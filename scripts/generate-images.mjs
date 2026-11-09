// Generates recipe photos with a local ComfyUI (Z-Image Turbo) and saves them to public/icons/<id>.jpg.
// Local dev tool only: it is not part of the app and nothing here ships to production.
//
// Usage:
//   node scripts/generate-images.mjs <recipe-id> [<recipe-id> ...]   generate specific recipes
//   node scripts/generate-images.mjs --missing [--limit 5]           generate recipes with no image yet
//   add --force to overwrite an existing image, --port 8000 if ComfyUI is on another port
//   --style "<text>" replaces the default photo style, --out <dir> saves somewhere other than public/icons
import { readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

function flagValue(name, fallback) {
  const index = args.indexOf(name)
  return index === -1 ? fallback : args[index + 1]
}

const port = flagValue('--port', '8000')
const limit = Number(flagValue('--limit', Infinity))
const force = args.includes('--force')
const missingOnly = args.includes('--missing')
const styleOverride = flagValue('--style', null)
const outputDir = flagValue('--out', path.join(root, 'public', 'icons'))
const modelName = flagValue('--model', 'zimage')
const fixedSeed = flagValue('--seed', null)
const requestedIds = args.filter((arg, index) => !arg.startsWith('--') && !['--port', '--limit', '--style', '--out', '--model', '--seed'].includes(args[index - 1]))
const base = `http://127.0.0.1:${port}`

const WIDTH = 1280
const HEIGHT = 768
const STYLE =
  'professional food photography, overhead three-quarter angle, soft natural window light, rustic table, ' +
  'shallow depth of field, appetizing, high detail, no text, no people'

function buildPrompt(recipe) {
  const mainIngredients = recipe.ingredients.slice(0, 5).map(ingredient => ingredient.name).join(', ')
  return `${recipe.name}, plated and ready to eat. ${recipe.summary} Made with ${mainIngredients}. ${styleOverride ?? STYLE}`
}

function buildFluxWorkflow(prompt, seed) {
  return {
    1: { class_type: 'UNETLoader', inputs: { unet_name: 'flux1-dev.safetensors', weight_dtype: 'fp8_e4m3fn' } },
    2: { class_type: 'DualCLIPLoader', inputs: { clip_name1: 'clip_l.safetensors', clip_name2: 't5xxl_fp16.safetensors', type: 'flux', device: 'default' } },
    3: { class_type: 'VAELoader', inputs: { vae_name: 'ae.safetensors' } },
    5: { class_type: 'CLIPTextEncode', inputs: { clip: ['2', 0], text: prompt } },
    11: { class_type: 'FluxGuidance', inputs: { conditioning: ['5', 0], guidance: 3.5 } },
    6: { class_type: 'ConditioningZeroOut', inputs: { conditioning: ['5', 0] } },
    7: { class_type: 'EmptySD3LatentImage', inputs: { width: WIDTH, height: HEIGHT, batch_size: 1 } },
    8: {
      class_type: 'KSampler',
      inputs: {
        model: ['1', 0], positive: ['11', 0], negative: ['6', 0], latent_image: ['7', 0],
        seed, steps: 20, cfg: 1, sampler_name: 'euler', scheduler: 'simple', denoise: 1,
      },
    },
    9: { class_type: 'VAEDecode', inputs: { samples: ['8', 0], vae: ['3', 0] } },
    10: { class_type: 'SaveImage', inputs: { images: ['9', 0], filename_prefix: 'pantrio' } },
  }
}

function buildFlux2Workflow(prompt, seed) {
  return {
    1: { class_type: 'UNETLoader', inputs: { unet_name: 'flux2_dev_fp8mixed.safetensors', weight_dtype: 'default' } },
    2: { class_type: 'CLIPLoader', inputs: { clip_name: 'mistral_3_small_flux2_bf16.safetensors', type: 'flux2', device: 'default' } },
    3: { class_type: 'VAELoader', inputs: { vae_name: 'flux2-vae.safetensors' } },
    5: { class_type: 'CLIPTextEncode', inputs: { clip: ['2', 0], text: prompt } },
    11: { class_type: 'FluxGuidance', inputs: { conditioning: ['5', 0], guidance: 4 } },
    12: { class_type: 'BasicGuider', inputs: { model: ['1', 0], conditioning: ['11', 0] } },
    13: { class_type: 'RandomNoise', inputs: { noise_seed: seed } },
    14: { class_type: 'KSamplerSelect', inputs: { sampler_name: 'euler' } },
    15: { class_type: 'Flux2Scheduler', inputs: { steps: 20, width: WIDTH, height: HEIGHT } },
    7: { class_type: 'EmptyFlux2LatentImage', inputs: { width: WIDTH, height: HEIGHT, batch_size: 1 } },
    8: {
      class_type: 'SamplerCustomAdvanced',
      inputs: { noise: ['13', 0], guider: ['12', 0], sampler: ['14', 0], sigmas: ['15', 0], latent_image: ['7', 0] },
    },
    9: { class_type: 'VAEDecode', inputs: { samples: ['8', 0], vae: ['3', 0] } },
    10: { class_type: 'SaveImage', inputs: { images: ['9', 0], filename_prefix: 'pantrio' } },
  }
}

function buildWorkflow(prompt, seed) {
  if (modelName === 'flux2') return buildFlux2Workflow(prompt, seed)
  if (modelName === 'flux1') return buildFluxWorkflow(prompt, seed)
  return {
    1: { class_type: 'UNETLoader', inputs: { unet_name: 'z_image_turbo_bf16.safetensors', weight_dtype: 'default' } },
    2: { class_type: 'CLIPLoader', inputs: { clip_name: 'qwen_3_4b.safetensors', type: 'lumina2', device: 'default' } },
    3: { class_type: 'VAELoader', inputs: { vae_name: 'ae.safetensors' } },
    4: { class_type: 'ModelSamplingAuraFlow', inputs: { model: ['1', 0], shift: 3 } },
    5: { class_type: 'CLIPTextEncode', inputs: { clip: ['2', 0], text: prompt } },
    6: { class_type: 'ConditioningZeroOut', inputs: { conditioning: ['5', 0] } },
    7: { class_type: 'EmptySD3LatentImage', inputs: { width: WIDTH, height: HEIGHT, batch_size: 1 } },
    8: {
      class_type: 'KSampler',
      inputs: {
        model: ['4', 0], positive: ['5', 0], negative: ['6', 0], latent_image: ['7', 0],
        seed, steps: 8, cfg: 1, sampler_name: 'euler', scheduler: 'simple', denoise: 1,
      },
    },
    9: { class_type: 'VAEDecode', inputs: { samples: ['8', 0], vae: ['3', 0] } },
    10: { class_type: 'SaveImage', inputs: { images: ['9', 0], filename_prefix: 'pantrio' } },
  }
}

async function generate(recipe) {
  const seed = fixedSeed === null ? Math.floor(Math.random() * 2 ** 32) : Number(fixedSeed)
  const queued = await fetch(`${base}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: buildWorkflow(buildPrompt(recipe), seed) }),
  })
  if (!queued.ok) throw new Error(`ComfyUI rejected the workflow: ${await queued.text()}`)
  const { prompt_id: promptId } = await queued.json()

  for (let attempt = 0; attempt < 300; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const history = await (await fetch(`${base}/history/${promptId}`)).json()
    const entry = history[promptId]
    if (!entry) continue
    if (entry.status?.status_str === 'error') throw new Error('ComfyUI reported an error while generating')
    const image = entry.outputs?.['10']?.images?.[0]
    if (!image) continue
    const params = new URLSearchParams({ filename: image.filename, subfolder: image.subfolder, type: image.type })
    const png = Buffer.from(await (await fetch(`${base}/view?${params}`)).arrayBuffer())
    return sharp(png).jpeg({ quality: 86, mozjpeg: true }).toBuffer()
  }
  throw new Error('Timed out waiting for ComfyUI')
}

async function exists(file) {
  try { await access(file); return true } catch { return false }
}

const recipes = JSON.parse(await readFile(path.join(root, 'data', 'recipes.json'), 'utf8'))
let queue = recipes
if (requestedIds.length > 0) queue = recipes.filter(recipe => requestedIds.includes(recipe.id))
else if (!missingOnly) {
  console.error('Pass recipe ids or --missing. See the usage note at the top of this file.')
  process.exit(1)
}

const unknown = requestedIds.filter(id => !recipes.some(recipe => recipe.id === id))
if (unknown.length > 0) {
  console.error(`Unknown recipe id(s): ${unknown.join(', ')}`)
  process.exit(1)
}

const todo = []
for (const recipe of queue) {
  const target = path.join(outputDir, `${recipe.id}.jpg`)
  if (force || !(await exists(target))) todo.push({ recipe, target })
}

const batch = todo.slice(0, limit)
console.log(`Generating ${batch.length} of ${todo.length} image(s) via ${base}`)
for (const [index, { recipe, target }] of batch.entries()) {
  const started = Date.now()
  try {
    await writeFile(target, await generate(recipe))
    console.log(`[${index + 1}/${batch.length}] ${recipe.id} (${((Date.now() - started) / 1000).toFixed(0)}s)`)
  } catch (error) {
    console.error(`[${index + 1}/${batch.length}] ${recipe.id} FAILED: ${error.message}`)
  }
}
