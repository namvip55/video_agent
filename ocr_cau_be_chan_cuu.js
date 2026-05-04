import axios from 'axios';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import FormData from 'form-data';
import fs from 'node:fs';

const apiKey = 'fg_live_PBMLwShJTRR8AKdfAazH4P0iIKUDU7rg';
const imageDir = 'temp_manga_images/cau-be-chan-cuu';
const images = Array.from({ length: 10 }, (_, i) => `page-${String(i + 1).padStart(3, '0')}.png`);

async function performOCR(imagePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    form.append('ocr_language', 'vie');

    try {
        const response = await axios.post('https://api.filegraph.ai/any/to-text', form, {
            headers: {
                ...form.getHeaders(),
                'X-API-Key': apiKey
            }
        });
        return response.data.text;
    } catch (e) {
        console.error(`OCR failed for ${imagePath}: ${e.response?.data?.detail || e.message}`);
        if (e.response?.status === 429) {
            console.log('Rate limited. Waiting 10s...');
            await new Promise(r => setTimeout(r, 10000));
            return performOCR(imagePath);
        }
        return "";
    }
}

const allResults = [];
for (const img of images) {
    console.log(`Processing ${img}...`);
    const text = await performOCR(join(imageDir, img));
    allResults.push({ page: img, text });
    // Small delay to respect rate limit (10 req/min for free tier)
    await new Promise(r => setTimeout(r, 6000));
}

await writeFile('ocr_results_cau_be_chan_cuu.json', JSON.stringify(allResults, null, 2));
console.log('OCR results saved to ocr_results_cau_be_chan_cuu.json');
