const REPO = 'southisack/pantrio'
const FILE_PATH = 'data/recipes.json'
const BRANCH = 'master'
const API = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not set')
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'pantrio-mcp',
  }
}

export async function readRecipesFile(): Promise<{ recipes: unknown; sha: string }> {
  const response = await fetch(`${API}?ref=${BRANCH}`, { headers: authHeaders(), cache: 'no-store' })
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`)
  const file: { content: string; sha: string } = await response.json()
  const text = Buffer.from(file.content, 'base64').toString('utf8')
  return { recipes: JSON.parse(text), sha: file.sha }
}

export async function writeRecipesFile(recipes: unknown, sha: string, message: string): Promise<string> {
  const response = await fetch(API, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      message,
      branch: BRANCH,
      sha,
      content: Buffer.from(JSON.stringify(recipes, null, 2), 'utf8').toString('base64'),
    }),
  })
  if (response.status === 409 || response.status === 422) {
    throw new Error('The cookbook changed while saving. Try again.')
  }
  if (!response.ok) throw new Error(`GitHub write failed (${response.status})`)
  const result: { commit: { html_url: string } } = await response.json()
  return result.commit.html_url
}
