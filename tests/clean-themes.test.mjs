import test from 'node:test';
import assert from 'node:assert/strict';
import { CLEAN_THEMES, getCleanThemeCSS } from '../src/lib/cleanThemes.js';
import { generateFormHTML } from '../src/lib/generateHTML.js';

const questions=[{id:'name',type:'short',label:'Name',required:true}];
const color={c1:'#227d69',c2:'#38bdf8'};
const scripts=html=>[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);

test('clean themes do not introduce decorative imagery, gradients or animation overrides',()=>{
  for(const theme of CLEAN_THEMES){
    const css=getCleanThemeCSS(theme.id,color.c1);
    assert.doesNotMatch(css,/url\(|gradient\(|@keyframes|\banimation\s*:|\.en\b|\.ex\b/);
    assert.match(css,/body \.nb/);
  }
  assert.equal(getCleanThemeCSS('default',color.c1),null);
});

test('clean themes share the unchanged runtime in every animation and layout',()=>{
  for(const layout of ['steps','single'])for(let animType=0;animType<10;animType++){
    const baseline=generateFormHTML('Title',questions,color,{layout,animType,scriptUrl:''});
    for(const theme of CLEAN_THEMES){
      const html=generateFormHTML('Title',questions,color,{layout,animType,conceptTheme:theme.id,scriptUrl:''});
      assert.deepEqual(scripts(html),scripts(baseline));
    }
  }
});
