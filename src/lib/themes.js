// ══════════════════════════════════════
// 컨셉 테마 정의 — 20종
// 각 테마는 완전히 다른 CSS 생성
// ══════════════════════════════════════

export const CONCEPT_THEMES = [
  { id:'default',   name:'기본',      emoji:'🌙', desc:'다크 모던' },
  { id:'soft',      name:'말랑말랑',  emoji:'🍬', desc:'파스텔 & 둥글둥글' },
  { id:'cyber',     name:'사이버',    emoji:'⚡', desc:'네온 & 다크' },
  { id:'serious',   name:'진지',      emoji:'◼',  desc:'미니멀 & 모노' },
  { id:'retro',     name:'레트로',    emoji:'📼', desc:'빈티지 & 웜톤' },
  { id:'nature',    name:'네이처',    emoji:'🌿', desc:'자연 & 초록' },
  { id:'luxury',    name:'럭셔리',    emoji:'✨', desc:'골드 & 블랙' },
  { id:'kawaii',    name:'카와이',    emoji:'🌸', desc:'일본 귀여움' },
  { id:'brutalist', name:'브루탈',    emoji:'▓',  desc:'브루탈리즘' },
  { id:'glass',     name:'글래스',    emoji:'🔮', desc:'유리 & 투명감' },
  { id:'newspaper', name:'신문',      emoji:'📰', desc:'타이포그래피' },
  { id:'midnight',  name:'미드나잇',  emoji:'🌃', desc:'딥 네이비' },
  { id:'candy',     name:'캔디',      emoji:'🍭', desc:'선명 & 팝아트' },
  { id:'ink',       name:'먹물',      emoji:'🖋', desc:'동양 & 수묵화' },
  { id:'aurora',    name:'오로라',    emoji:'🌌', desc:'그라디언트 & 우주' },
  { id:'paper',     name:'종이',      emoji:'📄', desc:'크래프트 & 종이' },
  { id:'neon80s',   name:'네온80s',   emoji:'🕹', desc:'80년대 아케이드' },
  { id:'medical',   name:'클린',      emoji:'🏥', desc:'의료 & 깔끔' },
  { id:'forest',    name:'포레스트',  emoji:'🌲', desc:'어두운 숲' },
  { id:'sunset',    name:'선셋',      emoji:'🌅', desc:'그라디언트 노을' },
  { id:'chalk',     name:'칠판',      emoji:'🖍', desc:'칠판 & 분필' },
  { id:'ocean',     name:'오션',      emoji:'🌊', desc:'깊은 바다' },
]

export const COLOR_THEMES = [
  { c1:'#7c6cfc', c2:'#c084fc', name:'퍼플' },
  { c1:'#6366f1', c2:'#a78bfa', name:'인디고' },
  { c1:'#8b5cf6', c2:'#d946ef', name:'바이올렛' },
  { c1:'#ec4899', c2:'#f472b6', name:'핑크' },
  { c1:'#EE4037', c2:'#ff7043', name:'레드' },
  { c1:'#f43f5e', c2:'#fb7185', name:'로즈' },
  { c1:'#0ea5e9', c2:'#38bdf8', name:'스카이' },
  { c1:'#3b82f6', c2:'#60a5fa', name:'블루' },
  { c1:'#06b6d4', c2:'#22d3ee', name:'시안' },
  { c1:'#10b981', c2:'#34d399', name:'에메랄드' },
  { c1:'#22c55e', c2:'#4ade80', name:'그린' },
  { c1:'#84cc16', c2:'#a3e635', name:'라임' },
  { c1:'#f59e0b', c2:'#fbbf24', name:'앰버' },
  { c1:'#f97316', c2:'#fb923c', name:'오렌지' },
  { c1:'#eab308', c2:'#facc15', name:'옐로우' },
  { c1:'#64748b', c2:'#94a3b8', name:'슬레이트' },
  { c1:'#8b5cf6', c2:'#06b6d4', name:'오로라' },
  { c1:'#f43f5e', c2:'#f97316', name:'선셋' },
  { c1:'#0ea5e9', c2:'#10b981', name:'오션' },
  { c1:'#d946ef', c2:'#f43f5e', name:'베리' },
]

export const FONTS = [
  { label:'Noto Sans KR', value:"'Noto Sans KR',sans-serif" },
  { label:'Gmarket Sans', value:"'Gmarket Sans',sans-serif" },
  { label:'Gowun Dodum', value:"'Gowun Dodum',sans-serif" },
  { label:'Nanum Gothic', value:"'Nanum Gothic',sans-serif" },
  { label:'Nanum Myeongjo', value:"'Nanum Myeongjo',serif" },
  { label:'IBM Plex Sans KR', value:"'IBM Plex Sans KR',sans-serif" },
  { label:'Black Han Sans', value:"'Black Han Sans',sans-serif" },
  { label:'Do Hyeon', value:"'Do Hyeon',sans-serif" },
  { label:'Jua', value:"'Jua',sans-serif" },
  { label:'Gaegu', value:"'Gaegu',sans-serif" },
  { label:'Hi Melody', value:"'Hi Melody',sans-serif" },
  { label:'Cute Font', value:"'Cute Font',sans-serif" },
]

// ══════════════════════════════════════
// 컨셉별 CSS 생성
// ══════════════════════════════════════
export function getConceptCSS(id, c1, c2, font) {
  const T = {

    // ── 기본 (다크 모던) ──────────────────
    default: `
body{background:#0e0e14;color:#f0eff8}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 55% at 15% -5%,${hex(c1,18)} 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 85% 110%,${hex(c2,13)} 0%,transparent 55%);pointer-events:none}
.card{background:rgba(22,22,31,.95);border:1px solid rgba(255,255,255,.09);border-radius:24px;box-shadow:0 24px 64px rgba(0,0,0,.35);backdrop-filter:blur(20px)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${c1},${c2},transparent 80%)}
.fi{background:#1a1a28;border:1.5px solid rgba(255,255,255,.09);border-radius:14px;color:#f0eff8}
.fi:focus{border-color:${c1};box-shadow:0 0 0 4px ${hex(c1,18)}}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:14px;color:#fff}
.nb:hover{box-shadow:0 8px 28px ${hex(c1,40)}}
.ci{background:#1a1a28;border:1.5px solid rgba(255,255,255,.09);border-radius:14px}
.ci:hover{border-color:${hex(c1,55)}} .ci.ck{border-color:${c1};background:${hex(c1,10)}}
.cb{border-radius:6px;border:2px solid rgba(255,255,255,.15)}.ci.ck .cb{background:${c1};border-color:${c1}}
.cn{color:${c1}}.stit{background:linear-gradient(135deg,#f0eff8 30%,${c2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:14px}
`,

    // ── 말랑말랑 ──────────────────────────
    soft: `
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
body{background:#fdf4ff;color:#3d1a4a;font-family:'Jua',sans-serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 20% -10%,rgba(244,114,182,.18) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 80% 110%,rgba(167,139,250,.14) 0%,transparent 55%);pointer-events:none}
.card{background:#fff;border:2.5px solid rgba(244,114,182,.2);border-radius:36px;box-shadow:0 8px 40px rgba(244,114,182,.14),0 2px 0 rgba(244,114,182,.1) inset}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,${c1},${c2});border-radius:36px 36px 0 0}
.fi{background:#fef5ff;border:2px solid rgba(244,114,182,.22);border-radius:20px;color:#3d1a4a}
.fi:focus{border-color:${c1};box-shadow:0 0 0 5px ${hex(c1,12)};transform:translateY(-2px)}
.ct,.cn{font-family:'Jua',sans-serif}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:99px;font-family:'Jua',sans-serif;font-size:15px;letter-spacing:.03em}
.nb:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 12px 32px ${hex(c1,35)}}
.ci{background:#fef5ff;border:2px solid rgba(244,114,182,.18);border-radius:18px}
.ci:hover{border-color:${c1};transform:translateY(-3px);box-shadow:0 6px 20px ${hex(c1,14)}}
.ci.ck{border-color:${c1};background:${hex(c1,8)};transform:translateY(-3px)}
.cb{border-radius:10px;border:2.5px solid rgba(244,114,182,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:10px}
.cn{color:${c1};font-size:12px}.stit{color:#3d1a4a;-webkit-text-fill-color:#3d1a4a;font-family:'Jua',sans-serif}
.stag{color:${c1};background:${hex(c1,10)};border-radius:99px}.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:99px;font-family:'Jua',sans-serif}
#pw{height:6px;border-radius:99px}#pf{border-radius:99px}
`,

    // ── 사이버 ────────────────────────────
    cyber: `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
body{background:#020817;color:#c8e8ff;font-family:'IBM Plex Mono',monospace}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,${hex(c1,8)} 0%,transparent 60%);pointer-events:none}
body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,245,255,.012) 2px,rgba(0,245,255,.012) 4px);pointer-events:none}
.card{background:#060f1e;border:1px solid ${hex(c1,30)};border-radius:4px;box-shadow:0 0 40px ${hex(c1,6)},inset 0 1px 0 ${hex(c1,12)}}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${c1},${c2},transparent)}
.fi{background:rgba(0,0,0,.6);border:1px solid ${hex(c1,25)};border-radius:2px;color:#c8e8ff;font-family:'IBM Plex Mono',monospace}
.fi:focus{border-color:${c1};box-shadow:0 0 0 2px ${hex(c1,18)},0 0 20px ${hex(c1,10)}}
.ct{font-family:'IBM Plex Mono',monospace;font-size:18px}.cn{color:${c1};font-family:'IBM Plex Mono',monospace;letter-spacing:.15em;font-size:10px}
.nb{background:transparent;border:1px solid ${c1};border-radius:2px;color:${c1};font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.12em;position:relative}
.nb::after{content:'';position:absolute;inset:0;background:${c1};opacity:0;transition:opacity .2s}
.nb:hover::after{opacity:.12}.nb:hover{box-shadow:0 0 24px ${hex(c1,45)};text-shadow:0 0 8px ${c1}}
.ci{background:rgba(0,0,0,.5);border:1px solid ${hex(c1,18)};border-radius:2px}
.ci:hover{border-color:${c1};box-shadow:0 0 12px ${hex(c1,14)}}
.ci.ck{border-color:${c1};background:${hex(c1,8)};box-shadow:0 0 20px ${hex(c1,18)}}
.cb{border-radius:1px;border:1px solid ${hex(c1,35)}}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:1px;box-shadow:0 0 8px ${c1}}
.stit{color:${c1};-webkit-text-fill-color:${c1};font-family:'IBM Plex Mono',monospace;text-shadow:0 0 20px ${c1}}
.stag{color:${c1};background:${hex(c1,8)};border-color:${hex(c1,25)};border-radius:2px}
.sbt{background:transparent;border:1px solid ${c1};color:${c1};border-radius:2px;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:.12em}
.sbt:hover{box-shadow:0 0 24px ${hex(c1,45)}}
#pf::after{display:none}#pw{background:rgba(0,245,255,.06)}#pf{background:${c1};box-shadow:0 0 8px ${c1}}
`,

    // ── 진지 (미니멀 모노) ────────────────
    serious: `
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap');
body{background:#f9f9f7;color:#111;font-family:'Nanum Myeongjo',serif}
body::before{display:none}
.card{background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.card::before{display:none}
.fi{background:#f5f5f3;border:1px solid rgba(0,0,0,.18);border-radius:2px;color:#111;font-family:'Nanum Myeongjo',serif}
.fi:focus{border-color:#111;box-shadow:none;outline:2px solid rgba(0,0,0,.15);outline-offset:1px;transform:none}
.ct{font-family:'Nanum Myeongjo',serif;font-weight:700}.cn{color:#999;font-family:'Nanum Myeongjo',serif;font-weight:400;letter-spacing:.1em;font-size:10px}
.nb{background:#111;border-radius:2px;color:#fff;font-family:'Nanum Myeongjo',serif;font-weight:700;letter-spacing:.05em}
.nb:hover{background:#333;transform:none;box-shadow:none}
.ci{background:#f5f5f3;border:1px solid rgba(0,0,0,.12);border-radius:2px}
.ci:hover{border-color:#111}.ci.ck{border-color:#111;background:#efefed}
.cb{border-radius:1px;border:1.5px solid rgba(0,0,0,.3)}.ci.ck .cb{background:#111;border-color:#111;border-radius:1px}
.stit{color:#111;-webkit-text-fill-color:#111;font-family:'Nanum Myeongjo',serif;font-weight:700}
.stag{color:#111;background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.15);border-radius:2px}
.sbt{background:#111;border-radius:2px;font-family:'Nanum Myeongjo',serif;font-weight:700}
#pw{background:rgba(0,0,0,.08)}#pf{background:#111;border-radius:0}#pf::after{display:none}
`,

    // ── 레트로 ────────────────────────────
    retro: `
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
body{background:#fef3e2;color:#3d2c12;font-family:'Black Han Sans',sans-serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 30% 20%,rgba(217,119,6,.1) 0%,transparent 60%);pointer-events:none}
.card{background:#fffbf0;border:2.5px solid rgba(180,120,40,.28);border-radius:6px;box-shadow:5px 5px 0 rgba(180,120,40,.25)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:repeating-linear-gradient(90deg,${c1} 0,${c1} 8px,${c2} 8px,${c2} 16px)}
.fi{background:#fdf5e0;border:2px solid rgba(180,120,40,.3);border-radius:3px;color:#3d2c12;font-family:'Black Han Sans',sans-serif}
.fi:focus{border-color:${c1};box-shadow:3px 3px 0 ${hex(c1,30)};transform:none}
.ct{font-family:'Black Han Sans',sans-serif}.cn{color:${c1};font-family:'Black Han Sans',sans-serif;letter-spacing:.1em}
.nb{background:${c1};border-radius:3px;color:#fff;font-family:'Black Han Sans',sans-serif;border:2px solid ${darken(c1)};box-shadow:4px 4px 0 ${darken(c1)};letter-spacing:.05em}
.nb:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 ${darken(c1)}}
.nb:active{transform:translate(2px,2px);box-shadow:1px 1px 0 ${darken(c1)}}
.ci{background:#fdf5e0;border:2px solid rgba(180,120,40,.25);border-radius:3px}
.ci:hover{border-color:${c1};box-shadow:3px 3px 0 ${hex(c1,25)}}
.ci.ck{border-color:${c1};background:${hex(c1,8)};box-shadow:3px 3px 0 ${hex(c1,25)}}
.cb{border-radius:2px;border:2px solid rgba(180,120,40,.4)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:2px}
.stit{color:#3d2c12;-webkit-text-fill-color:#3d2c12;font-family:'Black Han Sans',sans-serif}
.stag{color:${c1};background:${hex(c1,10)};border-color:${hex(c1,3)};border-radius:3px}
.sbt{background:${c1};border-radius:3px;border:2px solid ${darken(c1)};box-shadow:4px 4px 0 ${darken(c1)};font-family:'Black Han Sans',sans-serif}
#pf{background:${c1};border-radius:0}#pf::after{display:none}#pw{background:rgba(180,120,40,.15);border-radius:0}
`,

    // ── 네이처 ────────────────────────────
    nature: `
@import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
body{background:#f0fdf4;color:#14532d;font-family:'Gowun Dodum',sans-serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 10%,rgba(134,239,172,.22) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 80% 90%,rgba(34,197,94,.12) 0%,transparent 55%);pointer-events:none}
.card{background:#fff;border:1.5px solid rgba(22,163,74,.18);border-radius:20px;box-shadow:0 8px 32px rgba(22,163,74,.08)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${c1},${c2});border-radius:20px 20px 0 0}
.fi{background:#f7fef9;border:1.5px solid rgba(22,163,74,.22);border-radius:14px;color:#14532d;font-family:'Gowun Dodum',sans-serif}
.fi:focus{border-color:${c1};box-shadow:0 0 0 4px rgba(22,163,74,.1)}
.ct{font-family:'Gowun Dodum',sans-serif}.cn{color:${c1}}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:14px;font-family:'Gowun Dodum',sans-serif}
.nb:hover{transform:translateY(-2px);box-shadow:0 8px 24px ${hex(c1,32)}}
.ci{background:#f7fef9;border:1.5px solid rgba(22,163,74,.15);border-radius:14px}
.ci:hover{border-color:${c1};background:rgba(22,163,74,.04)}
.ci.ck{border-color:${c1};background:rgba(22,163,74,.08)}
.cb{border-radius:7px;border:2px solid rgba(22,163,74,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:7px}
.stit{color:#14532d;-webkit-text-fill-color:#14532d;font-family:'Gowun Dodum',sans-serif}
.stag{color:${c1};background:rgba(22,163,74,.08);border-color:rgba(22,163,74,.2);border-radius:99px}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:14px;font-family:'Gowun Dodum',sans-serif}
#pw{background:rgba(22,163,74,.12)}
`,

    // ── 럭셔리 ────────────────────────────
    luxury: `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');
body{background:#0a0a0a;color:#f0e8d0;font-family:'Noto Serif KR',serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(212,175,55,.06) 0%,transparent 60%);pointer-events:none}
.card{background:#141414;border:1px solid rgba(212,175,55,.22);border-radius:12px;box-shadow:0 0 60px rgba(0,0,0,.7),inset 0 1px 0 rgba(212,175,55,.1)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${c1},${c2},transparent)}
.fi{background:rgba(212,175,55,.04);border:1px solid rgba(212,175,55,.18);border-radius:6px;color:#f0e8d0;font-family:'Noto Serif KR',serif}
.fi:focus{border-color:${c1};box-shadow:0 0 0 2px rgba(212,175,55,.12)}
.ct{font-family:'Noto Serif KR',serif;font-weight:700}.cn{color:${c1};letter-spacing:.18em;font-size:10px}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:6px;color:#0a0a0a;font-family:'Noto Serif KR',serif;font-weight:700;letter-spacing:.06em}
.nb:hover{box-shadow:0 8px 24px rgba(212,175,55,.35);transform:translateY(-1px)}
.ci{background:rgba(212,175,55,.03);border:1px solid rgba(212,175,55,.14);border-radius:6px}
.ci:hover{border-color:rgba(212,175,55,.4)}.ci.ck{border-color:${c1};background:rgba(212,175,55,.07)}
.cb{border-radius:3px;border:1px solid rgba(212,175,55,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:3px}
.stit{background:linear-gradient(135deg,${c1},${c2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-family:'Noto Serif KR',serif}
.stag{color:${c1};background:rgba(212,175,55,.08);border-color:rgba(212,175,55,.22);border-radius:4px}
.sbt{background:linear-gradient(135deg,${c1},${c2});color:#0a0a0a;font-weight:700;border-radius:6px;font-family:'Noto Serif KR',serif}
#pf::after{background:${c1};box-shadow:0 0 10px ${c1}}
`,

    // ── 카와이 ────────────────────────────
    kawaii: `
@import url('https://fonts.googleapis.com/css2?family=Hi+Melody&display=swap');
body{background:#fff0f8;color:#5d2167;font-family:'Hi Melody',cursive}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 20% -10%,rgba(255,182,215,.3) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 80% 110%,rgba(192,132,252,.2) 0%,transparent 55%);pointer-events:none}
body::after{content:'✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀ ✿ ❀';position:fixed;top:6px;left:0;right:0;font-size:11px;text-align:center;color:rgba(244,114,182,.3);pointer-events:none}
.card{background:#fff;border:2px dashed rgba(244,114,182,.35);border-radius:40px;box-shadow:0 8px 40px rgba(244,114,182,.15)}
.card::before{content:'';position:absolute;top:-1px;left:-1px;right:-1px;height:5px;background:repeating-linear-gradient(90deg,${c1},${c1} 4px,${c2} 4px,${c2} 8px);border-radius:40px 40px 0 0}
.fi{background:#fff5fc;border:2px dotted rgba(244,114,182,.3);border-radius:20px;color:#5d2167;font-family:'Hi Melody',cursive}
.fi:focus{border-color:${c1};border-style:solid;box-shadow:0 0 0 4px ${hex(c1,12)}}
.ct{font-family:'Hi Melody',cursive;font-size:20px}.cn{color:${c1};font-family:'Hi Melody',cursive}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:99px;font-family:'Hi Melody',cursive;font-size:16px;border:2px solid rgba(255,255,255,.4)}
.nb:hover{transform:translateY(-4px) scale(1.04);box-shadow:0 12px 32px ${hex(c1,38)}}
.ci{background:#fff5fc;border:2px dotted rgba(244,114,182,.25);border-radius:20px}
.ci:hover{border-style:solid;border-color:${c1};transform:translateY(-3px)}
.ci.ck{border-style:solid;border-color:${c1};background:${hex(c1,8)};transform:translateY(-3px)}
.cb{border-radius:50%;border:2.5px solid rgba(244,114,182,.35)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:50%}
.stit{color:#5d2167;-webkit-text-fill-color:#5d2167;font-family:'Hi Melody',cursive;font-size:28px}
.stag{color:${c1};background:${hex(c1,10)};border-radius:99px;border-color:${hex(c1,25)}}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:99px;font-family:'Hi Melody',cursive;font-size:16px;border:2px solid rgba(255,255,255,.4)}
#pw{height:6px;border-radius:99px}#pf{border-radius:99px}
`,

    // ── 브루탈리즘 ────────────────────────
    brutalist: `
@import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap');
body{background:#fff;color:#000;font-family:'Black Han Sans',sans-serif}
body::before{display:none}
.card{background:#fff;border:3px solid #000;border-radius:0;box-shadow:8px 8px 0 #000}
.card::before{display:none}
.fi{background:#f5f5f5;border:3px solid #000;border-radius:0;color:#000;font-family:'Black Han Sans',sans-serif}
.fi:focus{border-color:#000;box-shadow:4px 4px 0 #000;transform:none;outline:none}
.ct{font-family:'Black Han Sans',sans-serif;text-transform:uppercase;letter-spacing:.05em}.cn{color:#000;font-family:'Black Han Sans',sans-serif;letter-spacing:.2em;font-size:10px;text-transform:uppercase}
.nb{background:${c1};border-radius:0;color:#fff;font-family:'Black Han Sans',sans-serif;border:3px solid #000;box-shadow:6px 6px 0 #000;text-transform:uppercase;letter-spacing:.08em}
.nb:hover{transform:translate(-3px,-3px);box-shadow:9px 9px 0 #000}
.nb:active{transform:translate(3px,3px);box-shadow:2px 2px 0 #000}
.ci{background:#f5f5f5;border:3px solid #000;border-radius:0}
.ci:hover{background:#e5e5e5;box-shadow:4px 4px 0 #000}
.ci.ck{background:${c1};border-color:#000;box-shadow:4px 4px 0 #000}
.ci.ck span{color:#fff}
.cb{border-radius:0;border:3px solid #000}.ci.ck .cb{background:#000;border-color:#000;border-radius:0}
.stit{color:#000;-webkit-text-fill-color:#000;font-family:'Black Han Sans',sans-serif;text-transform:uppercase}
.stag{color:#000;background:${c1};border-color:#000;border-radius:0;border-width:2px}
.sbt{background:${c1};border-radius:0;border:3px solid #000;box-shadow:6px 6px 0 #000;font-family:'Black Han Sans',sans-serif;text-transform:uppercase;color:#fff}
#pw{background:#e0e0e0;border-radius:0}#pf{background:#000;border-radius:0}#pf::after{display:none}
`,

    // ── 글래스모피즘 ──────────────────────
    glass: `
body{background:linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f64f59 100%);color:#fff;min-height:100vh}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 30% 20%,rgba(255,255,255,.15) 0%,transparent 55%);pointer-events:none}
.card{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:24px;box-shadow:0 8px 40px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.35);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent)}
.fi{background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3);border-radius:14px;color:#fff;backdrop-filter:blur(8px)}
.fi::placeholder{color:rgba(255,255,255,.6)}
.fi:focus{border-color:rgba(255,255,255,.6);box-shadow:0 0 0 3px rgba(255,255,255,.15)}
.ct{color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.15)}.cn{color:rgba(255,255,255,.8)}
.nb{background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.4);border-radius:14px;color:#fff;backdrop-filter:blur(8px)}
.nb:hover{background:rgba(255,255,255,.35);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
.ci{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:14px;color:#fff}
.ci:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.5)}
.ci.ck{background:rgba(255,255,255,.28);border-color:rgba(255,255,255,.6)}
.ci span{color:#fff}.cb{border-radius:6px;border:2px solid rgba(255,255,255,.4)}.ci.ck .cb{background:rgba(255,255,255,.9);border-color:rgba(255,255,255,.9)}
.stit{color:#fff;-webkit-text-fill-color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.2)}
.stag{color:#fff;background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.35);border-radius:99px}
.sbt{background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.4);border-radius:14px;color:#fff;backdrop-filter:blur(8px)}
.sbt:hover{background:rgba(255,255,255,.38)}
#pw{background:rgba(255,255,255,.2)}#pf{background:rgba(255,255,255,.8);border-radius:99px}#pf::after{display:none}
`,

    // ── 신문 ──────────────────────────────
    newspaper: `
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
body{background:#f2ede3;color:#1a1a1a;font-family:'Nanum Myeongjo',serif}
body::before{content:'';position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23f2ede3'/%3E%3Crect width='1' height='1' fill='rgba(0,0,0,.03)'/%3E%3C/svg%3E");pointer-events:none}
.card{background:#faf7f0;border:2px solid #1a1a1a;border-radius:0;box-shadow:none;position:relative}
.card::before{display:none}
.card::after{content:'';position:absolute;top:3px;left:3px;right:-3px;bottom:-3px;border:1px solid rgba(0,0,0,.15);z-index:-1}
.fi{background:#fff;border:1px solid #1a1a1a;border-radius:0;color:#1a1a1a;font-family:'Nanum Myeongjo',serif}
.fi:focus{border-color:#1a1a1a;box-shadow:none;outline:2px solid rgba(0,0,0,.15);outline-offset:2px;transform:none}
.ct{font-family:'Nanum Myeongjo',serif;font-weight:800;font-size:22px;line-height:1.2}
.cn{color:#888;font-family:'Nanum Myeongjo',serif;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.nb{background:#1a1a1a;border-radius:0;color:#f2ede3;font-family:'Nanum Myeongjo',serif;font-weight:700;letter-spacing:.05em}
.nb:hover{background:#333;transform:none;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.ci{background:#fff;border:1px solid rgba(0,0,0,.18);border-radius:0}
.ci:hover{border-color:#1a1a1a;background:#f5f2ec}
.ci.ck{border-color:#1a1a1a;background:#f5f2ec;border-width:2px}
.cb{border-radius:0;border:1.5px solid rgba(0,0,0,.4)}.ci.ck .cb{background:#1a1a1a;border-color:#1a1a1a;border-radius:0}
.stit{color:#1a1a1a;-webkit-text-fill-color:#1a1a1a;font-family:'Nanum Myeongjo',serif;font-weight:800;font-size:28px;line-height:1.15}
.stag{color:#1a1a1a;background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.2);border-radius:0;font-family:'Nanum Myeongjo',serif;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
.sbt{background:#1a1a1a;border-radius:0;font-family:'Nanum Myeongjo',serif;font-weight:700}
#pw{background:rgba(0,0,0,.1);border-radius:0}#pf{background:#1a1a1a;border-radius:0}#pf::after{display:none}
`,

    // ── 미드나잇 ──────────────────────────
    midnight: `
body{background:#0d1117;color:#cdd9e5;font-family:'IBM Plex Sans KR','Noto Sans KR',sans-serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(56,139,253,.08) 0%,transparent 60%);pointer-events:none}
.card{background:#161b22;border:1px solid #30363d;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(56,139,253,.4),rgba(164,86,246,.4),transparent)}
.fi{background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#cdd9e5}
.fi:focus{border-color:#388bfd;box-shadow:0 0 0 3px rgba(56,139,253,.15)}
.ct{color:#e6edf3;font-weight:600}.cn{color:#7d8590;font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.nb{background:${c1};border-radius:8px;color:#fff;font-weight:600}
.nb:hover{filter:brightness(1.12);transform:translateY(-1px)}
.ci{background:#0d1117;border:1px solid #30363d;border-radius:8px;color:#cdd9e5}
.ci:hover{border-color:#388bfd;background:#161b22}
.ci.ck{border-color:${c1};background:rgba(56,139,253,.08)}
.cb{border-radius:4px;border:1.5px solid #484f58}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:4px}
.ci span{color:#cdd9e5}.stit{color:#e6edf3;-webkit-text-fill-color:#e6edf3;font-weight:700}
.stag{color:#388bfd;background:rgba(56,139,253,.1);border-color:rgba(56,139,253,.25);border-radius:6px}
.sbt{background:${c1};border-radius:8px;font-weight:600}
#pw{background:#21262d}#pf{background:linear-gradient(90deg,${c1},${c2})}
`,

    // ── 캔디 ──────────────────────────────
    candy: `
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
body{background:#fffef0;color:#222;font-family:'Jua',sans-serif}
body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(45deg,rgba(255,100,150,.03) 0,rgba(255,100,150,.03) 1px,transparent 1px,transparent 20px),repeating-linear-gradient(-45deg,rgba(100,150,255,.03) 0,rgba(100,150,255,.03) 1px,transparent 1px,transparent 20px);pointer-events:none}
.card{background:#fff;border:3px solid #222;border-radius:20px;box-shadow:6px 6px 0 #222}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;background:linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#ff6b6b);border-radius:20px 20px 0 0}
.fi{background:#fffef0;border:3px solid #222;border-radius:12px;color:#222;font-family:'Jua',sans-serif}
.fi:focus{border-color:${c1};box-shadow:3px 3px 0 ${c1};transform:none}
.ct{font-family:'Jua',sans-serif;font-size:20px}.cn{color:${c1};font-family:'Jua',sans-serif;font-size:12px}
.nb{background:${c1};border:3px solid #222;border-radius:12px;color:#fff;font-family:'Jua',sans-serif;box-shadow:5px 5px 0 #222}
.nb:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 #222}
.nb:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #222}
.ci{background:#fffef0;border:3px solid #222;border-radius:12px}
.ci:hover{box-shadow:4px 4px 0 #222;background:#fff5f5}
.ci.ck{background:${hex(c1,12)};border-color:${c1};box-shadow:4px 4px 0 ${darken(c1)}}
.cb{border-radius:6px;border:3px solid #222}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:6px}
.stit{color:#222;-webkit-text-fill-color:#222;font-family:'Jua',sans-serif;font-size:26px}
.stag{color:${c1};background:${hex(c1,12)};border-color:#222;border-radius:8px;border-width:2px}
.sbt{background:${c1};border:3px solid #222;border-radius:12px;font-family:'Jua',sans-serif;box-shadow:5px 5px 0 #222;color:#fff}
#pw{background:#ffe5e5;border-radius:0}#pf{background:linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff);border-radius:0}#pf::after{display:none}
`,

    // ── 먹물 (동양) ──────────────────────
    ink: `
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap');
body{background:#f7f4ee;color:#1c1208;font-family:'Nanum Myeongjo',serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(139,105,20,.04) 0%,transparent 70%);pointer-events:none}
.card{background:#faf8f2;border:1px solid rgba(139,105,20,.2);border-radius:4px;box-shadow:0 2px 12px rgba(28,18,8,.08),4px 0 0 rgba(139,105,20,.15) inset}
.card::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(to bottom,${c1},${c2})}
.fi{background:#fff;border:1px solid rgba(139,105,20,.25);border-radius:2px;color:#1c1208;font-family:'Nanum Myeongjo',serif}
.fi:focus{border-color:${c1};box-shadow:0 0 0 2px ${hex(c1,15)};transform:none}
.ct{font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:20px;line-height:1.5}
.cn{color:rgba(139,105,20,.7);font-family:'Nanum Myeongjo',serif;font-size:10px;letter-spacing:.2em}
.nb{background:${c1};border-radius:2px;color:#fff;font-family:'Nanum Myeongjo',serif;font-weight:700}
.nb:hover{background:${darken(c1)};transform:none;box-shadow:2px 2px 4px rgba(28,18,8,.2)}
.ci{background:#fff;border:1px solid rgba(139,105,20,.18);border-radius:2px}
.ci:hover{border-color:${c1};background:#fdf9f0}
.ci.ck{border-color:${c1};background:#fdf5e0;border-width:2px}
.cb{border-radius:1px;border:1.5px solid rgba(139,105,20,.35)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:1px}
.stit{color:#1c1208;-webkit-text-fill-color:#1c1208;font-family:'Nanum Myeongjo',serif;font-weight:700;font-size:26px}
.stag{color:${c1};background:rgba(139,105,20,.06);border-color:rgba(139,105,20,.2);border-radius:2px}
.sbt{background:${c1};border-radius:2px;font-family:'Nanum Myeongjo',serif;font-weight:700}
#pw{background:rgba(139,105,20,.12);border-radius:0}#pf{background:${c1};border-radius:0}#pf::after{display:none}
`,

    // ── 오로라 ────────────────────────────
    aurora: `
body{background:#080820;color:#e8e0ff}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 20%,rgba(100,50,200,.25) 0%,transparent 45%),radial-gradient(ellipse 70% 60% at 80% 80%,rgba(0,200,150,.18) 0%,transparent 45%),radial-gradient(ellipse 60% 50% at 50% 50%,rgba(200,50,150,.1) 0%,transparent 50%);pointer-events:none;animation:auroraAnim 8s ease-in-out infinite alternate}
@keyframes auroraAnim{0%{opacity:.8}100%{opacity:1;filter:hue-rotate(20deg)}}
.card{background:rgba(20,15,50,.7);border:1px solid rgba(150,100,255,.25);border-radius:20px;box-shadow:0 8px 40px rgba(100,50,200,.15);backdrop-filter:blur(20px)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${c1},${c2},#00c896,transparent);animation:aurLine 3s linear infinite}
@keyframes aurLine{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
.fi{background:rgba(255,255,255,.06);border:1px solid rgba(150,100,255,.22);border-radius:14px;color:#e8e0ff}
.fi:focus{border-color:${c1};box-shadow:0 0 0 3px rgba(150,100,255,.18),0 0 20px rgba(150,100,255,.1)}
.ct{color:#f0ecff}.cn{color:${c1}}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:14px}
.nb:hover{box-shadow:0 8px 28px ${hex(c1,40)},0 0 40px ${hex(c2,20)};transform:translateY(-2px)}
.ci{background:rgba(255,255,255,.05);border:1px solid rgba(150,100,255,.18);border-radius:14px;color:#e8e0ff}
.ci:hover{border-color:${c1};background:rgba(150,100,255,.08)}
.ci.ck{border-color:${c1};background:rgba(150,100,255,.12);box-shadow:0 0 16px rgba(150,100,255,.15)}
.ci span{color:#e8e0ff}.cb{border-radius:6px;border:2px solid rgba(150,100,255,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:6px;box-shadow:0 0 8px ${c1}}
.stit{background:linear-gradient(135deg,#f0ecff,${c1},${c2},#00c896);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stag{color:${c1};background:rgba(150,100,255,.1);border-color:rgba(150,100,255,.25);border-radius:99px}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:14px}
`,

    // ── 종이 ──────────────────────────────
    paper: `
@import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap');
body{background:#f4ede0;color:#3d2b1a;font-family:'Gaegu',cursive}
body::before{content:'';position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.04'/%3E%3C/svg%3E");pointer-events:none}
.card{background:#fdf7ee;border:1px solid rgba(139,90,43,.2);border-radius:4px;box-shadow:2px 3px 8px rgba(100,60,20,.12),0 1px 0 rgba(255,255,255,.8) inset}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${c1},${c2});opacity:.7;border-radius:4px 4px 0 0}
.fi{background:#fff8ef;border:1px solid rgba(139,90,43,.22);border-radius:3px;color:#3d2b1a;font-family:'Gaegu',cursive;font-size:16px}
.fi:focus{border-color:${c1};box-shadow:1px 2px 4px rgba(100,60,20,.1);transform:none}
.ct{font-family:'Gaegu',cursive;font-weight:700;font-size:22px}.cn{color:${c1};font-family:'Gaegu',cursive}
.nb{background:${c1};border-radius:4px;color:#fff;font-family:'Gaegu',cursive;font-size:16px;box-shadow:2px 3px 0 rgba(100,60,20,.25)}
.nb:hover{transform:translateY(-2px);box-shadow:2px 5px 0 rgba(100,60,20,.25)}
.ci{background:#fff8ef;border:1px solid rgba(139,90,43,.18);border-radius:4px}
.ci:hover{border-color:${c1};background:#fffbf5}
.ci.ck{border-color:${c1};background:${hex(c1,8)};border-width:2px}
.cb{border-radius:3px;border:1.5px solid rgba(139,90,43,.35)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:3px}
.stit{color:#3d2b1a;-webkit-text-fill-color:#3d2b1a;font-family:'Gaegu',cursive;font-weight:700;font-size:26px}
.stag{color:${c1};background:${hex(c1,10)};border-color:${hex(c1,30)};border-radius:4px}
.sbt{background:${c1};border-radius:4px;font-family:'Gaegu',cursive;font-size:16px;box-shadow:2px 3px 0 rgba(100,60,20,.25);color:#fff}
#pw{background:rgba(139,90,43,.15);border-radius:0}#pf{background:${c1};border-radius:0}#pf::after{display:none}
`,

    // ── 네온 80s ──────────────────────────
    neon80s: `
@import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&display=swap');
body{background:#0a0015;color:#ff00ff;font-family:'Do Hyeon',sans-serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 50%,rgba(255,0,255,.05) 0%,transparent 60%);pointer-events:none}
body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,0,255,.015) 3px,rgba(255,0,255,.015) 4px);pointer-events:none}
.card{background:#0f0020;border:2px solid #ff00ff;border-radius:4px;box-shadow:0 0 20px rgba(255,0,255,.3),0 0 60px rgba(255,0,255,.1),inset 0 0 30px rgba(255,0,255,.05)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#ff00ff,#00ffff,#ff00ff);animation:neonPulse 2s ease-in-out infinite}
@keyframes neonPulse{0%,100%{opacity:.7;box-shadow:0 0 8px}50%{opacity:1;box-shadow:0 0 16px}}
.fi{background:rgba(255,0,255,.05);border:1px solid rgba(255,0,255,.4);border-radius:2px;color:#ff00ff;font-family:'Do Hyeon',sans-serif}
.fi::placeholder{color:rgba(255,0,255,.4)}
.fi:focus{border-color:#ff00ff;box-shadow:0 0 8px rgba(255,0,255,.5),0 0 20px rgba(255,0,255,.2)}
.ct{font-family:'Do Hyeon',sans-serif;color:#ff00ff;text-shadow:0 0 10px rgba(255,0,255,.8)}.cn{color:#00ffff;letter-spacing:.2em;font-size:10px;text-shadow:0 0 8px rgba(0,255,255,.8)}
.nb{background:transparent;border:2px solid ${c1};border-radius:2px;color:${c1};font-family:'Do Hyeon',sans-serif;text-transform:uppercase;letter-spacing:.1em;text-shadow:0 0 8px ${c1};box-shadow:0 0 12px ${hex(c1,40)},inset 0 0 12px ${hex(c1,10)}}
.nb:hover{box-shadow:0 0 24px ${hex(c1,70)},inset 0 0 24px ${hex(c1,15)};text-shadow:0 0 16px ${c1}}
.ci{background:rgba(255,0,255,.04);border:1px solid rgba(255,0,255,.25);border-radius:2px;color:#ff00ff}
.ci:hover{border-color:#ff00ff;box-shadow:0 0 10px rgba(255,0,255,.2)}
.ci.ck{border-color:${c1};background:${hex(c1,8)};box-shadow:0 0 16px ${hex(c1,3)}}
.ci span{color:#ff00ff;text-shadow:0 0 6px rgba(255,0,255,.5)}.cb{border-radius:1px;border:1px solid rgba(255,0,255,.4)}.ci.ck .cb{background:${c1};border-color:${c1};box-shadow:0 0 6px ${c1}}
.stit{color:#ff00ff;-webkit-text-fill-color:#ff00ff;font-family:'Do Hyeon',sans-serif;text-shadow:0 0 20px rgba(255,0,255,.9),0 0 40px rgba(255,0,255,.5)}
.stag{color:#00ffff;background:rgba(0,255,255,.08);border-color:rgba(0,255,255,.3);border-radius:2px;text-shadow:0 0 8px rgba(0,255,255,.8)}
.sbt{background:transparent;border:2px solid ${c1};border-radius:2px;color:${c1};font-family:'Do Hyeon',sans-serif;text-transform:uppercase;text-shadow:0 0 8px ${c1};box-shadow:0 0 12px ${hex(c1,40)}}
#pf{background:linear-gradient(90deg,#ff00ff,#00ffff);box-shadow:0 0 8px rgba(255,0,255,.7)}#pf::after{display:none}#pw{background:rgba(255,0,255,.1);border-radius:0}
`,

    // ── 클린 (의료) ──────────────────────
    medical: `
body{background:#f8faff;color:#1e2d40;font-family:'IBM Plex Sans KR','Noto Sans KR',sans-serif}
body::before{display:none}
.card{background:#fff;border:1px solid #dde3ef;border-radius:12px;box-shadow:0 2px 12px rgba(30,45,64,.06)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${c1},${c2});border-radius:12px 12px 0 0}
.fi{background:#f4f7ff;border:1.5px solid #dde3ef;border-radius:8px;color:#1e2d40}
.fi:focus{border-color:${c1};box-shadow:0 0 0 3px ${hex(c1,12)};background:#fff}
.ct{color:#1e2d40;font-weight:600;letter-spacing:-.02em}.cn{color:${c1};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.nb{background:${c1};border-radius:8px;color:#fff;font-weight:600;letter-spacing:.02em}
.nb:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 4px 16px ${hex(c1,30)}}
.ci{background:#f4f7ff;border:1.5px solid #dde3ef;border-radius:8px}
.ci:hover{border-color:${c1};background:#f0f5ff}
.ci.ck{border-color:${c1};background:${hex(c1,8)};border-width:2px}
.cb{border-radius:4px;border:2px solid #c5cfde}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:4px}
.stit{color:#1e2d40;-webkit-text-fill-color:#1e2d40;font-weight:700;letter-spacing:-.02em}
.stag{color:${c1};background:${hex(c1,8)};border-color:${hex(c1,25)};border-radius:6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.sbt{background:${c1};border-radius:8px;font-weight:600}
#pw{background:#e8edf5}#pf{background:linear-gradient(90deg,${c1},${c2})}
`,

    // ── 포레스트 (어두운 숲) ──────────────
    forest: `
@import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
body{background:#0a1a0f;color:#c8e6c5;font-family:'Gowun Dodum',sans-serif}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 20% 20%,rgba(34,85,34,.3) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 80% 80%,rgba(10,50,20,.3) 0%,transparent 55%);pointer-events:none}
.card{background:#0f2414;border:1px solid rgba(72,180,72,.2);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.5)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,${c1},${c2},transparent 80%)}
.fi{background:rgba(0,0,0,.4);border:1px solid rgba(72,180,72,.2);border-radius:12px;color:#c8e6c5;font-family:'Gowun Dodum',sans-serif}
.fi:focus{border-color:${c1};box-shadow:0 0 0 3px ${hex(c1,15)}}
.ct{color:#c8e6c5}.cn{color:${c1}}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:12px}
.nb:hover{box-shadow:0 8px 24px ${hex(c1,35)};transform:translateY(-2px)}
.ci{background:rgba(0,0,0,.3);border:1px solid rgba(72,180,72,.18);border-radius:12px;color:#c8e6c5}
.ci:hover{border-color:${c1};background:rgba(72,180,72,.08)}
.ci.ck{border-color:${c1};background:rgba(72,180,72,.12)}
.ci span{color:#c8e6c5}.cb{border-radius:6px;border:2px solid rgba(72,180,72,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:6px}
.stit{color:#a5d6a7;-webkit-text-fill-color:#a5d6a7;font-family:'Gowun Dodum',sans-serif}
.stag{color:${c1};background:rgba(72,180,72,.1);border-color:rgba(72,180,72,.25);border-radius:8px}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:12px;font-family:'Gowun Dodum',sans-serif}
#pw{background:rgba(72,180,72,.12)}#pf{background:linear-gradient(90deg,${c1},${c2})}
`,

    // ── 선셋 ──────────────────────────────
    sunset: `
body{background:linear-gradient(160deg,#1a0533 0%,#3d0c5c 30%,#7c1a3a 60%,#c44b1a 85%,#f07d20 100%);color:#ffe8d6}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(240,125,32,.2) 0%,transparent 55%);pointer-events:none}
.card{background:rgba(20,5,40,.6);border:1px solid rgba(255,150,100,.2);border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.4);backdrop-filter:blur(16px)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#f07d20,#e040a0,#7c3aed,transparent)}
.fi{background:rgba(255,255,255,.08);border:1px solid rgba(255,150,100,.25);border-radius:14px;color:#ffe8d6}
.fi::placeholder{color:rgba(255,232,214,.4)}
.fi:focus{border-color:rgba(255,150,100,.6);box-shadow:0 0 0 3px rgba(255,150,100,.12)}
.ct{color:#ffe8d6}.cn{color:rgba(255,200,150,.8)}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:14px;color:#fff}
.nb:hover{box-shadow:0 8px 28px rgba(255,100,50,.4);transform:translateY(-2px)}
.ci{background:rgba(255,255,255,.07);border:1px solid rgba(255,150,100,.2);border-radius:14px;color:#ffe8d6}
.ci:hover{border-color:rgba(255,150,100,.5);background:rgba(255,150,100,.08)}
.ci.ck{border-color:rgba(255,150,100,.7);background:rgba(255,150,100,.12)}
.ci span{color:#ffe8d6}.cb{border-radius:6px;border:2px solid rgba(255,150,100,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:6px}
.stit{color:#ffe8d6;-webkit-text-fill-color:#ffe8d6;text-shadow:0 2px 12px rgba(0,0,0,.3)}
.stag{color:#f07d20;background:rgba(240,125,32,.12);border-color:rgba(240,125,32,.3);border-radius:99px}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:14px}
#pf{background:linear-gradient(90deg,#f07d20,#e040a0,#7c3aed)}#pf::after{display:none}
`,

    // ── 칠판 ──────────────────────────────
    chalk: `
@import url('https://fonts.googleapis.com/css2?family=Cute+Font&display=swap');
body{background:#1e3a2a;color:#e8f5e9;font-family:'Cute Font',cursive}
body::before{content:'';position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");pointer-events:none}
.card{background:rgba(30,58,42,.8);border:2px dashed rgba(232,245,233,.25);border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,.3)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.5) 0,rgba(255,255,255,.5) 6px,transparent 6px,transparent 10px);opacity:.4}
.fi{background:rgba(0,0,0,.2);border:1px dashed rgba(232,245,233,.3);border-radius:2px;color:#e8f5e9;font-family:'Cute Font',cursive;font-size:18px}
.fi::placeholder{color:rgba(232,245,233,.35)}
.fi:focus{border-color:rgba(255,255,255,.6);border-style:solid;box-shadow:none;transform:none}
.ct{font-family:'Cute Font',cursive;font-size:22px;color:#e8f5e9}.cn{color:rgba(232,245,233,.6);font-family:'Cute Font',cursive;letter-spacing:.1em}
.nb{background:transparent;border:2px dashed rgba(232,245,233,.5);border-radius:3px;color:#e8f5e9;font-family:'Cute Font',cursive;font-size:17px}
.nb:hover{border-style:solid;background:rgba(255,255,255,.08)}
.ci{background:rgba(0,0,0,.15);border:1px dashed rgba(232,245,233,.25);border-radius:3px;color:#e8f5e9}
.ci:hover{border-color:rgba(255,255,255,.5);border-style:solid}
.ci.ck{border-style:solid;border-color:rgba(255,255,255,.7);background:rgba(255,255,255,.1)}
.ci span{color:#e8f5e9}.cb{border-radius:2px;border:1.5px dashed rgba(232,245,233,.4)}.ci.ck .cb{background:rgba(255,255,255,.8);border-color:rgba(255,255,255,.8);border-radius:2px;border-style:solid}
.stit{color:#e8f5e9;-webkit-text-fill-color:#e8f5e9;font-family:'Cute Font',cursive;font-size:28px}
.stag{color:rgba(232,245,233,.8);background:rgba(255,255,255,.06);border-color:rgba(232,245,233,.25);border-style:dashed;border-radius:3px;font-family:'Cute Font',cursive}
.sbt{background:transparent;border:2px dashed rgba(232,245,233,.5);border-radius:3px;color:#e8f5e9;font-family:'Cute Font',cursive;font-size:17px}
#pf{background:repeating-linear-gradient(90deg,rgba(255,255,255,.7) 0,rgba(255,255,255,.7) 8px,rgba(255,255,255,.4) 8px,rgba(255,255,255,.4) 10px)}#pf::after{display:none}#pw{background:rgba(255,255,255,.08);border-radius:0}
`,

    // ── 오션 ──────────────────────────────
    ocean: `
body{background:#020e1f;color:#b8e4ff}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 30% 30%,rgba(0,100,200,.2) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 70% 70%,rgba(0,180,220,.12) 0%,transparent 55%);pointer-events:none;animation:oceanAnim 6s ease-in-out infinite alternate}
@keyframes oceanAnim{0%{opacity:.8}100%{opacity:1;transform:scale(1.05)}}
.card{background:rgba(0,20,50,.75);border:1px solid rgba(0,150,220,.22);border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,.5);backdrop-filter:blur(16px)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${c1},${c2},transparent)}
.fi{background:rgba(0,0,0,.4);border:1px solid rgba(0,150,220,.2);border-radius:14px;color:#b8e4ff}
.fi::placeholder{color:rgba(184,228,255,.35)}
.fi:focus{border-color:${c1};box-shadow:0 0 0 3px ${hex(c1,15)}}
.ct{color:#cff0ff}.cn{color:${c1}}
.nb{background:linear-gradient(135deg,${c1},${c2});border-radius:14px}
.nb:hover{box-shadow:0 8px 28px ${hex(c1,40)};transform:translateY(-2px)}
.ci{background:rgba(0,0,0,.3);border:1px solid rgba(0,150,220,.18);border-radius:14px;color:#b8e4ff}
.ci:hover{border-color:${c1};background:rgba(0,150,220,.08)}
.ci.ck{border-color:${c1};background:rgba(0,150,220,.12)}
.ci span{color:#b8e4ff}.cb{border-radius:6px;border:2px solid rgba(0,150,220,.3)}.ci.ck .cb{background:${c1};border-color:${c1};border-radius:6px}
.stit{background:linear-gradient(135deg,#b8e4ff,${c1},${c2});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stag{color:${c1};background:rgba(0,150,220,.1);border-color:rgba(0,150,220,.25);border-radius:99px}
.sbt{background:linear-gradient(135deg,${c1},${c2});border-radius:14px}
`,
  }
  return T[id] || T.default
}

// 헬퍼
function hex(color, alpha) {
  return color + Math.round(alpha * 2.55).toString(16).padStart(2,'0')
}
function darken(hex) {
  const n = parseInt(hex.slice(1),16)
  const r = Math.max(0,(n>>16)-40), g = Math.max(0,((n>>8)&0xff)-40), b = Math.max(0,(n&0xff)-40)
  return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')
}
