const oceanCSS = `
:root{--theme-canvas:#eaf5f8;--theme-surface:#fbfeff;--theme-ink:#174c65;--tx:#14394d;--tx2:#527285;--tx3:#6e8998;--bg2:#f2f8fa;--bd:#c5dce5;--bd2:#91b7c6;--ls-bg:#f2f8fa;--card-bg:#fbfeff}
body{background:#eaf5f8;color:var(--tx)}
body::before{display:block;content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:1;background:linear-gradient(164deg,transparent 0 26%,rgba(122,190,210,.16) 26% 27%,transparent 27% 48%,rgba(255,255,255,.72) 48% 62%,transparent 62%),repeating-linear-gradient(176deg,transparent 0 58px,rgba(35,111,139,.07) 59px 60px)}
body::after{display:block;content:'';position:fixed;left:0;right:0;bottom:0;height:22vh;z-index:-1;pointer-events:none;background:linear-gradient(180deg,transparent,rgba(91,166,190,.12))}
.wrap{max-width:610px}
body #ss>.card,body .sl:not(#ss):not(#done)>.card,body #done>.card{background:rgba(251,254,255,.96);border:1px solid rgba(103,159,180,.38);border-top:5px solid var(--theme-ink);border-radius:8px;box-shadow:0 24px 70px rgba(32,91,112,.13),0 4px 14px rgba(32,91,112,.07);backdrop-filter:none}
body #ss>.card{padding:26px 30px 28px}
body #ss>.card::after{content:'OCEAN EDITION';display:block;position:absolute;right:30px;top:16px;color:rgba(20,76,101,.45);font-size:9px;font-weight:700;letter-spacing:.14em}
body #ss .cover-image{margin:18px 0 32px;padding:8px;border:1px solid var(--bd);border-radius:4px;background:#fff;box-shadow:10px 10px 0 rgba(62,136,162,.12);aspect-ratio:16/9}
body #ss .stag{display:inline-flex;width:auto;border:0;border-bottom:1px solid var(--theme-ink);border-radius:0;padding:0 0 8px;margin-bottom:20px;background:transparent;color:var(--theme-ink);font-size:11px}
body #ss .stag::before{width:20px;height:2px;border-radius:0;background:var(--theme-ink)}
body #ss .stit{max-width:13ch;margin-bottom:18px;color:var(--tx);font-family:'Gowun Batang','Noto Serif KR',serif;font-size:42px;font-weight:700;line-height:1.3}
body #ss .sdesc{max-width:36ch;color:var(--tx2);font-size:15px;line-height:1.85}
body .sbt,body .nb,body .dcta,body.single-page .single-submit{border:0;border-radius:4px;background:linear-gradient(110deg,var(--c1),var(--c2))!important;color:#fff;box-shadow:0 8px 20px color-mix(in srgb,var(--c1) 20%,transparent)!important}
body #ss .sbt{min-height:60px;border-left:6px solid var(--theme-ink)}
body .sl:not(#ss):not(#done)>.card{padding:42px 38px 34px}
body .cn{padding:0 0 14px;border:0;border-bottom:1px solid var(--bd);color:var(--theme-ink)!important}
body .cn::after{width:56px}
body .ct,body .dt,body.single-page .single-title{font-family:'Gowun Batang','Noto Serif KR',serif;font-weight:700}
body .fi,body .ci,body .ls{border:1px solid var(--bd);border-radius:4px;background:rgba(242,248,250,.92)}
body .fi{border-left:4px solid var(--theme-ink)}
body .ci{border-left:4px solid transparent}
body .ci.ck{border-left-color:var(--c1)!important;border-right:1px solid var(--bd);background:color-mix(in srgb,var(--c1) 7%,#fff)}
body .cf{border-top:1px solid var(--bd)}
body.single-page .single-sheet{background:rgba(251,254,255,.96);border:1px solid var(--bd);border-top:5px solid var(--theme-ink);border-radius:8px;box-shadow:0 24px 70px rgba(32,91,112,.13)}
body.single-page .single-cover{padding:8px;border:1px solid var(--bd);border-radius:4px;background:#fff}
body.single-page .single-header{border-bottom:1px solid var(--bd2)}
body.single-page .single-question{border-bottom:1px solid var(--bd)}
@media(max-width:480px){body #ss>.card{padding:22px 20px 24px}body #ss>.card::after{right:20px;top:13px}body #ss .stit{font-size:34px}body .sl:not(#ss):not(#done)>.card{padding:32px 24px 26px}}
`;

const glassCSS = `
:root{--theme-canvas:#0b1220;--theme-surface:#172236;--theme-ink:#b9d8ff;--tx:#f3f7ff;--tx2:#aebdd2;--tx3:#8191aa;--bg2:rgba(255,255,255,.07);--bd:rgba(216,232,255,.18);--bd2:rgba(216,232,255,.34);--ls-bg:rgba(255,255,255,.055);--card-bg:rgba(18,30,49,.66)}
body{background:#0b1220;color:var(--tx)}
body::before{display:block;content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:1;background:linear-gradient(118deg,rgba(76,111,168,.28) 0 17%,transparent 17% 52%,rgba(132,174,216,.12) 52% 66%,transparent 66%),linear-gradient(18deg,transparent 0 54%,rgba(255,255,255,.06) 54% 55%,transparent 55%)}
body::after{display:block;content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;background:repeating-linear-gradient(90deg,transparent 0 79px,rgba(219,234,255,.035) 80px)}
.wrap{max-width:610px}
body #ss>.card,body .sl:not(#ss):not(#done)>.card,body #done>.card{background:linear-gradient(145deg,rgba(32,49,76,.78),rgba(12,23,39,.64));border:1px solid rgba(223,237,255,.24);border-radius:8px;box-shadow:0 30px 90px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.16);backdrop-filter:blur(26px) saturate(1.25)}
body #ss>.card{padding:24px 26px 28px}
body #ss>.card::after{content:'';position:absolute;inset:12px;pointer-events:none;border:1px solid rgba(255,255,255,.055);border-radius:5px}
body #ss .cover-image{width:calc(100% + 52px);max-width:none;margin:-24px -26px 30px;padding:0;border:0;border-radius:7px 7px 0 0;aspect-ratio:16/8;filter:saturate(.78) contrast(1.04);box-shadow:none}
body #ss .stag{position:relative;z-index:1;width:auto;border:1px solid rgba(220,236,255,.24);border-radius:4px;padding:7px 10px;margin-bottom:18px;background:rgba(255,255,255,.07);color:#d8e8ff;box-shadow:inset 0 1px rgba(255,255,255,.1)}
body #ss .stag::before{background:var(--c2);box-shadow:0 0 12px color-mix(in srgb,var(--c2) 75%,transparent)}
body #ss .stit{position:relative;z-index:1;max-width:14ch;margin-bottom:18px;color:#f6f9ff;font-family:'IBM Plex Sans KR','Noto Sans KR',sans-serif;font-size:40px;font-weight:600;line-height:1.32}
body #ss .sdesc{position:relative;z-index:1;max-width:36ch;color:#b7c5d8;font-size:15px}
body .sbt,body .nb,body .dcta,body.single-page .single-submit{border:1px solid rgba(255,255,255,.22);border-radius:6px;background:linear-gradient(115deg,var(--c1),var(--c2))!important;color:#fff;box-shadow:0 12px 30px color-mix(in srgb,var(--c1) 22%,rgba(0,0,0,.3)),inset 0 1px rgba(255,255,255,.25)!important}
body #ss .sbt{position:relative;z-index:1;min-height:60px}
body .sl:not(#ss):not(#done)>.card{padding:42px 38px 34px}
body .cn{padding:8px 10px;border:1px solid rgba(218,233,255,.16);border-radius:4px;background:rgba(255,255,255,.055);color:#c7dcf7!important}
body .cn::after{background:#c7dcf7}
body .ct,body .dt,body.single-page .single-title{font-family:'IBM Plex Sans KR','Noto Sans KR',sans-serif;font-weight:600;color:#f4f8ff}
body .cs,body .sdesc,body .dd,body.single-page .single-desc{color:#afbed2}
body .fi,body .ci,body .ls{border:1px solid rgba(218,233,255,.18);border-radius:6px;background:rgba(255,255,255,.065);color:#f3f7ff;box-shadow:inset 0 1px rgba(255,255,255,.06);backdrop-filter:blur(10px)}
body .fi:focus{background:rgba(255,255,255,.095);border-color:color-mix(in srgb,var(--c1) 72%,white);box-shadow:0 0 0 3px color-mix(in srgb,var(--c1) 22%,transparent)}
body .fi::placeholder{color:#8292aa}
body .ci:hover:not(.qdisabled){background:rgba(255,255,255,.1)}
body .ci.ck{background:color-mix(in srgb,var(--c1) 20%,rgba(255,255,255,.07));border-color:color-mix(in srgb,var(--c1) 65%,white)!important;box-shadow:inset 4px 0 var(--c1)!important}
body .cf{border-top:1px solid rgba(218,233,255,.14)}
body #gb,body .bb,body .drst{color:#aebdd2}
body.single-page .single-sheet{background:linear-gradient(145deg,rgba(32,49,76,.78),rgba(12,23,39,.64));border:1px solid rgba(223,237,255,.24);border-radius:8px;box-shadow:0 30px 90px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.16);backdrop-filter:blur(26px) saturate(1.25)}
body.single-page .single-header,body.single-page .single-question{border-color:rgba(218,233,255,.16)}
body.single-page .single-cover{border:1px solid rgba(223,237,255,.24);border-radius:6px;filter:saturate(.78) contrast(1.04)}
@media(max-width:480px){body #ss>.card{padding:20px 20px 24px}body #ss .cover-image{width:calc(100% + 40px);margin:-20px -20px 26px}body #ss .stit{font-size:32px}body .sl:not(#ss):not(#done)>.card{padding:32px 24px 26px}}
`;

export function getFeaturedThemePolish(id) {
  if (id === 'ocean') return oceanCSS;
  if (id === 'glass') return glassCSS;
  return '';
}
