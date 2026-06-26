#!/usr/bin/env node
/**
 * MDS Git Hook Installer
 * Automatically installs a pre-commit hook in the local .git directory
 * to enforce MDS validation before any commit.
 */

const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
// Ascend 3 levels to reach the workspace root
const workspaceRoot = path.resolve(scriptDir, "..", "..", "..");
const gitDir = path.join(workspaceRoot, '.git');
const hooksDir = path.join(gitDir, 'hooks');
const preCommitHookPath = path.join(hooksDir, 'pre-commit');

console.log(`MDS Git Hook Installer initialized.`);
console.log(`Workspace root: ${workspaceRoot}`);

if (!fs.existsSync(gitDir)) {
    console.error(`❌ ERROR: Thư mục '.git' không tồn tại ở thư mục gốc dự án.`);
    console.error(`Vui lòng khởi tạo Git trước (chạy lệnh: git init) để kích hoạt cơ chế bọc thép Level 3.`);
    process.exit(1);
}

if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
}

// Shell script for the pre-commit hook (runs in Git Bash environment on Windows)
const hookContent = `#!/bin/sh
# MDS Gate - Pre-commit Validation Hook
echo "=================================================="
echo "🛡️  [MDS GATE] Đang quét tri thức hệ thống trước khi commit..."
echo "=================================================="

# Chạy trình linter Node.js để kiểm tra tính nhất quán tài liệu
node "[AI]_CONTEXT_ENGINE/28_[AI_DEVOPS]_AUTOMATION_ENGINE/scripts/detect_drift.js"
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo ""
  echo "❌ [MDS GATE] PHÁT HIỆN TÀI LIỆU SAI QUY CHUẨN!"
  echo "Commit đã bị chặn lại. Vui lòng sửa các lỗi trên trước khi commit lại."
  echo "=================================================="
  exit 1
fi

echo ""
echo "✅ [MDS GATE] Tài liệu hợp lệ. Tiến hành commit."
echo "=================================================="
exit 0
`;

try {
    fs.writeFileSync(preCommitHookPath, hookContent, { mode: 0o755 });
    // Ensure file permissions are set correctly for Unix-like environments (Git Bash)
    try {
        fs.chmodSync(preCommitHookPath, '755');
    } catch (e) {
        // chmod might fail on native Windows filesystems, but Git Bash will usually handle the file mode
    }
    console.log(`\n✅ BỌC THÉP THÀNH CÔNG!`);
    console.log(`Đã cài đặt Git Pre-commit Hook tại: ${preCommitHookPath}`);
    console.log(`Mỗi lần commit, hệ thống sẽ tự động kích hoạt camera kiểm soát tài liệu.`);
    process.exit(0);
} catch (err) {
    console.error(`❌ ERROR: Không thể ghi file pre-commit hook: ${err.message}`);
    process.exit(1);
}
