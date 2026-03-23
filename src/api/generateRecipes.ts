import type { Ingredient, RecipeSuggestion, GenerateRecipesResponse } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

function buildPrompt(ingredients: Ingredient[]): string {
  const list = ingredients.map((i) => i.name).join(', ');
  return `You are a recipe generator.
Given the following confirmed ingredients, suggest 3 to 5 recipes the user can realistically make.
Prioritize recipes that use most of the provided ingredients.
Format each recipe as:
{
  "id": "uid",
  "name": "string",
  "estimatedTime": "string",
  "difficulty": "easy | medium | hard",
  "keyIngredients": ["string"],
  "summary": "string",
  "servings": number,
  "ingredients": [{ "name": "string", "quantity": "string", "unit": "string" }],
  "steps": ["string"]
}
Return a JSON array. No preamble.

Ingredients: ${list}`;
}

export async function generateRecipes(ingredients: Ingredient[]): Promise<RecipeSuggestion[]> {
  const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured.');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: buildPrompt(ingredients),
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

  let parsed: GenerateRecipesResponse;
  try {
    parsed = JSON.parse(text) as GenerateRecipesResponse;
  } catch {
    throw new Error('PARSE_ERROR');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('INVALID_RESPONSE');
  }

  return parsed;
}
