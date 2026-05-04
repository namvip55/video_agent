import httpx
import json
import os
import time

def perform_ocr(image_url, language='vie'):
    # Try to load from .env if not in env
    api_key = os.environ.get('FILEGRAPH_API_KEY')
    if not api_key:
        try:
            with open(".env", "r") as f:
                for line in f:
                    if line.startswith("FILEGRAPH_API_KEY="):
                        api_key = line.strip().split("=")[1]
                        break
        except:
            pass

    if not api_key:
        print("Error: FILEGRAPH_API_KEY not found.")
        return None
    
    # Download image
    try:
        img_response = httpx.get(image_url)
        img_response.raise_for_status()
        img_data = img_response.content
    except Exception as e:
        print(f"Error downloading image {image_url}: {e}")
        return None

    # FileGraph OCR
    try:
        response = httpx.post(
            "https://api.filegraph.ai/image/to-text",
            headers={"X-API-Key": api_key},
            files={"file": ("image.jpg", img_data)},
            data={"language": language},
            timeout=60.0
        )
        response.raise_for_status()
        return response.json().get("text", "")
    except Exception as e:
        print(f"Error performing OCR on {image_url}: {e}")
        return None

def main():
    image_urls = [
        "https://www.mollymax.co.uk/upload/chaps/873453/001.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/002.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/003.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/004.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/005.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/006.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/007.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/008.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/009.jpg?v=0.1",
        "https://www.mollymax.co.uk/upload/chaps/873453/010.jpg?v=0.1"
    ]
    
    results = []
    for i, url in enumerate(image_urls):
        print(f"Processing image {i+1}/{len(image_urls)}...")
        text = perform_ocr(url)
        results.append({"index": i+1, "url": url, "text": text})
        time.sleep(1) # Be nice to the API
        
    with open("ocr_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("OCR completed. Results saved to ocr_results.json")

if __name__ == "__main__":
    main()
