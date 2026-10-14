const typefaces = {
  default: 'Noto Sans KR', soft: 'Gowun Dodum', cyber: 'Gugi',
  serious: 'Noto Serif KR', retro: 'Do Hyeon', nature: 'Gowun Batang',
  luxury: 'Hahmlet', kawaii: 'Jua', brutalist: 'Black Han Sans',
  glass: 'IBM Plex Sans KR', newspaper: 'Nanum Myeongjo', midnight: 'Song Myung',
  candy: 'Sunflower', ink: 'Yeon Sung', aurora: 'Stylish',
  paper: 'Nanum Pen Script', neon80s: 'Do Hyeon', medical: 'Gothic A1',
  forest: 'Noto Serif KR', sunset: 'Hi Melody', chalk: 'Gaegu',
  ocean: 'Gowun Batang', crypto: 'Orbit', trading: 'Nanum Gothic',
  defi: 'IBM Plex Sans KR', bullrun: 'Do Hyeon', bearish: 'Noto Sans KR',
  bloomberg: 'IBM Plex Sans KR', gold: 'Nanum Myeongjo', matrix: 'IBM Plex Sans KR',
};
const serif = new Set(['Noto Serif KR', 'Nanum Myeongjo', 'Gowun Batang', 'Hahmlet', 'Song Myung']);
const defaultFont = "'Noto Sans KR',sans-serif";

export function getThemeTypeface(id, selected) {
  if (selected && selected !== defaultFont) return selected;
  const family = typefaces[id] || typefaces.default;
  return `'${family}',${serif.has(family) ? 'serif' : 'sans-serif'}`;
}

export function getThemeFontURL(font) {
  const family = font.match(/['"]([^'"]+)['"]/)?.[1] || 'Noto Sans KR';
  const weights = {
    Sunflower: ':wght@300;500;700', 'Noto Serif KR': ':wght@400;500;600;700',
    'Nanum Myeongjo': ':wght@400;700', 'Nanum Gothic': ':wght@400;700;800',
    'Gowun Batang': ':wght@400;700', 'IBM Plex Sans KR': ':wght@400;500;600;700',
    Gaegu: ':wght@300;400;700',
    Hahmlet: ':wght@400;500;600;700', 'Gothic A1': ':wght@400;500;600;700',
  };
  const extra = family === 'Noto Sans KR' ? '' : `&family=${encodeURIComponent(family).replace(/%20/g, '+')}${weights[family] || ''}`;
  return `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700${extra}&display=swap`;
}

const backgrounds = {
  default: ['linear-gradient(90deg,var(--theme-grid) 1px,transparent 1px)', '96px 96px', .34],
  soft: ['repeating-linear-gradient(135deg,var(--bd) 0 1px,transparent 1px 22px)', 'auto', .24],
  cyber: ['linear-gradient(var(--theme-ink) 1px,transparent 1px),linear-gradient(90deg,var(--theme-ink) 1px,transparent 1px)', '32px 32px', .12],
  serious: ['linear-gradient(90deg,var(--tx) 0 2px,transparent 2px)', '220px 100%', .08],
  retro: ['repeating-linear-gradient(0deg,transparent 0 30px,var(--bd2) 30px 32px,transparent 32px 60px)', 'auto', .28],
  nature: ['repeating-linear-gradient(118deg,var(--theme-ink) 0 1px,transparent 1px 68px)', 'auto', .08],
  luxury: ['repeating-linear-gradient(135deg,var(--theme-ink) 0 1px,transparent 1px 22px)', 'auto', .07],
  kawaii: ['repeating-linear-gradient(135deg,var(--theme-ink) 0 2px,transparent 2px 30px)', 'auto', .07],
  brutalist: ['repeating-linear-gradient(90deg,var(--bd2) 0 1px,transparent 1px 12px)', 'auto', .18],
  glass: ['linear-gradient(120deg,var(--bd) 0 18%,transparent 18% 58%,var(--bd) 58% 72%,transparent 72%)', '420px 420px', .34],
  newspaper: ['repeating-linear-gradient(0deg,var(--bd2) 0 1px,transparent 1px 6px)', 'auto', .13],
  midnight: ['repeating-linear-gradient(120deg,var(--bd2) 0 1px,transparent 1px 84px)', 'auto', .09],
  candy: ['linear-gradient(90deg,var(--c1) 1px,transparent 1px),linear-gradient(var(--c2) 1px,transparent 1px)', '56px 56px', .16],
  ink: ['repeating-linear-gradient(135deg,var(--bd2) 0 1px,transparent 1px 5px)', 'auto', .1],
  aurora: ['linear-gradient(135deg,var(--c1),transparent 42%),linear-gradient(35deg,var(--c2),transparent 45%)', 'cover', .13],
  paper: ['repeating-linear-gradient(0deg,var(--bd2) 0 1px,transparent 1px 26px)', 'auto', .26],
  neon80s: ['linear-gradient(var(--c1) 1px,transparent 1px),linear-gradient(90deg,var(--c2) 1px,transparent 1px)', '72px 36px', .2],
  medical: ['linear-gradient(90deg,var(--bd2) 1px,transparent 1px)', '160px 160px', .24],
  forest: ['repeating-linear-gradient(118deg,var(--theme-ink) 0 2px,transparent 2px 70px)', 'auto', .12],
  sunset: ['linear-gradient(165deg,var(--c2) 0 18%,transparent 18% 68%,var(--c1) 68% 100%)', 'cover', .12],
  chalk: ['repeating-linear-gradient(5deg,var(--tx2) 0 1px,transparent 1px 7px)', 'auto', .06],
  ocean: ['repeating-linear-gradient(170deg,var(--theme-ink) 0 1px,transparent 1px 44px)', 'auto', .08],
  crypto: ['repeating-linear-gradient(45deg,var(--theme-ink) 0 1px,transparent 1px 36px)', 'auto', .12],
  trading: ['linear-gradient(var(--bd2) 1px,transparent 1px),linear-gradient(90deg,var(--bd2) 1px,transparent 1px)', '80px 24px', .28],
  defi: ['linear-gradient(45deg,var(--theme-ink) 1px,transparent 1px),linear-gradient(-45deg,var(--theme-ink) 1px,transparent 1px)', '48px 48px', .12],
  bullrun: ['repeating-linear-gradient(135deg,var(--theme-ink) 0 1px,transparent 1px 64px)', 'auto', .14],
  bearish: ['repeating-linear-gradient(45deg,var(--theme-ink) 0 1px,transparent 1px 64px)', 'auto', .14],
  bloomberg: ['linear-gradient(var(--theme-ink) 1px,transparent 1px),linear-gradient(90deg,var(--theme-ink) 1px,transparent 1px)', '144px 28px', .14],
  gold: ['repeating-linear-gradient(90deg,var(--theme-ink) 0 1px,transparent 1px 32px)', 'auto', .11],
  matrix: ['linear-gradient(var(--theme-ink) 1px,transparent 1px),linear-gradient(90deg,var(--theme-ink) 1px,transparent 1px)', '18px 36px', .17],
};

const relaxed = {
  default: '.stit{font-size:38px;font-weight:600}.ct{font-size:24px}.stag{border:0;padding:0}.fi,.ci{border-radius:8px}.cf{border:0}.start-meta{border:0;padding-top:0}.sbt{width:260px}',
  soft: '.stit{font-weight:500;line-height:1.5}.fi,.ci{border:1px solid var(--bd);border-radius:8px}.start-meta{border:0;padding-top:0}.cn{border:0}.cf{border:0}',
  kawaii: '.stit{font-weight:400}.ci,.fi{border-radius:8px;border-style:solid;border-color:var(--bd)}.start-meta{border:0;padding-top:0}.single-question .ct{font-weight:400}',
  nature: '.start-card .cover-image{border:0;padding:0;border-radius:8px}.start-intro,.start-actions{padding:0}.fi{border:1px solid var(--bd);border-radius:8px}.ci{border-radius:8px}.single-header{border-left:0;padding-left:0}',
  glass: '.stit{font-weight:500}.ci,.fi{border-radius:8px}.start-card .cover-image{padding:0;border:0}.cf{border:0}.start-meta{border:0;padding-top:0}',
  midnight: '.stit{font-size:40px}.fi,.ci{border-radius:8px}.start-meta{border:0;padding-top:0}',
  candy: '.stit{font-weight:700}.ci{border-width:1px;border-radius:8px}.sbt{border-bottom:0}.cf{border:0}.start-meta{border:0;padding-top:0}',
  aurora: '.stit{font-weight:500}.fi,.ci{border-radius:8px}.start-meta{border:0;padding-top:0}',
  medical: '.stit{font-weight:500}.ci,.fi{border-radius:8px}.start-intro{padding:0}.single-header{border-bottom-width:1px}.start-meta{border:0;padding-top:0}',
  forest: '.stit{font-weight:500}.ci,.fi{border-radius:8px}.start-meta{border:0;padding-top:0}',
  sunset: '.stit{font-weight:500}.start-card .cover-image{border:0;border-radius:8px}.ci,.fi{border-radius:8px}.start-meta{border:0;padding-top:0}',
  ocean: '.start-card .cover-image{border:0;padding:0;border-radius:8px}.ci,.fi{border-radius:8px}.start-meta{border:0;padding-top:0}',
  defi: '.stit{font-weight:500}.fi,.ci{border-radius:8px}.cf{border:0}.start-meta{border:0;padding-top:0}',
};

const identity = {
  default: '.card{border-top:3px solid var(--theme-ink)}.sbt{border-radius:999px}',
  soft: '.card{box-shadow:0 18px 50px color-mix(in srgb,var(--c1) 9%,transparent)}.sbt{border-radius:18px}',
  cyber: '.card{clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)}',
  serious: '.card{border-top:5px solid var(--tx)}.stit{font-weight:500}.sbt{background:var(--tx)!important;color:var(--theme-canvas)}',
  retro: '.card{box-shadow:8px 8px 0 var(--theme-ink)}.stag{transform:rotate(-1deg)}',
  nature: '.card{border-left:6px solid var(--theme-ink)}.stit{max-width:13ch}',
  luxury: '.card{border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink)}.stit{letter-spacing:.03em}',
  kawaii: '.card{border-radius:22px 8px 22px 8px}.sbt{border-radius:22px 8px 22px 8px}',
  brutalist: '.card{border:3px solid var(--tx);box-shadow:10px 10px 0 var(--tx)}',
  glass: '.card{border-width:1px 1px 4px;background:color-mix(in srgb,var(--theme-surface) 90%,transparent)}',
  newspaper: '.card{border-top:5px double var(--tx);border-bottom:5px double var(--tx)}.stit{text-transform:none}',
  midnight: '.card{border-top:1px solid var(--theme-ink)}.sbt{border-radius:999px}',
  candy: '.card{box-shadow:7px 7px 0 var(--theme-ink)}.sbt{border-bottom:5px solid var(--theme-ink)}',
  ink: '.card{border-left:9px solid var(--tx)}.stit{font-weight:400}',
  aurora: '.card{border:1px solid var(--theme-ink)}.sbt{border-radius:999px}',
  paper: '.card{border:1px solid var(--bd2);box-shadow:3px 4px 0 var(--bd)}',
  neon80s: '.card{border-left:5px solid var(--c1);border-bottom:5px solid var(--c2)}',
  medical: '.card{border-top:6px solid var(--theme-ink)}.stag{font-family:ui-monospace,monospace}',
  forest: '.card{border-radius:28px 0 28px 0;border-left:5px solid var(--theme-ink)}',
  sunset: '.card{border-top:8px solid var(--theme-ink)}.stit{font-weight:500}',
  chalk: '.card{border:2px dashed var(--tx2)}.fi,.ci{border-style:dashed}',
  ocean: '.card{border-radius:0 24px 0 24px;border-bottom:5px solid var(--theme-ink)}.single-header{border-bottom-width:4px}',
  crypto: '.card{clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);border-left:4px solid var(--theme-ink)}',
  trading: '.card{border-top:4px solid var(--theme-ink)}.cn,.stag{font-family:ui-monospace,monospace}',
  defi: '.card{clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px),0 10px)}',
  bullrun: '.card{border-left:7px solid var(--theme-ink)}.stit{font-weight:800}',
  bearish: '.card{border-right:7px solid var(--theme-ink)}.stit{font-weight:800}',
  bloomberg: '.card{border:0;border-top:5px solid #f28c28}.cn,.stag,.fi{font-family:ui-monospace,monospace}.sbt,.nb{background:#f28c28!important;color:#111}',
  gold: '.card{border:4px double var(--theme-ink)}.stag{letter-spacing:.16em}',
  matrix: '.card{border:1px solid var(--theme-ink);box-shadow:inset 5px 0 var(--theme-ink)}.cn,.stag,.fi,.ci{font-family:ui-monospace,monospace}',
};

export function getThemeAtmosphereCSS(id, hasCustomBackground = false) {
  const [image, size, opacity] = backgrounds[id] || backgrounds.default;
  const background = hasCustomBackground
    ? 'body{background-image:none}body::before{display:none}'
    : `body{background-image:none;isolation:isolate}body::before{content:'';display:block;position:fixed;inset:0;background-image:${image};background-size:${size};background-position:center;opacity:${opacity};pointer-events:none;z-index:-1}body::after{display:none}`;
  const handwriting = id === 'chalk' ? '.stit{font-size:44px}.sdesc,.cs,.ci span,.fi,.dd{font-size:19px}.stag,.start-meta,.cn,.sbt,.nb{font-size:18px}' : '';
  return `${background}\n${relaxed[id] || ''}\n${identity[id] || ''}\n@media(max-width:600px){.stit{font-size:32px}.sbt{width:100%}.ct{font-size:22px}}\n${handwriting}`;
}
