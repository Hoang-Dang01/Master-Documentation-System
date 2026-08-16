# Vai Trò BE — Đầu Vào Cần Thiết

- Approved/current REQ, BR, NFR và constraints có version/authority rõ ràng.
- Approved ADR/HLD khi quyết định kỹ thuật mang tính binding.
- Current Project Truth, relevant lineage và graph evidence path.
- Canonical API/DB/service templates và artifact truth standard.
- Với drift verification: repository/test evidence read-only có provenance và
  thời điểm thu thập.

Nếu upstream là `DRAFT`, `STALE` hoặc `CONFLICTED`, BE phải gắn warning
hoặc dừng binding specification theo workflow; không coi đó là truth.
