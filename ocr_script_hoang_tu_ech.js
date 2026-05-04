import fs from 'fs';
import path from 'path';
import axios from 'axios';
import 'dotenv/config';

const API_KEY = 'fg_live_PBMLwShJTRR8AKdfAazH4P0iIKUDU7rg';
const API_BASE = 'https://api.filegraph.ai';

async function ocrImage(imagePath) {
    const url = `${API_BASE}/image/to-text`;
    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', blob, path.basename(imagePath));

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'X-API-Key': API_KEY,
            },
            params: {
                language: 'eng'
            }
        });
        return response.data.text || '';
    } catch (error) {
        console.error(`Error OCR ${imagePath}:`, error.response?.data || error.message);
        return '';
    }
}

async function main() {
    const dir = 'temp_hoang_tu_ech';
    const results = {};
    const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.jpg'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/(\d+)/)[0]);
            const numB = parseInt(b.match(/(\d+)/)[0]);
            return numA - numB;
        });

    for (const file of files) {
        const filePath = path.join(dir, file);
        console.log(`Processing ${filePath}...`);
        const text = await ocrImage(filePath);
        results[file] = text;
        await new Promise(r => setTimeout(r, 1000));
    }

    fs.writeFileSync('ocr_results_hoang_tu_ech.json', JSON.stringify(results, null, 2), 'utf-8');
}

main().catch(console.error);
