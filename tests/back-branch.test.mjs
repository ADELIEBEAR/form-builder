import test from 'node:test'
import assert from 'node:assert/strict'
import { generateFormHTML } from '../src/lib/generateHTML.js'

// Runs the generated gn() against stubs: Q3's first option branches back to Q1.
function run(type) {
  const questions = [
    { id: 'a', type: 'short', label: 'A' },
    { id: 'b', type: 'short', label: 'B' },
    { id: 'c', type, label: 'C', options: ['again', 'go'], correctAnswer: 1, branches: [{ optionIdx: 0, targetIdx: 0 }] },
    { id: 'd', type: 'short', label: 'D' },
  ]
  const html = generateFormHTML('T', questions, { c1: '#000000', c2: '#ffffff' }, { useStart: false, scriptUrl: '' })
  const gn = /function gn\(s\)\{[\s\S]*?\n\}/.exec(html)[0]
  return new Function(`
    const SINGLE_PAGE=false,TOTAL=4,QS=${JSON.stringify(questions.map(q => ({ id: q.id, type: q.type })))},BRANCH={2:{0:0}},HIST=[],qzDone={2:true};
    let cur=0,anim=false,submitted=false,finished=false,moves=[];
    const document={querySelector:()=>cur===2?{dataset:{oi:'0'}}:null};
    const vld=()=>true,upUI=()=>{},quizCheck=()=>{},finishForm=()=>{finished=true},go=(f,t,d)=>moves.push(d);
    ${gn}
    gn(0);gn(1);gn(2);
    return {cur,finished,hist:[...HIST],moves};
  `)()
}

test('a backward branch returns to that question instead of submitting', () => {
  assert.deepEqual(run('single'), { cur: 0, finished: false, hist: [], moves: ['n', 'n', 'p'] })
})

test('a backward branch from a locked quiz still finishes', () => {
  const result = run('quiz')
  assert.equal(result.finished, true)
  assert.equal(result.cur, 2)
})
