import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { generateFormHTML } from '../../src/lib/generateHTML.js'
import { validateFormAnswers } from '../../netlify/lib/submission-validation.mjs'
import { CONCEPT_THEMES, ALL_CONCEPT_THEMES } from '../../src/lib/themes.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const root = fileURLToPath(new URL('../../', import.meta.url))
if (!process.env.QA_OUTPUT) throw new Error('Set QA_OUTPUT to a dedicated results directory before running browser tests.')
const output = process.env.QA_OUTPUT
await fs.mkdir(output, { recursive: true })
const results = []
let rendered = ''
let form
let writes = []
let delayRead = 0
let delaySave = 0
let failSave = false
let failSubmit = false
let submissions = []
let responseRows = []
const formId = '11111111-1111-4111-8111-111111111111'
const userId = '22222222-2222-4222-8222-222222222222'
const q = (id, type = 'short', extra = {}) => ({ id, type, label: `Question ${id}`, required: true, options: ['A', 'B', 'C'], ...extra })
const initialForm = (questions) => ({ id: formId, user_id: userId, title: 'Application QA', theme_c1: '#2463eb', theme_c2: '#60a5fa', questions, settings: { scriptUrl: '', useConfetti: false }, slug: 'existing-link', is_published: true })

const server = await createServer({
  root, envDir: false,
  define: { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://qa.invalid'), 'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('qa-public-key') },
  server: { host: '127.0.0.1', port: 5190, strictPort: false },
  plugins: [{
    name: 'qa-only-fixtures', enforce: 'pre',
    load(id) {
      if (id.replaceAll('\\', '/').endsWith('/hooks/useAuth.jsx')) return `const user={id:'${userId}',user_metadata:{}};export const useAuth=()=>({user,loading:false});export const AuthProvider=({children})=>children;`
    },
    configureServer(vite) {
      vite.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/__qa_form')) { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(rendered); return }
        next()
      })
    },
  }],
})
await server.listen()
const origin = `http://127.0.0.1:${server.httpServer.address().port}`
const browser = await chromium.launch({ channel: process.env.QA_BROWSER || 'msedge', headless: true })

async function run(name, task, viewport = { width: 1440, height: 1000 }) {
  if (process.env.QA_FILTER && !name.includes(process.env.QA_FILTER)) return
  if (process.env.QA_MATCH && !new RegExp(process.env.QA_MATCH).test(name)) return
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  page.setDefaultTimeout(5000)
  const errors = []
  page.on('pageerror', err => errors.push(err.message))
  form = initialForm([q(1)])
  writes = []; delayRead = 0; delaySave = 0; failSave = false; failSubmit = false; submissions = []; responseRows = []
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url())
    if (url.hostname === 'qa.invalid') {
      if (url.pathname === '/rest/v1/responses') return route.fulfill({ json: responseRows })
      if (url.pathname === '/rest/v1/forms') {
        if (req.method() === 'GET') {
          const data = structuredClone(form)
          if (delayRead) await new Promise(resolve => setTimeout(resolve, delayRead))
          return route.fulfill({ json: req.headers().accept?.includes('vnd.pgrst.object') ? data : [data] })
        }
        const payload = req.postDataJSON(); writes.push(payload)
        if (delaySave) await new Promise(resolve => setTimeout(resolve, delaySave))
        if (failSave) return route.fulfill({ status: 500, json: { message: 'QA save failure' } })
        form = { ...form, ...payload }
        return route.fulfill({ json: { id: formId, slug: form.slug, is_published: form.is_published } })
      }
      return route.fulfill({ json: [] })
    }
    if (url.origin === origin && url.pathname === '/api/submit-response') {
      submissions.push(req.postDataJSON())
      await new Promise(resolve => setTimeout(resolve, 100))
      const error = validateFormAnswers(req.postDataJSON().answers, form)
      return route.fulfill({ status: failSubmit ? 503 : error ? 400 : 201, json: { error: error || 'QA unavailable', ok: !failSubmit && !error } })
    }
    if (url.origin === origin) return route.continue()
    return route.abort()
  })
  await page.addInitScript(() => {
    window.__submissions = []
    window.addEventListener('message', event => { if (event.data?.type === 'FORM_SUBMIT') window.__submissions.push(event.data) })
  })
  const started = Date.now()
  try {
    await task(page)
    assert.deepEqual(errors, [], 'uncaught browser errors')
    results.push({ name, status: 'passed', ms: Date.now() - started })
    console.log(`PASS ${name}`)
  } catch (error) {
    const screenshot = `${name.replace(/[^a-z0-9-]/gi, '-')}.png`
    await page.screenshot({ path: path.join(output, screenshot), fullPage: true }).catch(() => {})
    results.push({ name, status: 'failed', error: error.message, errors, screenshot })
    console.log(`FAIL ${name}: ${error.message.slice(0, 300)}`)
  } finally { await context.close() }
}

async function editor(page, questions, options = {}) {
  form = initialForm(questions)
  if (options.cached) {
    delayRead = 1800
    await page.addInitScript(({ formId, form }) => sessionStorage.setItem(`form_${formId}`, JSON.stringify(form)), { formId, form })
  }
  await page.goto(`${origin}/builder/${formId}`)
  await page.locator('[data-qid]').first().waitFor()
}
const cards = page => page.locator('[data-qid]')
const label = (page, index) => cards(page).nth(index).locator('input[placeholder="질문을 입력하세요..."]')
async function generated(page, questions, settings = {}, theme = { c1: '#2463eb', c2: '#60a5fa' }) {
  rendered = generateFormHTML('Application QA', questions, theme, { useKb: false, useConfetti: false, scriptUrl: '', ...settings })
  await page.goto(`${origin}/__qa_form`)
}
async function settled(page) { await page.waitForFunction(() => typeof anim === 'undefined' || !anim) }
async function submitted(page) { await page.waitForFunction(() => window.__submissions.length === 1) }

async function checkButton(page, selector) {
  const result = await page.locator(selector).evaluate(button => {
    const css = getComputedStyle(button)
    const rgb = value => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number)
    const luminance = color => color.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
    const text = luminance(rgb(css.color))
    const stops = css.backgroundImage.match(/rgba?\([^)]+\)/g)?.map(rgb) || [rgb(css.backgroundColor)]
    const contrast = stops.map(stop => { const bg = luminance(stop); return (Math.max(text, bg) + .05) / (Math.min(text, bg) + .05) })
    const box = button.getBoundingClientRect()
    return { minContrast: Math.min(...contrast), color: css.color, background: css.backgroundImage === 'none' ? css.backgroundColor : css.backgroundImage, clipped: box.left < -1 || box.right > innerWidth + 1 || button.scrollWidth > button.clientWidth + 2, text: button.textContent.trim() }
  })
  assert.ok(result.text, 'empty action button')
  assert.ok(!result.clipped, JSON.stringify(result))
  assert.ok(result.minContrast >= 4.5, JSON.stringify(result))
}

try {
  await run('editor-duplicate-id-isolation', async page => {
    await editor(page, [q(1), q(2, 'quiz'), q(3, 'multiple'), q(2, 'phone')])
    await label(page, 1).fill('Only quiz changed')
    assert.equal(await label(page, 3).inputValue(), 'Question 2')
    assert.equal(new Set(await cards(page).evaluateAll(nodes => nodes.map(n => n.dataset.qid))).size, 4)
  })
  await run('editor-branch-target-after-move', async page => {
    await editor(page, [q(1, 'single', { branches: [{ optionIdx: 0, targetIdx: 2 }] }), q(2), q(3)])
    await cards(page).nth(2).getByTitle('위로', { exact: true }).click()
    assert.equal(await cards(page).nth(0).locator('select').first().inputValue(), '1')
  })
  await run('editor-quiz-answer-after-option-delete', async page => {
    await editor(page, [q(1, 'quiz', { correctAnswer: 2 })])
    await cards(page).first().locator('button[class*="optDel"]').first().click()
    await page.getByRole('button', { name: /저장/ }).first().click()
    await page.waitForFunction(() => document.body.textContent.includes('저장되었습니다'))
    assert.equal(writes[0].questions[0].correctAnswer, 1)
  })
  await run('editor-delayed-load-preserves-edit', async page => {
    await editor(page, [q(1)], { cached: true })
    await label(page, 0).fill('Typed while loading')
    await page.waitForTimeout(2100)
    assert.equal(await label(page, 0).inputValue(), 'Typed while loading')
  })
  await run('steps-final-quiz-save-failure', async page => {
    await generated(page, [q(1, 'quiz', { correctAnswer: 0 })], { useStart: false, waitForSubmit: true })
    await page.locator('.qo').first().click(); await page.locator('#qcb0').click(); await page.locator('#qnb0').click()
    await submitted(page)
    await page.evaluate(() => window.postMessage({ type: 'SUBMIT_ERROR', message: 'Retry' }, '*'))
    await page.waitForTimeout(50)
    assert.equal(await page.locator('#qnb0').isEnabled(), true)
  })
  await run('steps-submit-stays-disabled-until-ack', async page => {
    await generated(page, [q(1)], { useStart: false, waitForSubmit: true })
    await page.locator('#f1').fill('Value'); await page.locator('#sb').click(); await submitted(page)
    assert.equal(await page.locator('#sb').isDisabled(), true)
  })
  await run('steps-restart-without-cover', async page => {
    await generated(page, [q(1)], { useStart: false })
    await page.locator('#f1').fill('Value'); await page.locator('#sb').click(); await settled(page)
    await page.locator('.drst').click(); await page.waitForTimeout(700)
    assert.equal(await page.locator('#done').isVisible(), false)
    assert.equal(await page.locator('#sl0').isVisible(), true)
  })
  await run('single-duplicate-titles-preserve-answers', async page => {
    await generated(page, [q(1, 'short', { label: 'Answer' }), q(2, 'short', { label: 'Answer' })], { layout: 'single' })
    await page.locator('#f1').fill('first'); await page.locator('#f2').fill('second'); await page.locator('#sb').click(); await submitted(page)
    const values = await page.evaluate(() => Object.values(window.__submissions[0].answers))
    assert.ok(values.includes('first') && values.includes('second'))
  })
  await run('generated-multiline-and-script-text', async page => {
    await generated(page, [q(1, 'short', { label: 'Line one\nLine two </script>' })], { useStart: false })
    await page.locator('#f1').fill('Value'); await page.locator('#sb').click(); await submitted(page)
  })

  for (const type of ['short', 'long', 'phone', 'email', 'single', 'multiple', 'quiz', 'legal']) {
    await run(`editor-clone-save-reload-${type}`, async page => {
      await editor(page, [q(1, type)])
      await cards(page).first().getByTitle('복제', { exact: true }).click()
      await label(page, 1).fill('Independent copy')
      assert.equal(await label(page, 0).inputValue(), 'Question 1')
      if (['single', 'multiple', 'quiz'].includes(type)) {
        await cards(page).nth(1).locator('input[class*="optInp"]').first().fill('New option')
        assert.equal(await cards(page).nth(0).locator('input[class*="optInp"]').first().inputValue(), 'A')
      }
      await page.getByRole('button', { name: /저장/ }).first().click()
      await page.waitForFunction(() => document.body.textContent.includes('저장되었습니다'))
      assert.equal(writes[0].questions.length, 2)
      await page.reload(); await cards(page).nth(1).waitFor()
      assert.equal(await label(page, 1).inputValue(), 'Independent copy')
      await cards(page).nth(1).getByTitle('삭제', { exact: true }).click()
      assert.equal(await cards(page).count(), 1)
    })
    for (const layout of ['steps', 'single']) for (const required of [true, false]) {
      await run(`field-${type}-${layout}-${required ? 'required' : 'optional'}`, async page => {
        const questions = [q(1, type, { required, correctAnswer: 0 })]
        await generated(page, questions, { layout, useStart: false, waitForSubmit: true })
        const send = async () => {
          if (type === 'quiz' && layout === 'steps') {
            await page.locator('#qcb0').click()
            if (await page.locator('#qnb0').isVisible()) await page.locator('#qnb0').click()
          } else await page.locator('#sb').click()
        }
        if (required) {
          await send()
          assert.equal(await page.evaluate(() => window.__submissions.length), 0)
          assert.equal(await page.locator('#e0').isVisible(), true)
          if (['short', 'long', 'phone', 'email'].includes(type)) await page.locator('#f1').fill(type === 'phone' ? '010-4826-7395' : type === 'email' ? 'qa@example.test' : 'Filled answer')
          else if (type === 'legal') await page.locator('.la').click()
          else await page.locator('.ci').first().click()
        }
        await send(); await submitted(page)
        const answers = await page.evaluate(() => window.__submissions[0].answers)
        assert.equal(validateFormAnswers(answers, { questions }), '')
        await page.evaluate(() => window.postMessage({ type: 'SUBMIT_SUCCESS' }, '*'))
        await settled(page)
        assert.equal(await page.locator('#done').isVisible(), true)
        await page.locator('.drst').click()
        assert.equal(await page.locator('#done').isVisible(), false)
      })
    }
  }

  await run('editor-republish-preserves-public-url', async page => {
    await editor(page, [q(1)])
    await page.getByRole('button', { name: /발행/ }).first().click()
    await page.waitForFunction(() => document.body.textContent.includes('발행 완료'))
    assert.equal(form.slug, 'existing-link')
  })
  await run('editor-save-error-retains-draft', async page => {
    await editor(page, [q(1)]); failSave = true
    await label(page, 0).fill('Unsaved edit')
    await page.getByRole('button', { name: /저장/ }).first().click()
    await page.waitForFunction(() => document.body.textContent.includes('저장 중 오류'))
    assert.equal(await label(page, 0).inputValue(), 'Unsaved edit')
    failSave = false
    await page.getByRole('button', { name: /저장/ }).first().click()
    await page.waitForFunction(() => document.body.textContent.includes('저장되었습니다'))
    assert.equal(form.questions[0].label, 'Unsaved edit')
  })
  for (const layout of ['single', 'steps']) {
    await run(`public-submit-retry-${layout}`, async page => {
      form = initialForm([q(1)]); form.settings.layout = layout; form.settings.useStart = false
      await page.goto(`${origin}/f/existing-link`)
      const frame = page.frameLocator('iframe')
      await frame.locator('#f1').fill('Answer')
      failSubmit = true; await frame.locator('#sb').click()
      await frame.locator('#tst.fail').waitFor()
      assert.equal(await frame.locator('#done').isVisible(), false)
      failSubmit = false; await frame.locator('#sb').click()
      await frame.locator('#done').waitFor()
      assert.equal(submissions.length, 2)
    })
    await run(`branch-backtrack-discards-abandoned-answers-${layout}`, async page => {
      const questions = [q(1, 'single', { branches: [{ optionIdx: 1, targetIdx: 'done' }] }), q(2), q(3)]
      await generated(page, questions, { layout, useStart: false })
      await page.locator('#g1 .ci').first().click()
      if (layout === 'steps') { await page.locator('#sl0 .nb').click(); await settled(page) }
      await page.locator('#f2').fill('Abandoned answer')
      if (layout === 'steps') {
        await page.locator('#sl1 .nb').click(); await settled(page)
        await page.locator('#sl2 .bb').click(); await settled(page)
        await page.locator('#sl1 .bb').click(); await settled(page)
      }
      await page.locator('#g1 .ci').nth(1).click()
      await page.locator(layout === 'single' ? '#sb' : '#sl0 .nb').click(); await submitted(page)
      const answers = await page.evaluate(() => window.__submissions[0].answers)
      assert.equal(answers['Question 2'], undefined)
      assert.equal(validateFormAnswers(answers, { questions }), '')
    })
    await run(`quiz-incorrect-response-still-submits-${layout}`, async page => {
      const questions = [q(1, 'quiz', { correctAnswer: 0 })]
      await generated(page, questions, { layout, useStart: false })
      await page.locator('.ci').nth(1).click()
      if (layout === 'steps') { await page.locator('#qcb0').click(); await page.locator('#qnb0').click() } else await page.locator('#sb').click()
      await submitted(page)
      const answers = await page.evaluate(() => window.__submissions[0].answers)
      assert.equal(validateFormAnswers(answers, { questions }), '')
    })
  }

  for (const publicPage of [false, true]) for (const mode of ['ime', 'cursor', 'disabled', 'enter']) {
    await run(`edge-keyboard-${publicPage ? 'public' : 'preview'}-${mode}`, async page => {
      const settings = { useKb: mode !== 'disabled', useStart: false }
      let surface = page
      if (publicPage) {
        form = initialForm([q(1), q(2)])
        Object.assign(form.settings, settings)
        await page.goto(`${origin}/f/existing-link`)
        surface = page.frameLocator('iframe')
      } else await generated(page, [q(1), q(2)], settings)
      const input = surface.locator('#f1')
      await input.fill('Answer')
      if (mode === 'ime') await input.dispatchEvent('keydown', { key: 'Enter', code: 'Enter', isComposing: true, bubbles: true })
      else await input.press(mode === 'cursor' ? 'ArrowRight' : 'Enter')
      await page.waitForTimeout(750)
      assert.equal(await surface.locator('#sl0').isVisible(), mode !== 'enter')
      assert.equal(await surface.locator('#sl1').isVisible(), mode === 'enter')
    })
  }
  for (const layout of ['steps', 'single']) for (const duplicate of [false, true]) {
    await run(`edge-phone-international-${layout}-${duplicate}`, async page => {
      const questions = duplicate ? [q(1, 'short', { label: 'Contact' }), q(2, 'phone', { label: 'Contact' })] : [q(2, 'phone')]
      form = initialForm(questions); Object.assign(form.settings, { layout, useStart: false })
      await page.goto(`${origin}/f/existing-link`)
      const frame = page.frameLocator('iframe')
      if (duplicate) {
        await frame.locator('#f1').fill('Alice')
        if (layout === 'steps') { await frame.locator('#sl0 .nb').click(); await page.waitForTimeout(700) }
      }
      await frame.locator('#f2').fill('+82 10-4826-7395')
      await frame.locator('#sb').click(); await frame.locator('#done').waitFor()
      assert.equal(submissions.length, 1)
      assert.ok(Object.values(submissions[0].answers).includes('+82 10-4826-7395'))
      if (duplicate) assert.ok(Object.values(submissions[0].answers).includes('Alice'))
    })
  }
  for (const layout of ['steps', 'single']) for (const type of ['single', 'multiple']) {
    await run(`edge-other-answer-${layout}-${type}`, async page => {
      const questions = [q(1, type, { other: true })]
      await generated(page, questions, { layout, useStart: false })
      await page.locator('#oi1').fill('Custom choice')
      if (layout === 'steps') await page.locator('#oi1').locator('..').click({ position: { x: 12, y: 12 } })
      await page.locator('#sb').click(); await submitted(page)
      assert.equal(await page.evaluate(() => window.__submissions[0].answers['Question 1']), 'Custom choice')
    })
  }
  await run('edge-public-duplicate-submit-is-coalesced', async page => {
    form = initialForm([q(1)]); form.settings.useStart = false
    await page.goto(`${origin}/f/existing-link`)
    const frame = page.frameLocator('iframe')
    await frame.locator('#f1').fill('Answer')
    await frame.locator('#sb').evaluate(button => { button.click(); window.parent.postMessage({ type: 'FORM_SUBMIT', answers: { 'Question 1': 'Answer' } }, '*') })
    await frame.locator('#done').waitFor()
    assert.equal(submissions.length, 1)
  })

  const response = (id, answers) => ({ id: String(id), form_id: formId, answers, submitted_at: `2026-11-12T03:00:0${id}Z`, ip_address: '192.0.2.1' })
  await run('admin-one-response-two-phone-fields-is-not-duplicate', async page => {
    responseRows = [response(1, { Name: 'Alice', Phone: '010-4826-7395', Confirm: '01048267395' })]
    await page.goto(`${origin}/duplicates`)
    await page.getByRole('heading', { name: '중복 신청자 없음' }).waitFor()
  })
  await run('admin-duplicate-search-and-details', async page => {
    responseRows = [response(2, { Name: 'Alice', Phone: '010-4826-7395' }), response(1, { Name: 'Alice', Phone: '01048267395' })]
    await page.goto(`${origin}/duplicates`)
    await page.getByText('2회 신청', { exact: true }).waitFor()
    await page.getByPlaceholder('전화번호 또는 폼 이름 검색...').fill('01048267395')
    await page.getByText('2회 신청', { exact: true }).click()
    const phoneValues = page.locator('[class*="dupeEntryPhone"]')
    assert.equal(await phoneValues.count(), 2)
    assert.deepEqual(await phoneValues.allTextContents(), ['010-4826-7395', '010-4826-7395'])
  })
  await run('admin-international-number-groups-with-local-number', async page => {
    responseRows = [response(2, { Name: 'Alice', Phone: '+82 10-4826-7395' }), response(1, { Name: 'Alice', Phone: '01048267395' })]
    await page.goto(`${origin}/duplicates`)
    await page.getByText('2회 신청', { exact: true }).waitFor()
  })
  await run('admin-response-filters-and-table', async page => {
    responseRows = [response(3, { Name: 'Bob', Phone: '010-7935-2684' }), response(2, { Name: 'Alice', Phone: '010-4826-7395' }), response(1, { Name: 'Alice', Phone: '01048267395' })]
    await page.goto(`${origin}/responses/${formId}`)
    const checkboxes = page.locator('input[type="checkbox"]')
    await page.getByText('2번째 신청!', { exact: true }).waitFor()
    assert.equal(await checkboxes.count(), 3)
    await page.getByRole('button', { name: /^중복 제외/ }).click()
    assert.equal(await checkboxes.count(), 2)
    await page.getByRole('button', { name: /중복만 보기/ }).click()
    assert.equal(await checkboxes.count(), 1)
    await page.getByRole('button', { name: '표', exact: true }).click()
    assert.equal(await page.locator('tbody tr').count(), 1)
    await page.getByRole('button', { name: /중복만 보기/ }).click()
    assert.equal(await page.locator('tbody tr').count(), 3)
    await page.getByPlaceholder('응답 내용 검색...').fill('01048267395')
    assert.equal(await page.locator('tbody tr').count(), 2)
  })
  await run('admin-dashboard-duplicate-navigation', async page => {
    await page.addInitScript(() => sessionStorage.setItem('admin_unlocked_version', '2026-08-03-admin-pin-keypad'))
    await page.goto(`${origin}/dashboard`)
    await page.getByRole('button', { name: /중복 체크/ }).click()
    await page.waitForURL('**/duplicates')
    await page.getByRole('heading', { name: '중복 신청자 없음' }).waitFor()
  })

  for (const newForm of [false, true]) await run(`supplement-save-in-flight-${newForm ? 'new' : 'existing'}`, async page => {
    if (newForm) {
      await page.goto(`${origin}/builder`)
      await page.getByPlaceholder('폼 제목 입력...').fill('Application QA')
      await page.getByRole('button', { name: /단답형/ }).first().click()
    } else await editor(page, [q(1)])
    await label(page, 0).fill('Saved snapshot')
    delaySave = 900
    await page.getByRole('button', { name: /저장/ }).first().click()
    await label(page, 0).fill('Newer unsaved edit')
    await page.waitForFunction(() => document.body.textContent.includes('저장되었습니다'))
    await page.waitForTimeout(250)
    assert.equal(await label(page, 0).inputValue(), 'Newer unsaved edit')
    assert.equal(writes[0].questions[0].label, 'Saved snapshot')
  })
  await run('supplement-drag-keeps-branch-destination', async page => {
    await editor(page, [q(1, 'single', { branches: [{ optionIdx: 0, targetIdx: 2 }] }), q(2), q(3)])
    await page.locator('[data-qid="3"]').getByTitle('드래그해서 순서 변경').dragTo(page.locator('[data-qid="1"]').getByTitle('드래그해서 순서 변경'))
    assert.equal(await label(page, 0).inputValue(), 'Question 3')
    await page.getByRole('button', { name: /저장/ }).first().click()
    await page.waitForFunction(() => document.body.textContent.includes('저장되었습니다'))
    assert.equal(writes[0].questions[1].branches[0].targetIdx, 0)
  }, { width: 1440, height: 1800 })
  await run('supplement-live-preview-follows-independent-question-edit', async page => {
    await editor(page, [q(1), q(2, 'quiz'), q(2, 'phone')])
    await label(page, 1).fill('Independent quiz')
    const preview = page.frameLocator('iframe')
    await preview.locator('#sl1 .ct').filter({ hasText: 'Independent quiz' }).waitFor({ state: 'attached' })
    assert.equal(await preview.locator('#sl2 .ct').textContent(), 'Question 2')
    await preview.locator('.sbt').click()
    await preview.locator('#sl0').waitFor()
    await page.waitForTimeout(500)
    await page.screenshot({ path: path.join(output, 'editor-independent-preview.png'), fullPage: true })
  })
  await run('supplement-auto-next-does-not-skip-after-manual-next', async page => {
    await generated(page, [q(1, 'single'), q(2, 'short', { required: false }), q(3)], { autoNext: true, useStart: false })
    await page.locator('#g1 .ci').first().click()
    await page.locator('#sl0 .nb').click(); await settled(page)
    assert.equal(await page.locator('#sl1').isVisible(), true)
    assert.equal(await page.locator('#sl2').isVisible(), false)
  })
  for (const layout of ['single', 'steps']) await run(`supplement-cyclic-branch-${layout}`, async page => {
    const questions = [q(1, 'single'), q(2, 'single', { branches: [{ optionIdx: 0, targetIdx: 0 }] })]
    await generated(page, questions, { layout, useStart: false })
    await page.locator('#g1 .ci').first().click()
    if (layout === 'steps') { await page.locator('#sl0 .nb').click(); await settled(page) }
    await page.locator('#g2 .ci').first().click()
    await page.locator('#sb').click(); await submitted(page)
    assert.equal(validateFormAnswers(await page.evaluate(() => window.__submissions[0].answers), { questions }), '')
  })

  const colors = [
    { c1: '#ffffff', c2: '#ffffff' }, { c1: '#111111', c2: '#000000' },
    { c1: '#747474', c2: '#747474' }, { c1: '#000000', c2: '#ffffff' },
    { c1: '#ffff00', c2: '#ffffff' }, { c1: '#2463eb', c2: '#60a5fa' },
  ]
  for (const theme of CONCEPT_THEMES) for (const layout of ['steps', 'single']) for (const width of [320, 390, 1440]) for (const [ci, color] of colors.entries()) {
    await run(`appearance-${theme.id}-${layout}-${width}-color${ci}`, async page => {
      await generated(page, [q(1, 'short', { label: '길고 자세한 질문 제목도 화면을 벗어나지 않아야 합니다', required: false })], { conceptTheme: theme.id, layout, doneCta: '자료 확인하기', doneUrl: 'https://example.test', startBtnText: '지금 자료 신청 시작하기' }, color)
      const button = layout === 'single' ? '#sb' : '.sbt'
      await checkButton(page, button)
      await page.locator(button).hover(); await page.waitForTimeout(220); await checkButton(page, button)
      await page.mouse.move(0, 0)
      if (layout === 'steps') { await page.locator('.sbt').click(); await settled(page); await checkButton(page, '#sb') }
      if (ci === 0 && width === 390) await page.screenshot({ path: path.join(output, `${theme.id}-${layout}-white-button.png`), fullPage: true })
      await page.locator('#sb').click(); await settled(page)
      await checkButton(page, '.dcta')
      if (ci === 5 && width === 390) {
        await page.locator('.dcta').evaluate(async button => {
          await Promise.all(button.getAnimations().map(animation => animation.finished.catch(() => {})))
        })
        assert.equal(await page.locator('.dcta').evaluate(button => Number(getComputedStyle(button).opacity)), 1)
        await page.screenshot({ path: path.join(output, `${theme.id}-${layout}-mobile.png`), fullPage: true })
      }
    }, { width, height: 844 })
  }
  for (const theme of ALL_CONCEPT_THEMES.filter(t => !CONCEPT_THEMES.some(c => c.id === t.id))) for (const layout of ['single', 'steps']) {
    await run(`legacy-appearance-${theme.id}-${layout}`, async page => {
      await generated(page, [q(1, 'short', { required: false })], { conceptTheme: theme.id, layout, doneCta: 'Continue', doneUrl: 'https://example.test' })
      await checkButton(page, layout === 'single' ? '#sb' : '.sbt')
    }, { width: 390, height: 844 })
  }
  for (const theme of CONCEPT_THEMES) for (let animType = 0; animType < 10; animType++) {
    await run(`animation-${theme.id}-${animType}`, async page => {
      await generated(page, [q(1)], { conceptTheme: theme.id, animType })
      await page.locator('.sbt').click()
      await page.waitForTimeout(350)
      assert.equal(await page.locator('#sl0').evaluate(el => getComputedStyle(el).animationName), ['siU', 'fdi', 'fxIn', 'fyIn', 'ziIn', 'slIn', 'bnIn', 'rzIn', 'glIn', 'ufIn'][animType])
      await settled(page)
      await page.locator('#f1').fill('Answer'); await page.locator('#sb').click(); await settled(page)
      assert.equal(await page.locator('#done').isVisible(), true)
    })
  }
} finally {
  await browser.close(); await server.close()
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2))
}
console.log(`${results.filter(r => r.status === 'passed').length}/${results.length} passed`)
if (results.some(r => r.status === 'failed')) process.exitCode = 1
