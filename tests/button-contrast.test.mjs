import test from 'node:test'
import assert from 'node:assert/strict'
import { generateFormHTML } from '../src/lib/generateHTML.js'
import { readableButtonColors } from '../src/lib/buttonColors.js'

const questions = [{ id: 'name', type: 'short', label: 'Name', required: true }]

test('generated buttons choose readable text for light and dark custom colors', () => {
  const light = generateFormHTML('Light', questions, { c1: '#ffffff', c2: '#f3f4f6' }, { conceptTheme: 'clean_graphite', scriptUrl: '' })
  const dark = generateFormHTML('Dark', questions, { c1: '#111827', c2: '#000000' }, { conceptTheme: 'clean_graphite', scriptUrl: '' })
  const middle = generateFormHTML('Middle', questions, { c1: '#747474', c2: '#747474' }, { conceptTheme: 'clean_graphite', scriptUrl: '' })

  assert.match(light, /body \.nb,body \.sbt,body \.dcta,body\.single-page \.single-submit\{color:#000000!important\}/)
  assert.match(dark, /body \.nb,body \.sbt,body \.dcta,body\.single-page \.single-submit\{color:#ffffff!important\}/)
  assert.match(middle, /body \.nb,body \.sbt,body \.dcta,body\.single-page \.single-submit\{color:#ffffff!important\}/)
  assert.match(light, /border-top-color:#000000/)
  assert.match(dark, /border-top-color:#ffffff/)
})

test('button contrast holds across 400 solid and mixed gradients, not just their midpoint', () => {
  const colors = ['#000000', '#ffffff', '#747474', '#777777', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#2463eb', '#60a5fa', '#0f172a', '#fafafa', '#ff00ff', '#00ffff', '#7c6cfc', '#c084fc', '#ff8c00', '#f472b6', '#14b8a6', '#808000']
  const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  const light = color => color.map(v => v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
  for (const c1 of colors) for (const c2 of colors) {
    const palette = readableButtonColors(c1, c2), a = rgb(palette.c1), b = rgb(palette.c2)
    for (let i = 0; i <= 100; i++) {
      const luminance = light(a.map((v, j) => v + (b[j] - v) * i / 100))
      const contrast = palette.text === '#000000' ? (luminance + .05) / .05 : 1.05 / (luminance + .05)
      assert.ok(contrast >= 4.5, `${c1}/${c2} at ${i}%: ${contrast}`)
    }
  }
  assert.deepEqual(readableButtonColors('#fff', '#fff'), { text: '#000000', c1: '#ffffff', c2: '#ffffff' })
})
