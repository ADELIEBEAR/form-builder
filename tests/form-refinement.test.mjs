import test from 'node:test';
import assert from 'node:assert/strict';
import { formRefinementCSS } from '../src/lib/formRefinement.js';
import { generateFormHTML } from '../src/lib/generateHTML.js';
import { ALL_CONCEPT_THEMES, CONCEPT_THEMES } from '../src/lib/themes.js';
import { getFeaturedThemePolish } from '../src/lib/featuredThemePolish.js';

test('the builder exposes five themes while retaining legacy render compatibility', () => {
  assert.equal(CONCEPT_THEMES.length, 5);
  assert.ok(ALL_CONCEPT_THEMES.length > CONCEPT_THEMES.length);
});

test('refinement does not override animation, interaction transforms or button geometry', () => {
  assert.doesNotMatch(formRefinementCSS, /@keyframes|\banimation\s*:|\btransition\s*:|\btransform\s*:|\.en\b|\.ex\b|\.ep\b|\.xp\b/);
  const rules = [...formRefinementCSS.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
  for (const [, selectors, declarations] of rules) {
    if (/\.(nb|sbt|ci|cb|ld)\b/.test(selectors)) {
      assert.doesNotMatch(declarations, /border-radius\s*:|background\s*:/);
    }
  }
});

test('ocean and glass have distinct presentation-only polish', () => {
  const ocean = getFeaturedThemePolish('ocean');
  const glass = getFeaturedThemePolish('glass');
  assert.notEqual(ocean, glass);
  assert.match(ocean, /OCEAN EDITION/);
  assert.match(glass, /backdrop-filter:blur\(26px\)/);
  for (const css of [ocean, glass]) {
    assert.doesNotMatch(css, /@keyframes|\banimation\s*:|\btransition\s*:|\btransform\s*:/);
  }
});

test('all original themes and animation modes still generate both layouts', () => {
  const questions = [{ id:'name', type:'short', label:'Name', required:true }];
  for (const theme of ALL_CONCEPT_THEMES) {
    for (let animType = 0; animType < 10; animType++) {
      for (const layout of ['steps', 'single']) {
        const html = generateFormHTML('Application', questions, {c1:'#10b981', c2:'#38bdf8'}, {
          conceptTheme:theme.id, animType, layout, scriptUrl:'',
        });
        assert.match(html, /function go\(f,t,d\)/);
        assert.match(html, /},280\)/);
        assert.match(html, /},380\)/);
        assert.match(html, /@keyframes/);
      }
    }
  }
});
