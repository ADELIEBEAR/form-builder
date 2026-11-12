import{i as Ue,a as He}from"./phoneValidation-DnkXk63Q.js";function de(e,o){const n=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(e||"").trim());if(!n)return o;const r=n[1].length===3?[...n[1]].map(i=>i+i).join(""):n[1];return[0,2,4].map(i=>parseInt(r.slice(i,i+2),16))}function Fe(e){const o=e.map(n=>n/255<=.04045?n/255/12.92:((n/255+.055)/1.055)**2.4);return o[0]*.2126+o[1]*.7152+o[2]*.0722}function X(e,o){let n=1/0;for(let r=0;r<=32;r++){const i=Fe(e[0].map((p,l)=>p+(e[1][l]-p)*r/32));n=Math.min(n,o?1.05/(i+.05):(i+.05)/.05)}return n}function C(e,o=e){const n=de(e,[124,108,252]),r=[n,de(o,n)],i=[X(r,!1),X(r,!0)];let p=i[1]>i[0],l=r;if(Math.max(...i)<4.5){const y=[!1,!0].map(v=>{const B=I=>r.map(E=>E.map(O=>Math.round(O+((v?0:255)-O)*I)));let q=0,j=1;for(let I=0;I<12;I++){const E=(q+j)/2;X(B(E),v)>=4.6?j=E:q=E}return{amount:j,white:v,colors:B(j)}}).sort((v,B)=>v.amount-B.amount)[0];p=y.white,l=y.colors}const g=m=>"#"+m.map(y=>y.toString(16).padStart(2,"0")).join("");return{text:p?"#ffffff":"#000000",c1:g(l[0]),c2:g(l[1])}}const xe=[{id:"clean_white",name:"기본 카드",emoji:"",desc:"둥근 카드에 목록형 선택지",thumb:{borderRadius:7}},{id:"clean_warm",name:"안내형",emoji:"",desc:"위에 제목 줄과 번호 단계가 붙는 신청서",thumb:{borderRadius:8,borderTop:"4px solid #9aa3af"}},{id:"clean_band",name:"컬러 밴드",emoji:"",desc:"위쪽 색 띠 위에 카드가 얹힘",thumb:{borderRadius:6,boxShadow:"0 -9px 0 #9aa3af"}},{id:"clean_sheet",name:"바텀 시트",emoji:"",desc:"아래에서 올라온 시트, 위에는 큰 제목",thumb:{borderRadius:"9px 9px 0 0",marginTop:6}},{id:"clean_full",name:"풀스크린",emoji:"",desc:"카드 없이 화면 가득, 가운데 큰 제목",thumb:{borderRadius:0,border:"0",background:"#9aa3af"}},{id:"clean_landing",name:"랜딩 + 신청",emoji:"",desc:"긴 소개 페이지(요약·체크 목록·자주 묻는 질문·고정 버튼) 뒤에 신청 질문이 이어짐",thumb:{borderRadius:0,border:"0",borderTop:"5px solid #9aa3af",borderBottom:"7px solid #9aa3af",background:"#fff"}},{id:"clean_app",name:"앱 화면",emoji:"",desc:"위에 제목 바와 굵은 진행 막대, 카드 없이 흰 화면에 큰 버튼",thumb:{borderRadius:0,border:"0",borderTop:"5px solid #9aa3af",background:"#fff"}},{id:"clean_bubble",name:"말풍선",emoji:"",desc:"질문이 말풍선으로, 선택지는 알약으로",thumb:{borderRadius:"9px 9px 9px 2px"}},{id:"clean_chip",name:"칩 선택",emoji:"",desc:"선택지가 가로로 늘어선 알약 칩",thumb:{borderRadius:12,borderStyle:"dotted"}},{id:"clean_grid",name:"타일",emoji:"",desc:"선택지가 두 칸씩 놓이는 큰 타일",thumb:{borderRadius:5,boxShadow:"inset 15px 0 0 #e5e7eb,inset 16px 0 0 #fff"}},{id:"clean_capsule",name:"캡슐",emoji:"",desc:"전부 둥근 알약, 가운데 정렬",thumb:{borderRadius:14}},{id:"clean_pop",name:"팝",emoji:"",desc:"굵은 테두리와 딱 떨어지는 그림자",thumb:{borderRadius:7,border:"2px solid #16161a",boxShadow:"0 3px 0 #16161a"}},{id:"clean_stack",name:"겹친 종이",emoji:"",desc:"뒤에 종이가 겹쳐 보이는 카드",thumb:{borderRadius:4,boxShadow:"3px 3px 0 #fff,4px 4px 0 #b6bcc6"}},{id:"clean_tab",name:"폴더",emoji:"",desc:"단계 표시가 폴더 탭처럼 위로 튀어나옴",thumb:{borderRadius:"0 6px 6px 6px",boxShadow:"-0px -6px 0 -1px #9aa3af"}},{id:"clean_ticket",name:"티켓",emoji:"",desc:"점선과 양옆 홈이 있는 입장권",thumb:{borderRadius:5,borderBottom:"2px dashed #9aa3af"}},{id:"clean_frame",name:"액자",emoji:"",desc:"이중 테두리와 가운데 제목의 격식 있는 서류",thumb:{borderRadius:2,outline:"1px solid #9aa3af",outlineOffset:-4}},{id:"clean_note",name:"노트",emoji:"",desc:"왼쪽 색 띠와 밑줄 입력칸",thumb:{borderRadius:3,borderLeft:"4px solid #9aa3af"}},{id:"clean_line",name:"라인",emoji:"",desc:"가는 선만 쓰고 제목 아래 밑줄",thumb:{borderRadius:1,boxShadow:"inset 0 -8px 0 #fff,inset 0 -9px 0 #9aa3af"}},{id:"clean_neumo",name:"소프트 입체",emoji:"",desc:"볼록한 카드와 오목한 입력칸",thumb:{borderRadius:8,border:"0",background:"#e8ecf1",boxShadow:"2px 2px 5px #b9c1cc,-2px -2px 5px #fff"}},{id:"clean_glass",name:"글래스",emoji:"",desc:"번지는 빛 위에 반투명 유리 카드",thumb:{borderRadius:8,background:"rgba(120,130,220,.35)",border:"1px solid rgba(120,130,220,.6)"}},{id:"clean_neon",name:"네온",emoji:"",desc:"빛나는 테두리와 제목",thumb:{borderRadius:7,background:"#0d0f15",border:"1px solid #7c8cff",boxShadow:"0 0 7px #7c8cff"}},{id:"clean_pastel",name:"파스텔",emoji:"",desc:"",hidden:!0},{id:"clean_graphite",name:"미드나잇",emoji:"",desc:"",hidden:!0},{id:"clean_mono",name:"모노",emoji:"",desc:"",hidden:!0},{id:"clean_rose",name:"로즈",emoji:"",desc:"",hidden:!0},{id:"clean_sage",name:"세이지",emoji:"",desc:"",hidden:!0},{id:"clean_invert",name:"다크 카드",emoji:"",desc:"",hidden:!0}],J={clean_warm:["#fdf8ee","#fff","#2b2622","#6f665c","#8c8276","#efe6d6","#fff"],clean_white:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_pastel:["#f5f3ff","#fff","#232033","#625d78","#8a86a0","#e6e2f3","#faf9ff"],clean_band:["#f3f5f8","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_full:["#141a26","transparent","#ffffff","#d5dae3","#aab2c0","rgba(255,255,255,.18)","rgba(255,255,255,.1)"],clean_graphite:["#0f1115","#191c23","#f2f4f7","#b9c0cb","#8d95a3","#2c313b","#20242d"],clean_mono:["#ffffff","#fff","#111111","#444444","#777777","#111111","#fff"],clean_note:["#f1ede3","#fbf9f4","#2a2723","#69635a","#8f887d","#d9d2c3","transparent"],clean_rose:["#fbeff3","#fff","#3b2b33","#7b626d","#967c87","#f0dde4","#fdf8fa"],clean_sage:["#edf4ee","#fff","#24332a","#586b5f","#7f9085","#d9e6dc","#f7faf7"],clean_bubble:["#f1f3f9","transparent","#1f2430","#5d6575","#8a92a1","#e1e5ee","#fff"],clean_capsule:["#f6f4fd","#fff","#231f33","#625d78","#8a86a0","#e7e3f4","#faf9ff"],clean_pop:["#ffffff","#fff","#16161a","#3f3f46","#6b6b75","#16161a","#fff"],clean_ticket:["#eceef3","#fff","#1f2328","#5b6470","#868e99","#dfe3ea","#f7f8fa"],clean_neumo:["#e8ecf1","#e8ecf1","#27303b","#5c6876","#8793a1","transparent","#e8ecf1"],clean_line:["#ffffff","#fff","#1f2328","#5b6470","#8a929c","#d9dde3","transparent"],clean_invert:["#f1f2f5","#16181d","#f4f5f7","#c2c7d0","#959caa","rgba(255,255,255,.14)","rgba(255,255,255,.07)"],clean_glass:["#0e1224","rgba(255,255,255,.1)","#ffffff","#d7dbea","#aab0c8","rgba(255,255,255,.2)","rgba(255,255,255,.1)"],clean_neon:["#07080c","#0d0f15","#f1f4f9","#b4bccb","#8891a2","#262b38","#12151d"],clean_app:["#ffffff","#ffffff","#191f28","#4e5968","#8b95a1","#e5e8eb","#ffffff"],clean_sheet:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_chip:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#fff"],clean_grid:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_stack:["#eef0f3","#fff","#1f2328","#5b6470","#868e99","#dfe3ea","#f7f8fa"],clean_tab:["#f1f2f5","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_frame:["#f5f3ee","#fffefb","#26231f","#625c53","#8b8478","#d8d2c6","transparent"]},$=":not(.single-page)";function Ye([e,o,n,r,i,p,l],g){return`
:root{--tx:${n};--tx2:${r};--tx3:${i};--bg2:${l};--bd:${p};--bd2:${i};--ls-bg:${l}}
body{background:${e};color:var(--tx)}body::before,body::after{display:none}
body .card{background:${o};border:1px solid var(--bd);box-shadow:0 14px 40px rgba(20,24,40,.07);backdrop-filter:none}
.card::before{display:none}
body${$} .card{border-radius:26px;padding:40px 32px 30px}
.ct,.stit,.dt{font-family:inherit;color:var(--tx);background:none;-webkit-text-fill-color:var(--tx);text-shadow:none;font-weight:800;letter-spacing:-.02em;word-break:keep-all}
body${$} .ct{font-size:clamp(21px,5.2vw,26px);line-height:1.38}
.cs,.sdesc,.dd{font-size:15px;font-weight:400;line-height:1.65;color:var(--tx2)}
.cn,.stag{display:inline-flex;align-self:flex-start;width:fit-content;font-family:inherit;font-size:12px;font-weight:800;letter-spacing:.08em;color:${g};background:color-mix(in srgb,${g} 12%,transparent);border:0;border-radius:99px;padding:7px 14px;margin-bottom:18px;box-shadow:none}
.cn::after{display:none}
.fi,.ci{background:var(--bg2);color:var(--tx);border:1.5px solid var(--bd);backdrop-filter:none}
body${$} .fi{border-radius:16px;padding:16px 18px;font-size:16px}
body${$} .cg{gap:11px}
body${$} .ci{border-radius:16px;padding:17px 18px;gap:14px}
.ci span,.ci .oi{font-size:16px;font-weight:600}
body${$} .cb{width:24px;height:24px;border-radius:8px}body${$} .cb.rb{border-radius:50%}
.fi:focus{border-color:${g};box-shadow:0 0 0 4px color-mix(in srgb,${g} 14%,transparent);transform:none}
.ci:hover:not(.qdisabled){box-shadow:none;border-color:color-mix(in srgb,${g} 55%,var(--bd));transform:none}
.ci.ck{background:color-mix(in srgb,${g} 9%,${o==="transparent"?e:o});box-shadow:none;transform:none}
.ci.ck .cb,.la.ck .ld{transform:none}
.ci,.fi,.nb,.sbt,.dcta{transition:border-color .2s ease,background .2s ease,box-shadow .25s ease,opacity .2s ease,transform .2s ease}
body .nb,body .sbt,body .dcta{border-radius:16px;font-size:16px;font-weight:700;padding:17px 28px;text-shadow:none;box-shadow:0 8px 20px color-mix(in srgb,${g} 24%,transparent)}
body .nb{min-width:0;flex:0 1 auto}
.cf{min-width:0}
@media(max-width:480px){body .nb{flex:1 1 auto;padding-left:18px;padding-right:18px}}
body .nb:hover,body .sbt:hover,body .dcta:hover{transform:none;opacity:.92}
body .nb:active,body .sbt:active{transform:scale(.985)}
.sbt::before,.nb::before{display:none}
.ls{background:var(--ls-bg);border-color:var(--bd);border-radius:14px;color:var(--tx2)}
.qfb{border-radius:14px}
#pw{background:color-mix(in srgb,${g} 12%,transparent)}#pf{box-shadow:none}#pf::after{display:none}
@media(max-width:480px){body${$} .card{padding:30px 22px 24px;border-radius:22px}}
`}const R={clean_warm:(e,o)=>{const n=`color-mix(in srgb,${e} 72%,#231c14)`;return`
body{background:color-mix(in srgb,${e} 7%,#fffdf8);justify-content:flex-start;padding-top:30px;overflow-x:hidden;overflow-y:auto}
#sc{display:none}
.fhead{display:flex}.steps{display:flex}
.steps i{background:color-mix(in srgb,${e} 16%,${o[1]});color:color-mix(in srgb,${e} 62%,${o[1]})}
.steps i.on,.steps i.dn{background:${n};color:#fff}
.steps i.dn+i::before{background:${n}}
body .card{border:0;border-radius:28px;box-shadow:0 18px 50px color-mix(in srgb,${e} 14%,transparent)}
body .card::before{display:block;height:5px;background:${e}!important}
.cn,.stag{color:${n}!important;background:color-mix(in srgb,${e} 14%,${o[1]})}
.ct,.stit,.dt{color:${n};-webkit-text-fill-color:${n}}
body .nb{flex:1}body .sbt{width:100%;justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:18px;padding:18px 28px;font-size:17px}
.ci{padding:19px 18px}.cb{width:26px;height:26px}`},clean_white:()=>"",clean_pastel:(e,o)=>`
body{background:color-mix(in srgb,${e} 13%,#ffffff)}
body .card{border:0;box-shadow:0 20px 50px color-mix(in srgb,${e} 18%,transparent)}
.fi,.ci{background:color-mix(in srgb,${e} 5%,${o[1]});border-color:color-mix(in srgb,${e} 16%,${o[1]})}
.ct,.stit,.dt{color:color-mix(in srgb,${e} 55%,#17142a);-webkit-text-fill-color:color-mix(in srgb,${e} 55%,#17142a)}
body .nb,body .sbt,body .dcta{border-radius:999px}`,clean_band:e=>{const o=C(e);return`
body{justify-content:flex-start;padding-top:34px;overflow-x:hidden;overflow-y:auto}
body::before{display:block!important;content:'';position:fixed;top:0;left:0;right:0;height:236px;background:${o.c1};z-index:0}
.fhead{display:flex}.fhead b{color:${o.text}}.fhead span{color:${o.text};opacity:.78}
 18%,transparent);color:${o.text};box-shadow:none}
#gb,#sc{color:${o.text}}#pw{background:color-mix(in srgb,${o.text} 22%,transparent)}
body .card{border:0;box-shadow:0 18px 46px rgba(20,24,40,.14)}`},clean_full:e=>`
body{background:color-mix(in srgb,${e} 34%,#0d1015)}
body .card{border:0;box-shadow:none;padding:14px 6px;text-align:center}
body:not(.single-page) .ct{font-size:clamp(24px,6.4vw,31px)}
.cn,.stag{align-self:center;margin-left:auto;margin-right:auto;color:#fff;background:rgba(255,255,255,.14)}
.ci{text-align:left}
.ci.ck{background:rgba(255,255,255,.22)}
.ci:hover:not(.qdisabled),.fi:focus{border-color:rgba(255,255,255,.6)}
.fi:focus{box-shadow:0 0 0 4px rgba(255,255,255,.12)}
.fi::placeholder{color:rgba(255,255,255,.5)}
.cf{justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:999px;box-shadow:0 10px 28px rgba(0,0,0,.28)}
#pw{background:rgba(255,255,255,.14)}`,clean_app:e=>`
html body{justify-content:flex-start;padding:108px 20px 28px;overflow-x:hidden;overflow-y:auto}
.fhead{display:flex;position:fixed;top:0;left:0;right:0;height:54px;margin:0;padding:0 20px 0 max(52px,calc(50% - 218px));justify-content:flex-start;background:#fff;border-bottom:1px solid var(--bd);z-index:40}
.fhead b{font-size:15px}.fhead span{display:none}
#gb{top:9px;left:max(10px,calc(50% - 262px));font-size:0;gap:0;padding:8px;color:var(--tx)}#gb svg{width:20px;height:20px}
#pw{top:72px;left:max(20px,calc(50% - 270px));right:max(20px,calc(50% - 270px));height:6px;border-radius:99px;overflow:hidden;background:#eef0f2}#pf{border-radius:99px}
#sc{top:84px;right:max(20px,calc(50% - 270px));font-weight:700}
html body:has(#ss.active){padding-top:54px}body:has(#ss.active) #pw{display:none}
body .card{border:0;box-shadow:none;background:transparent;overflow:visible}
body${$} .card{padding:0;border-radius:0}
body .cn{display:none}
body${$} .ct{font-size:clamp(20px,5.2vw,23px)}
.cf{margin-top:16px}.cf .bb{display:none}
body .nb{flex:1 1 auto}
body .nb,body .sbt,body .dcta{border-radius:16px;box-shadow:0 10px 24px color-mix(in srgb,${e} 30%,transparent)}
#ss .card{min-height:calc(100vh - 82px);min-height:calc(100dvh - 82px);display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:26px}
#ss .stag{align-self:center}
#ss .tick{align-self:stretch;margin:-26px -20px 26px;border-radius:0}
#ss .cover-image{margin-bottom:22px}
body #ss .sbt{margin-top:auto;width:100%;justify-content:center}`,clean_graphite:e=>`
body .card{box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 0 1px color-mix(in srgb,${e} 14%,transparent)}
.cn,.stag{background:color-mix(in srgb,${e} 22%,transparent);color:color-mix(in srgb,${e} 55%,#ffffff)}
.fi::placeholder{color:var(--tx3)}`,clean_mono:()=>`
body .card{border:2px solid #111;box-shadow:7px 7px 0 #111}
body:not(.single-page) .card{border-radius:12px}
body:not(.single-page) .ct{font-size:clamp(23px,6vw,29px);font-weight:900;letter-spacing:-.03em}
.cn,.stag{background:#111;color:#fff;border-radius:4px;letter-spacing:.12em}
.fi,.ci{border:2px solid #111}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:8px}
.ci.ck{background:#111}.ci.ck span{color:#fff}
body .nb,body .sbt,body .dcta{border-radius:8px;box-shadow:4px 4px 0 #111}
body .nb:active,body .sbt:active{transform:translate(2px,2px);box-shadow:2px 2px 0 #111}`,clean_note:e=>`
body .card{border:0;box-shadow:0 10px 30px rgba(60,50,30,.1)}
body:not(.single-page) .card{border-radius:14px;padding-left:40px}
body .card::before{display:block;top:0;bottom:0;left:0;right:auto;width:7px;height:auto;background:${e}!important}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.14em}
.fi{border:0;border-bottom:2px solid var(--bd2)}
body:not(.single-page) .fi{border-radius:0;padding:14px 2px}
.fi:focus{box-shadow:none;border-bottom-color:${e}}
.ci{border:0;border-bottom:1px solid var(--bd)}
body:not(.single-page) .ci{border-radius:0;padding:16px 4px}
body:not(.single-page) .cg{gap:0}
.ci.ck{background:color-mix(in srgb,${e} 9%,transparent)}
body .nb,body .sbt,body .dcta{border-radius:10px;box-shadow:none}`,clean_rose:()=>"body .card{border:0;box-shadow:0 18px 46px rgba(170,90,120,.14)}body .nb,body .sbt,body .dcta{border-radius:999px}",clean_sage:()=>"body .card{border:0;box-shadow:0 18px 46px rgba(60,110,80,.13)}",clean_bubble:e=>`
body{background:color-mix(in srgb,${e} 9%,#f5f6fa)}
body .card{border:0;box-shadow:none}
body:not(.single-page) .card{padding:10px 4px}
body:not(.single-page) .ct{display:block;background:#fff;padding:18px 20px;border-radius:22px 22px 22px 6px;box-shadow:0 8px 24px rgba(20,30,60,.08);font-size:clamp(18px,4.6vw,21px);font-weight:700;margin-bottom:12px}
.cs{padding-left:6px}
.fi,.ci{border-color:transparent;box-shadow:0 4px 14px rgba(20,30,60,.06)}
body:not(.single-page) .ci{border-radius:999px;padding:15px 22px}
body:not(.single-page) .fi{border-radius:999px;padding:16px 24px}
.ci.ck{border-color:${e};background:#fff}
body .nb,body .sbt,body .dcta{border-radius:999px}`,clean_capsule:e=>`
body{background:color-mix(in srgb,${e} 10%,#ffffff)}
body .card{border:0;text-align:center;box-shadow:0 20px 50px color-mix(in srgb,${e} 16%,transparent)}
body:not(.single-page) .card{border-radius:40px}
.cn,.stag{align-self:center;margin-left:auto;margin-right:auto}
body:not(.single-page) .ci{border-radius:999px;padding:16px 22px;text-align:left}
body:not(.single-page) .fi{border-radius:999px;padding:16px 24px;text-align:center}
.cf{justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:999px}
body .nb{flex:1 1 auto}`,clean_pop:e=>{const o=C(e);return`
body{background:${o.c1}}
#gb,#sc{color:${o.text}}#pw{background:color-mix(in srgb,${o.text} 20%,transparent)}
body .card{border:3px solid #16161a;box-shadow:0 10px 0 #16161a}
body:not(.single-page) .card{border-radius:30px}
body:not(.single-page) .ct{font-weight:900;letter-spacing:-.03em}
.cn,.stag{background:#16161a;color:#fff}
.fi,.ci{border:2.5px solid #16161a}
.ci.ck{background:color-mix(in srgb,${e} 28%,#ffffff)}
.ci:hover:not(.qdisabled){border-color:#16161a}
body .nb,body .sbt,body .dcta{border:3px solid #16161a;border-radius:18px;box-shadow:0 5px 0 #16161a}
body .nb:active,body .sbt:active{transform:translateY(3px);box-shadow:0 2px 0 #16161a}`},clean_ticket:(e,o)=>`
body .card{border:0;box-shadow:0 14px 34px rgba(20,24,40,.1)}
body:not(.single-page) .card{border-radius:18px}
body .card::before{display:block;height:8px;background:${e}!important}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.2em;font-family:ui-monospace,Menlo,Consolas,monospace}
.cf{position:relative;border-top:2px dashed ${o[5]};padding-top:22px}
.cf::before,.cf::after{content:'';position:absolute;top:-13px;width:24px;height:24px;border-radius:50%;background:${o[0]}}
.cf::before{left:-44px}.cf::after{right:-44px}
@media(max-width:480px){.cf::before{left:-34px}.cf::after{right:-34px}}
body .nb,body .sbt,body .dcta{border-radius:10px}`,clean_neumo:()=>`
body .card{border:0;box-shadow:14px 14px 32px #c7ced8,-14px -14px 32px #ffffff}
.fi{border:0;box-shadow:inset 4px 4px 9px #ccd3dc,inset -4px -4px 9px #ffffff}
.fi:focus{box-shadow:inset 5px 5px 11px #c5ccd6,inset -5px -5px 11px #ffffff}
.ci{border:0;box-shadow:5px 5px 12px #cdd4dd,-5px -5px 12px #ffffff}
.ci:hover:not(.qdisabled){box-shadow:6px 6px 14px #c8cfd9,-6px -6px 14px #ffffff}
.ci.ck{background:#e8ecf1;box-shadow:inset 4px 4px 9px #ccd3dc,inset -4px -4px 9px #ffffff}
.cn,.stag{background:#e8ecf1;box-shadow:inset 2px 2px 5px #cfd6de,inset -2px -2px 5px #ffffff}
body .nb,body .sbt,body .dcta{box-shadow:6px 6px 14px #c4cbd5,-6px -6px 14px #ffffff}`,clean_line:e=>`
body .card{box-shadow:none}
body:not(.single-page) .card{border-radius:6px}
body:not(.single-page) .ct{display:block;font-weight:600;padding-bottom:14px;border-bottom:2px solid ${e}}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.18em}
.fi,.ci{border-width:1px}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:4px}
.ci span,.ci .oi{font-weight:500}
body:not(.single-page) .cb{border-radius:3px}
body .nb,body .sbt,body .dcta{border-radius:4px;box-shadow:none}`,clean_invert:()=>`
body .card{border:0;box-shadow:0 24px 60px rgba(20,24,40,.28)}
.cn,.stag{background:rgba(255,255,255,.1);color:#fff}
.ci.ck{background:rgba(255,255,255,.16)}
.fi::placeholder{color:var(--tx3)}`,clean_glass:e=>`
body::before,body::after{display:block!important;content:'';position:fixed;border-radius:50%;filter:blur(90px);z-index:0}
body::before{width:360px;height:360px;top:-90px;left:-80px;background:${e};opacity:.6}
body::after{width:320px;height:320px;bottom:-90px;right:-70px;background:color-mix(in srgb,${e} 45%,#ff5fa2);opacity:.5}
body .card{backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);box-shadow:0 20px 60px rgba(0,0,0,.3)}
.cn,.stag{background:rgba(255,255,255,.14);color:#fff}
.ci.ck{background:rgba(255,255,255,.24)}
.ci:hover:not(.qdisabled),.fi:focus{border-color:rgba(255,255,255,.6)}
.fi:focus{box-shadow:0 0 0 4px rgba(255,255,255,.12)}
.fi::placeholder{color:rgba(255,255,255,.5)}
#pw{background:rgba(255,255,255,.14)}`,clean_neon:e=>`
body .card{border-color:color-mix(in srgb,${e} 60%,transparent);box-shadow:0 0 0 1px color-mix(in srgb,${e} 40%,transparent),0 0 40px color-mix(in srgb,${e} 38%,transparent)}
.ct,.stit,.dt{text-shadow:0 0 22px color-mix(in srgb,${e} 60%,transparent)}
.cn,.stag{background:transparent;border:1px solid ${e};color:color-mix(in srgb,${e} 60%,#ffffff)}
.ci.ck{border-color:${e};background:color-mix(in srgb,${e} 14%,#0d0f15);box-shadow:0 0 18px color-mix(in srgb,${e} 40%,transparent)}
.fi:focus{box-shadow:0 0 0 3px color-mix(in srgb,${e} 30%,transparent),0 0 20px color-mix(in srgb,${e} 35%,transparent)}
body .nb,body .sbt,body .dcta{box-shadow:0 0 26px color-mix(in srgb,${e} 55%,transparent)}
.fi::placeholder{color:var(--tx3)}`,clean_sheet:e=>{const o=C(e);return`
body{background:${o.c1};justify-content:flex-end;padding:0;overflow-x:hidden;overflow-y:auto}
.wrap{max-width:560px;display:flex;flex-direction:column;min-height:100vh;justify-content:flex-end}
.fhead{display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin:0;padding:56px 26px 30px}
.fhead b{color:${o.text};font-size:clamp(24px,6.6vw,32px);letter-spacing:-.03em}
.fhead span{color:${o.text};opacity:.8;font-size:14px}
 18%,transparent);color:${o.text};box-shadow:none}
#gb,#sc{color:${o.text}}#pw{background:color-mix(in srgb,${o.text} 22%,transparent)}
body .card{border:0;box-shadow:0 -10px 40px rgba(0,0,0,.18)}
body:not(.single-page) .card{border-radius:30px 30px 0 0;padding:34px 26px 40px;min-height:52vh}
body:not(.single-page) .card::after{content:'';position:absolute;top:12px;left:50%;width:44px;height:5px;margin-left:-22px;border-radius:99px;background:var(--bd)}
body .nb{flex:1 1 auto}body .sbt{width:100%;justify-content:center}
@media(max-width:480px){body:not(.single-page) .card{border-radius:26px 26px 0 0}}`},clean_chip:e=>{const o=C(e);return`
body:not(.single-page) .cg{flex-direction:row;flex-wrap:wrap;gap:9px}
body:not(.single-page) .ci{flex:0 1 auto;border-radius:999px;padding:12px 18px;gap:0}
body:not(.single-page) .ci .cb{display:none}
.ci span,.ci .oi{flex:0 1 auto}
.ci.ck{background:${o.c1};border-color:${o.c1}}
.ci.ck span,.ci.ck .oi{color:${o.text}}
.ci .ot{flex:0 1 auto}.ci .od{display:none}
body .nb,body .sbt,body .dcta{border-radius:999px}`},clean_grid:e=>`
body:not(.single-page) .cg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
body:not(.single-page) .ci{flex-direction:column;align-items:flex-start;justify-content:space-between;min-height:104px;padding:16px;border-radius:20px;gap:12px}
.ci span,.ci .oi{flex:0 0 auto;width:100%}
.ci .ot{flex:0 0 auto;width:100%}
.ci.ck{border-color:${e};box-shadow:0 0 0 3px color-mix(in srgb,${e} 18%,transparent)}`,clean_stack:(e,o)=>`
body .card{border:1px solid var(--bd);box-shadow:8px 8px 0 -1px ${o[1]},8px 8px 0 0 var(--bd),16px 16px 0 -1px ${o[1]},16px 16px 0 0 var(--bd)}
body:not(.single-page) .card{border-radius:10px;margin-right:16px}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:8px}
.cn,.stag{border-radius:4px}
body .nb,body .sbt,body .dcta{border-radius:8px;box-shadow:none}`,clean_tab:(e,o)=>`
body .card{border:0;box-shadow:0 14px 36px rgba(20,24,40,.1);overflow:visible}
body:not(.single-page) .card{border-radius:0 22px 22px 22px;margin-top:38px}
body:not(.single-page) .cn{position:absolute;left:0;bottom:100%;margin:0;height:38px;align-items:center;padding:0 20px;border-radius:16px 16px 0 0;background:${o[1]};color:${e}}
.steps{margin-top:4px}`,clean_frame:e=>`
body .card{border:1px solid var(--bd2);box-shadow:none;text-align:center;outline:1px solid var(--bd);outline-offset:-10px}
body:not(.single-page) .card{border-radius:4px;padding:50px 36px 40px}
body:not(.single-page) .ct{font-weight:700;letter-spacing:0}
body:not(.single-page) .ct::after{content:'';display:block;width:36px;height:2px;margin:16px auto 0;background:${e}}
.cn,.stag{align-self:center;margin-left:auto;margin-right:auto;background:transparent;padding:0;border-radius:0;letter-spacing:.3em}
.fi{border:0;border-bottom:1px solid var(--bd2);text-align:center}
body:not(.single-page) .fi{border-radius:0}
.fi:focus{box-shadow:none;border-bottom-color:${e}}
.ci{text-align:left;border-width:1px}
body:not(.single-page) .ci{border-radius:2px}
.cf{justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:2px;box-shadow:none;letter-spacing:.06em}`};J.clean_landing=J.clean_app;R.clean_landing=(e,o)=>R.clean_app(e,o)+`
body:has(#ss.active) .fhead{display:none}
html body:has(#ss.active){padding-top:0}
#ss .card{padding-top:0;margin:0 -20px;padding-left:20px;padding-right:20px;background:#f1f2f4}
#ss .tick{order:-1;position:sticky;top:0;z-index:30;margin:0 -20px 34px}
#ss .stag{font-size:15px;letter-spacing:0;color:#fff!important;background:${e};border:2px solid #fff;border-radius:10px;padding:8px 16px;box-shadow:0 6px 16px color-mix(in srgb,${e} 35%,transparent)}
#ss .stag::before{display:none}
#ss .stit{font-family:'Gmarket Sans',sans-serif;font-size:clamp(46px,15.5vw,68px);font-weight:700;line-height:1.08;letter-spacing:-.04em;margin-bottom:14px;filter:drop-shadow(0 3px 0 #fff) drop-shadow(0 8px 12px rgba(0,0,0,.14))}
#ss .stit .t1:not(:only-of-type){font-size:.6em;color:${e};-webkit-text-fill-color:${e}}
#ss .cover-image{order:1;margin:18px 0 0}
#ss .card>.sbt,#ss .card>.sbt+div{display:none}
#ss .sfoot{order:1}
#ss .lsn{order:2;margin:0 -20px;padding:48px 20px;border-radius:0;background:#fff}
#ss .ls-lst{padding-bottom:0}#ss .ls-lst+.ls-lrv{padding-top:14px}
#ss .ls-lcd,#ss .ls-lfq{background:#f6f7f8}
html body:has(#lcta) #ss .card{padding-bottom:58px!important}#ss .ls-lend{background:#1b1c1f}#ss .ls-lft{background:#101113;margin-top:0;padding:28px 20px 34px}`;function Qe(e,o){var r;const n=J[e];return n?Ye(n,o)+(((r=R[e])==null?void 0:r.call(R,o,n))||""):null}const le={default:"Noto Sans KR",soft:"Gowun Dodum",cyber:"Gugi",serious:"Noto Serif KR",retro:"Do Hyeon",nature:"Gowun Batang",luxury:"Hahmlet",kawaii:"Jua",brutalist:"Black Han Sans",glass:"IBM Plex Sans KR",newspaper:"Nanum Myeongjo",midnight:"Song Myung",candy:"Sunflower",ink:"Yeon Sung",aurora:"Stylish",paper:"Nanum Pen Script",neon80s:"Do Hyeon",medical:"Gothic A1",forest:"Noto Serif KR",sunset:"Hi Melody",chalk:"Gaegu",ocean:"Gowun Batang",crypto:"Orbit",trading:"Nanum Gothic",defi:"IBM Plex Sans KR",bullrun:"Do Hyeon",bearish:"Noto Sans KR",bloomberg:"IBM Plex Sans KR",gold:"Nanum Myeongjo",matrix:"IBM Plex Sans KR"},Xe=new Set(["Noto Serif KR","Nanum Myeongjo","Gowun Batang","Hahmlet","Song Myung"]),We="'Noto Sans KR',sans-serif";function Je(e,o){if(o&&o!==We)return o;const n=le[e]||le.default;return`'${n}',${Xe.has(n)?"serif":"sans-serif"}`}function Ze(e){var i;const o=((i=e.match(/['"]([^'"]+)['"]/))==null?void 0:i[1])||"Noto Sans KR",n={Sunflower:":wght@300;500;700","Noto Serif KR":":wght@400;500;600;700","Nanum Myeongjo":":wght@400;700","Nanum Gothic":":wght@400;700;800","Gowun Batang":":wght@400;700","IBM Plex Sans KR":":wght@400;500;600;700",Gaegu:":wght@300;400;700",Hahmlet:":wght@400;500;600;700","Gothic A1":":wght@400;500;600;700"};return`https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700${o==="Noto Sans KR"?"":`&family=${encodeURIComponent(o).replace(/%20/g,"+")}${n[o]||""}`}&display=swap`}const gt=xe.filter(e=>!e.hidden),Ve={soft:"clean_pastel",candy:"clean_pastel",kawaii:"clean_rose",sunset:"clean_warm",paper:"clean_note",newspaper:"clean_note",medical:"clean_white",serious:"clean_mono",brutalist:"clean_mono",ink:"clean_mono",nature:"clean_sage",forest:"clean_sage",ocean:"clean_band"};function ue(e){return xe.some(o=>o.id===e)?e:Ve[e]||"clean_graphite"}const xt=[{label:"Noto Sans KR",value:"'Noto Sans KR',sans-serif",preview:"가나다"},{label:"Gmarket Sans",value:"'Gmarket Sans',sans-serif",preview:"가나다"},{label:"IBM Plex Sans KR",value:"'IBM Plex Sans KR',sans-serif",preview:"가나다"},{label:"Nanum Gothic",value:"'Nanum Gothic',sans-serif",preview:"가나다"},{label:"Nanum Barun Gothic",value:"'Nanum Barun Gothic',sans-serif",preview:"가나다"},{label:"KoPub Batang",value:"'KoPub Batang',serif",preview:"가나다"},{label:"Nanum Myeongjo",value:"'Nanum Myeongjo',serif",preview:"가나다"},{label:"Noto Serif KR",value:"'Noto Serif KR',serif",preview:"가나다"},{label:"Gowun Batang",value:"'Gowun Batang',serif",preview:"가나다"},{label:"Black Han Sans",value:"'Black Han Sans',sans-serif",preview:"가나다"},{label:"Gowun Dodum",value:"'Gowun Dodum',sans-serif",preview:"가나다"},{label:"Do Hyeon",value:"'Do Hyeon',sans-serif",preview:"가나다"},{label:"Jua",value:"'Jua',sans-serif",preview:"가나다"},{label:"Sunflower",value:"'Sunflower',sans-serif",preview:"가나다"},{label:"Dokdo",value:"'Dokdo',cursive",preview:"가나다"},{label:"Single Day",value:"'Single Day',cursive",preview:"가나다"},{label:"Gaegu",value:"'Gaegu',cursive",preview:"가나다"},{label:"Hi Melody",value:"'Hi Melody',cursive",preview:"가나다"},{label:"Cute Font",value:"'Cute Font',cursive",preview:"가나다"},{label:"Stylish",value:"'Stylish',sans-serif",preview:"가나다"},{label:"East Sea Dokdo",value:"'East Sea Dokdo',cursive",preview:"가나다"},{label:"Nanum Pen Script",value:"'Nanum Pen Script',cursive",preview:"가나다"},{label:"Nanum Brush Script",value:"'Nanum Brush Script',cursive",preview:"가나다"},{label:"Montserrat",value:"'Montserrat',sans-serif",preview:"Aa가나"},{label:"Playfair Display",value:"'Playfair Display',serif",preview:"Aa가나"},{label:"Space Grotesk",value:"'Space Grotesk',sans-serif",preview:"Aa가나"},{label:"DM Sans",value:"'DM Sans',sans-serif",preview:"Aa가나"}];function et(e,o,n,r){return Qe(ue(e),o)}function tt(e,o,n){var l;const r=[],i=new Set;let p=0;for(;p>=0&&p<e&&!i.has(p);){r.push(p),i.add(p);const g=(l=o[p])==null?void 0:l[n[p]];if(g==="done")break;const m=Number(g);p=g!=null&&Number.isInteger(m)&&m>=0&&m<e?m:p+1}return r}const ot=`
body.single-page{display:block;overflow-x:hidden;overflow-y:auto;padding:32px 16px 64px}
.single-page *{letter-spacing:0!important}
.single-page .wrap{max-width:720px;margin:0 auto}
.single-page #pw,.single-page #sc,.single-page #gb,.single-page #kh{display:none!important}
.single-page .single-sheet{border-radius:8px;padding:32px;overflow:visible}
.single-page .single-sheet::before{display:none}
.single-page .single-header{padding-bottom:24px;border-bottom:1px solid var(--bd)}
.single-page .single-title{font-family:inherit;font-size:28px;font-weight:700;line-height:1.4;color:var(--tx);white-space:pre-line;overflow-wrap:anywhere}
.single-page .single-desc{margin:12px 0 0;color:var(--tx2);line-height:1.7;font-size:14px;white-space:pre-line;overflow-wrap:anywhere}
.single-page .single-cover{display:block;width:100%;max-height:280px;object-fit:cover;border-radius:6px;margin-bottom:24px}
.single-page .single-question{padding:26px 0;border-bottom:1px solid var(--bd);scroll-margin-top:24px;min-width:0}
.single-page .single-question[hidden]{display:none}
.single-page .ct{display:block;font-size:16px;font-weight:600;line-height:1.55;overflow-wrap:anywhere}
.single-page .question-heading{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px;margin-bottom:8px}
.single-page .question-heading .ct{min-width:0;margin:0}
.single-page .required{font-size:11px;font-weight:500;color:var(--tx2);white-space:nowrap}
.single-page .cs{font-size:13px;margin:6px 0 14px;white-space:pre-line;overflow-wrap:anywhere}
.single-page .question-image{display:block;width:100%;max-height:240px;object-fit:contain;margin:0 0 18px;border-radius:6px}
.single-page .fi,.single-page .ci,.single-page .ls,.single-page .qfb{border-radius:6px}
.single-page .fi{padding:12px 14px;min-height:48px}
.single-page .ci{position:relative;padding:12px 14px;min-height:48px;transform:none!important;box-shadow:none!important}
.single-page .ci span,.single-page .oi{min-width:0;overflow-wrap:anywhere}
.single-page .cb.rb{border-radius:50%!important}
.single-page .ci:focus-within,.single-page .la:focus-within{outline:2px solid var(--c1);outline-offset:3px}
.single-page .native-choice{position:absolute;width:1px;height:1px;opacity:0}
.single-page .la{position:relative;min-height:44px}
.single-page .single-footer{padding-top:28px}
.single-page .single-submit{width:100%;min-width:0;min-height:50px;border-radius:6px;white-space:normal;overflow-wrap:anywhere}
.single-page .single-submit .nl{min-width:0}
.single-page .done-card{border-radius:8px;overflow-wrap:anywhere}
.single-page .dt{font-size:24px}
.single-page #tst{max-width:calc(100% - 32px);white-space:normal}
@media(max-width:480px){body.single-page{padding:16px 12px 40px}.single-page .single-sheet{padding:24px 20px}.single-page .single-title{font-size:24px}.single-page .single-question{padding:22px 0}}
`,at=`
function singlePath(){
  return responsePath();
}
function updateSinglePath(){
  const visible=new Set(singlePath());
  QS.forEach((q,i)=>{document.getElementById('sl'+i).hidden=!visible.has(i);});
}
function singleEnter(event){
  if(event.key!=='Enter'||event.isComposing||event.keyCode===229)return;
  const target=event.target;
  if(target.tagName!=='INPUT'||target.type==='radio'||target.type==='checkbox')return;
  event.preventDefault();
  const fields=[...document.querySelectorAll('#single-form input,#single-form textarea,#single-form button')].filter(el=>!el.disabled&&!el.closest('[hidden]'));
  const next=fields[fields.indexOf(target)+1];
  if(next)next.focus();
}
function submitSingle(){
  if(submitted)return;
  Object.keys(ans).forEach(key=>delete ans[key]);
  const path=singlePath();
  for(const i of path){
    if(!vld(i)){
      const section=document.getElementById('sl'+i);
      section.scrollIntoView({behavior:'smooth',block:'center'});
      const field=section.querySelector('input,textarea,button');
      if(field){field.setAttribute('aria-invalid','true');field.focus({preventScroll:true});}
      return;
    }
  }
  qzScore=0;qzTotal=0;
  for(const i of path){
    if(QS[i].type!=='quiz')continue;
    const selected=document.querySelector('#g'+QS[i].id+' .ci.ck');
    if(!selected)continue;
    const ok=Number(selected.dataset.oi)===QUIZ[i].correct;
    qzTotal++;if(ok)qzScore++;
    ans[ANSWER_KEYS[i]]=(ok?'✅정답':'❌오답')+'(선택:'+selected.querySelector('span').textContent+')';
  }
  finishForm();
}
document.getElementById('single-form').addEventListener('keydown',singleEnter);
document.getElementById('single-form').addEventListener('input',event=>event.target.removeAttribute('aria-invalid'));
window.addEventListener('message',event=>{
  if(event.source!==window.parent||!WAIT_FOR_SUBMIT||!submitted)return;
  if(event.data?.type==='SUBMIT_SUCCESS'&&cur<TOTAL){completeForm();return;}
  if(event.data?.type==='SUBMIT_ERROR'&&cur<TOTAL){
    submitted=false;
    setSubmissionBusy(false);
    tst(event.data.message||'저장하지 못했습니다. 다시 제출해주세요.','fail');
  }
});
updateSinglePath();
`,nt=`
body{min-height:100svh;overflow-y:auto;padding-top:48px;padding-bottom:48px}
.wrap{max-width:600px}
.card{padding:40px 36px 32px}
.cn,.ct,.stit,.stag,.nb,.sbt,.ci span{letter-spacing:0}
.ct,.stit{overflow-wrap:anywhere;word-break:keep-all}
.cn{display:flex;align-items:center;gap:14px;margin-bottom:22px;font-size:11px}
.cn::after{content:'';height:1px;width:36px;background:currentColor;opacity:.45}
.ct{font-size:26px;font-weight:700;line-height:1.5;margin-bottom:14px}
.stit{font-size:38px;line-height:1.35;margin-bottom:18px;font-weight:700}
.cs,.sdesc{font-weight:400;line-height:1.85;word-break:keep-all;overflow-wrap:anywhere}
.cs{margin-bottom:28px;font-size:14px}.sdesc{font-size:15px;margin-bottom:32px}
.fi{min-height:58px;line-height:1.5;padding-top:17px;padding-bottom:17px}
.cg{gap:12px}.ci{min-height:62px;padding:17px 20px;gap:16px}
.ci span{font-size:15px;line-height:1.6;min-width:0;overflow-wrap:anywhere}
.cb,.ld{flex-shrink:0}.la{align-items:flex-start;padding-top:12px;padding-bottom:12px}.la .ld{margin-top:1px}
.la span{font-size:14px;line-height:1.75;overflow-wrap:anywhere}
.ls{padding:18px 20px;line-height:1.85;max-height:180px}
.cf{gap:18px;margin-top:32px;padding-top:24px;border-top:1px solid var(--bd);justify-content:space-between}
.cf>.nb:only-child{margin-left:auto}
.nb,.sbt{min-height:56px;max-width:100%;white-space:normal;font-weight:600}
.nb svg,.sbt svg{flex-shrink:0}.nb span,.sbt span{overflow-wrap:anywhere}
#ss .card{padding-bottom:28px}
#ss .stag{margin-bottom:18px}
#ss .sbt{width:100%;justify-content:space-between;padding-left:22px;padding-right:22px;font-size:15px}
#ss .sbt+div{margin-top:18px!important;text-align:center;font-size:11px!important}
.done-card{padding:48px 36px 40px}.dd{font-weight:400}.done-card .dt{line-height:1.4}
button:focus-visible,a:focus-visible,.oi:focus-visible{outline:2px solid var(--c1);outline-offset:4px}
body:not(.single-page) .question-image{width:calc(100% + 72px);margin:-40px -36px 30px;object-fit:cover;border-radius:inherit;display:block;border-bottom-left-radius:0;border-bottom-right-radius:0;height:200px}
body:not(.single-page) .cover-image{width:100%;height:auto;aspect-ratio:16/9;max-height:280px;margin:0 0 28px;object-fit:cover;border-radius:8px;display:block}
.single-page .wrap{max-width:720px}
.single-page .single-sheet{overflow:visible;padding:40px}
.single-page .single-header{padding-bottom:32px}
.single-page .single-title{font-size:32px;line-height:1.45;overflow-wrap:anywhere;word-break:keep-all}
.single-page .single-desc{font-size:15px;line-height:1.85;margin-top:16px}
.single-page .single-cover{margin-bottom:28px;max-height:320px}
.single-page .single-question{padding:30px 0}
.single-page .single-question .ct{font-size:18px;font-weight:600}
.single-page .single-question .cs{text-align:left;font-size:14px}
.single-page .single-footer{padding-top:32px}
@media(max-width:480px){
  body{padding:44px 16px 40px}
  .card{padding:28px 24px 24px}
  .ct{font-size:22px}.stit{font-size:30px}.cs,.sdesc{font-size:14px}
  .cn{margin-bottom:18px}.cg{gap:10px}.ci{padding:16px;min-height:60px;gap:13px}
  .cf{gap:12px;padding-top:20px;margin-top:28px}.nb{padding-left:22px;padding-right:22px}
  body:not(.single-page) .question-image{width:calc(100% + 48px);margin:-28px -24px 26px}
  body:not(.single-page) .cover-image{margin-bottom:24px;aspect-ratio:4/3}
  .single-page .single-sheet{padding:28px 22px}.single-page .single-title{font-size:27px}
  .single-page .single-question{padding:26px 0}.single-page .single-question .ct{font-size:17px}
}
`,rt=`
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
`,it=`
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
`;function st(e){return e==="ocean"?rt:e==="glass"?it:""}const ce=e=>(typeof e=="string"||Number.isSafeInteger(e))&&/^[a-zA-Z0-9_-]+$/.test(String(e));function ut(e){const o=new Set(e.map(r=>String(r.id)));let n=1;for(;o.has(`q_${n}`);)n++;return`q_${n}`}function dt(e=[],o={}){const n=new Set(e.filter(l=>ce(l.id)).map(l=>String(l.id))),r=new Set,i={...o};return{questions:e.map((l,g)=>{const m=String(l.id);if(ce(l.id)&&!r.has(m))return r.add(m),l;let y=g+1;for(;n.has(`q_${y}`)||r.has(`q_${y}`);)y++;const v=`q_${y}`;return r.add(v),Object.hasOwn(o,m)&&(i[v]=o[m]),{...l,id:v}}),qImgData:i}}function mt(e,o){const n=new Map(o.map((r,i)=>[String(r.id),i]));return o.map(r=>r.branches?{...r,branches:r.branches.flatMap(i=>{if(i.targetIdx==="done")return[{...i}];const p=e[i.targetIdx],l=p&&n.get(String(p.id));return l==null?[]:[{...i,targetIdx:l}]})}:r)}function ht(e,o){if(!e.options||e.options.length<=1||o<0||o>=e.options.length)return e;const n={...e,options:e.options.filter((r,i)=>i!==o)};return e.optionMeta&&(n.optionMeta=e.optionMeta.filter((r,i)=>i!==o)),e.correctAnswer!=null&&(n.correctAnswer=e.correctAnswer===o?0:e.correctAnswer-(e.correctAnswer>o?1:0)),e.branches&&(n.branches=e.branches.filter(r=>r.optionIdx!==o).map(r=>({...r,optionIdx:r.optionIdx-(r.optionIdx>o?1:0)}))),n}const lt={phone:"전화번호",email:"이메일",legal:"동의"},pe=["_ts","_formTitle","__proto__","constructor","prototype"];function ct(e){const o=e.map((i,p)=>i.type==="quiz"?`Q${p+1}_답`:i.label||lt[i.type]||`q${p}`),n=new Set(pe),r=new Set([...o,...pe]);return o.map((i,p)=>{let l=i,g=p+1;if(n.has(l))do l=`${i} (Q${g++})`;while(n.has(l)||r.has(l));return n.add(l),l})}const W=e=>/^#[0-9a-f]{6}$/i.test(e||"")?e:"",be={square:6,round:16,pill:999},fe={left:["left","0","auto"],center:["center","auto","auto"],right:["right","auto","0"]},ge=e=>(parseInt(e.slice(1,3),16)*299+parseInt(e.slice(3,5),16)*587+parseInt(e.slice(5,7),16)*114)/255e3>.6,yt={header:!0,steps:"dots",stepLabel:!0,topBar:!0,align:"top",bg:"#fdf6e9",card:"#ffffff",radius:28,btnShape:"round",btnWide:!0,size:"lg"},vt={ticker:"무료 자료 신청 접수 중",landStats:`*신청부터 받기까지*
이렇게 간단해요
30초 | 신청 시간
0원 | 비용
한 번 | 안내 연락`,landReviews:`김** | 자료 받은 분 | 여기에 실제로 받은 후기를 적어 주세요. 지어낸 후기는 넣지 않습니다. | 5
*후기 아래 작은 안내 문구`,landCards:`^신청은 30초면 끝나요
지금 신청하면
*무료 자료*를 보내드려요
시계 | 신청 30초
선물 | 비용 무료
전화 | 안내 한 번
! 신청하신 분께만 보내드려요
*자료는 남겨 주신 연락처로 안내됩니다`,landChecks:`이런 분께 드려요
처음이라 막막하신 분 | 순서대로 따라 할 수 있게 정리했어요
시간이 없으신 분 | 핵심만 골라 담았어요
혼자 결정하기 어려우신 분 | 판단 기준을 함께 드려요`,landFaq:`자주 묻는 질문
정말 무료인가요? | 네, 신청만 하시면 비용 없이 보내드립니다.
자료는 어떻게 받나요? | 신청서에 남겨 주신 연락처로 안내드립니다.
신청 후 연락이 오나요? | 자료 안내를 위해 한 번 연락드릴 수 있습니다.`,landEnd:`^오늘의 30초가 내일의 판단을 바꿉니다
지금 바로
자료를 받아 보세요
! 신청은 무료입니다`,landFooter:`상호명을 적어 주세요
주소 · 사업자등록번호 · 대표번호`};function pt(e={}){const o=[],n=W(e.bg),r=W(e.card),i=W(e.titleColor);if(e.header!=null&&o.push(`body .fhead{display:${e.header?"flex":"none"}}`),e.steps==="dots"&&o.push("body .steps{display:flex}#pw{display:none}#sc{display:none}"),e.steps==="bar"&&o.push("body .steps{display:none}#pw{display:block}"),e.steps==="none"&&o.push("body .steps{display:none}#pw{display:none}#sc{display:none}"),e.stepLabel!=null&&o.push(`body .cn{display:${e.stepLabel?"inline-flex":"none"}}`),e.topBar!=null&&o.push(`body .card::before{display:${e.topBar?"block":"none"}!important;height:5px}`),e.align==="top"&&o.push("body{justify-content:flex-start;padding-top:30px;overflow-x:hidden;overflow-y:auto}"),e.align==="center"&&o.push("body{justify-content:center}"),n&&o.push(`body{background:${n}!important}body::before,body::after{display:none!important}`),n&&o.push(ge(n)?"body .fhead b{color:#2b2622}body .fhead span,#gb,#sc,#kh{color:#7d746a}":"body .fhead b{color:#f3f4f6}body .fhead span,#gb,#sc,#kh{color:#b6bcc6}"),r&&o.push(`body .card{background:${r}!important}`+(ge(r)?":root{--tx:#2b2622;--tx2:#6f665c;--tx3:#8c8276;--bd:rgba(60,45,20,.14);--bd2:rgba(60,45,20,.3);--bg2:#fff;--ls-bg:rgba(60,45,20,.04)}":":root{--tx:#f3f4f6;--tx2:#c3c8d0;--tx3:#9aa1ad;--bd:rgba(255,255,255,.14);--bd2:rgba(255,255,255,.3);--bg2:rgba(255,255,255,.06);--ls-bg:rgba(255,255,255,.04)}")+"body .card,body .ct,body .stit,body .dt{color:var(--tx)!important;-webkit-text-fill-color:var(--tx)!important}body .ct,body .stit,body .dt{background:none!important;text-shadow:none!important}body .fi,body .ci{background:var(--bg2)!important;color:var(--tx)!important;border-color:var(--bd)!important}body .ci span,body .ci .oi{color:var(--tx)!important}body .cs,body .sdesc,body .dd,body .ls{color:var(--tx2)!important}"),i&&o.push(`body .ct,body .stit,body .dt{color:${i}!important;-webkit-text-fill-color:${i}!important;background:none!important}`),Number.isFinite(e.radius)){const p=Math.min(40,Math.max(0,Math.round(e.radius)));o.push(`body .card{border-radius:${p}px!important}body .fi,body .ci,body .ls{border-radius:${Math.round(p*.6)}px!important}`)}if(fe[e.textAlign]){const[p,l,g]=fe[e.textAlign];o.push(`body .card{text-align:${p}}body .cn,body .stag{margin-left:${l};margin-right:${g};align-self:auto}body .fi{text-align:${p}}body .steps{justify-content:${e.textAlign==="center"?"center":e.textAlign==="right"?"flex-end":"flex-start"}}body .ct::after{margin-left:${l};margin-right:${g}}`)}return e.optAlign==="left"&&o.push("body .ci{justify-content:flex-start;text-align:left}"),e.optAlign==="center"&&o.push("body .ci{justify-content:center;text-align:center}body .ci span,body .ci .ot{flex:0 1 auto}body .ot{justify-content:center}"),e.optAlign==="right"&&o.push("body .ci{justify-content:flex-end;text-align:right}body .ci span,body .ci .ot{flex:0 1 auto}body .ot{justify-content:flex-end}"),e.btnAlign==="left"&&o.push("body .cf{justify-content:flex-start}body .cf .nb{flex:0 1 auto;order:-1}body .cf .bb{margin-left:auto}body .sbt{width:auto}"),e.btnAlign==="center"&&o.push("body .cf{justify-content:center}body .cf .nb{flex:0 1 auto}body .sbt{width:auto}"),e.btnAlign==="right"&&o.push("body .cf{justify-content:space-between}body .cf .nb{flex:0 1 auto;margin-left:auto}body .sbt{width:auto}"),be[e.btnShape]!=null&&o.push(`body .nb,body .sbt,body .dcta,body.single-page .single-submit{border-radius:${be[e.btnShape]}px!important}`),e.btnWide!=null&&o.push(e.btnWide?"body .nb{flex:1}body .sbt{width:100%;justify-content:center}":"body .nb{flex:0 1 auto}body .sbt{width:auto}"),e.size==="lg"&&o.push("body .ct{font-size:clamp(22px,5.6vw,27px)!important;line-height:1.35}body .cs,body .sdesc{font-size:15px}body .fi{font-size:17px;padding:17px 18px}body .ci{padding:19px 18px;gap:15px}body .ci span,body .ci .oi{font-size:16px;font-weight:600}body .cb{width:26px;height:26px}body .nb,body .sbt{font-size:17px;padding:18px 28px}body .od{font-size:14px}"),o.join(`
`)}function s(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function S(e){return String(e||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/</g,"\\u003c").replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}const N=e=>JSON.stringify(e).replace(/</g,"\\u003c");function wt(e,o,n,r={},i={}){const{animType:p=0,fontFamily:l="'Noto Sans KR',sans-serif",conceptTheme:g="default",useStart:m=!0,bgBlur:y=0,bgOverlay:v=.5,bgOverlayColor:B="#000000",allowBack:q=!0,autoNext:j=!1,useConfetti:I=!0,useKb:E=!0,layout:O="steps",submitBtnText:me="제출하기",waitForSubmit:he=!1,startTag:ye="✦ Form",startBtnText:Y="시작하기",startDesc:P="",doneTitle:ve="제출 완료!",doneDesc:we="응답해주셔서 감사합니다 🎉",doneCta:Z="",doneUrl:G="",donePdfUrl:ke="",look:w={},scriptUrl:$e="https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec"}=r,_=ue(g),h=O==="single",M=E&&!h,Se=ke||(/\.pdf(\?|#|$)/i.test(G)?G:""),D=Object.hasOwn(i,"coverImgData")?i.coverImgData:r.coverImgData??null,V=dt(o,i.qImgData??r.qImgData??{});o=V.questions;const K=V.qImgData,Q=ct(o),U=Object.hasOwn(i,"bgImgData")?i.bgImgData:r.bgImgData??null,z=o.length,ze=t=>/hot|인기/i.test(t)?"hot":/event|이벤트/i.test(t)?"event":/추천|best/i.test(t)?"pick":/free|무료/i.test(t)?"free":"new",ee=(t,a,d)=>{var f;const c=t.optionDetail?((f=t.optionMeta)==null?void 0:f[d])||{}:{};return!c.desc&&!c.badge?`<span>${s(a)}</span>`:`<div class="ot"><span>${s(a)}</span>${c.badge?`<em class="ob ob-${ze(c.badge)}">${s(c.badge)}</em>`:""}${c.desc?`<small class="od">${s(c.desc)}</small>`:""}</div>`};if(!z)return'<html><body style="background:#f7f8fa;color:#8c8f96;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px">질문을 추가해주세요.</body></html>';const te=o.some(t=>t.type==="quiz"),Ie=N(o.reduce((t,a,d)=>(a.type==="quiz"&&(t[d]={correct:a.correctAnswer??0,explanation:a.explanation||""}),t),{})),Ee=N(o.reduce((t,a,d)=>{var c;if((a.type==="single"||a.type==="quiz")&&((c=a.branches)!=null&&c.length)){const f={};a.branches.forEach(u=>{u.targetIdx!=null&&(f[u.optionIdx]=u.targetIdx)}),Object.keys(f).length&&(t[d]=f)}return t},{}));N(o.map(t=>t.id));const _e=et(_,n.c1,n.c2),Te=st(_),oe=_.startsWith("clean_"),H=C(n.c1,oe?n.c1:n.c2),F=H.text,ae=oe?H.c1:`linear-gradient(${_==="ocean"?110:_==="glass"?115:135}deg,${H.c1},${H.c2})`,Be=Ze(Je(_,l)),qe=["@keyframes siU{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-8px)}}@keyframes siD{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}@keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(8px)}}.en{animation:siU .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:soU .22s ease both}.ep{animation:siD .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:soD .22s ease both}","@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}@keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}}.en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fdo .28s ease both}","@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}}.en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fxOut .28s ease both}","@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyInR{from{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}}@keyframes fyOutR{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}}.en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both}.ep{animation:fyInR .42s cubic-bezier(.22,1,.36,1) both}.xp{animation:fyOutR .28s ease both}","@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}@keyframes ziOut{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.2)}}.en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both}.ex,.xp{animation:ziOut .28s ease both}","@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}@keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}}@keyframes slInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}@keyframes slOutR{from{opacity:1}to{opacity:0;transform:translateX(60px)}}.en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both}.ep{animation:slInR .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:slOutR .28s ease both}","@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}80%{transform:translateY(4px)}100%{opacity:1;transform:none}}@keyframes bnOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(.95)}}.en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:bnOut .28s ease both}","@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}}@keyframes rzOut{from{opacity:1}to{opacity:0;transform:rotate(8deg) scale(.85)}}.en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:rzOut .28s ease both}","@keyframes glIn{0%{opacity:0;transform:translateX(-4px) skewX(3deg)}20%{transform:translateX(3px) skewX(-2deg)}40%{transform:translateX(-2px) skewX(1deg)}100%{opacity:1;transform:none}}@keyframes glOut{0%{opacity:1}50%{transform:translateX(4px) skewX(-3deg)}100%{opacity:0;transform:translateX(-4px)}}.en,.ep{animation:glIn .45s ease both}.ex,.xp{animation:glOut .28s ease both}","@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6);transform-origin:top}to{opacity:1;transform:none}}@keyframes ufOut{from{opacity:1}to{opacity:0;transform:translateY(30px) scaleY(.6);transform-origin:bottom}}.en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:ufOut .28s ease both}"][p]||"",je=o.map((t,a)=>{const d=K[t.id]&&h?`<img class="question-image" src="${s(K[t.id])}" loading="lazy" decoding="async" alt="">`:K[t.id]?`<img class="question-image" src="${K[t.id]}" loading="lazy" decoding="async" alt="">`:"";let c="";if(t.type==="short")c=`<input type="text" class="fi" id="f${t.id}" placeholder="${s(t.placeholder||"답변을 입력하세요...")}">`;else if(t.type==="long")c=`<textarea class="fi" id="f${t.id}" style="height:110px;resize:none;padding-top:13px;line-height:1.6" placeholder="${s(t.placeholder||"답변을 입력하세요...")}"></textarea>`;else if(t.type==="phone")c=`<div style="position:relative"><div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none">🇰🇷 +82</div><input type="tel" class="fi" id="f${t.id}" style="padding-left:72px" placeholder="010-0000-0000" inputmode="tel"></div>`;else if(t.type==="email")c=`<input type="email" class="fi" id="f${t.id}" placeholder="example@email.com" inputmode="email">`;else if(t.type==="multiple"){const x=(t.options||[]).map((k,L)=>`<div class="ci" onclick="pick(this,'g${t.id}',true)"><div class="cb"></div>${ee(t,k,L)}</div>`).join(""),b=t.other?`<div class="ci" onclick="pickOther(this,'g${t.id}',true)"><div class="cb"></div><input class="oi" placeholder="기타..." id="oi${t.id}" onclick="event.stopPropagation()"></div>`:"";c=`<div class="cg" id="g${t.id}">${x}${b}</div>`}else if(t.type==="single"){const x=(t.options||[]).map((k,L)=>`<div class="ci si" data-oi="${L}" onclick="pick(this,'g${t.id}',false)"><div class="cb rb"></div>${ee(t,k,L)}</div>`).join(""),b=t.other?`<div class="ci si" onclick="pickOther(this,'g${t.id}',false)"><div class="cb rb"></div><input class="oi" placeholder="기타..." id="oi${t.id}" onclick="event.stopPropagation()"></div>`:"";c=`<div class="cg" id="g${t.id}">${x}${b}</div>`}else if(t.type==="quiz"){const x=(t.options||[]).map((b,k)=>`<div class="ci si qo" data-oi="${k}" onclick="pickQuiz(this,'g${t.id}',${a})"><div class="cb rb"></div><span>${s(b)}</span></div>`).join("");c=`<div class="cg" id="g${t.id}">${x}</div><div class="qfb" id="qfb${a}" style="display:none"></div>`}else t.type==="legal"&&(c=`<div class="ls">${s(t.legalText||"").replace(/\n/g,"<br>")}</div><div class="la" id="la${t.id}" onclick="this.classList.toggle('ck')"><div class="ld"></div><span style="font-size:13px;color:var(--tx2);font-weight:300"><strong style="color:var(--tx);font-weight:500">위 내용에 동의합니다.</strong></span></div>`);if(h){if(["single","multiple","quiz"].includes(t.type)){const x=t.type==="multiple",b=x?"checkbox":"radio",k=(t.options||[]).map((De,Ke)=>`<label class="ci${x?"":" si"}" data-oi="${Ke}"><input class="native-choice" type="${b}" name="g${t.id}" onchange="pick(this.parentElement,'g${t.id}',${x})"><div class="cb${x?"":" rb"}"></div><span>${s(De)}</span></label>`).join(""),L=t.other&&t.type!=="quiz"?`<label class="ci${x?"":" si"}"><input class="native-choice" type="${b}" name="g${t.id}" aria-label="기타" onchange="if(${x}&&!this.checked)pick(this.parentElement,'g${t.id}',true);else pickOther(this.parentElement,'g${t.id}',${x})"><div class="cb${x?"":" rb"}"></div><input class="oi" placeholder="기타..." aria-label="기타 답변" id="oi${t.id}" onfocus="pickOther(this.parentElement,'g${t.id}',${x})"></label>`:"";c=`<div class="cg" id="g${t.id}" role="group" aria-labelledby="label${t.id}">${k}${L}</div>`}else t.type==="legal"&&(c=`<div class="ls">${s(t.legalText||"").replace(/\n/g,"<br>")}</div><label class="la" id="la${t.id}"><input class="native-choice" type="checkbox" onchange="this.parentElement.classList.toggle('ck',this.checked)"><div class="ld"></div><span>위 내용에 동의합니다.</span></label>`);return c=c.replace(/ onkeydown="[^"]*"/g,"").replace(/class="fi"/g,`class="fi" aria-labelledby="label${t.id}" aria-describedby="hint${t.id} e${a}" aria-required="${!!t.required}"`),`<section class="single-question" id="sl${a}" aria-labelledby="label${t.id}">
        ${d}<div class="question-heading"><label class="ct" id="label${t.id}" for="f${t.id}">${s(t.label||"질문")}</label><span class="required">${t.required?"필수":"선택"}</span></div>
        <div class="cs" id="hint${t.id}"${t.hint?"":" hidden"}>${s(t.hint||"")}</div>
        ${c}<div class="em" id="e${a}" role="alert"></div>
      </section>`}const f=a===z-1,u=q?`<button class="bb" onclick="gp(${a})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>`:"<span></span>",T=t.type==="quiz"?`<button class="nb" id="qcb${a}" onclick="quizCheck(${a})"><span class="nl">정답 확인</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
<button class="nb" id="qnb${a}" onclick="gn(${a})" style="display:none"><span class="nl">${f?"결과 보기 🎉":"다음 질문"}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`:`<button class="nb" onclick="${f?"sub()":"gn("+a+")"}"${f?' id="sb"':""}><span class="sp"></span><span class="nl">${f?"신청 완료하기 🎉":"다음 질문"}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`;return`<div class="sl" id="sl${a}" style="display:none">
  <div class="card">${d}
    ${z<=8?`<div class="steps" style="--n:${z}">${o.map((x,b)=>`<i${b<a?' class="dn"':b===a?' class="on"':""}>${b+1}</i>`).join("")}</div>`:""}
    <div class="cn">STEP ${String(a+1).padStart(2,"0")} / ${String(z).padStart(2,"0")}</div>
    <div class="ct">${s(t.label||"질문")}</div>
    ${t.hint?`<div class="cs">${s(t.hint)}</div>`:""}
    <div style="margin-top:6px">${c}</div>
    <div class="em" id="e${a}"></div>
    <div class="cf">${u}${T}</div>
  </div>
</div>`}).join(""),Ae=o.map((t,a)=>{const d={...t,label:Q[a]};if(d.type==="short"||d.type==="long"){const c=["이름","성함","성명","닉네임","name"].some(u=>String(d.label||"").toLowerCase().includes(u.toLowerCase())),f=Ue(t);return`case ${a}:{const v=document.getElementById('f${d.id}')?.value.trim()||'';${d.required?`if(!v){er(${a},'답변을 입력해주세요.');return false;}`:""}${c?`if(v){const nv=v.replace(/[s._-·•・,，。!@#$%^&*+=~\`|\\/?:;[]{}<>"']/g,'');const lw=nv.toLowerCase();const badWords=['샘플','sample','demo','dummy','asdf','qwer','확인용','삭제','연습'];if(!nv||nv.length<2||/^[0-9]+$/.test(nv)||/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(nv)||(/^(.)\\1+$/.test(nv)&&nv.length<=4)||badWords.some(w=>lw.includes(w.toLowerCase()))){er(${a},'정확한 이름을 입력해주세요.');return false;}}`:""}${f?`if(v&&!validPhone(v)){er(${a},'올바른 전화번호를 입력해주세요.');return false;}`:""}ans['${S(d.label||"q"+a)}']=v;break;}`}return d.type==="phone"?`case ${a}:{const v=document.getElementById('f${d.id}')?.value.trim()||'';${d.required?`if(!v){er(${a},'전화번호를 입력해주세요.');return false;}`:""}if(v&&!validPhone(v)){er(${a},'올바른 전화번호를 입력해주세요.');return false;}ans['${S(d.label||"전화번호")}']=v;break;}`:d.type==="email"?`case ${a}:{const v=document.getElementById('f${d.id}')?.value.trim()||'';if((${!!d.required}&&!v)||(v&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v))){er(${a},'올바른 이메일을 입력해주세요.');return false;}ans['${S(d.label||"이메일")}']=v;break;}`:d.type==="multiple"?`case ${a}:{const sel=[...document.querySelectorAll('#g${d.id} .ci.ck')].map(el=>{const oi=el.querySelector('.oi');return oi?oi.value||'기타':el.querySelector('span').textContent;});${d.required?`if(!sel.length){er(${a},'하나 이상 선택해주세요.');return false;}`:""}ans['${S(d.label||"q"+a)}']=sel.join(', ');break;}`:d.type==="single"?`case ${a}:{const el=document.querySelector('#g${d.id} .ci.ck');const oi=el?.querySelector('.oi');const sel=oi?oi.value||'기타':el?.querySelector('span')?.textContent||'';${d.required?`if(!sel){er(${a},'선택해주세요.');return false;}`:""}ans['${S(d.label||"q"+a)}']=sel;break;}`:d.type==="quiz"?`case ${a}:{const el=document.querySelector('#g${d.id} .ci.ck');${d.required?`if(!el){er(${a},'보기를 선택해주세요.');return false;}`:""}break;}`:d.type==="legal"?`case ${a}:{${d.required?`if(!document.getElementById('la${d.id}')?.classList.contains('ck')){er(${a},'동의가 필요합니다.');return false;}`:""}ans['${S(d.label||"동의")}']=document.getElementById('la${d.id}')?.classList.contains('ck')?'동의':'미동의';break;}`:`case ${a}:break;`}).join(`
`),Le=Q[o.findIndex(t=>t.type==="short")]||"",ne=(Array.isArray(w.points)?w.points:[]).map(t=>String(t||"").trim()).filter(Boolean).slice(0,3),re=t=>s(t).replace(/\*([^*]+)\*/g,'<em class="ac">$1</em>'),Me=t=>{const a={lead:[],head:[],hl:[],fn:[],items:[]};return String(t||"").split(`
`).forEach((d,c)=>{const f=d.trim();f&&(f[0]==="^"?a.lead.push({ln:c,t:f.slice(1).trim()}):f[0]==="!"?a.hl.push({ln:c,t:f.slice(1).trim()}):f[0]==="*"&&f.indexOf("*",1)<0?a.fn.push({ln:c,t:f}):f.includes("|")?a.items.push({ln:c,c:f.split("|").map(u=>u.trim())}):a.head.push({ln:c,t:f}))}),a},Ne=`<button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${s(Y)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`,A=(t,a,d,{button:c=!1,hlFirst:f=!1}={})=>{const u=Me(w[a]);if(!Object.values(u).some(b=>b.length))return"";const T=(b,k=-1)=>` data-le="${a}:${b}:${k}"`,x=u.hl.map(b=>`<div class="lhl"${T(b.ln)}>${re(b.t)}</div>`).join("");return`<section class="lsn ls-${t}">${u.lead.map(b=>`<div class="ll"${T(b.ln)}>${s(b.t)}</div>`).join("")}`+(u.head.length?`<div class="lh">${u.head.map(b=>`<span${T(b.ln)}>${re(b.t)}</span>`).join("<br>")}</div>`:"")+(u.items.length&&d?`<div class="${t}">${u.items.map(b=>d(b.c,k=>T(b.ln,k))).join("")}</div>`:"")+(f?x:"")+(c?Ne:"")+(f?"":x)+u.fn.map(b=>`<div class="lfn"${T(b.ln)}>${s(b.t)}</div>`).join("")+"</section>"},ie={시계:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',집:'<path d="M4 11l8-7 8 7v9h-5v-6h-4v6H4z"/>',사람:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',책:'<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>',선물:'<path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-2-5-7-3-4 0M12 9c2-5 7-3 4 0"/>',돈:'<circle cx="12" cy="12" r="9"/><path d="M8.5 9l1.8 6 1.7-5 1.7 5 1.8-6M8 12h8"/>',전화:'<path d="M6 3h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 014 5a2 2 0 012-2z"/>',별:'<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/>',체크:'<path d="M5 12.5l4.5 4.5L19 7.5"/>'},Ce=t=>/^[1-5]$/.test(t||"")?`<u>${"★".repeat(Number(t))}</u>`:"",se=[A("lst","landStats",(t,a)=>`<div><b${a(0)}>${s(t[0])}</b><span${a(1)}>${s(t[1]||"")}</span></div>`),A("lrv","landReviews",(t,a)=>{const d=t.length>2;return`<div><i>${s([...t[0]][0]||"")}</i><span><b${a(0)}>${s(t[0])}</b>${d&&t[1]?`<small${a(1)}>${s(t[1])}</small>`:""}</span>${Ce(t[3])}<p${a(d?2:1)}>${s(t[d?2:1]||"")}</p></div>`}),A("lcd","landCards",(t,a)=>`<div><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ie[t[0]]||ie.체크}</svg></i><b${a(1)}>${s(t[1]||"")}</b></div>`,{button:!0}),A("lck","landChecks",(t,a)=>`<div><i></i><p><b${a(0)}>${s(t[0])}</b>${t[1]?`<small${a(1)}>${s(t[1])}</small>`:""}</p></div>`),A("lfq","landFaq",(t,a)=>`<details><summary><span${a(0)}>${s(t[0])}</span></summary><p${a(1)}>${s(t[1]||"")}</p></details>`),A("lend","landEnd",null,{button:!0,hlFirst:!0}),w.landFooter?`<section class="lsn ls-lft">${String(w.landFooter).split(`
`).map((t,a)=>t.trim()?`<span data-le="landFooter:${a}:-1">${s(t.trim())}</span>`:"").filter(Boolean).join(`
`)}</section>`:""].join(""),Re=m&&!h?`<div id="ss" class="sl active" style="display:flex"><div class="card">
    ${w.ticker?`<div class="tick"><div>${`<span>${s(w.ticker)}</span>`.repeat(8)}</div></div>`:""}
    ${D?`<img class="cover-image" src="${D}" loading="eager" decoding="async" alt="">`:""}
    <div class="stag">${s(ye)}</div>
    <div class="stit">${s(e).split(`
`).map((t,a)=>`<span class="${a?"tl":"tl t1"}">${t}</span>`).join("<br>")}</div>
    ${P?`<div class="sdesc">${s(P)}</div>`:""}
    ${ne.length?`<div class="spts">${ne.map(t=>`<span>${s(t)}</span>`).join("")}</div>`:""}
    <button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${s(Y)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <div style="font-size:12px;color:var(--tx3);margin-top:14px">총 ${z}개 질문</div>
    ${w.footnote?`<div class="sfoot">${s(w.footnote)}</div>`:""}
    ${se}
  </div></div>${se?`<button id="lcta" class="sbt" onclick="sf()"><span>${s(Y)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`:""}`:"",Oe=I?`function cf(){const w=document.getElementById('cfw'),colors=['${n.c1}','${n.c2}','#f0eff8','#4ade80','#fbbf24','#f472b6','#38bdf8'];for(let i=0;i<90;i++){const p=document.createElement('div'),c=colors[i%colors.length],sz=5+Math.random()*8;p.style.cssText='position:absolute;top:-12px;left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(Math.random()>.5?'50%':'3px')+';animation:cff '+(1.6+Math.random()*1.6)+'s '+(Math.random()*.9)+'s linear forwards';w.appendChild(p);}setTimeout(()=>w.innerHTML='',4500);}`:"",Pe=M?`document.addEventListener('keydown',e=>{
    if(e.defaultPrevented||e.isComposing||e.keyCode===229||e.repeat||e.ctrlKey||e.altKey||e.metaKey||anim||submitted)return;
    const target=e.target,tag=target?.tagName;
    if(target?.isContentEditable||['TEXTAREA','SELECT','BUTTON','A'].includes(tag))return;
    if(e.key==='Enter'||(e.key==='ArrowRight'&&tag!=='INPUT')){
      e.preventDefault();
      if(cur<0)sf();else if(cur<TOTAL){const q=QS[cur];if(q&&q.type==='quiz')quizCheck(cur);else gn(cur);}
    }
    if((e.key==='ArrowLeft'||e.key==='Backspace')&&tag!=='INPUT'&&${q}&&(cur>0||HIST.length>0)){e.preventDefault();gp(cur);}
  });`:"",Ge=te?'<div id="qscore" style="margin:10px 0 4px;font-size:15px;font-weight:600"></div>':"";return`<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${s(e)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&display=swap" rel="stylesheet">
<link href="${Be}" rel="stylesheet">
<style>
:root{--c1:${n.c1};--c2:${n.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15);--ls-bg:rgba(255,255,255,.025)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${l};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden;-webkit-font-smoothing:antialiased;position:relative}
${U?`#bg-img{position:fixed;inset:0;z-index:-2;background-image:url('${U}');background-size:cover;background-position:center;filter:blur(${y}px);transform:scale(${y>0?1.05:1});transition:filter .3s}#bg-overlay{position:fixed;inset:0;z-index:-1;background:${B};opacity:${v}}`:""}
#pw{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:50}
#pf{height:100%;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:0 3px 3px 0;transition:width .6s cubic-bezier(.4,0,.2,1);position:relative}
#pf::after{content:'';position:absolute;right:-2px;top:-2px;bottom:-2px;width:7px;border-radius:50%;background:var(--c2);box-shadow:0 0 10px 2px var(--c2)}
#sc{position:fixed;top:14px;right:18px;font-size:12px;color:var(--tx3);z-index:50;font-variant-numeric:tabular-nums;transition:opacity .3s}
#gb{position:fixed;top:10px;left:14px;z-index:50;display:none;align-items:center;gap:5px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer;font-family:inherit;transition:color .2s,transform .2s;padding:6px 4px}
#gb:hover{color:var(--tx);transform:translateX(-3px)}#gb.v{display:flex}
#kh{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(122,120,143,.5);display:flex;align-items:center;gap:6px;pointer-events:none;z-index:10;transition:opacity .5s;white-space:nowrap}
@media(hover:none),(max-width:600px){#kh{display:none}}
#kh kbd{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:2px 8px;font-family:monospace;font-size:11px}
.wrap{position:relative;z-index:1;width:100%;max-width:540px}
.fhead{display:none;align-items:center;justify-content:center;gap:12px;margin-bottom:20px}
.fhead b{display:block;font-size:17px;font-weight:800;color:var(--tx);line-height:1.35;word-break:keep-all}
.fhead span{font-size:13px;color:var(--tx3)}
.steps{display:none;align-items:center;justify-content:center;margin-bottom:24px;--sg:clamp(8px,4.2vw,26px)}
.steps i{position:relative;box-sizing:border-box;flex:0 0 auto;width:min(30px,calc((100% - (var(--n) - 1)*var(--sg))/var(--n)));aspect-ratio:1;font-style:normal;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;line-height:1;background:color-mix(in srgb,var(--c1) 14%,transparent);color:var(--c1);transition:background .3s,color .3s,box-shadow .3s}
.steps i+i{margin-left:var(--sg)}
.steps i+i::before{content:'';position:absolute;right:calc(100% + 3px);top:50%;width:calc(var(--sg) - 6px);height:2px;margin-top:-1px;border-radius:2px;background:color-mix(in srgb,var(--c1) 20%,transparent);transition:background .3s}
.steps i.on,.steps i.dn{background:var(--c1);color:#fff}
.steps i.on{box-shadow:0 0 0 4px color-mix(in srgb,var(--c1) 22%,transparent)}
.steps i.dn{font-size:0}
.steps i.dn::after{content:'';width:34%;height:18%;border-left:2px solid currentColor;border-bottom:2px solid currentColor;transform:translateY(-15%) rotate(-45deg)}
.steps i.dn+i::before{background:var(--c1)}
body.single-page .steps,body.single-page .fhead{display:none}
.ot{flex:1;min-width:0;display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px}
.ci .ot span{flex:0 1 auto}
.ob{font-style:normal;font-size:10px;font-weight:800;letter-spacing:.06em;line-height:1;padding:4px 8px;border-radius:99px;background:color-mix(in srgb,var(--c1) 16%,transparent);color:var(--c1);animation:obIn .5s cubic-bezier(.22,1,.36,1) both,obGlow 2.4s ease-in-out .5s infinite}
.ob-hot{background:#ffe4e1;color:#d92d20}.ob-event{background:#efe5ff;color:#6d3fd6}.ob-pick{background:#dff5e6;color:#17803d}.ob-free{background:#fff1c9;color:#a16207}
.od{flex-basis:100%;font-size:13px;line-height:1.5;color:var(--tx2)}
@keyframes obIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}
@keyframes obGlow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 0 4px color-mix(in srgb,currentColor 16%,transparent)}}
.sl{width:100%;display:none;flex-direction:column}.sl.active{display:flex}
.card{background:var(--card-bg,rgba(22,22,31,.95));border:1px solid var(--bd);border-radius:24px;padding:38px 34px 30px;backdrop-filter:blur(20px);position:relative;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.35)}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c1),var(--c2),transparent 80%)}
.cn{font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.13em;color:var(--c1);margin-bottom:12px}
.ct{font-family:'Gmarket Sans',sans-serif;font-size:clamp(18px,4.5vw,24px);font-weight:500;line-height:1.4;margin-bottom:8px}
.cs{font-size:14px;color:var(--tx2);font-weight:300;line-height:1.65;margin-bottom:22px}
.fi{width:100%;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:15px 18px;font-size:16px;color:var(--tx);font-family:inherit;outline:none;-webkit-appearance:none;transition:border-color .2s,box-shadow .2s,transform .15s}
.fi::placeholder{color:var(--tx3)}.fi:focus{border-color:var(--c1);box-shadow:0 0 0 4px color-mix(in srgb,var(--c1) 18%,transparent);transform:translateY(-1px)}
.fi.er{border-color:#f87171;box-shadow:0 0 0 4px rgba(248,113,113,.1);animation:shk .35s ease}
@keyframes shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
.cg{display:flex;flex-direction:column;gap:10px}
.ci{display:flex;align-items:center;gap:13px;background:var(--bg2);border:1.5px solid var(--bd);border-radius:14px;padding:14px 17px;cursor:pointer;transition:border-color .2s,background .2s,transform .15s,box-shadow .2s;user-select:none}
.ci:hover:not(.qdisabled){border-color:color-mix(in srgb,var(--c1) 55%,transparent);transform:translateY(-1px);box-shadow:0 4px 18px rgba(124,108,252,.13)}
.ci.ck{border-color:var(--c1);background:color-mix(in srgb,var(--c1) 10%,transparent);transform:translateY(-1px);box-shadow:0 4px 20px color-mix(in srgb,var(--c1) 22%,transparent)}
.ci.qcorrect{border-color:#22c55e!important;background:rgba(34,197,94,.12)!important;box-shadow:0 4px 20px rgba(34,197,94,.2)!important;transform:none!important}
.ci.qwrong{border-color:#f87171!important;background:rgba(248,113,113,.1)!important;animation:shk .35s ease;transform:none!important}
.ci.qdisabled{pointer-events:none}
.cb{width:22px;height:22px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .22s cubic-bezier(.34,1.56,.64,1)}
.rb{border-radius:50%}
.ci.ck .cb{background:var(--c1);border-color:var(--c1);transform:scale(1.1)}
.ci.qcorrect .cb{background:#22c55e!important;border-color:#22c55e!important;transform:scale(1.1)}
.ci.qwrong .cb{background:#f87171!important;border-color:#f87171!important}
.cb::after{content:'';width:9px;height:9px;border-radius:2px;background:#fff;opacity:0;transform:scale(0) rotate(-20deg);transition:all .22s cubic-bezier(.34,1.56,.64,1)}.rb::after{border-radius:50%;width:8px;height:8px}
.ci.ck .cb::after,.ci.qcorrect .cb::after,.ci.qwrong .cb::after{opacity:1;transform:scale(1) rotate(0)}
.ci span,.ci .oi{font-size:15px;flex:1;line-height:1.4;color:var(--tx)}
.oi{background:transparent;border:none;outline:none;color:var(--tx);font-family:inherit}
.qfb{margin-top:12px;border-radius:12px;padding:13px 16px;font-size:13px;line-height:1.65;animation:fbIn .3s ease}
.qfb.ok{background:rgba(34,197,94,.1);border:1.5px solid rgba(34,197,94,.3);color:#4ade80}
.qfb.ng{background:rgba(248,113,113,.09);border:1.5px solid rgba(248,113,113,.25);color:#f87171}
@keyframes fbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ls{background:rgba(255,255,255,.025);border:1.5px solid var(--bd);border-radius:12px;padding:14px 16px;max-height:140px;overflow-y:auto;font-size:12px;color:var(--tx2);line-height:1.75;margin-bottom:14px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}
.la{display:flex;align-items:center;gap:11px;cursor:pointer;user-select:none;padding:8px 4px}
.ld{width:22px;height:22px;border-radius:6px;border:2px solid var(--bd2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all .22s cubic-bezier(.34,1.56,.64,1)}
.la.ck .ld{background:var(--c1);border-color:var(--c1);transform:scale(1.1)}.ld::after{content:'';width:9px;height:9px;border-radius:2px;background:#fff;opacity:0;transform:scale(0);transition:all .22s cubic-bezier(.34,1.56,.64,1)}.la.ck .ld::after{opacity:1;transform:scale(1)}
.em{font-size:12px;color:#f87171;margin-top:8px;min-height:16px;display:none;align-items:center;gap:5px}.em.on{display:flex;animation:fdi .2s ease}
@keyframes fdi{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:none}}
.cf{display:flex;align-items:center;justify-content:center;margin-top:26px;gap:12px}
.bb{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer;font-family:inherit;padding:10px 4px;transition:color .2s,transform .2s;flex-shrink:0}
.bb:hover{color:var(--tx);transform:translateX(-3px)}
.nb{flex:0;min-width:160px;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:15px 28px;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s;position:relative;overflow:hidden;white-space:nowrap}
.nb::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.1))}.nb:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 28px color-mix(in srgb,var(--c1) 40%,transparent)}.nb:active{transform:scale(.97)}.nb:disabled{opacity:.4;cursor:not-allowed;transform:none}
.sp{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none;flex-shrink:0}.nb.ld2 .sp{display:block}.nb.ld2 .nl,.nb.ld2 .na{display:none}
.stag{display:inline-flex;align-items:center;gap:6px;font-family:'Gmarket Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--c1);background:color-mix(in srgb,var(--c1) 12%,transparent);border:1px solid color-mix(in srgb,var(--c1) 28%,transparent);border-radius:99px;padding:5px 14px;margin-bottom:16px}
.stag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--c1);animation:pulse 1.6s ease-in-out infinite}
.stit{font-family:'Gmarket Sans',sans-serif;font-size:clamp(22px,5.5vw,34px);font-weight:700;line-height:1.2;margin-bottom:12px;white-space:pre-line;background:linear-gradient(135deg,#f0eff8 30%,var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.tick{overflow:hidden;white-space:nowrap;background:#111;border-radius:10px;margin-bottom:18px;padding:9px 0}.tick div{display:inline-block;animation:tick 16s linear infinite}.tick span{display:inline-block;padding:0 18px;font-size:13px;font-weight:800;letter-spacing:.04em;color:var(--c1);text-shadow:0 0 10px var(--c1)}@keyframes tick{to{transform:translateX(-50%)}}
.spts{display:flex;align-self:stretch;margin:4px 0 24px}.spts span{flex:1;min-width:0;padding:2px 8px;font-size:13px;font-weight:700;line-height:1.45;color:var(--tx);text-align:center;word-break:keep-all}.spts span+span{border-left:1px solid var(--bd)}
.lsn{align-self:stretch;margin-top:46px;text-align:left}.lh{font-size:21px;font-weight:800;line-height:1.4;text-align:center;margin-bottom:18px;color:var(--tx);word-break:keep-all}.ac{font-style:normal;color:var(--c1)}.ll{font-size:13px;color:var(--tx3);text-align:center;margin-bottom:12px}.lhl{margin-top:14px;font-size:14px;font-weight:800;color:var(--c1);text-align:center}.lfn{margin-top:4px;font-size:11.5px;line-height:1.7;color:var(--tx3);text-align:center}.lsn>div+.lfn{margin-top:14px}.lfn+.lfn{margin-top:0}
.lst{display:flex;background:var(--c1);border-radius:18px;padding:18px 6px}.lst div{flex:1;min-width:0;text-align:center;color:#fff;padding:0 4px}.lst b{display:block;font-size:17px;font-weight:800}.lst span{font-size:11.5px;opacity:.9}
.ls-lst+.ls-lrv{margin-top:14px}.lrv>div{display:flex;flex-wrap:wrap;align-items:center;gap:0 12px;border:1px solid var(--bd);border-radius:16px;padding:16px;margin-bottom:10px;background:var(--bg2)}.lrv i{flex:0 0 40px;height:40px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:16px;font-weight:800;color:var(--c1);background:color-mix(in srgb,var(--c1) 13%,transparent)}.lrv span{flex:1;min-width:0}.lrv b{display:block;font-size:14px;color:var(--tx)}.lrv small{display:block;font-size:12.5px;font-weight:800;color:var(--c1)}.lrv u{text-decoration:none;font-size:13px;letter-spacing:1px;color:#f5a623}.lrv p{flex:0 0 100%;margin-top:10px;font-size:14px;line-height:1.65;color:var(--tx2)}
.lcd{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}.lcd>div{border:1px solid var(--bd);border-radius:16px;padding:16px 6px;text-align:center;background:var(--bg2)}.lcd i{display:grid;place-items:center;width:42px;height:42px;margin:0 auto 10px;border-radius:50%;color:var(--c1);background:color-mix(in srgb,var(--c1) 12%,transparent)}.lcd svg{width:22px;height:22px}.lcd b{font-size:13px;line-height:1.45;color:var(--tx);word-break:keep-all}.lsn>.sbt{width:100%;justify-content:center}
.lck>div{display:flex;align-items:center;gap:14px;border-radius:14px;padding:15px 16px;margin-bottom:10px;background:color-mix(in srgb,var(--tx) 5%,transparent)}.lck i{flex:0 0 24px;height:24px;border-radius:50%;background:var(--c1) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 12.5l4 4 8-9'/%3E%3C/svg%3E") center/14px no-repeat}.lck b{display:block;font-size:15px;color:var(--tx)}.lck small{display:block;margin-top:3px;font-size:12.5px;color:var(--tx3)}
.lfq details{border:1px solid var(--bd);border-radius:14px;margin-bottom:10px;background:var(--bg2)}.lfq summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;gap:12px;padding:16px;font-size:15px;font-weight:700;color:var(--tx)}.lfq summary::-webkit-details-marker{display:none}.lfq summary::after{content:'+';color:var(--c1);font-weight:800}.lfq details[open] summary::after{content:'\\2212'}.lfq p{padding:0 16px 16px;font-size:14px;line-height:1.7;color:var(--tx2)}
.ls-lend{background:#1b1c1f;border-radius:22px;padding:38px 20px 30px;text-align:center}.ls-lend .lh{color:#fff;font-size:23px}.ls-lend .ll{color:#b9bdc4}.ls-lend .lhl{display:inline-block;margin:0 0 20px;padding:9px 18px;border-radius:99px;font-size:13px;border:1px solid color-mix(in srgb,var(--c1) 55%,transparent);background:color-mix(in srgb,var(--c1) 18%,transparent);color:color-mix(in srgb,var(--c1) 55%,#fff)}
.ls-lft{margin-top:14px;background:#101113;border-radius:22px;padding:26px 20px;text-align:center;font-size:12px;line-height:1.8;color:#8f959e;white-space:pre-line}.ls-lft::first-line{color:#fff;font-weight:800;font-size:13px}
#lcta{display:none;position:fixed;left:0;right:0;bottom:0;z-index:60;width:100%;justify-content:center;border-radius:0!important;padding:18px 20px;font-size:17px;font-weight:800;box-shadow:0 -6px 20px rgba(0,0,0,.12)!important}body:has(#ss.active) #lcta{display:flex}body:has(#lcta) #ss .card{padding-bottom:96px!important}
.sfoot{margin-top:12px;font-size:11.5px;line-height:1.7;color:var(--tx3);white-space:pre-line}
.sdesc{font-size:14px;color:var(--tx2);font-weight:300;line-height:1.75;margin-bottom:24px}
.sbt{display:inline-flex;align-items:center;gap:9px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:14px;padding:16px 32px;font-size:15px;font-weight:500;font-family:inherit;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s;position:relative;overflow:hidden}
.sbt::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.1))}.sbt:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 28px color-mix(in srgb,var(--c1) 40%,transparent)}
.done-card{text-align:center;padding:52px 34px 44px;display:flex;flex-direction:column;align-items:center}
.dr{width:80px;height:80px;border-radius:50%;background:rgba(74,222,128,.1);border:2px solid rgba(74,222,128,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;animation:pop .55s cubic-bezier(.34,1.56,.64,1) both}
@keyframes pop{from{transform:scale(0) rotate(-30deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}.dr svg{opacity:0;animation:chin .3s .35s ease forwards}@keyframes chin{to{opacity:1}}
.dt{font-family:'Gmarket Sans',sans-serif;font-size:26px;font-weight:700;margin-bottom:12px;animation:fup .4s .4s ease both}
.dd{font-size:14px;color:var(--tx2);line-height:1.85;font-weight:300;white-space:pre-line;animation:fup .4s .5s ease both}.dn{font-weight:500;color:var(--c2)}
.dcta{margin-top:22px;display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;border-radius:12px;padding:13px 26px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;animation:fup .4s .6s ease both;text-decoration:none;transition:opacity .2s,transform .2s}.dcta:hover{opacity:.88;transform:translateY(-1px)}
.drst{margin-top:14px;font-size:12px;color:var(--tx3);background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px;font-family:inherit;animation:fup .4s .65s ease both}
@keyframes fup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
#tst{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--card-bg,rgba(22,22,31,.95));border:1px solid var(--bd);border-radius:12px;padding:11px 20px;font-size:13px;z-index:400;transition:transform .35s cubic-bezier(.34,1.2,.64,1);pointer-events:none;white-space:nowrap;backdrop-filter:blur(12px)}
#tst.on{transform:translateX(-50%) translateY(0)}#tst.ok{border-color:rgba(74,222,128,.35);color:#4ade80}#tst.fail{border-color:rgba(248,113,113,.35);color:#f87171}
#cfw{position:fixed;inset:0;pointer-events:none;z-index:300;overflow:hidden}
.rp{position:absolute;border-radius:50%;background:rgba(255,255,255,.28);transform:scale(0);animation:rpa .55s linear;pointer-events:none}@keyframes rpa{to{transform:scale(4);opacity:0}}
@keyframes cff{0%{opacity:1;transform:translateY(0) rotate(0)}80%{opacity:1}100%{transform:translateY(110vh) rotate(760deg);opacity:0}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}}
@keyframes spin{to{transform:rotate(360deg)}}
${_e}
${l!=="'Noto Sans KR',sans-serif"?`body{font-family:${l}!important}.ct,.stit{font-family:${l}!important}`:""}
.nb{background:linear-gradient(135deg,${n.c1},${n.c2})!important}.nb:hover{box-shadow:0 8px 28px color-mix(in srgb,${n.c1} 40%,transparent)!important}
.sbt{background:linear-gradient(135deg,${n.c1},${n.c2})!important}
.ci.ck{border-color:${n.c1}!important}.ci.ck .cb{background:${n.c1}!important;border-color:${n.c1}!important}
.cn{color:${n.c1}!important}.card::before{background:linear-gradient(90deg,transparent,${n.c1},${n.c2},transparent)!important}
#pf{background:linear-gradient(90deg,${n.c1},${n.c2})!important}
${qe}
@media(prefers-reduced-motion:reduce){.en,.ex,.ep,.xp{animation-duration:.01s!important}}
@media(max-width:480px){.card{padding:28px 22px 22px;border-radius:20px}.ct{font-size:19px}}
${h?ot:""}
${nt}
${Te}
body .nb,body .sbt,body .dcta,body.single-page .single-submit{color:${F}!important}
body .nb,body .sbt,body .dcta,body.single-page .single-submit{background:${ae}!important}
body .nb:hover,body .sbt:hover,body .dcta:hover,body.single-page .single-submit:hover{color:${F}!important;background:${ae}!important}
body .nb .sp,body .sbt .sp{border-color:color-mix(in srgb,${F} 30%,transparent);border-top-color:${F}}
${pt(w)}
${U&&_.startsWith("clean_")?"body{background:transparent}":""}
</style></head><body${h?' class="single-page"':""}>
${U?'<div id="bg-img"></div><div id="bg-overlay"></div>':""}
<div id="pw"><div id="pf"></div></div>
<div id="sc"></div>
<button id="gb" onclick="gp(cur)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>
<div id="cfw"></div>
${M?'<div id="kh"><kbd>Enter</kbd> 또는 <kbd>→</kbd> 로 다음으로</div>':""}
<div id="tst"></div>
<div class="wrap">
<div class="fhead"><div><b>${s(e)}</b><span>${s(w.headerSub||`총 ${z}개 질문`)}</span></div></div>
  ${Re}
  ${h?`<main class="card single-sheet" id="single-form">
    <header class="single-header">
      ${D?`<img class="single-cover" src="${s(D)}" decoding="async" alt="">`:""}
      <h1 class="single-title">${s(e||"신청서")}</h1>
      ${P?`<p class="single-desc">${s(P)}</p>`:""}
    </header>`:""}
  ${je}
  ${h?`<footer class="single-footer"><button class="nb single-submit" id="sb" type="button" onclick="submitSingle()"><span class="sp"></span><span class="nl">${s(me||"제출하기")}</span></button></footer></main>`:""}
  <div class="sl" id="done"><div class="card done-card">
    <div class="dr"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div class="dt">${s(ve)}</div>
    ${Ge}
    <div class="dd"><span class="dn" id="dn"></span>${s(we)}</div>
    ${Z&&G?`<a class="dcta" href="${s(G)}" target="_blank">${s(Z)} →</a>`:""}
    <button class="drst" onclick="rst()">다시 제출하기</button>
  </div></div>
</div>
<script>
const SU='${S($e)}';
const SINGLE_PAGE=${h};
const WAIT_FOR_SUBMIT=${!!he};
const TOTAL=${z};
const QUIZ=${Ie};
const BRANCH=${Ee};
const QS=${N(o.map(t=>({id:t.id,type:t.type,required:!!t.required})))};
const ANSWER_KEYS=${N(Q)};
const getFormPath=${tt.toString()};
const HIST=[];
let cur=${h?"0":"-1"},anim=false,submitted=false;
let qzScore=0,qzTotal=0,qzDone={};
const ans={};
upUI();
${!m&&!h?"initFirst();":""}
function initFirst(){cur=0;const s=document.getElementById('sl0');if(s){s.style.display='flex';s.classList.add('active');const i=s.querySelector('input,textarea');if(i)setTimeout(()=>i.focus(),80);}upUI();}
function sid(i){return i<0?'ss':i>=TOTAL?'done':'sl'+i}
function upUI(){
  if(SINGLE_PAGE)return;
  if(cur<0||cur>=TOTAL){document.getElementById('pf').style.width=cur>=TOTAL?'100%':'0%';document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';return;}
  document.getElementById('pf').style.width=((cur+1)/TOTAL*100)+'%';
  document.getElementById('sc').textContent=(cur+1)+' / '+TOTAL;
  document.getElementById('sc').style.opacity='1';
  document.getElementById('gb').className=(${q}&&(cur>0||HIST.length>0))?'v':'';
}
function go(f,t,d){
  if(anim)return;anim=true;
  const fe=document.getElementById(sid(f)),te=document.getElementById(sid(t));
  if(!fe||!te){anim=false;return;}
  const oc=d==='n'?'ex':'xp',ic=d==='n'?'en':'ep';
  fe.classList.add(oc);fe.classList.remove('active');
  setTimeout(()=>{fe.style.display='none';fe.classList.remove(oc);te.style.display='flex';te.classList.add(ic);te.classList.add('active');setTimeout(()=>{te.classList.remove(ic);anim=false;const i=te.querySelector('input[type=text],input[type=tel],input[type=email],textarea');if(i)i.focus();},380);},280);
}
function sf(){
  if(anim)return;
  try{window.scrollTo(0,0)}catch(e){}
  const p=cur;
  cur=0;
  HIST.length=0;
  const fromEl=document.getElementById(p<0?'ss':'sl'+p);
  const toEl=document.getElementById('sl0');
  if(!fromEl||!toEl){anim=false;return;}
  if(p<0){
    // 시작화면→첫질문
    anim=true;
    fromEl.classList.add('ex');fromEl.classList.remove('active');
    setTimeout(()=>{fromEl.style.display='none';fromEl.classList.remove('ex');
      toEl.style.display='flex';toEl.classList.add('en');toEl.classList.add('active');
      setTimeout(()=>{toEl.classList.remove('en');anim=false;
        const inp=toEl.querySelector('input[type=text],input[type=tel],input[type=email],textarea');
        if(inp)inp.focus();
      },380);
    },280);
  } else {
    go(p,0,'n');
  }
  upUI();
}
function gn(s){
  if(SINGLE_PAGE)return;
  if(anim||submitted||s!==cur)return;
  if(QS[s]?.type==='quiz'&&!qzDone[s]&&document.querySelector('#g'+QS[s].id+' .ci.ck')){quizCheck(s);return;}
  if(!vld(s))return;
  const br=BRANCH[s];
  let next=s+1;
  if(br){
    const el=document.querySelector('#g'+QS[s].id+' .ci.ck');
    const oi=el?parseInt(el.dataset.oi??-1):-1;
    if(oi>=0&&br[oi]!=null){const t=br[oi];if(t==='done'){finishForm();return;}const target=Number(t);if(Number.isInteger(target)&&target>=0&&target<TOTAL)next=target;}
  }
  if(next>=TOTAL||next===s){finishForm();return;}
  const back=HIST.indexOf(next);
  if(back>=0){
    // A locked quiz answer cannot be changed, so returning would loop forever.
    if(QS[s].type==='quiz'){finishForm();return;}
    HIST.length=back;
    const f=cur;cur=next;go(f,cur,'p');upUI();return;
  }
  HIST.push(cur);
  const f=cur;cur=next;
  go(f,cur,'n');upUI();
}
function gp(s){
  if(anim||submitted)return;
  const prev=HIST.length>0?HIST.pop():(cur>0?cur-1:0);
  const f=cur;cur=prev;go(f,cur,'p');upUI();
}
function pick(el,gid,multi){
  if(el.classList.contains('qdisabled'))return;
  if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));
  el.classList.toggle('ck');el.style.transform='scale(0.96)';setTimeout(()=>el.style.transform='',100);
  if(SINGLE_PAGE){syncChoices(gid);updateSinglePath();}
  ${j&&!h?"if(!multi){const s=cur;if(document.querySelectorAll('#'+gid+' .ci.ck').length===1)setTimeout(()=>{if(cur===s)gn(s);},320);}":""}}
function syncChoices(gid){document.querySelectorAll('#'+gid+' .ci').forEach(el=>{const input=el.querySelector('.native-choice');if(input)input.checked=el.classList.contains('ck');});}
function pickOther(el,gid,multi){if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));el.classList.add('ck');if(SINGLE_PAGE){syncChoices(gid);updateSinglePath();}el.querySelector('.oi')?.focus();}
function pickQuiz(el,gid,qi){
  if(qzDone[qi])return;
  document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));
  el.classList.add('ck');
}
function quizCheck(qi){
  if(qzDone[qi]){gn(qi);return;}
  const qd=QUIZ[qi];if(!qd)return;
  const gid='g'+QS[qi].id;
  const sel=document.querySelector('#'+gid+' .ci.ck');
  if(!sel){if(!QS[qi].required){gn(qi);return;}er(qi,'보기를 선택해주세요.');return;}
  const selOi=parseInt(sel.dataset.oi);
  const ok=selOi===qd.correct;
  qzDone[qi]=true;qzTotal++;if(ok)qzScore++;
  ans[ANSWER_KEYS[qi]]=(ok?'✅정답':'❌오답')+'(선택:'+sel.querySelector('span').textContent+')';
  document.querySelectorAll('#'+gid+' .ci').forEach(c=>{
    c.classList.add('qdisabled');
    const oi=parseInt(c.dataset.oi);
    if(oi===qd.correct)c.classList.add('qcorrect');
    else if(c.classList.contains('ck'))c.classList.add('qwrong');
  });
  const fb=document.getElementById('qfb'+qi);
  if(fb){
    fb.style.display='block';
    fb.className='qfb '+(ok?'ok':'ng');
    fb.textContent=ok?'✅ 정답입니다!':'❌ 오답입니다.';
    if(qd.explanation){const detail=document.createElement('span');detail.style.cssText='font-size:12px;opacity:.85';detail.textContent='💡 '+qd.explanation;fb.append(document.createElement('br'),detail);}
  }
  const cb=document.getElementById('qcb'+qi),nb=document.getElementById('qnb'+qi);
  if(cb)cb.style.display='none';
  if(nb)nb.style.display='flex';
}
function er(i,m){const e=document.getElementById('e'+i);e.textContent='⚠ '+m;e.classList.add('on');}
function ce(){document.querySelectorAll('.em').forEach(e=>{e.textContent='';e.classList.remove('on')});document.querySelectorAll('.fi').forEach(f=>f.classList.remove('er'));}
function vld(s){ce();switch(s){${Ae}default:break;}return true;}
const validPhone = ${He.toString()};
function responsePath(){
  const selected={};
  QS.forEach((q,i)=>{if(q.type!=='single'&&q.type!=='quiz')return;const el=document.querySelector('#g'+q.id+' .ci.ck');if(el?.dataset.oi!=null)selected[i]=el.dataset.oi;});
  return getFormPath(TOTAL,BRANCH,selected);
}
function setSubmissionBusy(busy){
  document.querySelectorAll('.nb,.sbt,#gb,.bb').forEach(button=>{button.disabled=busy;button.classList.remove('ld2');});
  const button=document.getElementById(SINGLE_PAGE?'sb':QS[cur]?.type==='quiz'?'qnb'+cur:'sb');
  if(button){button.disabled=busy;if(busy)button.classList.add('ld2');}
}
function finishForm(){
  if(submitted)return;
  const path=responsePath(),keys=new Set(path.map(i=>ANSWER_KEYS[i]));
  Object.keys(ans).forEach(key=>{if(!keys.has(key))delete ans[key];});
  qzScore=0;qzTotal=0;
  path.forEach(i=>{
    if(QS[i].type!=='quiz')return;
    const selected=document.querySelector('#g'+QS[i].id+' .ci.ck');
    if(!selected)return;
    const ok=Number(selected.dataset.oi)===Number(QUIZ[i].correct);
    qzTotal++;if(ok)qzScore++;
    ans[ANSWER_KEYS[i]]=(ok?'✅정답':'❌오답')+'(선택:'+selected.querySelector('span').textContent+')';
  });
  submitted=true;
  ans._ts=new Date().toLocaleString('ko-KR');
  ans._formTitle=${JSON.stringify(e||"").replace(/</g,"\\u003c")};
  try{window.parent.postMessage({type:'FORM_SUBMIT',answers:ans,pdfUrl:'${S(Se)}'},'*');}catch(e){}
  if(WAIT_FOR_SUBMIT){setSubmissionBusy(true);return;}
  completeForm();
}
function completeForm(){
  if(SU){try{Promise.resolve(fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)})).catch(()=>{});}catch(e){}}
  const f=cur;cur=TOTAL;
  const dn=document.getElementById('dn');
  if(dn){const nk='${S(Le)}';if(ans[nk])dn.textContent=ans[nk]+', ';}
  ${te?"const sc=document.getElementById('qscore');if(sc&&qzTotal>0){const p=Math.round(qzScore/qzTotal*100);sc.textContent='🏆 점수: '+qzScore+' / '+qzTotal+' ('+p+'%)';sc.style.color=p>=70?'#4ade80':p>=40?'#fbbf24':'#f87171';}":""}
  document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';
  ${M?"document.getElementById('kh').style.opacity='0';":""}
  if(SINGLE_PAGE){document.getElementById('single-form').hidden=true;document.getElementById('done').style.display='flex';window.scrollTo(0,0);}
  else go(f,TOTAL,'n');
  document.getElementById('pf').style.width='100%';
  ${I?"if(!qzTotal||qzScore===qzTotal)setTimeout(cf,420);else if(qzScore>0)setTimeout(cf,420);":""}
  tst('✅ 완료되었습니다!','ok');
}
async function sub(){
  if(SINGLE_PAGE){submitSingle();return;}
  gn(cur);
}
function rst(){
  if(anim)return;
  submitted=false;ce();setSubmissionBusy(false);
  document.querySelectorAll('input').forEach(el=>el.value='');
  document.querySelectorAll('input[type=checkbox],input[type=radio]').forEach(el=>el.checked=false);
  document.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  document.querySelectorAll('textarea').forEach(el=>el.value='');
  document.querySelectorAll('.ci,.la').forEach(el=>el.classList.remove('ck','qcorrect','qwrong','qdisabled'));
  document.querySelectorAll('.qfb').forEach(el=>{el.style.display='none';});
  document.querySelectorAll('[id^="qcb"]').forEach(el=>el.style.display='flex');
  document.querySelectorAll('[id^="qnb"]').forEach(el=>el.style.display='none');
  const sb=document.getElementById('sb');if(sb){sb.classList.remove('ld2');sb.disabled=false;}
  Object.keys(ans).forEach(k=>delete ans[k]);
  Object.keys(qzDone).forEach(k=>delete qzDone[k]);
  qzScore=0;qzTotal=0;HIST.length=0;
  if(SINGLE_PAGE){document.getElementById('done').style.display='none';document.getElementById('single-form').hidden=false;cur=0;updateSinglePath();window.scrollTo(0,0);return;}
  document.getElementById('pf').style.width='0%';document.getElementById('sc').style.opacity='0';
  ${M?"document.getElementById('kh').style.opacity='1';":""}
  const f=cur;cur=-1;
  ${m?"go(f,-1,'p');upUI();":"document.getElementById('done').style.display='none';initFirst();"}
}
${Oe}
function rp(e,btn){const r=btn.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2,el=document.createElement('span');el.className='rp';el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';btn.appendChild(el);setTimeout(()=>el.remove(),560);}
function tst(m,t){const el=document.getElementById('tst');el.textContent=m;el.className=t+' on';setTimeout(()=>el.className='',3200);}
${Pe}
${h?at:`
window.addEventListener('message',event=>{
  if(event.source!==window.parent||!WAIT_FOR_SUBMIT||!submitted)return;
  if(event.data?.type==='SUBMIT_SUCCESS'&&cur<TOTAL){completeForm();return;}
  if(event.data?.type==='SUBMIT_ERROR'&&cur<TOTAL){
    submitted=false;
    setSubmissionBusy(false);
    tst(event.data.message||'저장하지 못했습니다. 다시 제출해주세요.','fail');
  }
});
`}
${M?"setTimeout(()=>document.getElementById('kh').style.opacity='0',5000);":""}
<\/script></body></html>`}export{gt as C,yt as F,vt as L,xt as a,ut as b,mt as c,ht as d,ct as e,wt as g,dt as n,ue as r};
