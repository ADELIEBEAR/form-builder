import test from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

test('minified production generator preserves embedded validation and branch functions', async () => {
  const bundle = await build({
    configFile: false, logLevel: 'silent',
    build: { write: false, minify: true, lib: { entry: fileURLToPath(new URL('../src/lib/generateHTML.js', import.meta.url)), formats: ['es'] } },
  })
  const code = [bundle].flat().flatMap(result => result.output).find(chunk => chunk.type === 'chunk' && chunk.isEntry).code
  const { generateFormHTML } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
  const questions = [{ id: 'phone', type: 'phone', label: 'Phone', required: true }]
  for (const layout of ['steps', 'single']) {
    const html = generateFormHTML('Application', questions, { c1: '#000000', c2: '#ffffff' }, { layout, useStart: false, useConfetti: false, useKb: false, scriptUrl: '' })
    const nodes = new Map()
    const element = id => {
      if (!nodes.has(id)) nodes.set(id, { style: {}, value: '', classList: { add() {}, remove() {} }, addEventListener() {}, querySelector() { return null } })
      return nodes.get(id)
    }
    const context = vm.createContext({
      document: { getElementById: element, querySelectorAll: () => [] },
      window: { addEventListener() {} }, setTimeout() {},
    })
    vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], context)
    element('fphone').value = '+82 10-4826-7395'
    assert.equal(context.vld(0), true)
    element('fphone').value = '01000000000'
    assert.equal(context.vld(0), false)
    assert.deepEqual(Array.from(context.responsePath()), [0])
  }
})
