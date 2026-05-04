---
name: update-filegraph
description: Cập nhật FileGraph API Key cho cả MCP và file .env.
---

# Kỹ năng Cập nhật FileGraph API Key (`/update-filegraph`)

Kỹ năng này giúp cập nhật FileGraph API Key đồng bộ trong cả MCP server và file `.env`.

## Cách sử dụng
`/update-filegraph <api_key>`

## Quy trình thực hiện
1. **Xóa MCP cũ**: `claude mcp remove filegraph`
2. **Thêm MCP mới**: `claude mcp add --transport http filegraph https://api.filegraph.ai/mcp/ --header "X-API-Key: <api_key>"`
3. **Cập nhật `.env` & `.env.local`**: Tìm và thay thế `FILEGRAPH_API_KEY=...` bằng key mới.
4. **Kiểm tra**: Chạy lệnh `claude mcp list` để xác nhận.

## Lưu ý
- API Key thường có định dạng `fg_live_...` hoặc `fg_test_...`.
- Luôn cập nhật cả 2 file `.env` nếu có để tránh sai lệch cấu hình khi chạy script độc lập.
