export const IMAGE_BUCKET = 'form-builder-assets'
export const IMAGE_PRESETS = {
  cover: { maxWidth: 1200, maxHeight: 800, quality: 0.8, maxBytes: 180 * 1024 },
  background: { maxWidth: 1600, maxHeight: 1000, quality: 0.76, maxBytes: 220 * 1024 },
  question: { maxWidth: 1000, maxHeight: 760, quality: 0.8, maxBytes: 140 * 1024 },
}

export function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function getFormImageSettings(form) {
  return {
    ...form.settings,
    coverImgData: form.cover_url || form.settings?.coverImgData || null,
    bgImgData: form.background_url || form.settings?.bgImgData || null,
    qImgData: form.settings?.qImgData || {},
  }
}

export async function optimizeImageFile(file, presetKey) {
  const preset = IMAGE_PRESETS[presetKey]
  if (!preset || !file.type.startsWith('image/')) throw new Error('Invalid image')
  if (file.size > 20 * 1024 * 1024) throw new Error('Image exceeds 20 MB')
  const src = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = src
    await img.decode()
    if (img.width * img.height > 40_000_000) throw new Error('Image dimensions are too large')
    let scale = Math.min(1, preset.maxWidth / img.width, preset.maxHeight / img.height)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { alpha: true })
    let output
    for (let attempt = 0; attempt < 5; attempt++) {
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      output = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', Math.max(0.6, preset.quality - attempt * 0.04)))
      if (!output) throw new Error('Image encoding failed')
      if (output.size <= preset.maxBytes) break
      scale *= 0.8
    }
    // Keep already-small originals when recompression would make them larger.
    if (scale === 1 && file.size <= output.size && /^(image\/(png|jpeg|webp))$/.test(file.type)) output = file
    if (output.size > preset.maxBytes) throw new Error('Image could not be reduced enough')
    return { blob: output, originalBytes: file.size, optimizedBytes: output.size }
  } finally {
    URL.revokeObjectURL(src)
  }
}

export async function uploadImageBlob(client, userId, blob) {
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer())
  const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
  const extension = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg' }[blob.type]
  if (!extension || !userId) throw new Error('Invalid image upload')
  const path = `${userId}/${hash}.${extension}`
  const bucket = client.storage.from(IMAGE_BUCKET)
  const { error } = await bucket.upload(path, blob, {
    contentType: blob.type, cacheControl: '31536000', upsert: false,
  })
  const alreadyExists = error && (String(error.statusCode) === '409' || error.error === 'Duplicate' || /already exists/i.test(error.message || ''))
  if (error && !alreadyExists) throw error
  return bucket.getPublicUrl(path).data.publicUrl
}

export async function uploadFormImage(client, userId, file, presetKey) {
  const result = await optimizeImageFile(file, presetKey)
  return { ...result, url: await uploadImageBlob(client, userId, result.blob) }
}

export async function prepareImageSettings(settings, questions, upload) {
  const next = { ...settings, qImgData: {} }
  const cache = new Map()
  async function convert(value, preset) {
    if (typeof value !== 'string' || !value.startsWith('data:image/')) return value || null
    const key = preset + value
    if (!cache.has(key)) cache.set(key, upload(value, preset))
    return cache.get(key)
  }
  next.coverImgData = await convert(settings.coverImgData, 'cover')
  next.bgImgData = await convert(settings.bgImgData, 'background')
  for (const question of questions || []) {
    const value = settings.qImgData?.[question.id]
    if (value) next.qImgData[question.id] = await convert(value, 'question')
  }
  return next
}

export function storeInlineImages(client, userId, settings, questions) {
  return prepareImageSettings(settings, questions, async (dataUrl, preset) => {
    const blob = await (await fetch(dataUrl)).blob()
    return (await uploadFormImage(client, userId, blob, preset)).url
  })
}
