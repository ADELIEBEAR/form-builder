function parseColor(value, fallback) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value || '').trim())
  if (!match) return fallback
  const hex = match[1].length === 3 ? [...match[1]].map(c => c + c).join('') : match[1]
  return [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16))
}

function luminance(rgb) {
  const linear = rgb.map(c => c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4)
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function minimumContrast(colors, whiteText) {
  let minimum = Infinity
  for (let i = 0; i <= 32; i++) {
    const light = luminance(colors[0].map((c, j) => c + (colors[1][j] - c) * i / 32))
    minimum = Math.min(minimum, whiteText ? 1.05 / (light + 0.05) : (light + 0.05) / 0.05)
  }
  return minimum
}

export function readableButtonColors(c1, c2 = c1) {
  const first = parseColor(c1, [124, 108, 252])
  const colors = [first, parseColor(c2, first)]
  const contrasts = [minimumContrast(colors, false), minimumContrast(colors, true)]
  let whiteText = contrasts[1] > contrasts[0]
  let result = colors
  if (Math.max(...contrasts) < 4.5) {
    // One text color must remain legible across the entire gradient, not only its midpoint.
    const candidates = [false, true].map(white => {
      const blend = amount => colors.map(rgb => rgb.map(c => Math.round(c + ((white ? 0 : 255) - c) * amount)))
      let low = 0, high = 1
      for (let i = 0; i < 12; i++) {
        const mid = (low + high) / 2
        if (minimumContrast(blend(mid), white) >= 4.6) high = mid
        else low = mid
      }
      return { amount: high, white, colors: blend(high) }
    })
    const best = candidates.sort((a, b) => a.amount - b.amount)[0]
    whiteText = best.white
    result = best.colors
  }
  const hex = rgb => '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('')
  return { text: whiteText ? '#ffffff' : '#000000', c1: hex(result[0]), c2: hex(result[1]) }
}
