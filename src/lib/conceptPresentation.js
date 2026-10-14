import { themeLayouts, compactThemeLayoutCSS } from './themeLayouts.js';

// Canvas, surface, text, secondary text, border, field, detail, corner radius.
const palettes = {
  default: ['#16191f', '#20242c', '#f4f6fa', '#aeb6c5', '#39404c', '#1b1f26', 'rule', 6],
  soft: ['#fff7fb', '#ffffff', '#382c36', '#74606c', '#ebdce5', '#fffafd', 'soft', 8],
  cyber: ['#10181c', '#162328', '#e5f4f6', '#a1bcc5', '#344951', '#111c21', 'grid', 4],
  serious: ['#f7f8f8', '#ffffff', '#22282b', '#59646a', '#d7dee1', '#f5f7f7', 'rule', 2],
  retro: ['#fff8ee', '#fffcf6', '#3b302b', '#756051', '#dcc8b6', '#fffaf2', 'double', 4],
  nature: ['#f4f9f2', '#ffffff', '#293b2d', '#576c5b', '#d7e3d4', '#f8fbf6', 'rail', 8],
  luxury: ['#1a1917', '#23211f', '#f4eee0', '#c0b8aa', '#494338', '#1c1b18', 'double', 4],
  kawaii: ['#fff6f8', '#ffffff', '#49303b', '#80606e', '#eed5df', '#fffafb', 'soft', 8],
  brutalist: ['#eef0ee', '#f8f9f7', '#232823', '#566054', '#8b958a', '#ffffff', 'frame', 0],
  glass: ['#0b1220', '#172236', '#f3f7ff', '#aebdd2', '#53647d', '#202d43', 'glass', 8],
  newspaper: ['#f8f8f4', '#fffefa', '#2b2c29', '#63665f', '#c9cdc5', '#ffffff', 'ledger', 0],
  midnight: ['#151921', '#202633', '#eaf0f9', '#a9b4c6', '#394459', '#191f2b', 'rule', 6],
  candy: ['#fff5f0', '#ffffff', '#493334', '#7d6060', '#edcfc6', '#fffaf8', 'double', 8],
  ink: ['#f5f6f5', '#ffffff', '#252a2a', '#606969', '#cbd2d1', '#f8f9f8', 'rail', 2],
  aurora: ['#1b1b24', '#272634', '#f0edf8', '#b9b3ca', '#484359', '#211f2d', 'double', 8],
  paper: ['#faf8f2', '#fffefa', '#3b3830', '#716b5f', '#dcd5c4', '#fffdf7', 'ledger', 4],
  neon80s: ['#23191f', '#30222c', '#faeef5', '#c7aebe', '#59404f', '#271b24', 'frame', 4],
  medical: ['#f1f8fc', '#ffffff', '#253b47', '#587282', '#cfdee7', '#f7fbfe', 'rail', 6],
  forest: ['#18231e', '#24332b', '#edf5e9', '#b0c2b2', '#45594a', '#1d2b23', 'rule', 8],
  sunset: ['#fff5f0', '#fffaf7', '#4b3334', '#806163', '#ead0c7', '#fffcfa', 'rail', 8],
  chalk: ['#252729', '#303336', '#f3f1e8', '#c5c3ba', '#606468', '#2a2d30', 'ledger', 2],
  ocean: ['#eaf3f8', '#ffffff', '#183c56', '#53748b', '#c3d8e5', '#f5f9fc', 'double', 6],
  crypto: ['#1b2022', '#272f32', '#f2f1eb', '#b9c0bd', '#454f51', '#21282b', 'frame', 6],
  trading: ['#f1f4f8', '#ffffff', '#202f45', '#56677d', '#cfd8e4', '#f7f9fc', 'grid', 4],
  defi: ['#f1f4fb', '#ffffff', '#273758', '#61708f', '#d2dbea', '#f7f9fd', 'glass', 8],
  bullrun: ['#f0faf4', '#ffffff', '#203c2d', '#52725d', '#c9e3d1', '#f7fcf8', 'rail', 6],
  bearish: ['#fff4f4', '#ffffff', '#4a2a30', '#805b64', '#e8ccd1', '#fff9fa', 'rail', 6],
  bloomberg: ['#181b1d', '#23282c', '#f5e7d7', '#c1b8aa', '#4a4740', '#1c2124', 'ledger', 2],
  gold: ['#fbf9f0', '#fffef7', '#403a25', '#746b4c', '#e0d8b9', '#fffdf3', 'double', 4],
  matrix: ['#17201b', '#223128', '#e6f4e7', '#a9c3b0', '#405648', '#1b2920', 'grid', 2],
};

function luminance(color) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return 0;
  const channels = color.replace('#', '').match(/.{2}/g).map(v => parseInt(v, 16) / 255);
  const linear = channels.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

export function getConceptSwatch(id, accent) {
  const [canvas, surface, text, , border] = palettes[id] || palettes.default;
  return { '--concept-canvas': canvas, '--concept-surface': surface, '--concept-text': text, '--concept-border': border, '--concept-accent': accent };
}

export function getConceptPresentation(id, c1, c2, font) {
  const [canvas, surface, text, secondary, border, field, detail, radius] = palettes[id] || palettes.default;
  const buttonText = luminance(c1) > 0.179 ? '#000000' : '#ffffff';
  const dark = luminance(canvas) < 0.2;
  const details = {
    rule: '.stag{border-left-width:3px}.single-header{border-bottom-width:1px}',
    soft: '.stag{border:0;background:color-mix(in srgb,var(--c1) 9%,var(--theme-surface));padding:7px 12px;border-radius:6px}.fi{border-color:var(--bd)}',
    double: '.stag{border-left:0;border-top:2px solid var(--theme-ink);padding:10px 0 0}.single-header{border-bottom:3px double var(--bd2)}.cn{border-top:3px double var(--bd2);padding-top:14px}.ci{border-left:3px solid var(--bd2)}.ci.ck{border-left-width:3px}',
    rail: '.stag{border-left-width:4px}.cn{border-left:3px solid var(--theme-ink);padding-left:10px}.single-question .question-heading{border-left:3px solid var(--theme-ink);padding-left:10px}',
    frame: '.stag{border:1px solid var(--theme-ink);padding:6px 10px}.fi,.ci{border-color:var(--bd2)}.single-header{border-bottom:2px solid var(--theme-ink)}.cn{display:inline-block;background:var(--theme-ink);color:var(--theme-canvas);padding:7px 10px}.ci.ck{box-shadow:inset 3px 0 var(--c1)!important}',
    glass: '.fi,.ci{background:color-mix(in srgb,var(--theme-surface) 75%,var(--theme-canvas))}.stag{border-left:0;border-bottom:2px solid var(--theme-ink);padding:0 0 7px}',
    ledger: '.stag{border-left:0;border-top:1px solid var(--bd2);border-bottom:1px solid var(--bd2);padding:8px 0}.cn{border-bottom:1px solid var(--bd);padding-bottom:10px}.single-header{border-bottom:3px double var(--bd2)}.fi{background:transparent;border:0;border-bottom:1px solid var(--bd2);border-radius:0}.ci{background:transparent;border:0;border-bottom:1px solid var(--bd);border-radius:0}.ci.ck{border-bottom:2px solid var(--c1)}',
    grid: 'body{background-image:linear-gradient(var(--theme-grid) 1px,transparent 1px),linear-gradient(90deg,var(--theme-grid) 1px,transparent 1px);background-size:64px 64px}.stag{border:1px solid var(--bd2);padding:6px 10px}.cn{font-variant-numeric:tabular-nums}',
  };

  return `
:root{--theme-canvas:${canvas};--theme-surface:${surface};--theme-ink:color-mix(in srgb,${c1} 35%,${text});--theme-button-text:${buttonText};--theme-grid:color-mix(in srgb,${border} 22%,transparent);--tx:${text};--tx2:${secondary};--tx3:${secondary};--bg2:${field};--bd:${border};--bd2:color-mix(in srgb,${border} 65%,${text});--ls-bg:${field};--card-bg:${surface}}
body{background:${canvas};background-image:none;color:var(--tx);font-family:${font};color-scheme:${dark ? 'dark' : 'light'}}
body::before,body::after{display:none}
.card{background:${surface};border:1px solid var(--bd);border-radius:${radius}px;box-shadow:none;backdrop-filter:none;margin:0}
.card.start-card{background:transparent;border:0;box-shadow:none}
.sl:not(#ss):not(#done)>.card{border:0;background:transparent;padding:36px 0}
.ct,.stit,.dt,.single-title{color:var(--tx);-webkit-text-fill-color:var(--tx);background:none;text-shadow:none;font-family:inherit;letter-spacing:0}
.stit{font-weight:700}.ct{font-weight:600}.dt{font-weight:700}
.cs,.sdesc,.dd,.single-desc{color:var(--tx2);font-weight:400}
.cn,.stag{color:var(--theme-ink);text-shadow:none;letter-spacing:0;font-family:inherit}
.stag{background:transparent;border-color:var(--theme-ink)}
.fi,.ci,.ls{border-radius:${radius}px;background:${field};color:var(--tx);border-color:var(--bd);text-shadow:none;backdrop-filter:none}
.fi{font-family:inherit;outline:none}.fi::placeholder{color:var(--tx3);opacity:.8}
.fi:focus{background:var(--theme-surface);border-color:var(--c1);box-shadow:0 0 0 3px color-mix(in srgb,var(--c1) 16%,transparent);outline:none;transform:none}
.fi.er,.fi.er:focus{border-color:${dark ? '#f7a0a0' : '#be394b'};box-shadow:0 0 0 3px color-mix(in srgb,#be394b 12%,transparent)}
.em{color:${dark ? '#ffb4b4' : '#b73549'}}
.qfb.ok{color:${dark ? '#8ad6a7' : '#246b3a'}}.qfb.ng{color:${dark ? '#ffb4b4' : '#b73549'}}
.ci{background:var(--theme-surface)}.ci span,.ci .oi{color:var(--tx);text-shadow:none}
.ci:hover:not(.qdisabled){background:color-mix(in srgb,var(--c1) 5%,var(--theme-surface));border-color:var(--c1);box-shadow:none}
.ci.ck{background:color-mix(in srgb,var(--c1) ${dark ? 18 : 8}%,var(--theme-surface));box-shadow:none;border-width:1px}
.cb,.ld{border-color:var(--bd2);box-shadow:none}.ci.ck .cb,.la.ck .ld{background:var(--c1);border-color:var(--c1);box-shadow:none}
.ci.ck .cb::after,.la.ck .ld::after{background:var(--theme-button-text)}
.nb,.sbt,.dcta{background:var(--c1)!important;color:var(--theme-button-text);border:1px solid transparent;border-radius:${radius}px;box-shadow:none;text-shadow:none;letter-spacing:0;font-family:inherit;font-weight:600}
.nb:hover,.sbt:hover,.dcta:hover{background:var(--c1)!important;color:var(--theme-button-text);box-shadow:none!important;transform:none}
.nb::after,.sbt::after{display:none}
.single-page .single-sheet{background:transparent;border:0}.single-page .single-question{border-color:var(--bd)}
.single-page .single-header{border-color:var(--bd2)}
.single-page .single-submit{border-radius:${radius}px}
.done-card{border-radius:${radius}px}.dr{background:color-mix(in srgb,#32a673 10%,var(--theme-surface));border-color:color-mix(in srgb,#32a673 35%,var(--bd))}
.ls{background:var(--ls-bg)}
#pw{height:3px;background:var(--bd);border:0;border-radius:0}#pf{background:var(--c1)!important;box-shadow:none}#pf::after{display:none}
#gb,.bb,.drst{color:var(--tx2)}
${details[detail]}
${themeLayouts[id] || themeLayouts.default}
${compactThemeLayoutCSS}
`;
}
