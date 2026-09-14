import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { generateFormHTML } from '../src/lib/generateHTML.js'
import { getSinglePagePath } from '../src/lib/singlePage.js'

const theme = { c1: '#10b981', c2: '#38bdf8' }
const questions = [
  { id: 1, type: 'short', label: 'Name', hint: 'Description only', required: true },
  { id: 2, type: 'phone', label: 'Phone', required: true },
  { id: 3, type: 'email', label: 'Email' },
  { id: 4, type: 'single', label: 'Choice', options: ['A', 'B'], other: true },
  { id: 5, type: 'multiple', label: 'Interests', options: ['A', 'B'] },
  { id: 6, type: 'legal', label: 'Consent', legalText: 'Terms', required: true },
  { id: 7, type: 'long', label: 'Notes' },
  { id: 8, type: 'quiz', label: 'Quiz', options: ['A', 'B'], correctAnswer: 0 },
]
const htmlFor = settings => generateFormHTML('Application', questions, theme, { scriptUrl: '', ...settings })

test('legacy forms still default to step-by-step', () => {
  const html = htmlFor({})
  assert.match(html, /id="ss"/)
  assert.match(html, /STEP 01/)
  assert.match(html, /const SINGLE_PAGE=false/)
  assert.doesNotMatch(html, /id="single-form"/)
})

test('single page contains all fields and exactly one submit button without step controls', () => {
  const html = htmlFor({ layout: 'single', useStart: true, autoNext: true, useKb: true, submitBtnText: 'Send' })
  assert.match(html, /<h1 class="single-title">Application/)
  assert.equal((html.match(/class="single-question"/g) || []).length, 8)
  assert.equal((html.match(/id="sb"/g) || []).length, 1)
  assert.doesNotMatch(html, /id="ss"|STEP 01|onkeydown="|id="kh"|setTimeout\(\(\)=>gn/)
  assert.match(html, /type="radio"/)
  assert.match(html, /type="checkbox"/)
  assert.match(html, /aria-required="true"/)
  assert.doesNotMatch(html, /placeholder="Description only"/)
  assert.match(html, /<span class="nl">Send<\/span>/)
})

test('generated scripts parse in both layouts and preserve phone validation regexes', () => {
  for (const layout of ['single', 'steps']) {
    const script = htmlFor({ layout }).match(/<script>([\s\S]*?)<\/script>/)[1]
    assert.doesNotThrow(() => new vm.Script(script))
    assert.ok(script.includes(String.raw`/^010\d{8}$/`))
    assert.ok(script.includes(String.raw`/[-\s()]/g`))
  }
})

test('single-page branching follows choices, restores paths, and stops cycles', () => {
  const branches = { 0: { 0: 2, 1: 'done' } }
  assert.deepEqual(getSinglePagePath(4, branches, {}), [0, 1, 2, 3])
  assert.deepEqual(getSinglePagePath(4, branches, { 0: 0 }), [0, 2, 3])
  assert.deepEqual(getSinglePagePath(4, branches, { 0: 1 }), [0])
  assert.deepEqual(getSinglePagePath(4, { 0: { 0: 1 }, 1: { 0: 0 } }, { 0: 0, 1: 0 }), [0, 1])
  assert.deepEqual(getSinglePagePath(4, { 0: { 0: 99 } }, { 0: 0 }), [0, 1, 2, 3])
})

test('single-page output preserves assets, completion CTA and custom descriptions', () => {
  const html = htmlFor({ layout: 'single', useStart: false, startDesc: '<intro>', coverImgData: 'https://example.com/cover.webp', doneCta: 'Visit', doneUrl: 'https://example.com/done' })
  assert.match(html, /class="single-cover" src="https:\/\/example.com\/cover.webp"/)
  assert.match(html, /&lt;intro&gt;/)
  assert.match(html, /href="https:\/\/example.com\/done"/)
})
