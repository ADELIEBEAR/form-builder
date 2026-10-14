const buttonDesigns = {
  default: 'border-radius:999px',
  soft: 'border-radius:18px;box-shadow:0 4px 0 var(--bd2)!important',
  cyber: 'border-radius:0;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);border:1px solid var(--theme-ink)',
  serious: 'border-radius:0;border:1px solid var(--tx);background:var(--theme-surface)!important;color:var(--tx)',
  retro: 'border-radius:4px;border:2px solid var(--tx);box-shadow:5px 5px 0 var(--theme-ink)!important',
  nature: 'border-radius:24px 6px 24px 6px',
  luxury: 'border-radius:0;border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)',
  kawaii: 'border-radius:22px 8px 22px 8px;border:2px dashed var(--theme-ink)',
  brutalist: 'border-radius:0;border:3px solid var(--tx);box-shadow:6px 6px 0 var(--tx)!important',
  glass: 'border-radius:8px;border:1px solid var(--bd2);background:var(--theme-surface)!important;color:var(--tx);box-shadow:0 4px 12px color-mix(in srgb,var(--theme-ink) 12%,transparent)!important',
  newspaper: 'border-radius:0;border-top:3px double var(--tx);border-bottom:3px double var(--tx)',
  midnight: 'border-radius:999px;border:1px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)',
  candy: 'border-radius:8px;border-bottom:5px solid var(--theme-ink)',
  ink: 'border-radius:0;border-bottom:2px solid var(--tx);background:var(--theme-surface)!important;color:var(--tx)',
  aurora: 'border-radius:999px;border:3px double var(--theme-ink)',
  paper: 'border-radius:2px;border:3px double var(--tx);box-shadow:2px 2px 0 var(--bd2)!important',
  neon80s: 'border-radius:0;clip-path:polygon(6% 0,100% 0,94% 100%,0 100%)',
  medical: 'border-radius:6px;border-left:5px solid var(--theme-ink)',
  forest: 'border-radius:28px 0 28px 0;border:1px solid var(--theme-ink)',
  sunset: 'border-radius:20px 20px 4px 4px',
  chalk: 'border-radius:4px;border:2px dashed var(--tx2);background:var(--theme-surface)!important;color:var(--tx)',
  ocean: 'border-radius:0 24px 0 24px;border-bottom:3px solid var(--theme-ink)',
  crypto: 'border-radius:0;clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,12px 100%,0 50%)',
  trading: 'border-radius:0;border:1px solid var(--tx);box-shadow:inset 0 -3px var(--theme-ink)!important',
  defi: 'border-radius:0;clip-path:polygon(8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px),0 8px)',
  bullrun: 'border-radius:4px 16px 4px 4px;border-left:7px solid var(--theme-ink)',
  bearish: 'border-radius:4px;border-right:7px solid var(--theme-ink)',
  bloomberg: 'border-radius:0;border-top:2px solid var(--theme-ink);border-bottom:2px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)',
  gold: 'border-radius:999px;border:4px double var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)',
  matrix: 'border-radius:0;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));border:1px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)',
};

export function getReferenceFormPresentation(id, selectedFont) {
  const button = buttonDesigns[id] || buttonDesigns.default;
  const hand = ['ink', 'paper', 'sunset', 'chalk'].includes(id);
  const preserveCustom = selectedFont && selectedFont !== "'Noto Sans KR',sans-serif";
  return `
.wrap{max-width:580px}.start-intro,.start-actions{min-width:0}
.stit{font-size:36px;line-height:1.45;margin-bottom:16px}.sdesc{font-size:15px;line-height:1.8;margin-bottom:28px}
.start-meta{border:0;padding:0;margin-top:20px!important}
.sbt,.nb,.dcta,.single-page .single-submit{min-height:56px;padding:14px 24px;border:0;border-radius:6px;box-shadow:none;font-size:15px;${button}}
.sbt:hover,.nb:hover,.dcta:hover,.single-page .single-submit:hover{${button};filter:brightness(.96)}
.sbt{max-width:100%;gap:16px}.cf{margin-top:28px}.fi,.ci{min-height:56px}
.single-page .wrap{max-width:620px}.single-page .single-title{font-size:30px;line-height:1.5}
.single-page .single-question{padding:26px 0}.single-page .ct{font-size:17px;line-height:1.6}
${hand ? '.stit,.dt,.single-title{font-size:38px}.sdesc,.cs{font-size:18px}' : ''}
${preserveCustom ? '' : '.fi,.ci span,.ls,.la span{font-family:"Noto Sans KR",sans-serif}'}
@media(max-width:600px){body{padding:24px 20px 40px}.stit{font-size:32px}.ct{font-size:22px}.start-card .cover-image{max-height:300px}.single-page .single-title{font-size:28px}${hand ? '.stit{font-size:38px}' : ''}}
`;
}
