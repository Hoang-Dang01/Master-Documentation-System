const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const JSZip = require("jszip");
const {
  importDocument,
  listProjectArtifacts,
} = require("../../packages/application/ingestion/dist/index.js");

async function createDocx(targetPath) {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );
  zip.folder("_rels").file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  zip.folder("word").file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Khách hàng cần nhận thông báo khi trạng thái phiếu thay đổi.</w:t></w:r></w:p>
    <w:p><w:r><w:t>Người dùng phải xem được thời gian cập nhật gần nhất.</w:t></w:r></w:p>
  </w:body>
</w:document>`,
  );
  await fs.writeFile(targetPath, await zip.generateAsync({ type: "nodebuffer" }));
}

async function main() {
  const temporaryRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "mds-document-import-"),
  );
  const activeProjectsRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeProjectsRoot, "edumeet");
  const sourcePath = path.join(temporaryRoot, "yeu-cau-khach-hang.docx");

  try {
    await fs.mkdir(projectPath, { recursive: true });
    await createDocx(sourcePath);

    const imported = await importDocument(
      sourcePath,
      projectPath,
      activeProjectsRoot,
    );

    assert.match(imported.checksum, /^[a-f0-9]{64}$/);
    assert.match(imported.preview, /trạng thái phiếu thay đổi/);
    assert.match(imported.sourceRelativePath, /^sources\//);
    assert.match(imported.normalizedRelativePath, /^imports\//);
    assert.match(imported.requirementRelativePath, /^requirements\//);

    const requirement = await fs.readFile(
      path.join(projectPath, imported.requirementRelativePath),
      "utf8",
    );
    assert.match(requirement, /lifecycle_state: DRAFT/);
    assert.match(requirement, /title: "Yêu cầu từ Yeu cau khach hang"/);
    assert.match(requirement, /người phải duyệt/);

    const artifacts = await listProjectArtifacts(
      projectPath,
      activeProjectsRoot,
    );
    assert.equal(artifacts.length, 2);
    assert.ok(artifacts.every((artifact) => artifact.title.length > 0));

    console.log(
      "[DOCUMENT IMPORT] DOCX parsed, preserved, normalized, and converted to a DRAFT requirement.",
    );
  } finally {
    const resolvedTemporaryRoot = path.resolve(temporaryRoot);
    const resolvedOsTemp = path.resolve(os.tmpdir());
    if (
      resolvedTemporaryRoot.startsWith(`${resolvedOsTemp}${path.sep}`) &&
      path.basename(resolvedTemporaryRoot).startsWith("mds-document-import-")
    ) {
      await fs.rm(resolvedTemporaryRoot, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
