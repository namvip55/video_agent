import os
import json
import time
import requests
from PIL import Image
from pathlib import Path

# Cấu hình API
API_KEY = "fg_live_PBMLwShJTRR8AKdfAazH4P0iIKUDU7rg"
API_BASE = "https://api.filegraph.ai"

def merge_images_vertically(image_paths, output_path, border_px=20):
    """Ghép các ảnh theo chiều dọc với viền đen giữa các ảnh."""
    images = [Image.open(p) for p in image_paths]

    # Tính toán kích thước ảnh mới
    max_width = max(img.width for img in images)
    total_height = sum(img.height for img in images) + border_px * (len(images) - 1)

    # Tạo canvas đen
    new_img = Image.new('RGB', (max_width, total_height), (0, 0, 0))

    # Dán từng ảnh vào
    current_y = 0
    for img in images:
        # Căn giữa nếu ảnh hẹp hơn max_width
        offset_x = (max_width - img.width) // 2
        new_img.paste(img, (offset_x, current_y))
        current_y += img.height + border_px

    new_img.save(output_path, quality=85)
    return output_path

def call_filegraph_struct(image_path, batch_size):
    """Gọi API FileGraph để lấy dữ liệu cấu trúc."""
    url = f"{API_BASE}/any/to-struct"
    headers = {"X-API-Key": API_KEY}

    # Định nghĩa schema cho batch
    schema = {
        "type": "object",
        "description": "Danh sách các trang truyện được trích xuất",
        "properties": {
            "pages": {
                "type": "array",
                "description": "Mảng chứa nội dung từng trang",
                "items": {
                    "type": "object",
                    "properties": {
                        "page_index": {"type": "integer", "description": "Số thứ tự trang trong ảnh ghép (bắt đầu từ 1)"},
                        "text": {"type": "string", "description": "Toàn bộ nội dung văn bản tiếng Việt trong trang này"}
                    },
                    "required": ["page_index", "text"]
                }
            }
        }
    }

    with open(image_path, "rb") as f:
        files = {"file": f}
        data = {
            "schema": json.dumps(schema),
            "ocr_language": "eng", # Dùng eng vì vie có thể gây lỗi server như đã thấy
            "ocr_fallback": "true"
        }

        response = requests.post(url, headers=headers, files=files, data=data)

    if response.status_code == 200:
        return response.json().get("extracted_data", {}).get("pages", [])
    else:
        print(f"Error processing {image_path}: {response.text}")
        return []

def main():
    image_dir = Path("temp_hoang_tu_ech")
    output_file = "ocr_results_optimized.json"
    batch_size = 3

    # Lấy danh sách ảnh và sắp xếp
    image_files = sorted([f for f in image_dir.glob("*.jpg")],
                        key=lambda x: int(x.name.split("-")[-1].split(".")[0]))

    all_results = {}

    # Chia batch
    for i in range(0, len(image_files), batch_size):
        batch = image_files[i:i + batch_size]
        print(f"Processing batch {i//batch_size + 1}: {[b.name for b in batch]}...")

        # Ghép ảnh
        temp_merged = f"temp_merged_{i}.jpg"
        merge_images_vertically(batch, temp_merged)

        # OCR
        pages_data = call_filegraph_struct(temp_merged, len(batch))

        # Map kết quả lại
        for idx, page in enumerate(pages_data):
            # Lưu ý: AI có thể trả về page_index không khớp hoàn toàn,
            # nên ta dựa vào thứ tự trong mảng nếu có thể.
            if idx < len(batch):
                filename = batch[idx].name
                all_results[filename] = page.get("text", "")

        # Dọn dẹp
        if os.path.exists(temp_merged):
            os.remove(temp_merged)

        time.sleep(2) # Tránh rate limit

    # Lưu kết quả
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)

    print(f"Completed! Results saved to {output_file}")

if __name__ == "__main__":
    main()
