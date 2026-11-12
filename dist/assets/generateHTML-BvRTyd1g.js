import{i as je,a as Re}from"./phoneValidation-DnkXk63Q.js";function ee(e,t){const a=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(e||"").trim());if(!a)return t;const n=a[1].length===3?[...a[1]].map(r=>r+r).join(""):a[1];return[0,2,4].map(r=>parseInt(n.slice(r,r+2),16))}function Oe(e){const t=e.map(a=>a/255<=.04045?a/255/12.92:((a/255+.055)/1.055)**2.4);return t[0]*.2126+t[1]*.7152+t[2]*.0722}function U(e,t){let a=1/0;for(let n=0;n<=32;n++){const r=Oe(e[0].map((c,s)=>c+(e[1][s]-c)*n/32));a=Math.min(a,t?1.05/(r+.05):(r+.05)/.05)}return a}function N(e,t=e){const a=ee(e,[124,108,252]),n=[a,ee(t,a)],r=[U(n,!1),U(n,!0)];let c=r[1]>r[0],s=n;if(Math.max(...r)<4.5){const m=[!1,!0].map(y=>{const _=$=>n.map(S=>S.map(j=>Math.round(j+((y?0:255)-j)*$)));let T=0,B=1;for(let $=0;$<12;$++){const S=(T+B)/2;U(_(S),y)>=4.6?B=S:T=S}return{amount:B,white:y,colors:_(B)}}).sort((y,_)=>y.amount-_.amount)[0];c=m.white,s=m.colors}const b=f=>"#"+f.map(m=>m.toString(16).padStart(2,"0")).join("");return{text:c?"#ffffff":"#000000",c1:b(s[0]),c2:b(s[1])}}const se=[{id:"clean_white",name:"기본 카드",emoji:"",desc:"둥근 카드에 목록형 선택지",thumb:{borderRadius:7}},{id:"clean_warm",name:"안내형",emoji:"",desc:"위에 제목 줄과 번호 단계가 붙는 신청서",thumb:{borderRadius:8,borderTop:"4px solid #9aa3af"}},{id:"clean_band",name:"컬러 밴드",emoji:"",desc:"위쪽 색 띠 위에 카드가 얹힘",thumb:{borderRadius:6,boxShadow:"0 -9px 0 #9aa3af"}},{id:"clean_sheet",name:"바텀 시트",emoji:"",desc:"아래에서 올라온 시트, 위에는 큰 제목",thumb:{borderRadius:"9px 9px 0 0",marginTop:6}},{id:"clean_full",name:"풀스크린",emoji:"",desc:"카드 없이 화면 가득, 가운데 큰 제목",thumb:{borderRadius:0,border:"0",background:"#9aa3af"}},{id:"clean_bubble",name:"말풍선",emoji:"",desc:"질문이 말풍선으로, 선택지는 알약으로",thumb:{borderRadius:"9px 9px 9px 2px"}},{id:"clean_chip",name:"칩 선택",emoji:"",desc:"선택지가 가로로 늘어선 알약 칩",thumb:{borderRadius:12,borderStyle:"dotted"}},{id:"clean_grid",name:"타일",emoji:"",desc:"선택지가 두 칸씩 놓이는 큰 타일",thumb:{borderRadius:5,boxShadow:"inset 15px 0 0 #e5e7eb,inset 16px 0 0 #fff"}},{id:"clean_capsule",name:"캡슐",emoji:"",desc:"전부 둥근 알약, 가운데 정렬",thumb:{borderRadius:14}},{id:"clean_pop",name:"팝",emoji:"",desc:"굵은 테두리와 딱 떨어지는 그림자",thumb:{borderRadius:7,border:"2px solid #16161a",boxShadow:"0 3px 0 #16161a"}},{id:"clean_stack",name:"겹친 종이",emoji:"",desc:"뒤에 종이가 겹쳐 보이는 카드",thumb:{borderRadius:4,boxShadow:"3px 3px 0 #fff,4px 4px 0 #b6bcc6"}},{id:"clean_tab",name:"폴더",emoji:"",desc:"단계 표시가 폴더 탭처럼 위로 튀어나옴",thumb:{borderRadius:"0 6px 6px 6px",boxShadow:"-0px -6px 0 -1px #9aa3af"}},{id:"clean_ticket",name:"티켓",emoji:"",desc:"점선과 양옆 홈이 있는 입장권",thumb:{borderRadius:5,borderBottom:"2px dashed #9aa3af"}},{id:"clean_frame",name:"액자",emoji:"",desc:"이중 테두리와 가운데 제목의 격식 있는 서류",thumb:{borderRadius:2,outline:"1px solid #9aa3af",outlineOffset:-4}},{id:"clean_note",name:"노트",emoji:"",desc:"왼쪽 색 띠와 밑줄 입력칸",thumb:{borderRadius:3,borderLeft:"4px solid #9aa3af"}},{id:"clean_line",name:"라인",emoji:"",desc:"가는 선만 쓰고 제목 아래 밑줄",thumb:{borderRadius:1,boxShadow:"inset 0 -8px 0 #fff,inset 0 -9px 0 #9aa3af"}},{id:"clean_neumo",name:"소프트 입체",emoji:"",desc:"볼록한 카드와 오목한 입력칸",thumb:{borderRadius:8,border:"0",background:"#e8ecf1",boxShadow:"2px 2px 5px #b9c1cc,-2px -2px 5px #fff"}},{id:"clean_glass",name:"글래스",emoji:"",desc:"번지는 빛 위에 반투명 유리 카드",thumb:{borderRadius:8,background:"rgba(120,130,220,.35)",border:"1px solid rgba(120,130,220,.6)"}},{id:"clean_neon",name:"네온",emoji:"",desc:"빛나는 테두리와 제목",thumb:{borderRadius:7,background:"#0d0f15",border:"1px solid #7c8cff",boxShadow:"0 0 7px #7c8cff"}},{id:"clean_pastel",name:"파스텔",emoji:"",desc:"",hidden:!0},{id:"clean_graphite",name:"미드나잇",emoji:"",desc:"",hidden:!0},{id:"clean_mono",name:"모노",emoji:"",desc:"",hidden:!0},{id:"clean_rose",name:"로즈",emoji:"",desc:"",hidden:!0},{id:"clean_sage",name:"세이지",emoji:"",desc:"",hidden:!0},{id:"clean_invert",name:"다크 카드",emoji:"",desc:"",hidden:!0}],Ce={clean_warm:["#fdf8ee","#fff","#2b2622","#6f665c","#8c8276","#efe6d6","#fff"],clean_white:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_pastel:["#f5f3ff","#fff","#232033","#625d78","#8a86a0","#e6e2f3","#faf9ff"],clean_band:["#f3f5f8","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_full:["#141a26","transparent","#ffffff","#d5dae3","#aab2c0","rgba(255,255,255,.18)","rgba(255,255,255,.1)"],clean_graphite:["#0f1115","#191c23","#f2f4f7","#b9c0cb","#8d95a3","#2c313b","#20242d"],clean_mono:["#ffffff","#fff","#111111","#444444","#777777","#111111","#fff"],clean_note:["#f1ede3","#fbf9f4","#2a2723","#69635a","#8f887d","#d9d2c3","transparent"],clean_rose:["#fbeff3","#fff","#3b2b33","#7b626d","#967c87","#f0dde4","#fdf8fa"],clean_sage:["#edf4ee","#fff","#24332a","#586b5f","#7f9085","#d9e6dc","#f7faf7"],clean_bubble:["#f1f3f9","transparent","#1f2430","#5d6575","#8a92a1","#e1e5ee","#fff"],clean_capsule:["#f6f4fd","#fff","#231f33","#625d78","#8a86a0","#e7e3f4","#faf9ff"],clean_pop:["#ffffff","#fff","#16161a","#3f3f46","#6b6b75","#16161a","#fff"],clean_ticket:["#eceef3","#fff","#1f2328","#5b6470","#868e99","#dfe3ea","#f7f8fa"],clean_neumo:["#e8ecf1","#e8ecf1","#27303b","#5c6876","#8793a1","transparent","#e8ecf1"],clean_line:["#ffffff","#fff","#1f2328","#5b6470","#8a929c","#d9dde3","transparent"],clean_invert:["#f1f2f5","#16181d","#f4f5f7","#c2c7d0","#959caa","rgba(255,255,255,.14)","rgba(255,255,255,.07)"],clean_glass:["#0e1224","rgba(255,255,255,.1)","#ffffff","#d7dbea","#aab0c8","rgba(255,255,255,.2)","rgba(255,255,255,.1)"],clean_neon:["#07080c","#0d0f15","#f1f4f9","#b4bccb","#8891a2","#262b38","#12151d"],clean_sheet:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_chip:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#fff"],clean_grid:["#f4f5f7","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_stack:["#eef0f3","#fff","#1f2328","#5b6470","#868e99","#dfe3ea","#f7f8fa"],clean_tab:["#f1f2f5","#fff","#1f2328","#5b6470","#868e99","#e3e6ea","#f7f8fa"],clean_frame:["#f5f3ee","#fffefb","#26231f","#625c53","#8b8478","#d8d2c6","transparent"]},k=":not(.single-page)";function Me([e,t,a,n,r,c,s],b){return`
:root{--tx:${a};--tx2:${n};--tx3:${r};--bg2:${s};--bd:${c};--bd2:${r};--ls-bg:${s}}
body{background:${e};color:var(--tx)}body::before,body::after{display:none}
body .card{background:${t};border:1px solid var(--bd);box-shadow:0 14px 40px rgba(20,24,40,.07);backdrop-filter:none}
.card::before{display:none}
body${k} .card{border-radius:26px;padding:40px 32px 30px}
.ct,.stit,.dt{font-family:inherit;color:var(--tx);background:none;-webkit-text-fill-color:var(--tx);text-shadow:none;font-weight:800;letter-spacing:-.02em;word-break:keep-all}
body${k} .ct{font-size:clamp(21px,5.2vw,26px);line-height:1.38}
.cs,.sdesc,.dd{font-size:15px;font-weight:400;line-height:1.65;color:var(--tx2)}
.cn,.stag{display:inline-flex;align-self:flex-start;width:fit-content;font-family:inherit;font-size:12px;font-weight:800;letter-spacing:.08em;color:${b};background:color-mix(in srgb,${b} 12%,transparent);border:0;border-radius:99px;padding:7px 14px;margin-bottom:18px;box-shadow:none}
.cn::after{display:none}
.fi,.ci{background:var(--bg2);color:var(--tx);border:1.5px solid var(--bd);backdrop-filter:none}
body${k} .fi{border-radius:16px;padding:16px 18px;font-size:16px}
body${k} .cg{gap:11px}
body${k} .ci{border-radius:16px;padding:17px 18px;gap:14px}
.ci span,.ci .oi{font-size:16px;font-weight:600}
body${k} .cb{width:24px;height:24px;border-radius:8px}body${k} .cb.rb{border-radius:50%}
.fi:focus{border-color:${b};box-shadow:0 0 0 4px color-mix(in srgb,${b} 14%,transparent);transform:none}
.ci:hover:not(.qdisabled){box-shadow:none;border-color:color-mix(in srgb,${b} 55%,var(--bd));transform:none}
.ci.ck{background:color-mix(in srgb,${b} 9%,${t==="transparent"?e:t});box-shadow:none;transform:none}
.ci.ck .cb,.la.ck .ld{transform:none}
.ci,.fi,.nb,.sbt,.dcta{transition:border-color .2s ease,background .2s ease,box-shadow .25s ease,opacity .2s ease,transform .2s ease}
body .nb,body .sbt,body .dcta{border-radius:16px;font-size:16px;font-weight:700;padding:17px 28px;text-shadow:none;box-shadow:0 8px 20px color-mix(in srgb,${b} 24%,transparent)}
body .nb{min-width:0;flex:0 1 auto}
.cf{min-width:0}
@media(max-width:480px){body .nb{flex:1 1 auto;padding-left:18px;padding-right:18px}}
body .nb:hover,body .sbt:hover,body .dcta:hover{transform:none;opacity:.92}
body .nb:active,body .sbt:active{transform:scale(.985)}
.sbt::before,.nb::before{display:none}
.ls{background:var(--ls-bg);border-color:var(--bd);border-radius:14px;color:var(--tx2)}
.qfb{border-radius:14px}
#pw{background:color-mix(in srgb,${b} 12%,transparent)}#pf{box-shadow:none}#pf::after{display:none}
@media(max-width:480px){body${k} .card{padding:30px 22px 24px;border-radius:22px}}
`}const Y={clean_warm:(e,t)=>{const a=`color-mix(in srgb,${e} 72%,#231c14)`;return`
body{background:color-mix(in srgb,${e} 7%,#fffdf8);justify-content:flex-start;padding-top:30px;overflow-x:hidden;overflow-y:auto}
#sc{display:none}
.fhead{display:flex}.steps{display:flex}
.steps i{background:color-mix(in srgb,${e} 16%,${t[1]});color:color-mix(in srgb,${e} 62%,${t[1]})}
.steps i.on,.steps i.dn{background:${a};color:#fff}
.steps i.dn+i::before{background:${a}}
body .card{border:0;border-radius:28px;box-shadow:0 18px 50px color-mix(in srgb,${e} 14%,transparent)}
body .card::before{display:block;height:5px;background:${e}!important}
.cn,.stag{color:${a}!important;background:color-mix(in srgb,${e} 14%,${t[1]})}
.ct,.stit,.dt{color:${a};-webkit-text-fill-color:${a}}
body .nb{flex:1}body .sbt{width:100%;justify-content:center}
body .nb,body .sbt,body .dcta{border-radius:18px;padding:18px 28px;font-size:17px}
.ci{padding:19px 18px}.cb{width:26px;height:26px}`},clean_white:()=>"",clean_pastel:(e,t)=>`
body{background:color-mix(in srgb,${e} 13%,#ffffff)}
body .card{border:0;box-shadow:0 20px 50px color-mix(in srgb,${e} 18%,transparent)}
.fi,.ci{background:color-mix(in srgb,${e} 5%,${t[1]});border-color:color-mix(in srgb,${e} 16%,${t[1]})}
.ct,.stit,.dt{color:color-mix(in srgb,${e} 55%,#17142a);-webkit-text-fill-color:color-mix(in srgb,${e} 55%,#17142a)}
body .nb,body .sbt,body .dcta{border-radius:999px}`,clean_band:e=>{const t=N(e);return`
body{justify-content:flex-start;padding-top:34px;overflow-x:hidden;overflow-y:auto}
body::before{display:block!important;content:'';position:fixed;top:0;left:0;right:0;height:236px;background:${t.c1};z-index:0}
.fhead{display:flex}.fhead b{color:${t.text}}.fhead span{color:${t.text};opacity:.78}
 18%,transparent);color:${t.text};box-shadow:none}
#gb,#sc{color:${t.text}}#pw{background:color-mix(in srgb,${t.text} 22%,transparent)}
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
#pw{background:rgba(255,255,255,.14)}`,clean_graphite:e=>`
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
body .nb{flex:1 1 auto}`,clean_pop:e=>{const t=N(e);return`
body{background:${t.c1}}
#gb,#sc{color:${t.text}}#pw{background:color-mix(in srgb,${t.text} 20%,transparent)}
body .card{border:3px solid #16161a;box-shadow:0 10px 0 #16161a}
body:not(.single-page) .card{border-radius:30px}
body:not(.single-page) .ct{font-weight:900;letter-spacing:-.03em}
.cn,.stag{background:#16161a;color:#fff}
.fi,.ci{border:2.5px solid #16161a}
.ci.ck{background:color-mix(in srgb,${e} 28%,#ffffff)}
.ci:hover:not(.qdisabled){border-color:#16161a}
body .nb,body .sbt,body .dcta{border:3px solid #16161a;border-radius:18px;box-shadow:0 5px 0 #16161a}
body .nb:active,body .sbt:active{transform:translateY(3px);box-shadow:0 2px 0 #16161a}`},clean_ticket:(e,t)=>`
body .card{border:0;box-shadow:0 14px 34px rgba(20,24,40,.1)}
body:not(.single-page) .card{border-radius:18px}
body .card::before{display:block;height:8px;background:${e}!important}
.cn,.stag{background:transparent;padding:0;border-radius:0;letter-spacing:.2em;font-family:ui-monospace,Menlo,Consolas,monospace}
.cf{position:relative;border-top:2px dashed ${t[5]};padding-top:22px}
.cf::before,.cf::after{content:'';position:absolute;top:-13px;width:24px;height:24px;border-radius:50%;background:${t[0]}}
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
.fi::placeholder{color:var(--tx3)}`,clean_sheet:e=>{const t=N(e);return`
body{background:${t.c1};justify-content:flex-end;padding:0;overflow-x:hidden;overflow-y:auto}
.wrap{max-width:560px;display:flex;flex-direction:column;min-height:100vh;justify-content:flex-end}
.fhead{display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin:0;padding:56px 26px 30px}
.fhead b{color:${t.text};font-size:clamp(24px,6.6vw,32px);letter-spacing:-.03em}
.fhead span{color:${t.text};opacity:.8;font-size:14px}
 18%,transparent);color:${t.text};box-shadow:none}
#gb,#sc{color:${t.text}}#pw{background:color-mix(in srgb,${t.text} 22%,transparent)}
body .card{border:0;box-shadow:0 -10px 40px rgba(0,0,0,.18)}
body:not(.single-page) .card{border-radius:30px 30px 0 0;padding:34px 26px 40px;min-height:52vh}
body:not(.single-page) .card::after{content:'';position:absolute;top:12px;left:50%;width:44px;height:5px;margin-left:-22px;border-radius:99px;background:var(--bd)}
body .nb{flex:1 1 auto}body .sbt{width:100%;justify-content:center}
@media(max-width:480px){body:not(.single-page) .card{border-radius:26px 26px 0 0}}`},clean_chip:e=>{const t=N(e);return`
body:not(.single-page) .cg{flex-direction:row;flex-wrap:wrap;gap:9px}
body:not(.single-page) .ci{flex:0 1 auto;border-radius:999px;padding:12px 18px;gap:0}
body:not(.single-page) .ci .cb{display:none}
.ci span,.ci .oi{flex:0 1 auto}
.ci.ck{background:${t.c1};border-color:${t.c1}}
.ci.ck span,.ci.ck .oi{color:${t.text}}
.ci .ot{flex:0 1 auto}.ci .od{display:none}
body .nb,body .sbt,body .dcta{border-radius:999px}`},clean_grid:e=>`
body:not(.single-page) .cg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
body:not(.single-page) .ci{flex-direction:column;align-items:flex-start;justify-content:space-between;min-height:104px;padding:16px;border-radius:20px;gap:12px}
.ci span,.ci .oi{flex:0 0 auto;width:100%}
.ci .ot{flex:0 0 auto;width:100%}
.ci.ck{border-color:${e};box-shadow:0 0 0 3px color-mix(in srgb,${e} 18%,transparent)}`,clean_stack:(e,t)=>`
body .card{border:1px solid var(--bd);box-shadow:8px 8px 0 -1px ${t[1]},8px 8px 0 0 var(--bd),16px 16px 0 -1px ${t[1]},16px 16px 0 0 var(--bd)}
body:not(.single-page) .card{border-radius:10px;margin-right:16px}
body:not(.single-page) .fi,body:not(.single-page) .ci{border-radius:8px}
.cn,.stag{border-radius:4px}
body .nb,body .sbt,body .dcta{border-radius:8px;box-shadow:none}`,clean_tab:(e,t)=>`
body .card{border:0;box-shadow:0 14px 36px rgba(20,24,40,.1);overflow:visible}
body:not(.single-page) .card{border-radius:0 22px 22px 22px;margin-top:38px}
body:not(.single-page) .cn{position:absolute;left:0;bottom:100%;margin:0;height:38px;align-items:center;padding:0 20px;border-radius:16px 16px 0 0;background:${t[1]};color:${e}}
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
body .nb,body .sbt,body .dcta{border-radius:2px;box-shadow:none;letter-spacing:.06em}`};function Pe(e,t){var n;const a=Ce[e];return a?Me(a,t)+(((n=Y[e])==null?void 0:n.call(Y,t,a))||""):null}const te={default:"Noto Sans KR",soft:"Gowun Dodum",cyber:"Gugi",serious:"Noto Serif KR",retro:"Do Hyeon",nature:"Gowun Batang",luxury:"Hahmlet",kawaii:"Jua",brutalist:"Black Han Sans",glass:"IBM Plex Sans KR",newspaper:"Nanum Myeongjo",midnight:"Song Myung",candy:"Sunflower",ink:"Yeon Sung",aurora:"Stylish",paper:"Nanum Pen Script",neon80s:"Do Hyeon",medical:"Gothic A1",forest:"Noto Serif KR",sunset:"Hi Melody",chalk:"Gaegu",ocean:"Gowun Batang",crypto:"Orbit",trading:"Nanum Gothic",defi:"IBM Plex Sans KR",bullrun:"Do Hyeon",bearish:"Noto Sans KR",bloomberg:"IBM Plex Sans KR",gold:"Nanum Myeongjo",matrix:"IBM Plex Sans KR"},Ge=new Set(["Noto Serif KR","Nanum Myeongjo","Gowun Batang","Hahmlet","Song Myung"]),De="'Noto Sans KR',sans-serif";function Ke(e,t){if(t&&t!==De)return t;const a=te[e]||te.default;return`'${a}',${Ge.has(a)?"serif":"sans-serif"}`}function Ue(e){var r;const t=((r=e.match(/['"]([^'"]+)['"]/))==null?void 0:r[1])||"Noto Sans KR",a={Sunflower:":wght@300;500;700","Noto Serif KR":":wght@400;500;600;700","Nanum Myeongjo":":wght@400;700","Nanum Gothic":":wght@400;700;800","Gowun Batang":":wght@400;700","IBM Plex Sans KR":":wght@400;500;600;700",Gaegu:":wght@300;400;700",Hahmlet:":wght@400;500;600;700","Gothic A1":":wght@400;500;600;700"};return`https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700${t==="Noto Sans KR"?"":`&family=${encodeURIComponent(t).replace(/%20/g,"+")}${a[t]||""}`}&display=swap`}const it=se.filter(e=>!e.hidden),Ye={soft:"clean_pastel",candy:"clean_pastel",kawaii:"clean_rose",sunset:"clean_warm",paper:"clean_note",newspaper:"clean_note",medical:"clean_white",serious:"clean_mono",brutalist:"clean_mono",ink:"clean_mono",nature:"clean_sage",forest:"clean_sage",ocean:"clean_band"};function de(e){return se.some(t=>t.id===e)?e:Ye[e]||"clean_graphite"}const st=[{label:"Noto Sans KR",value:"'Noto Sans KR',sans-serif",preview:"가나다"},{label:"Gmarket Sans",value:"'Gmarket Sans',sans-serif",preview:"가나다"},{label:"IBM Plex Sans KR",value:"'IBM Plex Sans KR',sans-serif",preview:"가나다"},{label:"Nanum Gothic",value:"'Nanum Gothic',sans-serif",preview:"가나다"},{label:"Nanum Barun Gothic",value:"'Nanum Barun Gothic',sans-serif",preview:"가나다"},{label:"KoPub Batang",value:"'KoPub Batang',serif",preview:"가나다"},{label:"Nanum Myeongjo",value:"'Nanum Myeongjo',serif",preview:"가나다"},{label:"Noto Serif KR",value:"'Noto Serif KR',serif",preview:"가나다"},{label:"Gowun Batang",value:"'Gowun Batang',serif",preview:"가나다"},{label:"Black Han Sans",value:"'Black Han Sans',sans-serif",preview:"가나다"},{label:"Gowun Dodum",value:"'Gowun Dodum',sans-serif",preview:"가나다"},{label:"Do Hyeon",value:"'Do Hyeon',sans-serif",preview:"가나다"},{label:"Jua",value:"'Jua',sans-serif",preview:"가나다"},{label:"Sunflower",value:"'Sunflower',sans-serif",preview:"가나다"},{label:"Dokdo",value:"'Dokdo',cursive",preview:"가나다"},{label:"Single Day",value:"'Single Day',cursive",preview:"가나다"},{label:"Gaegu",value:"'Gaegu',cursive",preview:"가나다"},{label:"Hi Melody",value:"'Hi Melody',cursive",preview:"가나다"},{label:"Cute Font",value:"'Cute Font',cursive",preview:"가나다"},{label:"Stylish",value:"'Stylish',sans-serif",preview:"가나다"},{label:"East Sea Dokdo",value:"'East Sea Dokdo',cursive",preview:"가나다"},{label:"Nanum Pen Script",value:"'Nanum Pen Script',cursive",preview:"가나다"},{label:"Nanum Brush Script",value:"'Nanum Brush Script',cursive",preview:"가나다"},{label:"Montserrat",value:"'Montserrat',sans-serif",preview:"Aa가나"},{label:"Playfair Display",value:"'Playfair Display',serif",preview:"Aa가나"},{label:"Space Grotesk",value:"'Space Grotesk',sans-serif",preview:"Aa가나"},{label:"DM Sans",value:"'DM Sans',sans-serif",preview:"Aa가나"}];function He(e,t,a,n){return Pe(de(e),t)}function Fe(e,t,a){var s;const n=[],r=new Set;let c=0;for(;c>=0&&c<e&&!r.has(c);){n.push(c),r.add(c);const b=(s=t[c])==null?void 0:s[a[c]];if(b==="done")break;const f=Number(b);c=b!=null&&Number.isInteger(f)&&f>=0&&f<e?f:c+1}return n}const Qe=`
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
`,Xe=`
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
`,We=`
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
`,Je=`
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
`,Ze=`
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
`;function Ve(e){return e==="ocean"?Je:e==="glass"?Ze:""}const oe=e=>(typeof e=="string"||Number.isSafeInteger(e))&&/^[a-zA-Z0-9_-]+$/.test(String(e));function dt(e){const t=new Set(e.map(n=>String(n.id)));let a=1;for(;t.has(`q_${a}`);)a++;return`q_${a}`}function et(e=[],t={}){const a=new Set(e.filter(s=>oe(s.id)).map(s=>String(s.id))),n=new Set,r={...t};return{questions:e.map((s,b)=>{const f=String(s.id);if(oe(s.id)&&!n.has(f))return n.add(f),s;let m=b+1;for(;a.has(`q_${m}`)||n.has(`q_${m}`);)m++;const y=`q_${m}`;return n.add(y),Object.hasOwn(t,f)&&(r[y]=t[f]),{...s,id:y}}),qImgData:r}}function ct(e,t){const a=new Map(t.map((n,r)=>[String(n.id),r]));return t.map(n=>n.branches?{...n,branches:n.branches.flatMap(r=>{if(r.targetIdx==="done")return[{...r}];const c=e[r.targetIdx],s=c&&a.get(String(c.id));return s==null?[]:[{...r,targetIdx:s}]})}:n)}function lt(e,t){if(!e.options||e.options.length<=1||t<0||t>=e.options.length)return e;const a={...e,options:e.options.filter((n,r)=>r!==t)};return e.optionMeta&&(a.optionMeta=e.optionMeta.filter((n,r)=>r!==t)),e.correctAnswer!=null&&(a.correctAnswer=e.correctAnswer===t?0:e.correctAnswer-(e.correctAnswer>t?1:0)),e.branches&&(a.branches=e.branches.filter(n=>n.optionIdx!==t).map(n=>({...n,optionIdx:n.optionIdx-(n.optionIdx>t?1:0)}))),a}const tt={phone:"전화번호",email:"이메일",legal:"동의"},ae=["_ts","_formTitle","__proto__","constructor","prototype"];function ot(e){const t=e.map((r,c)=>r.type==="quiz"?`Q${c+1}_답`:r.label||tt[r.type]||`q${c}`),a=new Set(ae),n=new Set([...t,...ae]);return t.map((r,c)=>{let s=r,b=c+1;if(a.has(s))do s=`${r} (Q${b++})`;while(a.has(s)||n.has(s));return a.add(s),s})}const H=e=>/^#[0-9a-f]{6}$/i.test(e||"")?e:"",ne={square:6,round:16,pill:999},re={left:["left","0","auto"],center:["center","auto","auto"],right:["right","auto","0"]},ie=e=>(parseInt(e.slice(1,3),16)*299+parseInt(e.slice(3,5),16)*587+parseInt(e.slice(5,7),16)*114)/255e3>.6,pt={header:!0,steps:"dots",stepLabel:!0,topBar:!0,align:"top",bg:"#fdf6e9",card:"#ffffff",radius:28,btnShape:"round",btnWide:!0,size:"lg"};function at(e={}){const t=[],a=H(e.bg),n=H(e.card),r=H(e.titleColor);if(e.header!=null&&t.push(`body .fhead{display:${e.header?"flex":"none"}}`),e.steps==="dots"&&t.push("body .steps{display:flex}#pw{display:none}#sc{display:none}"),e.steps==="bar"&&t.push("body .steps{display:none}#pw{display:block}"),e.steps==="none"&&t.push("body .steps{display:none}#pw{display:none}#sc{display:none}"),e.stepLabel!=null&&t.push(`body .cn{display:${e.stepLabel?"inline-flex":"none"}}`),e.topBar!=null&&t.push(`body .card::before{display:${e.topBar?"block":"none"}!important;height:5px}`),e.align==="top"&&t.push("body{justify-content:flex-start;padding-top:30px;overflow-x:hidden;overflow-y:auto}"),e.align==="center"&&t.push("body{justify-content:center}"),a&&t.push(`body{background:${a}!important}body::before,body::after{display:none!important}`),a&&t.push(ie(a)?"body .fhead b{color:#2b2622}body .fhead span,#gb,#sc,#kh{color:#7d746a}":"body .fhead b{color:#f3f4f6}body .fhead span,#gb,#sc,#kh{color:#b6bcc6}"),n&&t.push(`body .card{background:${n}!important}`+(ie(n)?":root{--tx:#2b2622;--tx2:#6f665c;--tx3:#8c8276;--bd:rgba(60,45,20,.14);--bd2:rgba(60,45,20,.3);--bg2:#fff;--ls-bg:rgba(60,45,20,.04)}":":root{--tx:#f3f4f6;--tx2:#c3c8d0;--tx3:#9aa1ad;--bd:rgba(255,255,255,.14);--bd2:rgba(255,255,255,.3);--bg2:rgba(255,255,255,.06);--ls-bg:rgba(255,255,255,.04)}")+"body .card,body .ct,body .stit,body .dt{color:var(--tx)!important;-webkit-text-fill-color:var(--tx)!important}body .ct,body .stit,body .dt{background:none!important;text-shadow:none!important}body .fi,body .ci{background:var(--bg2)!important;color:var(--tx)!important;border-color:var(--bd)!important}body .ci span,body .ci .oi{color:var(--tx)!important}body .cs,body .sdesc,body .dd,body .ls{color:var(--tx2)!important}"),r&&t.push(`body .ct,body .stit,body .dt{color:${r}!important;-webkit-text-fill-color:${r}!important;background:none!important}`),Number.isFinite(e.radius)){const c=Math.min(40,Math.max(0,Math.round(e.radius)));t.push(`body .card{border-radius:${c}px!important}body .fi,body .ci,body .ls{border-radius:${Math.round(c*.6)}px!important}`)}if(re[e.textAlign]){const[c,s,b]=re[e.textAlign];t.push(`body .card{text-align:${c}}body .cn,body .stag{margin-left:${s};margin-right:${b};align-self:auto}body .fi{text-align:${c}}body .steps{justify-content:${e.textAlign==="center"?"center":e.textAlign==="right"?"flex-end":"flex-start"}}body .ct::after{margin-left:${s};margin-right:${b}}`)}return e.optAlign==="left"&&t.push("body .ci{justify-content:flex-start;text-align:left}"),e.optAlign==="center"&&t.push("body .ci{justify-content:center;text-align:center}body .ci span,body .ci .ot{flex:0 1 auto}body .ot{justify-content:center}"),e.optAlign==="right"&&t.push("body .ci{justify-content:flex-end;text-align:right}body .ci span,body .ci .ot{flex:0 1 auto}body .ot{justify-content:flex-end}"),e.btnAlign==="left"&&t.push("body .cf{justify-content:flex-start}body .cf .nb{flex:0 1 auto;order:-1}body .cf .bb{margin-left:auto}body .sbt{width:auto}"),e.btnAlign==="center"&&t.push("body .cf{justify-content:center}body .cf .nb{flex:0 1 auto}body .sbt{width:auto}"),e.btnAlign==="right"&&t.push("body .cf{justify-content:space-between}body .cf .nb{flex:0 1 auto;margin-left:auto}body .sbt{width:auto}"),ne[e.btnShape]!=null&&t.push(`body .nb,body .sbt,body .dcta,body.single-page .single-submit{border-radius:${ne[e.btnShape]}px!important}`),e.btnWide!=null&&t.push(e.btnWide?"body .nb{flex:1}body .sbt{width:100%;justify-content:center}":"body .nb{flex:0 1 auto}body .sbt{width:auto}"),e.size==="lg"&&t.push("body .ct{font-size:clamp(22px,5.6vw,27px)!important;line-height:1.35}body .cs,body .sdesc{font-size:15px}body .fi{font-size:17px;padding:17px 18px}body .ci{padding:19px 18px;gap:15px}body .ci span,body .ci .oi{font-size:16px;font-weight:600}body .cb{width:26px;height:26px}body .nb,body .sbt{font-size:17px;padding:18px 28px}body .od{font-size:14px}"),t.join(`
`)}function l(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function v(e){return String(e||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/</g,"\\u003c").replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")}const L=e=>JSON.stringify(e).replace(/</g,"\\u003c");function bt(e,t,a,n={},r={}){const{animType:c=0,fontFamily:s="'Noto Sans KR',sans-serif",conceptTheme:b="default",useStart:f=!0,bgBlur:m=0,bgOverlay:y=.5,bgOverlayColor:_="#000000",allowBack:T=!0,autoNext:B=!1,useConfetti:$=!0,useKb:S=!0,layout:j="steps",submitBtnText:ce="제출하기",waitForSubmit:le=!1,startTag:pe="✦ Form",startBtnText:be="시작하기",startDesc:R="",doneTitle:fe="제출 완료!",doneDesc:ge="응답해주셔서 감사합니다 🎉",doneCta:F="",doneUrl:O="",donePdfUrl:xe="",look:Q={},scriptUrl:ue="https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec"}=n,z=de(b),x=j==="single",A=S&&!x,me=xe||(/\.pdf(\?|#|$)/i.test(O)?O:""),C=Object.hasOwn(r,"coverImgData")?r.coverImgData:n.coverImgData??null,X=et(t,r.qImgData??n.qImgData??{});t=X.questions;const M=X.qImgData,K=ot(t),P=Object.hasOwn(r,"bgImgData")?r.bgImgData:n.bgImgData??null,w=t.length,he=o=>/hot|인기/i.test(o)?"hot":/event|이벤트/i.test(o)?"event":/추천|best/i.test(o)?"pick":/free|무료/i.test(o)?"free":"new",W=(o,i,d)=>{var u;const p=o.optionDetail?((u=o.optionMeta)==null?void 0:u[d])||{}:{};return!p.desc&&!p.badge?`<span>${l(i)}</span>`:`<div class="ot"><span>${l(i)}</span>${p.badge?`<em class="ob ob-${he(p.badge)}">${l(p.badge)}</em>`:""}${p.desc?`<small class="od">${l(p.desc)}</small>`:""}</div>`};if(!w)return'<html><body style="background:#f7f8fa;color:#8c8f96;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px">질문을 추가해주세요.</body></html>';const J=t.some(o=>o.type==="quiz"),ye=L(t.reduce((o,i,d)=>(i.type==="quiz"&&(o[d]={correct:i.correctAnswer??0,explanation:i.explanation||""}),o),{})),ve=L(t.reduce((o,i,d)=>{var p;if((i.type==="single"||i.type==="quiz")&&((p=i.branches)!=null&&p.length)){const u={};i.branches.forEach(I=>{I.targetIdx!=null&&(u[I.optionIdx]=I.targetIdx)}),Object.keys(u).length&&(o[d]=u)}return o},{}));L(t.map(o=>o.id));const we=He(z,a.c1,a.c2),ke=Ve(z),Z=z.startsWith("clean_"),G=N(a.c1,Z?a.c1:a.c2),D=G.text,V=Z?G.c1:`linear-gradient(${z==="ocean"?110:z==="glass"?115:135}deg,${G.c1},${G.c2})`,$e=Ue(Ke(z,s)),Se=["@keyframes siU{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-8px)}}@keyframes siD{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}@keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(8px)}}.en{animation:siU .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:soU .22s ease both}.ep{animation:siD .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:soD .22s ease both}","@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}@keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}}.en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fdo .28s ease both}","@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}}.en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fxOut .28s ease both}","@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyInR{from{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}}@keyframes fyOutR{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}}.en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both}.ep{animation:fyInR .42s cubic-bezier(.22,1,.36,1) both}.xp{animation:fyOutR .28s ease both}","@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}@keyframes ziOut{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.2)}}.en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both}.ex,.xp{animation:ziOut .28s ease both}","@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}@keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}}@keyframes slInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}@keyframes slOutR{from{opacity:1}to{opacity:0;transform:translateX(60px)}}.en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both}.ep{animation:slInR .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:slOutR .28s ease both}","@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}80%{transform:translateY(4px)}100%{opacity:1;transform:none}}@keyframes bnOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(.95)}}.en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:bnOut .28s ease both}","@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}}@keyframes rzOut{from{opacity:1}to{opacity:0;transform:rotate(8deg) scale(.85)}}.en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:rzOut .28s ease both}","@keyframes glIn{0%{opacity:0;transform:translateX(-4px) skewX(3deg)}20%{transform:translateX(3px) skewX(-2deg)}40%{transform:translateX(-2px) skewX(1deg)}100%{opacity:1;transform:none}}@keyframes glOut{0%{opacity:1}50%{transform:translateX(4px) skewX(-3deg)}100%{opacity:0;transform:translateX(-4px)}}.en,.ep{animation:glIn .45s ease both}.ex,.xp{animation:glOut .28s ease both}","@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6);transform-origin:top}to{opacity:1;transform:none}}@keyframes ufOut{from{opacity:1}to{opacity:0;transform:translateY(30px) scaleY(.6);transform-origin:bottom}}.en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:ufOut .28s ease both}"][c]||"",ze=t.map((o,i)=>{const d=M[o.id]&&x?`<img class="question-image" src="${l(M[o.id])}" loading="lazy" decoding="async" alt="">`:M[o.id]?`<img class="question-image" src="${M[o.id]}" loading="lazy" decoding="async" alt="">`:"";let p="";if(o.type==="short")p=`<input type="text" class="fi" id="f${o.id}" placeholder="${l(o.placeholder||"답변을 입력하세요...")}">`;else if(o.type==="long")p=`<textarea class="fi" id="f${o.id}" style="height:110px;resize:none;padding-top:13px;line-height:1.6" placeholder="${l(o.placeholder||"답변을 입력하세요...")}"></textarea>`;else if(o.type==="phone")p=`<div style="position:relative"><div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none">🇰🇷 +82</div><input type="tel" class="fi" id="f${o.id}" style="padding-left:72px" placeholder="010-0000-0000" inputmode="tel"></div>`;else if(o.type==="email")p=`<input type="email" class="fi" id="f${o.id}" placeholder="example@email.com" inputmode="email">`;else if(o.type==="multiple"){const g=(o.options||[]).map((E,q)=>`<div class="ci" onclick="pick(this,'g${o.id}',true)"><div class="cb"></div>${W(o,E,q)}</div>`).join(""),h=o.other?`<div class="ci" onclick="pickOther(this,'g${o.id}',true)"><div class="cb"></div><input class="oi" placeholder="기타..." id="oi${o.id}" onclick="event.stopPropagation()"></div>`:"";p=`<div class="cg" id="g${o.id}">${g}${h}</div>`}else if(o.type==="single"){const g=(o.options||[]).map((E,q)=>`<div class="ci si" data-oi="${q}" onclick="pick(this,'g${o.id}',false)"><div class="cb rb"></div>${W(o,E,q)}</div>`).join(""),h=o.other?`<div class="ci si" onclick="pickOther(this,'g${o.id}',false)"><div class="cb rb"></div><input class="oi" placeholder="기타..." id="oi${o.id}" onclick="event.stopPropagation()"></div>`:"";p=`<div class="cg" id="g${o.id}">${g}${h}</div>`}else if(o.type==="quiz"){const g=(o.options||[]).map((h,E)=>`<div class="ci si qo" data-oi="${E}" onclick="pickQuiz(this,'g${o.id}',${i})"><div class="cb rb"></div><span>${l(h)}</span></div>`).join("");p=`<div class="cg" id="g${o.id}">${g}</div><div class="qfb" id="qfb${i}" style="display:none"></div>`}else o.type==="legal"&&(p=`<div class="ls">${l(o.legalText||"").replace(/\n/g,"<br>")}</div><div class="la" id="la${o.id}" onclick="this.classList.toggle('ck')"><div class="ld"></div><span style="font-size:13px;color:var(--tx2);font-weight:300"><strong style="color:var(--tx);font-weight:500">위 내용에 동의합니다.</strong></span></div>`);if(x){if(["single","multiple","quiz"].includes(o.type)){const g=o.type==="multiple",h=g?"checkbox":"radio",E=(o.options||[]).map((Le,Ne)=>`<label class="ci${g?"":" si"}" data-oi="${Ne}"><input class="native-choice" type="${h}" name="g${o.id}" onchange="pick(this.parentElement,'g${o.id}',${g})"><div class="cb${g?"":" rb"}"></div><span>${l(Le)}</span></label>`).join(""),q=o.other&&o.type!=="quiz"?`<label class="ci${g?"":" si"}"><input class="native-choice" type="${h}" name="g${o.id}" aria-label="기타" onchange="if(${g}&&!this.checked)pick(this.parentElement,'g${o.id}',true);else pickOther(this.parentElement,'g${o.id}',${g})"><div class="cb${g?"":" rb"}"></div><input class="oi" placeholder="기타..." aria-label="기타 답변" id="oi${o.id}" onfocus="pickOther(this.parentElement,'g${o.id}',${g})"></label>`:"";p=`<div class="cg" id="g${o.id}" role="group" aria-labelledby="label${o.id}">${E}${q}</div>`}else o.type==="legal"&&(p=`<div class="ls">${l(o.legalText||"").replace(/\n/g,"<br>")}</div><label class="la" id="la${o.id}"><input class="native-choice" type="checkbox" onchange="this.parentElement.classList.toggle('ck',this.checked)"><div class="ld"></div><span>위 내용에 동의합니다.</span></label>`);return p=p.replace(/ onkeydown="[^"]*"/g,"").replace(/class="fi"/g,`class="fi" aria-labelledby="label${o.id}" aria-describedby="hint${o.id} e${i}" aria-required="${!!o.required}"`),`<section class="single-question" id="sl${i}" aria-labelledby="label${o.id}">
        ${d}<div class="question-heading"><label class="ct" id="label${o.id}" for="f${o.id}">${l(o.label||"질문")}</label><span class="required">${o.required?"필수":"선택"}</span></div>
        <div class="cs" id="hint${o.id}"${o.hint?"":" hidden"}>${l(o.hint||"")}</div>
        ${p}<div class="em" id="e${i}" role="alert"></div>
      </section>`}const u=i===w-1,I=T?`<button class="bb" onclick="gp(${i})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>`:"<span></span>",Ae=o.type==="quiz"?`<button class="nb" id="qcb${i}" onclick="quizCheck(${i})"><span class="nl">정답 확인</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
<button class="nb" id="qnb${i}" onclick="gn(${i})" style="display:none"><span class="nl">${u?"결과 보기 🎉":"다음 질문"}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`:`<button class="nb" onclick="${u?"sub()":"gn("+i+")"}"${u?' id="sb"':""}><span class="sp"></span><span class="nl">${u?"신청 완료하기 🎉":"다음 질문"}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`;return`<div class="sl" id="sl${i}" style="display:none">
  <div class="card">${d}
    ${w<=8?`<div class="steps" style="--n:${w}">${t.map((g,h)=>`<i${h<i?' class="dn"':h===i?' class="on"':""}>${h+1}</i>`).join("")}</div>`:""}
    <div class="cn">STEP ${String(i+1).padStart(2,"0")} / ${String(w).padStart(2,"0")}</div>
    <div class="ct">${l(o.label||"질문")}</div>
    ${o.hint?`<div class="cs">${l(o.hint)}</div>`:""}
    <div style="margin-top:6px">${p}</div>
    <div class="em" id="e${i}"></div>
    <div class="cf">${I}${Ae}</div>
  </div>
</div>`}).join(""),Ie=t.map((o,i)=>{const d={...o,label:K[i]};if(d.type==="short"||d.type==="long"){const p=["이름","성함","성명","닉네임","name"].some(I=>String(d.label||"").toLowerCase().includes(I.toLowerCase())),u=je(o);return`case ${i}:{const v=document.getElementById('f${d.id}')?.value.trim()||'';${d.required?`if(!v){er(${i},'답변을 입력해주세요.');return false;}`:""}${p?`if(v){const nv=v.replace(/[s._-·•・,，。!@#$%^&*+=~\`|\\/?:;[]{}<>"']/g,'');const lw=nv.toLowerCase();const badWords=['샘플','sample','demo','dummy','asdf','qwer','확인용','삭제','연습'];if(!nv||nv.length<2||/^[0-9]+$/.test(nv)||/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(nv)||(/^(.)\\1+$/.test(nv)&&nv.length<=4)||badWords.some(w=>lw.includes(w.toLowerCase()))){er(${i},'정확한 이름을 입력해주세요.');return false;}}`:""}${u?`if(v&&!validPhone(v)){er(${i},'올바른 전화번호를 입력해주세요.');return false;}`:""}ans['${v(d.label||"q"+i)}']=v;break;}`}return d.type==="phone"?`case ${i}:{const v=document.getElementById('f${d.id}')?.value.trim()||'';${d.required?`if(!v){er(${i},'전화번호를 입력해주세요.');return false;}`:""}if(v&&!validPhone(v)){er(${i},'올바른 전화번호를 입력해주세요.');return false;}ans['${v(d.label||"전화번호")}']=v;break;}`:d.type==="email"?`case ${i}:{const v=document.getElementById('f${d.id}')?.value.trim()||'';if((${!!d.required}&&!v)||(v&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v))){er(${i},'올바른 이메일을 입력해주세요.');return false;}ans['${v(d.label||"이메일")}']=v;break;}`:d.type==="multiple"?`case ${i}:{const sel=[...document.querySelectorAll('#g${d.id} .ci.ck')].map(el=>{const oi=el.querySelector('.oi');return oi?oi.value||'기타':el.querySelector('span').textContent;});${d.required?`if(!sel.length){er(${i},'하나 이상 선택해주세요.');return false;}`:""}ans['${v(d.label||"q"+i)}']=sel.join(', ');break;}`:d.type==="single"?`case ${i}:{const el=document.querySelector('#g${d.id} .ci.ck');const oi=el?.querySelector('.oi');const sel=oi?oi.value||'기타':el?.querySelector('span')?.textContent||'';${d.required?`if(!sel){er(${i},'선택해주세요.');return false;}`:""}ans['${v(d.label||"q"+i)}']=sel;break;}`:d.type==="quiz"?`case ${i}:{const el=document.querySelector('#g${d.id} .ci.ck');${d.required?`if(!el){er(${i},'보기를 선택해주세요.');return false;}`:""}break;}`:d.type==="legal"?`case ${i}:{${d.required?`if(!document.getElementById('la${d.id}')?.classList.contains('ck')){er(${i},'동의가 필요합니다.');return false;}`:""}ans['${v(d.label||"동의")}']=document.getElementById('la${d.id}')?.classList.contains('ck')?'동의':'미동의';break;}`:`case ${i}:break;`}).join(`
`),Ee=K[t.findIndex(o=>o.type==="short")]||"",_e=f&&!x?`<div id="ss" class="sl active" style="display:flex"><div class="card">
    ${C?`<img class="cover-image" src="${C}" loading="eager" decoding="async" alt="">`:""}
    <div class="stag">${l(pe)}</div>
    <div class="stit">${l(e).replace(/\n/g,"<br>")}</div>
    ${R?`<div class="sdesc">${l(R)}</div>`:""}
    <button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${l(be)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <div style="font-size:12px;color:var(--tx3);margin-top:14px">총 ${w}개 질문</div>
  </div></div>`:"",Te=$?`function cf(){const w=document.getElementById('cfw'),colors=['${a.c1}','${a.c2}','#f0eff8','#4ade80','#fbbf24','#f472b6','#38bdf8'];for(let i=0;i<90;i++){const p=document.createElement('div'),c=colors[i%colors.length],sz=5+Math.random()*8;p.style.cssText='position:absolute;top:-12px;left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(Math.random()>.5?'50%':'3px')+';animation:cff '+(1.6+Math.random()*1.6)+'s '+(Math.random()*.9)+'s linear forwards';w.appendChild(p);}setTimeout(()=>w.innerHTML='',4500);}`:"",Be=A?`document.addEventListener('keydown',e=>{
    if(e.defaultPrevented||e.isComposing||e.keyCode===229||e.repeat||e.ctrlKey||e.altKey||e.metaKey||anim||submitted)return;
    const target=e.target,tag=target?.tagName;
    if(target?.isContentEditable||['TEXTAREA','SELECT','BUTTON','A'].includes(tag))return;
    if(e.key==='Enter'||(e.key==='ArrowRight'&&tag!=='INPUT')){
      e.preventDefault();
      if(cur<0)sf();else if(cur<TOTAL){const q=QS[cur];if(q&&q.type==='quiz')quizCheck(cur);else gn(cur);}
    }
    if((e.key==='ArrowLeft'||e.key==='Backspace')&&tag!=='INPUT'&&${T}&&(cur>0||HIST.length>0)){e.preventDefault();gp(cur);}
  });`:"",qe=J?'<div id="qscore" style="margin:10px 0 4px;font-size:15px;font-weight:600"></div>':"";return`<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${l(e)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&display=swap" rel="stylesheet">
<link href="${$e}" rel="stylesheet">
<style>
:root{--c1:${a.c1};--c2:${a.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15);--ls-bg:rgba(255,255,255,.025)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${s};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden;-webkit-font-smoothing:antialiased;position:relative}
${P?`#bg-img{position:fixed;inset:0;z-index:-2;background-image:url('${P}');background-size:cover;background-position:center;filter:blur(${m}px);transform:scale(${m>0?1.05:1});transition:filter .3s}#bg-overlay{position:fixed;inset:0;z-index:-1;background:${_};opacity:${y}}`:""}
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
${we}
${s!=="'Noto Sans KR',sans-serif"?`body{font-family:${s}!important}.ct,.stit{font-family:${s}!important}`:""}
.nb{background:linear-gradient(135deg,${a.c1},${a.c2})!important}.nb:hover{box-shadow:0 8px 28px color-mix(in srgb,${a.c1} 40%,transparent)!important}
.sbt{background:linear-gradient(135deg,${a.c1},${a.c2})!important}
.ci.ck{border-color:${a.c1}!important}.ci.ck .cb{background:${a.c1}!important;border-color:${a.c1}!important}
.cn{color:${a.c1}!important}.card::before{background:linear-gradient(90deg,transparent,${a.c1},${a.c2},transparent)!important}
#pf{background:linear-gradient(90deg,${a.c1},${a.c2})!important}
${Se}
@media(prefers-reduced-motion:reduce){.en,.ex,.ep,.xp{animation-duration:.01s!important}}
@media(max-width:480px){.card{padding:28px 22px 22px;border-radius:20px}.ct{font-size:19px}}
${x?Qe:""}
${We}
${ke}
body .nb,body .sbt,body .dcta,body.single-page .single-submit{color:${D}!important}
body .nb,body .sbt,body .dcta,body.single-page .single-submit{background:${V}!important}
body .nb:hover,body .sbt:hover,body .dcta:hover,body.single-page .single-submit:hover{color:${D}!important;background:${V}!important}
body .nb .sp,body .sbt .sp{border-color:color-mix(in srgb,${D} 30%,transparent);border-top-color:${D}}
${at(Q)}
${P&&z.startsWith("clean_")?"body{background:transparent}":""}
</style></head><body${x?' class="single-page"':""}>
${P?'<div id="bg-img"></div><div id="bg-overlay"></div>':""}
<div id="pw"><div id="pf"></div></div>
<div id="sc"></div>
<button id="gb" onclick="gp(cur)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>
<div id="cfw"></div>
${A?'<div id="kh"><kbd>Enter</kbd> 또는 <kbd>→</kbd> 로 다음으로</div>':""}
<div id="tst"></div>
<div class="wrap">
<div class="fhead"><div><b>${l(e)}</b><span>${l(Q.headerSub||`총 ${w}개 질문`)}</span></div></div>
  ${_e}
  ${x?`<main class="card single-sheet" id="single-form">
    <header class="single-header">
      ${C?`<img class="single-cover" src="${l(C)}" decoding="async" alt="">`:""}
      <h1 class="single-title">${l(e||"신청서")}</h1>
      ${R?`<p class="single-desc">${l(R)}</p>`:""}
    </header>`:""}
  ${ze}
  ${x?`<footer class="single-footer"><button class="nb single-submit" id="sb" type="button" onclick="submitSingle()"><span class="sp"></span><span class="nl">${l(ce||"제출하기")}</span></button></footer></main>`:""}
  <div class="sl" id="done"><div class="card done-card">
    <div class="dr"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div class="dt">${l(fe)}</div>
    ${qe}
    <div class="dd"><span class="dn" id="dn"></span>${l(ge)}</div>
    ${F&&O?`<a class="dcta" href="${l(O)}" target="_blank">${l(F)} →</a>`:""}
    <button class="drst" onclick="rst()">다시 제출하기</button>
  </div></div>
</div>
<script>
const SU='${v(ue)}';
const SINGLE_PAGE=${x};
const WAIT_FOR_SUBMIT=${!!le};
const TOTAL=${w};
const QUIZ=${ye};
const BRANCH=${ve};
const QS=${L(t.map(o=>({id:o.id,type:o.type,required:!!o.required})))};
const ANSWER_KEYS=${L(K)};
const getFormPath=${Fe.toString()};
const HIST=[];
let cur=${x?"0":"-1"},anim=false,submitted=false;
let qzScore=0,qzTotal=0,qzDone={};
const ans={};
upUI();
${!f&&!x?"initFirst();":""}
function initFirst(){cur=0;const s=document.getElementById('sl0');if(s){s.style.display='flex';s.classList.add('active');const i=s.querySelector('input,textarea');if(i)setTimeout(()=>i.focus(),80);}upUI();}
function sid(i){return i<0?'ss':i>=TOTAL?'done':'sl'+i}
function upUI(){
  if(SINGLE_PAGE)return;
  if(cur<0||cur>=TOTAL){document.getElementById('pf').style.width=cur>=TOTAL?'100%':'0%';document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';return;}
  document.getElementById('pf').style.width=((cur+1)/TOTAL*100)+'%';
  document.getElementById('sc').textContent=(cur+1)+' / '+TOTAL;
  document.getElementById('sc').style.opacity='1';
  document.getElementById('gb').className=(${T}&&(cur>0||HIST.length>0))?'v':'';
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
  ${B&&!x?"if(!multi){const s=cur;if(document.querySelectorAll('#'+gid+' .ci.ck').length===1)setTimeout(()=>{if(cur===s)gn(s);},320);}":""}}
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
function vld(s){ce();switch(s){${Ie}default:break;}return true;}
const validPhone = ${Re.toString()};
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
  try{window.parent.postMessage({type:'FORM_SUBMIT',answers:ans,pdfUrl:'${v(me)}'},'*');}catch(e){}
  if(WAIT_FOR_SUBMIT){setSubmissionBusy(true);return;}
  completeForm();
}
function completeForm(){
  if(SU){try{Promise.resolve(fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)})).catch(()=>{});}catch(e){}}
  const f=cur;cur=TOTAL;
  const dn=document.getElementById('dn');
  if(dn){const nk='${v(Ee)}';if(ans[nk])dn.textContent=ans[nk]+', ';}
  ${J?"const sc=document.getElementById('qscore');if(sc&&qzTotal>0){const p=Math.round(qzScore/qzTotal*100);sc.textContent='🏆 점수: '+qzScore+' / '+qzTotal+' ('+p+'%)';sc.style.color=p>=70?'#4ade80':p>=40?'#fbbf24':'#f87171';}":""}
  document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';
  ${A?"document.getElementById('kh').style.opacity='0';":""}
  if(SINGLE_PAGE){document.getElementById('single-form').hidden=true;document.getElementById('done').style.display='flex';window.scrollTo(0,0);}
  else go(f,TOTAL,'n');
  document.getElementById('pf').style.width='100%';
  ${$?"if(!qzTotal||qzScore===qzTotal)setTimeout(cf,420);else if(qzScore>0)setTimeout(cf,420);":""}
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
  ${A?"document.getElementById('kh').style.opacity='1';":""}
  const f=cur;cur=-1;
  ${f?"go(f,-1,'p');upUI();":"document.getElementById('done').style.display='none';initFirst();"}
}
${Te}
function rp(e,btn){const r=btn.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2,el=document.createElement('span');el.className='rp';el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';btn.appendChild(el);setTimeout(()=>el.remove(),560);}
function tst(m,t){const el=document.getElementById('tst');el.textContent=m;el.className=t+' on';setTimeout(()=>el.className='',3200);}
${Be}
${x?Xe:`
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
${A?"setTimeout(()=>document.getElementById('kh').style.opacity='0',5000);":""}
<\/script></body></html>`}export{it as C,pt as F,st as a,dt as b,ct as c,lt as d,ot as e,bt as g,et as n,de as r};
