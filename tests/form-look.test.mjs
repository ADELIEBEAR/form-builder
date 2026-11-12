import test from 'node:test'
import assert from 'node:assert/strict'
import { getLookCSS, FRIENDLY_LOOK } from '../src/lib/formLook.js'
import { generateFormHTML } from '../src/lib/generateHTML.js'
import { removeQuestionOption } from '../src/lib/questionModel.js'

const theme = { c1: '#2463eb', c2: '#60a5fa' }

test('an empty look leaves every theme untouched', () => {
  assert.equal(getLookCSS(), '')
  assert.equal(getLookCSS({}), '')
})

test('look values are sanitized before reaching the form stylesheet', () => {
  const css = getLookCSS({ bg: 'red;}body{display:none', card: '#fff', radius: 9999, btnShape: 'x', titleColor: 'url(x)' })
  assert.doesNotMatch(css, /display:none|url\(|red/)
  assert.match(getLookCSS({ radius: 9999 }), /border-radius:40px/)
})

test('a light card on a dark theme switches to dark text, and the reverse', () => {
  assert.match(getLookCSS({ card: '#ffffff' }), /--tx:#2b2622/)
  assert.match(getLookCSS({ card: '#111111' }), /--tx:#f3f4f6/)
})

test('the preset renders header and numbered steps in any theme', () => {
  const questions = [{ id: 'a', type: 'short', label: 'A' }, { id: 'b', type: 'short', label: 'B' }]
  const html = generateFormHTML('T', questions, theme, { scriptUrl: '', conceptTheme: 'default', look: FRIENDLY_LOOK })
  assert.match(html, /body \.fhead\{display:flex\}/)
  assert.match(html, /body \.steps\{display:flex\}/)
  assert.match(html, /<i class="on">1<\/i><i>2<\/i>/)
})

test('choice badges and descriptions render only when enabled and never change the answer text', () => {
  const q = { id: 'a', type: 'multiple', label: 'A', options: ['One', 'Two'], optionMeta: [{ badge: 'HOT!', desc: '<b>' }, {}] }
  const off = generateFormHTML('T', [q], theme, { scriptUrl: '' })
  assert.doesNotMatch(off, /class="ob /)
  const on = generateFormHTML('T', [{ ...q, optionDetail: true }], theme, { scriptUrl: '' })
  assert.match(on, /<span>One<\/span><em class="ob ob-hot">HOT!<\/em><small class="od">&lt;b&gt;<\/small>/)
  assert.match(on, /<span>Two<\/span><\/div>/)
})

test('deleting a choice keeps the remaining badges on their own choices', () => {
  const next = removeQuestionOption({ options: ['A', 'B', 'C'], optionMeta: [{ badge: 'a' }, { badge: 'b' }, { badge: 'c' }] }, 1)
  assert.deepEqual(next.optionMeta, [{ badge: 'a' }, { badge: 'c' }])
})

test('alignment options move text, choices and buttons independently', () => {
  assert.match(getLookCSS({ textAlign: 'center' }), /body \.card\{text-align:center\}/)
  assert.match(getLookCSS({ optAlign: 'right' }), /body \.ci\{justify-content:flex-end/)
  assert.match(getLookCSS({ btnAlign: 'center' }), /body \.cf\{justify-content:center\}/)
  assert.equal(getLookCSS({ textAlign: 'x;}', optAlign: 'x', btnAlign: 'x' }), '')
})
