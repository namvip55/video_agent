
import httpx
import os
import json
import time

API_KEY = "fg_live_pobUevnR9tJhF3OcrqtG8fUQrTF9X0Jr"
BASE_URL = "https://api.filegraph.ai/image/to-text"

files = [
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-001.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-002.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-003.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-004.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-005.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-006.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-007.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-008.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-009.jpg",
    r"C:\Users\Admin\expand_auto_create_video\temp_manga_images\page-010.jpg"
]

def extract_text(file_path):
    print(f"Processing {os.path.basename(file_path)}...")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return "File not found"

    with open(file_path, "rb") as f:
        try:
            # We use python -m pip install httpx if needed, but here we assume environment has it or we use requests if safer.
            # Given the previous failure, I will use a more robust way to run this.
            response = httpx.post(
                BASE_URL,
                headers={"X-API-Key": API_KEY},
                files={"file": f},
                data={"language": "vie"},
                timeout=60.0
            )
            if response.status_code == 200:
                return response.json().get("text", "")
            elif response.status_code == 429:
                print(f"Rate limited. Waiting 10 seconds...")
                time.sleep(10)
                return extract_text(file_path)
            else:
                print(f"Error {response.status_code}: {response.text}")
                return f"Error: {response.status_code}"
        except Exception as e:
            print(f"Exception: {str(e)}")
            return f"Exception: {str(e)}"

results = {}
for file_path in files:
    page_num = os.path.basename(file_path).split('-')[1].split('.')[0]
    text = extract_text(file_path)
    results[page_num] = text
    time.sleep(1)

with open("ocr_results_seishun.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nOCR extraction complete. Results saved to ocr_results_seishun.json")
