import test from 'node:test'
import assert from 'node:assert/strict'
import { generateFormHTML } from '../src/lib/generateHTML.js'

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
