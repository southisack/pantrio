import { createHash, timingSafeEqual } from 'node:crypto'
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'
import { MAIN_INGREDIENT_OPTIONS, addRecipe, loadRecipes, searchRecipes } from '@/src/lib/cookbook'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const mainIngredient = z.enum(MAIN_INGREDIENT_OPTIONS as [string, ...string[]])

const mcpHandler = createMcpHandler(
  server => {
    server.registerTool(
      'search_recipes',
      {
        title: 'Search recipes',
        description:
          "Search Johnny's family cookbook. Pass the ingredients on hand to get recipes ranked by how many ingredients are already covered, with what is still needed. All filters are optional; with none, it lists recipes.",
        inputSchema: z.object({
          ingredients: z.array(z.string()).optional().describe('Ingredients on hand, e.g. ["chicken", "rice"]'),
          mainIngredient: mainIngredient.optional(),
          maxMinutes: z.number().int().positive().optional(),
          difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
          text: z.string().optional().describe('Words to look for in the recipe name or summary'),
          limit: z.number().int().min(1).max(50).default(15),
        }),
      },
      async filters => {
        const results = searchRecipes(await loadRecipes(), filters)
        return { content: [{ type: 'text', text: JSON.stringify({ count: results.length, recipes: results }, null, 2) }] }
      },
    )

    server.registerTool(
      'get_recipe',
      {
        title: 'Get a recipe',
        description: 'Get the full recipe (ingredients, steps, ratings) by its id, as returned by search_recipes.',
        inputSchema: z.object({ id: z.string() }),
      },
      async ({ id }) => {
        const recipe = (await loadRecipes()).find(r => r.id === id)
        if (!recipe) return { isError: true, content: [{ type: 'text', text: `No recipe with id "${id}".` }] }
        return { content: [{ type: 'text', text: JSON.stringify(recipe, null, 2) }] }
      },
    )

    server.registerTool(
      'add_recipe',
      {
        title: 'Add a recipe',
        description:
          'Add a new recipe to the cookbook. It is validated, then saved to the repo; the live site updates about a minute later. Transcribe from the source faithfully. quantity and unit are strings ("" if none, e.g. quantity "2", unit "tbsp"). The summary should be one dry, specific sentence in a warm, direct voice.',
        inputSchema: z.object({
          name: z.string().min(1),
          summary: z.string().min(1),
          time: z.number().int().positive().describe('Total minutes, prep plus cooking'),
          servings: z.number().int().positive(),
          difficulty: z.enum(['easy', 'medium', 'hard']),
          ingredients: z
            .array(z.object({ name: z.string().min(1), quantity: z.string().default(''), unit: z.string().default('') }))
            .min(1),
          steps: z.array(z.string().min(1)).min(1),
          mainIngredient: mainIngredient.optional().describe('Only if the dish is clearly built around one of these'),
          cuisine: z.string().min(1).optional(),
          tags: z.array(z.string().min(1)).optional().describe('Lowercase words, e.g. ["weeknight"]'),
          source: z.string().min(1).optional().describe('Where it came from, e.g. "Mom" or a cookbook title'),
          id: z.string().optional().describe('Leave out; it is made from the name'),
        }),
      },
      async input => {
        try {
          const tags = input.tags?.map(tag => tag.toLowerCase())
          const result = await addRecipe({ ...input, tags })
          if ('errors' in result) {
            return { isError: true, content: [{ type: 'text', text: `Not saved:\n${result.errors.join('\n')}` }] }
          }
          return {
            content: [{ type: 'text', text: `Saved "${input.name}" as ${result.id}. It goes live in about a minute. Commit: ${result.commitUrl}` }],
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error'
          return { isError: true, content: [{ type: 'text', text: `Not saved: ${message}` }] }
        }
      },
    )
  },
  { serverInfo: { name: 'pantrio-cookbook', version: '1.0.0' } },
)

function secretMatches(provided: string): boolean {
  const expected = process.env.MCP_SECRET
  if (!expected) return false
  const a = createHash('sha256').update(provided).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

async function handle(request: Request, context: { params: Promise<{ secret: string }> }): Promise<Response> {
  const { secret } = await context.params
  if (!secretMatches(secret)) return new Response('Not found', { status: 404 })
  return mcpHandler(request)
}

export { handle as GET, handle as POST, handle as DELETE }
