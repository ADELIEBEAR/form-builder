import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { normalizeQuestions, newQuestionId, remapQuestionBranches, removeQuestionOption } from '../src/lib/questionModel.js'
import { getAnswerKeys } from '../src/lib/answerKeys.js'
import { generateFormHTML } from '../src/lib/generateHTML.js'
import { validateFormAnswers } from '../netlify/lib/submission-validation.mjs'
import { ALL_CONCEPT_THEMES } from '../src/lib/themes.js'

test('duplicate, missing, mixed-type and unsafe question IDs are independent without losing content or images', () => {
  const original = [1, 2, '2', 2, null, undefined, 'q_1', 'bad id', 9007199254740992].map((id, i) => ({ id, type: 'short', label: `Field ${i}` }))
  const copy = structuredClone(original)
  const images = { 2: 'https://example.test/image.webp' }
  const result = normalizeQuestions(original, images)
  assert.equal(new Set(result.questions.map(q => String(q.id))).size, original.length)
  assert.deepEqual(original, copy)
  assert.deepEqual(result.questions.map(q => q.label), original.map(q => q.label))
  for (const index of [1, 2, 3]) assert.equal(result.qImgData[result.questions[index].id], images[2])
  assert.deepEqual(normalizeQuestions(result.questions, result.qImgData), result)
})

test('500 additions, clones, moves and deletions keep unique IDs and branch destinations', () => {
  let questions = [{ id: 1, type: 'single', options: ['A'], branches: [{ optionIdx: 0, targetIdx: 1 }] }, { id: 2 }]
  for (let i = 0; i < 500; i++) {
    const previous = questions
    const next = previous.map(q => structuredClone(q))
    if (i % 3 === 0 || next.length < 3) next.splice(1, 0, { id: newQuestionId(next), type: 'short' })
    else if (i % 3 === 1) next.push(next.shift())
    else next.splice(next.findIndex(q => q.id !== 1 && q.id !== 2), 1)
    questions = remapQuestionBranches(previous, next)
    assert.equal(new Set(questions.map(q => String(q.id))).size, questions.length)
    const source = questions.find(q => q.id === 1)
    assert.equal(questions[source.branches[0].targetIdx].id, 2)
  }
})

test('deleted destinations fall back to the next question; completed branches are preserved', () => {
  const qs = [{ id: 1, branches: [{ optionIdx: 0, targetIdx: 2 }, { optionIdx: 1, targetIdx: 'done' }] }, { id: 2 }, { id: 3 }]
  assert.deepEqual(remapQuestionBranches(qs, qs.slice(0, 2))[0].branches, [{ optionIdx: 1, targetIdx: 'done' }])
})

test('every option deletion keeps surviving quiz answers and branches on the same option', () => {
  for (let correct = 0; correct < 8; correct++) for (let removed = 0; removed < 8; removed++) {
    const q = { options: Array.from({ length: 8 }, (_, i) => `Choice ${i}`), correctAnswer: correct, branches: Array.from({ length: 8 }, (_, optionIdx) => ({ optionIdx, targetIdx: optionIdx + 5 })) }
    const next = removeQuestionOption(q, removed)
    if (removed !== correct) assert.equal(next.options[next.correctAnswer], q.options[correct])
    assert.ok(next.correctAnswer >= 0 && next.correctAnswer < next.options.length)
    for (const branch of next.branches) assert.equal(next.options[branch.optionIdx], q.options[branch.targetIdx - 5])
  }
})

test('same titles, fallback names and reserved names get distinct answer keys accepted by the server', () => {
  const questions = ['Answer', 'Answer', 'Answer (Q2)', '_ts', '_formTitle', '__proto__', 'constructor', 'prototype', '', ''].map((label, id) => ({ id, type: 'short', label, required: true }))
  const keys = getAnswerKeys(questions)
  assert.equal(new Set(keys).size, questions.length)
  assert.equal(keys[0], 'Answer')
  assert.equal(keys[2], 'Answer (Q2)')
  const answers = Object.fromEntries(keys.map((key, i) => [key, `Value ${i}`]))
  assert.equal(validateFormAnswers(answers, { questions }), '')
  delete answers[keys[1]]
  assert.ok(validateFormAnswers(answers, { questions }))
})

test('all saved themes, animation modes and layouts parse with hostile or multiline text and duplicate IDs', () => {
  const questions = ['short', 'long', 'phone', 'email', 'single', 'multiple', 'quiz', 'legal'].map(type => ({ id: 1, type, label: 'First\nSecond </script> \' " \\', options: ['</script>', "A'B"], explanation: '</script><img src=x>', legalText: 'Terms\nLine' }))
  const originals = JSON.stringify(questions)
  for (const theme of ALL_CONCEPT_THEMES) for (const layout of ['steps', 'single']) for (let animType = 0; animType < 10; animType++) {
    const html = generateFormHTML('Title </script>', questions, { c1: '#fff', c2: '#000' }, { conceptTheme: theme.id, layout, animType, scriptUrl: '' })
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    assert.equal(scripts.length, 1)
    assert.doesNotThrow(() => new vm.Script(scripts[0][1]), `${theme.id}/${layout}/${animType}`)
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
    assert.equal(new Set(ids).size, ids.length)
  }
  assert.equal(JSON.stringify(questions), originals)
})
