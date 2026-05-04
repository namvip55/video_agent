import os
import requests
import json
import time

API_KEY = os.environ.get("FILEGRAPH_API_KEY")
API_BASE = "https://api.filegraph.ai"

def ocr_image(image_path):
    url = f"{API_BASE}/image/to-text"
    headers = {"X-API-Key": API_KEY}
    with open(image_path, "rb") as f:
        files = {"file": f}
        # Theo rule: tiếng Việt (vie)
        params = {"language": "vie"}

        response = requests.post(url, headers=headers, files=files, params=params)
    if response.status_code == 200:
        return response.json().get("text", "")
    else:
        print(f"Error OCR {image_path}: {response.text}")
        return ""

def main():
    results = {}
    images = sorted([f for f in os.listdir("temp_hoang_tu_ech") if f.endswith(".jpg")],
                    key=lambda x: int(x.split("-")[-1].split(".")[0]))

    for img in images:
        path = os.path.join("temp_hoang_tu_ech", img)
        print(f"Processing {path}...")
        text = ocr_image(path)
        results[img] = text
        time.sleep(1) # Rate limit safety

    with open("ocr_results_hoang_tu_ech.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
