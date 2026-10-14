export const CLEAN_THEMES = [
  { id:'clean_white', name:'클린 화이트', emoji:'', desc:'화이트 배경과 선명한 타이포' },
  { id:'clean_graphite', name:'그래파이트', emoji:'', desc:'차분한 차콜과 단색 버튼' },
  { id:'clean_rose', name:'소프트 로즈', emoji:'', desc:'은은한 핑크와 깨끗한 입력칸' },
  { id:'clean_sage', name:'클린 블루', emoji:'', desc:'차분한 블루와 얇은 구분선' },
];

const palettes = {
  clean_white: ['#f3f5f6','#fff','#20282c','#59676c','#7c898f','#dfe5e8','#f7f9fa'],
  clean_graphite: ['#181a1c','#222527','#f3f5f5','#b8c0c3','#97a2a7','#3d4549','#292e31'],
  clean_rose: ['#f9f2f4','#fff','#3b2b33','#7b626d','#967c87','#eadce2','#fcf8fa'],
  clean_sage: ['#eef3fb','#fff','#263652','#61718c','#8190a8','#d7e0ee','#f6f8fc'],
};

export function getCleanThemeCSS(id, c1) {
  const palette = palettes[id];
  if (!palette) return null;
  const [canvas,surface,text,muted,subtle,border,input] = palette;
  return `
:root{--tx:${text};--tx2:${muted};--tx3:${subtle};--bg2:${input};--bd:${border};--bd2:${subtle};--ls-bg:${input}}
body{background:${canvas};color:var(--tx)}body::before,body::after{display:none}
body .card{background:${surface};border:1px solid var(--bd);border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.04);backdrop-filter:none}
.card::before{display:none}
.ct,.stit,.dt{font-family:inherit;color:var(--tx);background:none;-webkit-text-fill-color:var(--tx);text-shadow:none}
.fi,.ci{background:var(--bg2);color:var(--tx);border:1px solid var(--bd);border-radius:6px;backdrop-filter:none}
.fi:focus{background:${surface};border-color:${c1};box-shadow:0 0 0 3px color-mix(in srgb,${c1} 12%,transparent)}
.ci:hover:not(.qdisabled){box-shadow:none;border-color:${c1}}
.ci.ck{background:color-mix(in srgb,${c1} 9%,${surface});box-shadow:none}
body .nb,body .sbt,body .dcta{background:${c1}!important;color:#fff;border-radius:6px;text-shadow:none}
body .nb:hover,body .sbt:hover,body .dcta:hover{box-shadow:none!important}
.sbt::before,.nb::before{display:none}
.stag{background:transparent;border:0;padding:0;border-radius:0;box-shadow:none;color:${c1}}
.ls{background:var(--ls-bg);border-color:var(--bd);color:var(--tx2)}
#pf{box-shadow:none}#pf::after{display:none}
@media(max-width:480px){body .card{border-radius:8px}}
`;
}
