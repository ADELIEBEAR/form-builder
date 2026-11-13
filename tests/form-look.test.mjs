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

test('start screen extras appear only when filled in and are escaped', () => {
  const q = [{ id: 'a', type: 'short', label: 'A' }]
  const plain = generateFormHTML('T', q, theme, { scriptUrl: '' })
  assert.doesNotMatch(plain, /class="(tick|spts|sfoot)"/)
  const html = generateFormHTML('T', q, theme, { scriptUrl: '', conceptTheme: 'clean_app', look: { ticker: '<b>', points: ['One', '', 'Two', 'x'], footnote: '*note' } })
  assert.match(html, /<div class="tick"><div><span>&lt;b&gt;<\/span>/)
  assert.match(html, /<div class="spts"><span>One<\/span><span>Two<\/span><span>x<\/span><\/div>/)
  assert.match(html, /<div class="sfoot">\*note<\/div>/)
  assert.match(html, /\.fhead\{display:flex;position:fixed/)
})

test('landing sections render from line-based text, escaped, with a pinned button', () => {
  const q = [{ id: 'a', type: 'short', label: 'A' }]
  assert.doesNotMatch(generateFormHTML('T', q, theme, { scriptUrl: '' }), /id="lcta"|class="lsn/)
  const look = {
    landChecks: 'Head *hot*\nOne | <i>', landFaq: 'Q | A', landReviews: 'Kim | note | body | 5\nLee | plain',
    landCards: '^lead\n시계 | fast\n! now\n*small print', landEnd: 'Go\n! free', landFooter: '<b>',
  }
  assert.doesNotMatch(generateFormHTML('T', q, theme, { scriptUrl: '', conceptTheme: 'clean_white', look }), /id="lcta"|class="lsn/)
  const html = generateFormHTML('T\nBig', q, theme, { scriptUrl: '', conceptTheme: 'clean_landing', look })
  assert.match(html, /<div class="lh"><span data-le="landChecks:0:-1">Head <em class="ac">hot<\/em><\/span><\/div><div class="lck"><div><i><\/i><p><b data-le="landChecks:1:0">One<\/b><small data-le="landChecks:1:1">&lt;i&gt;<\/small>/)
  assert.match(html, /<summary><span data-le="landFaq:0:0">Q<\/span><\/summary><p data-le="landFaq:0:1">A<\/p>/)
  assert.match(html, /<i>K<\/i><span><b[^>]*>Kim<\/b><small[^>]*>note<\/small><\/span><u>★★★★★<\/u><p data-le="landReviews:0:2">body<\/p>/)
  assert.match(html, /<i>L<\/i><span><b[^>]*>Lee<\/b><\/span><p data-le="landReviews:1:1">plain<\/p>/)
  assert.match(html, /<div class="ll"[^>]*>lead<\/div><div class="lcd">.*<b data-le="landCards:1:1">fast<\/b><\/div><\/div><button class="sbt"[^>]*>.*<div class="lhl" data-le="landCards:2:-1">now<\/div><div class="lfn"[^>]*>\*small print<\/div>/)
  assert.match(html, /<section class="lsn ls-lend"><div class="lh"><span[^>]*>Go<\/span><\/div><div class="lhl"[^>]*>free<\/div><button class="sbt"/)
  assert.match(html, /<section class="lsn ls-lft"><span data-le="landFooter:0:-1">&lt;b&gt;<\/span><\/section>/)
  assert.match(html, /<span class="tl t1">T<\/span><br><span class="tl">Big<\/span>/)
  assert.match(html, /<button id="lcta" class="sbt" onclick="sf\(\)">/)
})
