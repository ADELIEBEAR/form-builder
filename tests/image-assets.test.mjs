import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareImageSettings, uploadImageBlob, getFormImageSettings, IMAGE_BUCKET } from '../src/lib/imageAssets.js'
import { generateFormHTML } from '../src/lib/generateHTML.js'

test('question descriptions are not used as answers or placeholders', () => {
  const html = generateFormHTML('Test', [
    { id: 1, type: 'short', hint: 'Description only', label: 'Name' },
    { id: 2, type: 'long', hint: 'Long description', placeholder: 'Your own words', label: 'Details' },
  ], { c1: '#123456', c2: '#abcdef' }, { scriptUrl: '' })
  assert.match(html, /<div class="cs">Description only<\/div>/)
  assert.match(html, /id="f1" placeholder="답변을 입력하세요\.\.\."/)
  assert.match(html, /id="f2"[^>]*placeholder="Your own words"/)
  assert.doesNotMatch(html, /(?:placeholder|value)="(?:Description only|Long description)"/)
})

test('migration preserves settings, reuses question images and drops deleted question assets', async () => {
  const settings = { doneUrl: 'https://example.com', coverImgData: 'https://example.com/cover.webp', bgImgData: 'data:image/png;base64,bg', qImgData: { 1: 'data:image/png;base64,same', 2: 'data:image/png;base64,same', 99: 'data:image/png;base64,deleted' } }
  const before = structuredClone(settings)
  const calls = []
  const next = await prepareImageSettings(settings, [{ id: 1 }, { id: 2 }], async (value, preset) => {
    calls.push([value, preset])
    return `https://example.com/${preset}.webp`
  })
  assert.equal(calls.length, 2)
  assert.equal(next.coverImgData, settings.coverImgData)
  assert.equal(next.doneUrl, settings.doneUrl)
  assert.deepEqual(next.qImgData, { 1: 'https://example.com/question.webp', 2: 'https://example.com/question.webp' })
  assert.deepEqual(settings, before)
})

test('failed conversion leaves original form settings intact', async () => {
  const settings = { coverImgData: 'data:image/png;base64,original' }
  await assert.rejects(prepareImageSettings(settings, [], async () => { throw new Error('upload failed') }), /upload failed/)
  assert.equal(settings.coverImgData, 'data:image/png;base64,original')
})

test('uploads use immutable user-scoped hashes and reuse duplicate objects', async () => {
  const paths = []
  const client = { storage: { from(bucket) {
    assert.equal(bucket, IMAGE_BUCKET)
    return {
      async upload(path, blob, options) {
        assert.equal(options.upsert, false)
        assert.equal(options.cacheControl, '31536000')
        paths.push(path)
        return { error: paths.length > 1 ? { statusCode: '409', error: 'Duplicate' } : null }
      },
      getPublicUrl(path) { return { data: { publicUrl: `https://example.com/${path}` } } },
    }
  } } }
  const blob = new Blob(['same image'], { type: 'image/webp' })
  const first = await uploadImageBlob(client, 'user-1', blob)
  assert.equal(await uploadImageBlob(client, 'user-1', blob), first)
  assert.match(paths[0], /^user-1\/[a-f0-9]{64}\.webp$/)
  const denied = { storage: { from() { return { async upload() { return { error: new Error('permission denied') } } } } } }
  await assert.rejects(uploadImageBlob(denied, 'user-1', blob), /permission denied/)
})

test('legacy image columns retain the same visible priority when migrated', () => {
  const settings = getFormImageSettings({ cover_url: 'https://example.com/current.png', settings: { coverImgData: 'data:image/png;base64,old', bgImgData: 'https://example.com/bg.png', doneTitle: 'Done' } })
  assert.equal(settings.coverImgData, 'https://example.com/current.png')
  assert.equal(settings.bgImgData, 'https://example.com/bg.png')
  assert.equal(settings.doneTitle, 'Done')
})

test('explicit image removal does not fall back to old saved images in preview', () => {
  const html = generateFormHTML('Test', [{id: 1, type: 'short'}], {c1: '#123456', c2: '#abcdef'}, {
    coverImgData: 'https://example.com/old-cover.png', bgImgData: 'https://example.com/old-background.png',
  }, { coverImgData: null, bgImgData: null })
  assert.doesNotMatch(html, /old-cover|old-background/)
})
