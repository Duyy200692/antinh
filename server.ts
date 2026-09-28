import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Basic health check endpoint for Cloud Run
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Auto-Translation Endpoint for Menu Dishes (Vietnamese -> English)
app.post('/api/translate-dish', async (req: Request, res: Response) => {
  try {
    const { name, description, unit, prepTime } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Translate the following Vietnamese vegetarian dish item into professional, appetizing culinary English:
Dish Name (Vietnamese): ${name}
Description (Vietnamese): ${description || ''}
Serving Unit (Vietnamese): ${unit || ''}
Prep Time (Vietnamese): ${prepTime || ''}

Please return appetizing, professional English translations suitable for a high-end plant-based restaurant menu.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nameEn: { type: Type.STRING, description: 'Appetizing English title for the dish' },
            descriptionEn: { type: Type.STRING, description: 'Natural English description for the dish' },
            unitEn: { type: Type.STRING, description: 'English translation for serving unit, e.g. Portion, Jar, Loaf, Bowl, Box' },
            prepTimeEn: { type: Type.STRING, description: 'English translation for preparation time, e.g. 5 - 10 mins' },
          },
          required: ['nameEn', 'descriptionEn'],
        },
      },
    });

    const jsonText = response.text ? response.text.trim() : '{}';
    const translated = JSON.parse(jsonText);
    res.json(translated);
  } catch (err: any) {
    console.error('Translation endpoint error:', err);
    res.status(500).json({ error: 'Translation service error', details: err?.message });
  }
});

// Serve static assets from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client-side routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
