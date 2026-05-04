---
name: create-news-video
description: Tạo video tin tức 9:16 (~60s) hoặc video manga từ URL/file tiếng Việt. Output: video.mp4, voice.mp3 (CapCut), script.txt.
trigger-phrases:
  - "tạo video tin tức"
  - "làm video so sánh"
  - "tạo video truyện tranh"
  - "làm video manga"
  - "render tin thành video"
---

# Kỹ năng Tạo Video (News & Manga)

## 1. Quy trình thực hiện

### Bước 1: Thu thập & Xử lý nội dung
- **News Mode**: Scrape nội dung từ URL (Firecrawl/WebFetch). Viết script tóm tắt.
- **Manga Mode**: Scrape ảnh truyện. 
  - **Tối ưu chi phí OCR**: Ghép 3-5 ảnh theo chiều dọc (Pillow) trước khi gửi FileGraph.
  - **OCR (FileGraph MCP)**: Ưu tiên `/any/to-text` cho tiếng Việt.
  - **Sửa lỗi OCR**: Nếu text bị lỗi chính tả (do OCR nhận diện sai dấu/chữ), Claude hãy **tự sửa lại theo logic và ngữ cảnh truyện** thay vì đọc lại ảnh. Chỉ dùng `Read` tool xem ảnh khi text trả về bị rỗng hoặc hoàn toàn vô nghĩa.
  - Quy tắc đọc: **phải qua trái, trên xuống dưới**. Sắp xếp text theo ngữ cảnh.

### Bước 2: Viết script.json
- Phân bổ nội dung vào các `scenes`.
- **Schema Validation**: Đảm bảo `version: "1.0"`, `metadata.mode: "manga"`, và `scenes` có đầy đủ `id`, `type` (hook/body/outro), `templateData`.
- **Template Manga**: Luôn dùng template `manga-panel` cho các scene body để có UI chuẩn truyện tranh.
- **Quy tắc cuối video**: Scene `outro` BẮT BUỘC dùng voiceText: "Cảm ơn bạn đã theo dõi. Hãy theo dõi Nép si lon để xem các video thú vị nhé."
- **Quy tắc đọc số & tên (Phonetic)**: BẮT BUỘC viết số/tên riêng thành chữ trong `voiceText` (ví dụ: `5.5` -> `năm chấm năm`, `AI` -> `ây ai`, `Nepsilon` -> `Nép si lon`).
- **TTS Backup**: Nếu LucyLab báo lỗi 502 liên tục hoặc không trả URL, hãy kiểm tra lại `voiceId` trong `.env` hoặc cân nhắc chuyển sang ElevenLabs (nếu có key).

### Bước 3: Chạy Pipeline
- **Chuẩn bị file**: Copy ảnh vào thư mục `output/<slug>/pages/` và sửa đường dẫn trong `script.json` thành `pages/page-XXX.png` để pipeline chạy mượt nhất.
- **News**: `npm run pipeline -- path/to/script.json`
- **Manga**: `npm run manga -- path/to/script.json`

## 2. Quy tắc hình ảnh & âm thanh
- **Manga**: Không dùng overlay tối ảnh (giữ nguyên độ sáng).
- **News**: Dùng overlay làm tối nền để nổi bật text.
- **SFX**: Mặc định tắt các âm thanh gây nhiễu. Dùng `sfx: { "name": "none" }` để tắt hẳn.

## 3. Kết quả bàn giao
```markdown
✅ Video:  [video.mp4](đường_dẫn)
✅ Audio:  [voice.mp3](đường_dẫn) — cho CapCut
✅ Script: [script.txt](đường_dẫn) — cho auto-caption
```
