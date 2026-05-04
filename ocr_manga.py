import os
import requests
from pathlib import Path

API_KEY = os.environ.get("FILEGRAPH_API_KEY")
BASE_URL = "https://api.filegraph.ai"

def ocr_image(image_path: str, language: str = "vie") -> str:
    """OCR an image file and return extracted text."""
    with open(image_path, "rb") as f:
        response = requests.post(
            f"{BASE_URL}/image/to-text",
            headers={"X-API-Key": API_KEY},
            files={"file": f},
            data={"language": language},
            timeout=60.0
        )
    response.raise_for_status()
    data = response.json()
    return data.get("text", "")

def main():
    base_dir = Path("temp_hoang_tu_ech")
    results = {}

    for i in range(1, 14):
        image_path = base_dir / f"page_{i}.jpg"
        print(f"Processing page {i}...")
        try:
            text = ocr_image(str(image_path), language="vie")
            results[i] = text
            print(f"  Page {i}: {len(text)} chars extracted")
        except Exception as e:
            print(f"  Page {i} ERROR: {e}")
            results[i] = ""

    # Save results
    output_file = base_dir / "ocr_results.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        for page_num in sorted(results.keys()):
            f.write(f"\n{'='*50}\n")
            f.write(f"PAGE {page_num}\n")
            f.write(f"{'='*50}\n")
            f.write(results[page_num])
            f.write("\n")

    print(f"\nResults saved to: {output_file}")

if __name__ == "__main__":
    main()