
import httpx
import os
import sys
import json
import time

API_KEY = "fg_live_pobUevnR9tJhF3OcrqtG8fUQrTF9X0Jr"
BASE_URL = "https://api.filegraph.ai/image/to-text"

files = [
    r"C:\Users\Admin\expand_auto_create_video\output\002_truyen-thieu-nhi-truyen-co-tic-chap-1-2026050317532\pages\page-018.jpg",
    r"C:\Users\Admin\expand_auto_create_video\output\002_truyen-thieu-nhi-truyen-co-tic-chap-1-2026050317532\pages\page-021.jpg",
    r"C:\Users\Admin\expand_auto_create_video\output\002_truyen-thieu-nhi-truyen-co-tic-chap-1-2026050317532\pages\page-022.jpg",
    r"C:\Users\Admin\expand_auto_create_video\output\002_truyen-thieu-nhi-truyen-co-tic-chap-1-2026050317532\pages\page-024.jpg",
    r"C:\Users\Admin\expand_auto_create_video\output\002_truyen-thieu-nhi-truyen-co-tic-chap-1-2026050317532\pages\page-028.png",
    r"C:\Users\Admin\expand_auto_create_video\output\002_truyen-thieu-nhi-truyen-co-tic-chap-1-2026050317532\pages\page-029.jpg",
]

def extract_text(file_path):
    print(f"Processing {os.path.basename(file_path)}...")
    with open(file_path, "rb") as f:
        try:
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
    # Sleep a bit to avoid hitting rate limits too hard if on free tier
    time.sleep(1)

print("\n--- RESULTS ---\n")
print(json.dumps(results, ensure_ascii=False, indent=2))
