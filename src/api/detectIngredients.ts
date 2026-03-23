import type { CapturedPhoto, DetectIngredientsResponse, Ingredient } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

const DETECTION_PROMPT = `You are analyzing a photo of a fridge or pantry.
Return a JSON array of detected ingredients.
Be specific but not overly granular (e.g. "chicken breast" not just "meat").
Only include items that are clearly visible and identifiable.
For each ingredient, include a confidence level: "high" if clearly identifiable, "medium" if likely but not certain, "low" if you're guessing.
Format: { "ingredients": [{ "id": "uid", "name": "string", "confidence": "high | medium | low" }] }
Return JSON only. No preamble.`;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function detectIngredients(photos: CapturedPhoto[]): Promise<Ingredient[]> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured.');
  }

  const imageContent = photos.map((photo) => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: 'image/jpeg' as const,
      data: photo.base64,
    },
  }));

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            { type: 'text', text: DETECTION_PROMPT },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status >= 500) {
      throw new Error('CLAUDE_SERVER_ERROR');
    }
    throw new Error('CLAUDE_API_ERROR');
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> };
  const text = data.content.find((c) => c.type === 'text')?.text ?? '';

  let parsed: DetectIngredientsResponse;
  try {
    parsed = JSON.parse(text) as DetectIngredientsResponse;
  } catch {
    throw new Error('PARSE_ERROR');
  }

  if (!Array.isArray(parsed.ingredients)) {
    throw new Error('INVALID_RESPONSE');
  }

  return parsed.ingredients.map((item) => ({
    id: item.id ?? generateId(),
    name: item.name,
    confidence: item.confidence,
    confirmed: true,
  }));
}
