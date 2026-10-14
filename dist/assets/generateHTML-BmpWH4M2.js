const he={clean_white:["#f3f5f6","#fff","#20282c","#59676c","#7c898f","#dfe5e8","#f7f9fa"],clean_graphite:["#181a1c","#222527","#f3f5f5","#b8c0c3","#97a2a7","#3d4549","#292e31"],clean_rose:["#f9f2f4","#fff","#3b2b33","#7b626d","#967c87","#eadce2","#fcf8fa"],clean_sage:["#eef3fb","#fff","#263652","#61718c","#8190a8","#d7e0ee","#f6f8fc"]};function ve(o,a){const r=he[o];if(!r)return null;const[i,n,d,l,b,g,m]=r;return`
:root{--tx:${d};--tx2:${l};--tx3:${b};--bg2:${m};--bd:${g};--bd2:${b};--ls-bg:${m}}
body{background:${i};color:var(--tx)}body::before,body::after{display:none}
body .card{background:${n};border:1px solid var(--bd);border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.04);backdrop-filter:none}
.card::before{display:none}
.ct,.stit,.dt{font-family:inherit;color:var(--tx);background:none;-webkit-text-fill-color:var(--tx);text-shadow:none}
.fi,.ci{background:var(--bg2);color:var(--tx);border:1px solid var(--bd);border-radius:6px;backdrop-filter:none}
.fi:focus{background:${n};border-color:${a};box-shadow:0 0 0 3px color-mix(in srgb,${a} 12%,transparent)}
.ci:hover:not(.qdisabled){box-shadow:none;border-color:${a}}
.ci.ck{background:color-mix(in srgb,${a} 9%,${n});box-shadow:none}
body .nb,body .sbt,body .dcta{background:${a}!important;color:#fff;border-radius:6px;text-shadow:none}
body .nb:hover,body .sbt:hover,body .dcta:hover{box-shadow:none!important}
.sbt::before,.nb::before{display:none}
.stag{background:transparent;border:0;padding:0;border-radius:0;box-shadow:none;color:${a}}
.ls{background:var(--ls-bg);border-color:var(--bd);color:var(--tx2)}
#pf{box-shadow:none}#pf::after{display:none}
@media(max-width:480px){body .card{border-radius:8px}}
`}const G={default:".start-intro{padding:0 0 4px}.single-header{padding-bottom:36px}.fi{border-bottom-width:2px}.ci.ck{box-shadow:inset 3px 0 var(--c1)!important}",soft:".start-card,.single-header{text-align:center}.start-card .cover-image{width:88%;align-self:center;border:8px solid var(--theme-surface);box-shadow:0 8px 24px color-mix(in srgb,var(--c1) 9%,transparent)}.stag{display:inline-flex}.sdesc{margin-left:auto;margin-right:auto}.sbt{width:100%;justify-content:center;gap:24px}.single-cover{width:88%!important;margin-left:auto;margin-right:auto}.fi,.ci{border-width:2px}.cf{border:0}.done-card{border:0}",cyber:".start-card .cover-image{border:1px solid var(--theme-ink);padding:6px;clip-path:polygon(14px 0,100% 0,100% calc(100% - 14px),calc(100% - 14px) 100%,0 100%,0 14px)}.start-intro{border-left:2px solid var(--c1);padding-left:24px}.stag{border:0;padding:0}.cn{font-family:ui-monospace,monospace;border:1px solid var(--bd2);padding:10px}.fi,.ci{border-left:3px solid var(--c1)}.sbt,.nb{border:1px solid var(--theme-ink);clip-path:polygon(8px 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%,0 8px)}.single-header{border-left:2px solid var(--c1);padding-left:20px}",serious:".start-intro{order:-1}.start-card .cover-image{margin:0 0 28px;border-radius:0}.stag{border:0;border-bottom:1px solid var(--bd2);width:100%;padding:0 0 14px}.stit{font-size:48px;font-weight:500}.single-header{display:flex;flex-direction:column}.single-title{order:-2;font-weight:500}.single-desc{order:-1;margin-bottom:24px!important}.fi{background:transparent;border:0;border-bottom:1px solid var(--tx);border-radius:0}.ci{border-radius:0}.cn{color:var(--tx2)}.cf{border-top:1px solid var(--tx)}",retro:".start-intro{order:-1}.start-card .cover-image{border:2px solid var(--tx);border-radius:0;box-shadow:6px 6px 0 var(--bd2);margin-bottom:36px}.stit{font-weight:800}.stag{border:2px solid var(--theme-ink);padding:8px 12px}.fi,.ci{border:2px solid var(--bd2);border-radius:0}.ci.ck{box-shadow:4px 4px 0 var(--bd2)!important}.sbt,.nb,.single-submit{border:2px solid var(--theme-ink);box-shadow:4px 4px 0 var(--theme-ink)!important}.single-header{border-bottom:4px solid var(--theme-ink)}",nature:".start-card .cover-image{border-radius:0;border-left:8px solid var(--theme-ink);padding-left:12px}.start-intro{padding:0 20px}.start-actions{padding:0 20px}.stit{font-weight:500;line-height:1.5}.fi{border:0;border-bottom:2px solid var(--bd2);background:var(--bg2)}.ci{border:0;background:var(--bg2);border-left:3px solid transparent}.ci.ck{border-left-color:var(--c1)}.single-header{padding-left:24px;border-left:4px solid var(--theme-ink)}",luxury:".start-card,.single-header{text-align:center}.start-intro{order:-1}.stag{border:0;border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink);padding:10px 28px}.stit{font-weight:500;font-size:46px;line-height:1.5}.sdesc{margin-left:auto;margin-right:auto}.start-card .cover-image{border-radius:0;margin-bottom:32px}.sbt{width:100%;justify-content:center;gap:28px}.fi{background:transparent;border:0;border-bottom:1px solid var(--theme-ink);border-radius:0}.ci{border-color:var(--theme-ink)}.single-cover{border-radius:0!important}.cn{text-align:center}.dt{font-weight:500}",kawaii:".start-card{text-align:center}.start-card .cover-image{width:92%;align-self:center;border:6px solid var(--theme-surface);outline:1px dashed var(--theme-ink);outline-offset:5px;margin:10px 0 36px}.stag{border:1px dashed var(--theme-ink);background:var(--theme-surface);padding:8px 14px}.stit{font-size:40px;line-height:1.5}.sdesc{margin-left:auto;margin-right:auto}.sbt{width:100%;justify-content:center;gap:20px}.ci{border:1px dashed var(--bd2)}.ci.ck{border-style:solid;background:color-mix(in srgb,var(--c1) 12%,var(--theme-surface))}.single-header{text-align:center}.single-question .ct{font-weight:500}",brutalist:".start-intro{order:-1;border-top:5px solid var(--tx);padding-top:24px}.stit{font-size:52px;font-weight:800}.stag{border:0;padding:0}.cover-image,.single-cover{border-radius:0!important;border:2px solid var(--tx)}.fi,.ci{border:2px solid var(--tx);border-radius:0}.ci.ck{box-shadow:inset 6px 0 var(--c1)!important}.sbt,.nb{width:100%;border:2px solid var(--tx);min-height:64px;border-radius:0}.single-header{border-bottom:5px solid var(--tx)}.cn{background:var(--tx);color:var(--theme-canvas);padding:8px 12px}",glass:".start-card .cover-image{padding:8px;background:var(--theme-surface);border:1px solid var(--bd);box-shadow:0 12px 32px color-mix(in srgb,var(--theme-ink) 10%,transparent)}.start-intro{padding:0 8px}.stag{border:0;border-bottom:2px solid var(--theme-ink)}.fi,.ci{border:1px solid var(--bd);box-shadow:inset 0 1px 0 var(--theme-surface)}.single-question{border-bottom:0!important;padding:24px 0!important}.single-header{border:0}.ci.ck{box-shadow:0 3px 12px color-mix(in srgb,var(--c1) 12%,transparent)!important}.sbt{width:100%}",newspaper:".start-intro{order:-1}.stag{display:block;border-top:3px double var(--tx);border-bottom:1px solid var(--tx);padding:12px 0}.stit{font-size:52px;line-height:1.2;font-weight:800}.start-card .cover-image{border-radius:0;border-top:1px solid var(--tx);border-bottom:1px solid var(--tx);padding:12px 0;filter:grayscale(1)}.single-header{display:flex;flex-direction:column}.single-title{order:-2;font-weight:800}.single-desc{order:-1;margin-bottom:24px!important}.single-cover{border-radius:0!important;filter:grayscale(1)}.cn{border-top:3px double var(--tx);border-bottom:1px solid var(--tx);padding:12px 0}.ci{padding-left:0;padding-right:0}.sbt{width:100%;border-radius:0}",midnight:".start-card .cover-image{width:76%;align-self:flex-end;border-radius:0;margin-bottom:0;border-bottom:4px solid var(--theme-ink)}.start-intro{padding-top:32px}.stit{font-size:50px;line-height:1.3;font-weight:500}.stag{padding:0;border:0}.cn{display:flex;justify-content:flex-end;padding-bottom:16px;border-bottom:1px solid var(--bd2)}.fi{background:var(--theme-canvas);border-bottom:2px solid var(--theme-ink)}.single-header{text-align:right}.ci.ck{border-left:4px solid var(--c1)}",candy:".start-intro{order:-1}.stag{background:var(--theme-ink);color:var(--theme-canvas);padding:8px 12px;border:0;transform:rotate(-2deg)}.stit{font-size:48px;font-weight:800}.start-card .cover-image{border-bottom:8px solid var(--theme-ink);border-radius:0}.ci:nth-child(even){background:color-mix(in srgb,var(--c2) 7%,var(--theme-surface))}.ci{border-width:2px}.sbt{width:100%;border-bottom:4px solid var(--theme-ink)}.cn{font-weight:800;font-size:14px}.single-title{font-weight:800}",ink:".wrap{max-width:600px}.start-intro{order:-1;border-left:1px solid var(--tx);padding-left:24px}.stit{font-weight:500;line-height:1.55}.stag{border:0;padding:0}.start-card .cover-image{border-radius:0;filter:grayscale(1);margin:8px 0 28px}.fi{border:0;border-bottom:1px solid var(--tx);border-radius:0;background:transparent}.ci{border:0;border-bottom:1px solid var(--bd2);border-radius:0;background:transparent}.single-header{border-left:1px solid var(--tx);padding-left:24px}.cn{font-weight:400;border-bottom:1px solid var(--tx);padding-bottom:16px}",aurora:".start-card .cover-image{border-left:7px solid var(--c1);border-right:7px solid var(--c2);border-radius:0}.start-intro{padding-left:24px;border-left:1px solid var(--theme-ink)}.stag{border:0;padding:0}.stit{font-size:46px;font-weight:500}.fi{border:0;border-bottom:2px solid var(--theme-ink)}.ci{border-left:4px solid var(--theme-ink)}.single-header{border-left:4px solid var(--theme-ink);padding-left:24px}.sbt{width:100%}",paper:".start-intro{order:-1}.stag{display:block;border-top:1px solid var(--tx);border-bottom:1px solid var(--tx);padding:12px 0}.stit{font-weight:500;font-style:italic;line-height:1.5}.start-card .cover-image{border:1px solid var(--bd2);border-radius:0;padding:12px;background:var(--theme-surface)}.sbt,.nb{border:3px double var(--theme-ink);border-radius:0}.fi{padding-left:0}.ci{border-bottom:1px dashed var(--bd2)}.single-header{border-bottom:1px dashed var(--tx)}.cn{border-bottom:1px dashed var(--tx)}",neon80s:".start-card .cover-image{outline:2px solid var(--theme-ink);outline-offset:6px;border-radius:0;margin:8px 0 40px}.stag{border:0;background:var(--theme-ink);color:var(--theme-canvas);padding:8px 14px}.stit{font-weight:800;font-style:italic}.cn{border:1px solid var(--theme-ink);padding:10px;font-family:ui-monospace,monospace}.fi,.ci{border-color:var(--theme-ink);border-radius:0}.ci.ck{box-shadow:inset 0 -3px var(--c1)!important}.sbt,.nb{border-bottom:4px solid var(--theme-ink);border-radius:0}.single-header{border-bottom:3px double var(--theme-ink)}",medical:".start-card .cover-image{border-radius:0;border-bottom:6px solid var(--theme-ink);padding-bottom:8px}.start-intro{padding:0 12px}.stag{border:0;background:var(--bg2);padding:8px 12px}.stit{font-weight:500;line-height:1.4}.fi{background:var(--theme-surface);border:1px solid var(--bd2)}.ci{background:var(--bg2);border:0}.ci.ck{outline:1px solid var(--c1);outline-offset:-1px}.cn{border-left:4px solid var(--theme-ink);padding:6px 12px;background:var(--bg2)}.single-question{border-bottom:0!important}.single-header{border-bottom:4px solid var(--theme-ink)}",forest:".start-card .cover-image{border:1px solid var(--theme-ink);border-radius:0;padding:10px}.start-intro{border-top:1px solid var(--theme-ink);padding:24px 16px 0}.stag{border:0;padding:0}.stit{font-size:42px;font-weight:500}.sbt{width:100%}.cn{display:inline-block;border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink);padding:12px 0}.ci{background:transparent;border-bottom-width:2px}.single-header{padding:0 16px 28px;border-bottom:1px solid var(--theme-ink)}.single-cover{padding:8px;border:1px solid var(--theme-ink);border-radius:0!important}",sunset:".start-intro{order:-1}.stag{border:0;border-bottom:4px solid var(--theme-ink);padding:0 0 8px}.stit{font-style:italic;font-weight:500}.start-card .cover-image{border-radius:0;border-bottom:8px solid var(--theme-ink)}.cn{border-bottom:2px solid var(--theme-ink);padding-bottom:12px}.fi{border:0;border-bottom:2px solid var(--theme-ink);border-radius:0}.ci{border:0;border-left:3px solid var(--bd2)}.sbt{width:100%}.single-title{font-style:italic;font-weight:500}.single-header{border-bottom:6px solid var(--theme-ink)}",chalk:".start-card .cover-image{width:84%;align-self:center;padding:8px;outline:1px dashed var(--tx2);outline-offset:5px;border-radius:0;margin:6px 0 36px}.start-card{text-align:center}.stag{border:0;border-bottom:2px dashed var(--tx2);padding:8px 0}.stit{font-weight:500;line-height:1.5}.sbt{width:100%;border:2px solid var(--theme-ink);border-radius:0}.fi{background:transparent;border:0;border-bottom:1px dashed var(--tx2);border-radius:0}.ci{background:transparent;border:1px dashed var(--tx2)}.cn{border-bottom:2px dashed var(--tx2);text-align:center}.single-header{text-align:center;border-bottom:2px dashed var(--tx2)}",ocean:".start-card .cover-image{border-radius:0;border-bottom:9px double var(--theme-ink);padding-bottom:12px}.stag{border-left:0;border-bottom:1px solid var(--theme-ink);padding:0 0 10px}.stit{font-weight:500}.sbt{width:100%}.fi{border:0;border-left:4px solid var(--theme-ink);border-radius:0}.ci{border:0;background:var(--bg2);border-right:3px solid transparent}.ci.ck{border-right-color:var(--c1)}.single-header{border-bottom:9px double var(--theme-ink)}.cn{border-bottom:3px double var(--theme-ink);padding-bottom:16px}",crypto:".start-intro{order:-1;border-left:5px solid var(--theme-ink);padding-left:20px}.stag{border:0;padding:0;font-family:ui-monospace,monospace}.stit{font-size:46px;font-weight:800}.start-card .cover-image{padding:8px;border:1px solid var(--bd2);border-radius:0}.cn{font-family:ui-monospace,monospace;border:1px solid var(--bd2);padding:12px}.fi{border-radius:0;border-left:3px solid var(--theme-ink)}.ci{border-radius:0}.sbt,.nb{border-radius:0;border-right:6px solid var(--theme-ink)}.single-header{border-left:5px solid var(--theme-ink);padding-left:20px}",trading:".start-card .cover-image{border-radius:0;border-top:1px solid var(--bd2);border-bottom:1px solid var(--bd2);padding:8px 0}.stag{font-family:ui-monospace,monospace;border:0;border-bottom:1px solid var(--bd2)}.stit{font-size:42px;font-weight:600}.cg{gap:0;border-top:1px solid var(--bd2)}.ci{border:0;border-bottom:1px solid var(--bd2);border-radius:0}.cn{font-family:ui-monospace,monospace;padding:12px;border-top:1px solid var(--bd2);border-bottom:1px solid var(--bd2)}.fi{border-radius:0}.single-question .required{font-family:ui-monospace,monospace}.single-header{border-bottom:3px solid var(--theme-ink)}",defi:".start-card .cover-image{padding:8px;background:var(--theme-surface);border-left:6px solid var(--theme-ink);border-radius:0}.start-intro{padding:0 16px}.stag{border:0;background:var(--bg2);padding:8px 12px}.stit{font-weight:500}.ci{border:1px solid var(--bd2);background:var(--theme-surface)}.ci.ck{border-left:5px solid var(--c1)}.fi{border:0;border-bottom:2px solid var(--theme-ink)}.cn{border-bottom:1px solid var(--theme-ink);padding-bottom:14px}.single-header{border:0;border-left:6px solid var(--theme-ink);padding-left:20px}.sbt{width:100%}",bullrun:".start-intro{border-top:6px solid var(--theme-ink);padding-top:24px}.stag{border:0;padding:0}.stit{font-size:48px;font-weight:800}.start-card .cover-image{border-radius:0;margin-bottom:0}.cn{display:inline-block;background:var(--theme-ink);color:var(--theme-canvas);padding:10px 14px}.fi{border:0;border-bottom:3px solid var(--theme-ink);border-radius:0}.ci{border:0;background:var(--bg2);border-left:5px solid transparent}.ci.ck{border-left-color:var(--c1)}.single-header{border-top:6px solid var(--theme-ink);padding-top:24px}.single-title{font-weight:800}.sbt{width:100%}",bearish:".start-intro{order:-1}.stag{border:0;border-left:5px solid var(--theme-ink);padding:4px 12px}.stit{font-weight:800}.start-card .cover-image{border-radius:0;border-top:5px solid var(--theme-ink);padding-top:10px}.cn{border-right:5px solid var(--theme-ink);text-align:right;padding:8px 14px}.fi{border-radius:0;border-bottom:3px solid var(--theme-ink)}.ci{border-radius:0}.ci.ck{box-shadow:inset -5px 0 var(--c1)!important}.single-header{border-right:5px solid var(--theme-ink);padding-right:20px}.sbt{width:100%}",bloomberg:".start-intro{order:-1}.stag{display:block;font-family:ui-monospace,monospace;border:0;background:var(--theme-ink);color:var(--theme-canvas);padding:10px 14px}.stit{font-size:42px;font-weight:600;margin-top:12px}.start-card .cover-image{border:1px solid var(--bd2);border-radius:0;padding:6px}.cn{font-family:ui-monospace,monospace;border-top:1px solid var(--bd2);border-bottom:1px solid var(--bd2);padding:12px 0}.fi{background:var(--theme-canvas);border:1px solid var(--bd2);border-radius:0}.cg{gap:0}.ci{border:0;border-bottom:1px solid var(--bd2);border-radius:0}.sbt,.nb{width:100%;border-radius:0}.single-header{border-top:4px solid var(--theme-ink);padding-top:24px}",gold:".start-intro{order:-1;text-align:center}.stag{border:3px double var(--theme-ink);padding:10px 20px}.stit{font-weight:500;font-style:italic;font-size:46px;line-height:1.5}.sdesc{margin-left:auto;margin-right:auto}.start-card .cover-image{border-radius:0;border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink);padding:12px 0}.sbt{width:100%;justify-content:center;gap:24px;border:3px double var(--theme-ink)}.fi{border:0;border-bottom:2px solid var(--theme-ink);border-radius:0}.ci{border:1px solid var(--theme-ink)}.cn{text-align:center;border-bottom:3px double var(--theme-ink)}.single-header{text-align:center}.single-title{font-weight:500;font-style:italic}",matrix:".start-card .cover-image{width:70%;align-self:flex-end;border-radius:0;border-left:2px solid var(--theme-ink);padding-left:12px}.start-intro{border-bottom:1px solid var(--theme-ink);margin-bottom:28px}.stag{border:0;font-family:ui-monospace,monospace;padding:0}.stit{font-weight:600;font-size:46px}.cn{font-family:ui-monospace,monospace;border-left:5px solid var(--theme-ink);padding:10px 14px}.fi,.ci{border-radius:0;background:var(--theme-canvas);border:1px solid var(--bd2)}.ci.ck{box-shadow:inset 5px 0 var(--c1)!important}.sbt{width:100%;border-radius:0}.single-header{border-left:2px solid var(--theme-ink);padding-left:20px}"},ye=`
@media(max-width:600px){.stit{font-size:32px}.start-intro{max-width:100%}.start-card .cover-image{max-width:100%;max-height:300px}.sbt{width:100%}.single-title{font-size:30px}.single-header{max-width:100%}}
`,N={default:["#16191f","#20242c","#f4f6fa","#aeb6c5","#39404c","#1b1f26","rule",6],soft:["#fff7fb","#ffffff","#382c36","#74606c","#ebdce5","#fffafd","soft",8],cyber:["#10181c","#162328","#e5f4f6","#a1bcc5","#344951","#111c21","grid",4],serious:["#f7f8f8","#ffffff","#22282b","#59646a","#d7dee1","#f5f7f7","rule",2],retro:["#fff8ee","#fffcf6","#3b302b","#756051","#dcc8b6","#fffaf2","double",4],nature:["#f4f9f2","#ffffff","#293b2d","#576c5b","#d7e3d4","#f8fbf6","rail",8],luxury:["#1a1917","#23211f","#f4eee0","#c0b8aa","#494338","#1c1b18","double",4],kawaii:["#fff6f8","#ffffff","#49303b","#80606e","#eed5df","#fffafb","soft",8],brutalist:["#eef0ee","#f8f9f7","#232823","#566054","#8b958a","#ffffff","frame",0],glass:["#0b1220","#172236","#f3f7ff","#aebdd2","#53647d","#202d43","glass",8],newspaper:["#f8f8f4","#fffefa","#2b2c29","#63665f","#c9cdc5","#ffffff","ledger",0],midnight:["#151921","#202633","#eaf0f9","#a9b4c6","#394459","#191f2b","rule",6],candy:["#fff5f0","#ffffff","#493334","#7d6060","#edcfc6","#fffaf8","double",8],ink:["#f5f6f5","#ffffff","#252a2a","#606969","#cbd2d1","#f8f9f8","rail",2],aurora:["#1b1b24","#272634","#f0edf8","#b9b3ca","#484359","#211f2d","double",8],paper:["#faf8f2","#fffefa","#3b3830","#716b5f","#dcd5c4","#fffdf7","ledger",4],neon80s:["#23191f","#30222c","#faeef5","#c7aebe","#59404f","#271b24","frame",4],medical:["#f1f8fc","#ffffff","#253b47","#587282","#cfdee7","#f7fbfe","rail",6],forest:["#18231e","#24332b","#edf5e9","#b0c2b2","#45594a","#1d2b23","rule",8],sunset:["#fff5f0","#fffaf7","#4b3334","#806163","#ead0c7","#fffcfa","rail",8],chalk:["#252729","#303336","#f3f1e8","#c5c3ba","#606468","#2a2d30","ledger",2],ocean:["#eaf3f8","#ffffff","#183c56","#53748b","#c3d8e5","#f5f9fc","double",6],crypto:["#1b2022","#272f32","#f2f1eb","#b9c0bd","#454f51","#21282b","frame",6],trading:["#f1f4f8","#ffffff","#202f45","#56677d","#cfd8e4","#f7f9fc","grid",4],defi:["#f1f4fb","#ffffff","#273758","#61708f","#d2dbea","#f7f9fd","glass",8],bullrun:["#f0faf4","#ffffff","#203c2d","#52725d","#c9e3d1","#f7fcf8","rail",6],bearish:["#fff4f4","#ffffff","#4a2a30","#805b64","#e8ccd1","#fff9fa","rail",6],bloomberg:["#181b1d","#23282c","#f5e7d7","#c1b8aa","#4a4740","#1c2124","ledger",2],gold:["#fbf9f0","#fffef7","#403a25","#746b4c","#e0d8b9","#fffdf3","double",4],matrix:["#17201b","#223128","#e6f4e7","#a9c3b0","#405648","#1b2920","grid",2]};function D(o){if(!/^#[0-9a-f]{6}$/i.test(o))return 0;const r=o.replace("#","").match(/.{2}/g).map(i=>parseInt(i,16)/255).map(i=>i<=.04045?i/12.92:((i+.055)/1.055)**2.4);return r[0]*.2126+r[1]*.7152+r[2]*.0722}function Re(o,a){const[r,i,n,,d]=N[o]||N.default;return{"--concept-canvas":r,"--concept-surface":i,"--concept-text":n,"--concept-border":d,"--concept-accent":a}}function ke(o,a,r,i){const[n,d,l,b,g,m,O,k]=N[o]||N.default,S=D(a)>.179?"#000000":"#ffffff",h=D(n)<.2;return`
:root{--theme-canvas:${n};--theme-surface:${d};--theme-ink:color-mix(in srgb,${a} 35%,${l});--theme-button-text:${S};--theme-grid:color-mix(in srgb,${g} 22%,transparent);--tx:${l};--tx2:${b};--tx3:${b};--bg2:${m};--bd:${g};--bd2:color-mix(in srgb,${g} 65%,${l});--ls-bg:${m};--card-bg:${d}}
body{background:${n};background-image:none;color:var(--tx);font-family:${i};color-scheme:${h?"dark":"light"}}
body::before,body::after{display:none}
.card{background:${d};border:1px solid var(--bd);border-radius:${k}px;box-shadow:none;backdrop-filter:none;margin:0}
.card.start-card{background:transparent;border:0;box-shadow:none}
.sl:not(#ss):not(#done)>.card{border:0;background:transparent;padding:36px 0}
.ct,.stit,.dt,.single-title{color:var(--tx);-webkit-text-fill-color:var(--tx);background:none;text-shadow:none;font-family:inherit;letter-spacing:0}
.stit{font-weight:700}.ct{font-weight:600}.dt{font-weight:700}
.cs,.sdesc,.dd,.single-desc{color:var(--tx2);font-weight:400}
.cn,.stag{color:var(--theme-ink);text-shadow:none;letter-spacing:0;font-family:inherit}
.stag{background:transparent;border-color:var(--theme-ink)}
.fi,.ci,.ls{border-radius:${k}px;background:${m};color:var(--tx);border-color:var(--bd);text-shadow:none;backdrop-filter:none}
.fi{font-family:inherit;outline:none}.fi::placeholder{color:var(--tx3);opacity:.8}
.fi:focus{background:var(--theme-surface);border-color:var(--c1);box-shadow:0 0 0 3px color-mix(in srgb,var(--c1) 16%,transparent);outline:none;transform:none}
.fi.er,.fi.er:focus{border-color:${h?"#f7a0a0":"#be394b"};box-shadow:0 0 0 3px color-mix(in srgb,#be394b 12%,transparent)}
.em{color:${h?"#ffb4b4":"#b73549"}}
.qfb.ok{color:${h?"#8ad6a7":"#246b3a"}}.qfb.ng{color:${h?"#ffb4b4":"#b73549"}}
.ci{background:var(--theme-surface)}.ci span,.ci .oi{color:var(--tx);text-shadow:none}
.ci:hover:not(.qdisabled){background:color-mix(in srgb,var(--c1) 5%,var(--theme-surface));border-color:var(--c1);box-shadow:none}
.ci.ck{background:color-mix(in srgb,var(--c1) ${h?18:8}%,var(--theme-surface));box-shadow:none;border-width:1px}
.cb,.ld{border-color:var(--bd2);box-shadow:none}.ci.ck .cb,.la.ck .ld{background:var(--c1);border-color:var(--c1);box-shadow:none}
.ci.ck .cb::after,.la.ck .ld::after{background:var(--theme-button-text)}
.nb,.sbt,.dcta{background:var(--c1)!important;color:var(--theme-button-text);border:1px solid transparent;border-radius:${k}px;box-shadow:none;text-shadow:none;letter-spacing:0;font-family:inherit;font-weight:600}
.nb:hover,.sbt:hover,.dcta:hover{background:var(--c1)!important;color:var(--theme-button-text);box-shadow:none!important;transform:none}
.nb::after,.sbt::after{display:none}
.single-page .single-sheet{background:transparent;border:0}.single-page .single-question{border-color:var(--bd)}
.single-page .single-header{border-color:var(--bd2)}
.single-page .single-submit{border-radius:${k}px}
.done-card{border-radius:${k}px}.dr{background:color-mix(in srgb,#32a673 10%,var(--theme-surface));border-color:color-mix(in srgb,#32a673 35%,var(--bd))}
.ls{background:var(--ls-bg)}
#pw{height:3px;background:var(--bd);border:0;border-radius:0}#pf{background:var(--c1)!important;box-shadow:none}#pf::after{display:none}
#gb,.bb,.drst{color:var(--tx2)}
${{rule:".stag{border-left-width:3px}.single-header{border-bottom-width:1px}",soft:".stag{border:0;background:color-mix(in srgb,var(--c1) 9%,var(--theme-surface));padding:7px 12px;border-radius:6px}.fi{border-color:var(--bd)}",double:".stag{border-left:0;border-top:2px solid var(--theme-ink);padding:10px 0 0}.single-header{border-bottom:3px double var(--bd2)}.cn{border-top:3px double var(--bd2);padding-top:14px}.ci{border-left:3px solid var(--bd2)}.ci.ck{border-left-width:3px}",rail:".stag{border-left-width:4px}.cn{border-left:3px solid var(--theme-ink);padding-left:10px}.single-question .question-heading{border-left:3px solid var(--theme-ink);padding-left:10px}",frame:".stag{border:1px solid var(--theme-ink);padding:6px 10px}.fi,.ci{border-color:var(--bd2)}.single-header{border-bottom:2px solid var(--theme-ink)}.cn{display:inline-block;background:var(--theme-ink);color:var(--theme-canvas);padding:7px 10px}.ci.ck{box-shadow:inset 3px 0 var(--c1)!important}",glass:".fi,.ci{background:color-mix(in srgb,var(--theme-surface) 75%,var(--theme-canvas))}.stag{border-left:0;border-bottom:2px solid var(--theme-ink);padding:0 0 7px}",ledger:".stag{border-left:0;border-top:1px solid var(--bd2);border-bottom:1px solid var(--bd2);padding:8px 0}.cn{border-bottom:1px solid var(--bd);padding-bottom:10px}.single-header{border-bottom:3px double var(--bd2)}.fi{background:transparent;border:0;border-bottom:1px solid var(--bd2);border-radius:0}.ci{background:transparent;border:0;border-bottom:1px solid var(--bd);border-radius:0}.ci.ck{border-bottom:2px solid var(--c1)}",grid:"body{background-image:linear-gradient(var(--theme-grid) 1px,transparent 1px),linear-gradient(90deg,var(--theme-grid) 1px,transparent 1px);background-size:64px 64px}.stag{border:1px solid var(--bd2);padding:6px 10px}.cn{font-variant-numeric:tabular-nums}"}[O]}
${G[o]||G.default}
${ye}
`}const j={default:"Noto Sans KR",soft:"Gowun Dodum",cyber:"Gugi",serious:"Noto Serif KR",retro:"Do Hyeon",nature:"Gowun Batang",luxury:"Hahmlet",kawaii:"Jua",brutalist:"Black Han Sans",glass:"IBM Plex Sans KR",newspaper:"Nanum Myeongjo",midnight:"Song Myung",candy:"Sunflower",ink:"Yeon Sung",aurora:"Stylish",paper:"Nanum Pen Script",neon80s:"Do Hyeon",medical:"Gothic A1",forest:"Noto Serif KR",sunset:"Hi Melody",chalk:"Gaegu",ocean:"Gowun Batang",crypto:"Orbit",trading:"Nanum Gothic",defi:"IBM Plex Sans KR",bullrun:"Do Hyeon",bearish:"Noto Sans KR",bloomberg:"IBM Plex Sans KR",gold:"Nanum Myeongjo",matrix:"IBM Plex Sans KR"},we=new Set(["Noto Serif KR","Nanum Myeongjo","Gowun Batang","Hahmlet","Song Myung"]),$e="'Noto Sans KR',sans-serif";function U(o,a){if(a&&a!==$e)return a;const r=j[o]||j.default;return`'${r}',${we.has(r)?"serif":"sans-serif"}`}function Se(o){var n;const a=((n=o.match(/['"]([^'"]+)['"]/))==null?void 0:n[1])||"Noto Sans KR",r={Sunflower:":wght@300;500;700","Noto Serif KR":":wght@400;500;600;700","Nanum Myeongjo":":wght@400;700","Nanum Gothic":":wght@400;700;800","Gowun Batang":":wght@400;700","IBM Plex Sans KR":":wght@400;500;600;700",Gaegu:":wght@300;400;700",Hahmlet:":wght@400;500;600;700","Gothic A1":":wght@400;500;600;700"};return`https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700${a==="Noto Sans KR"?"":`&family=${encodeURIComponent(a).replace(/%20/g,"+")}${r[a]||""}`}&display=swap`}const K={default:["linear-gradient(90deg,var(--theme-grid) 1px,transparent 1px)","96px 96px",.34],soft:["repeating-linear-gradient(135deg,var(--bd) 0 1px,transparent 1px 22px)","auto",.24],cyber:["linear-gradient(var(--theme-ink) 1px,transparent 1px),linear-gradient(90deg,var(--theme-ink) 1px,transparent 1px)","32px 32px",.12],serious:["linear-gradient(90deg,var(--tx) 0 2px,transparent 2px)","220px 100%",.08],retro:["repeating-linear-gradient(0deg,transparent 0 30px,var(--bd2) 30px 32px,transparent 32px 60px)","auto",.28],nature:["repeating-linear-gradient(118deg,var(--theme-ink) 0 1px,transparent 1px 68px)","auto",.08],luxury:["repeating-linear-gradient(135deg,var(--theme-ink) 0 1px,transparent 1px 22px)","auto",.07],kawaii:["repeating-linear-gradient(135deg,var(--theme-ink) 0 2px,transparent 2px 30px)","auto",.07],brutalist:["repeating-linear-gradient(90deg,var(--bd2) 0 1px,transparent 1px 12px)","auto",.18],glass:["linear-gradient(120deg,var(--bd) 0 18%,transparent 18% 58%,var(--bd) 58% 72%,transparent 72%)","420px 420px",.34],newspaper:["repeating-linear-gradient(0deg,var(--bd2) 0 1px,transparent 1px 6px)","auto",.13],midnight:["repeating-linear-gradient(120deg,var(--bd2) 0 1px,transparent 1px 84px)","auto",.09],candy:["linear-gradient(90deg,var(--c1) 1px,transparent 1px),linear-gradient(var(--c2) 1px,transparent 1px)","56px 56px",.16],ink:["repeating-linear-gradient(135deg,var(--bd2) 0 1px,transparent 1px 5px)","auto",.1],aurora:["linear-gradient(135deg,var(--c1),transparent 42%),linear-gradient(35deg,var(--c2),transparent 45%)","cover",.13],paper:["repeating-linear-gradient(0deg,var(--bd2) 0 1px,transparent 1px 26px)","auto",.26],neon80s:["linear-gradient(var(--c1) 1px,transparent 1px),linear-gradient(90deg,var(--c2) 1px,transparent 1px)","72px 36px",.2],medical:["linear-gradient(90deg,var(--bd2) 1px,transparent 1px)","160px 160px",.24],forest:["repeating-linear-gradient(118deg,var(--theme-ink) 0 2px,transparent 2px 70px)","auto",.12],sunset:["linear-gradient(165deg,var(--c2) 0 18%,transparent 18% 68%,var(--c1) 68% 100%)","cover",.12],chalk:["repeating-linear-gradient(5deg,var(--tx2) 0 1px,transparent 1px 7px)","auto",.06],ocean:["repeating-linear-gradient(170deg,var(--theme-ink) 0 1px,transparent 1px 44px)","auto",.08],crypto:["repeating-linear-gradient(45deg,var(--theme-ink) 0 1px,transparent 1px 36px)","auto",.12],trading:["linear-gradient(var(--bd2) 1px,transparent 1px),linear-gradient(90deg,var(--bd2) 1px,transparent 1px)","80px 24px",.28],defi:["linear-gradient(45deg,var(--theme-ink) 1px,transparent 1px),linear-gradient(-45deg,var(--theme-ink) 1px,transparent 1px)","48px 48px",.12],bullrun:["repeating-linear-gradient(135deg,var(--theme-ink) 0 1px,transparent 1px 64px)","auto",.14],bearish:["repeating-linear-gradient(45deg,var(--theme-ink) 0 1px,transparent 1px 64px)","auto",.14],bloomberg:["linear-gradient(var(--theme-ink) 1px,transparent 1px),linear-gradient(90deg,var(--theme-ink) 1px,transparent 1px)","144px 28px",.14],gold:["repeating-linear-gradient(90deg,var(--theme-ink) 0 1px,transparent 1px 32px)","auto",.11],matrix:["linear-gradient(var(--theme-ink) 1px,transparent 1px),linear-gradient(90deg,var(--theme-ink) 1px,transparent 1px)","18px 36px",.17]},ze={default:".stit{font-size:38px;font-weight:600}.ct{font-size:24px}.stag{border:0;padding:0}.fi,.ci{border-radius:8px}.cf{border:0}.start-meta{border:0;padding-top:0}.sbt{width:260px}",soft:".stit{font-weight:500;line-height:1.5}.fi,.ci{border:1px solid var(--bd);border-radius:8px}.start-meta{border:0;padding-top:0}.cn{border:0}.cf{border:0}",kawaii:".stit{font-weight:400}.ci,.fi{border-radius:8px;border-style:solid;border-color:var(--bd)}.start-meta{border:0;padding-top:0}.single-question .ct{font-weight:400}",nature:".start-card .cover-image{border:0;padding:0;border-radius:8px}.start-intro,.start-actions{padding:0}.fi{border:1px solid var(--bd);border-radius:8px}.ci{border-radius:8px}.single-header{border-left:0;padding-left:0}",glass:".stit{font-weight:500}.ci,.fi{border-radius:8px}.start-card .cover-image{padding:0;border:0}.cf{border:0}.start-meta{border:0;padding-top:0}",midnight:".stit{font-size:40px}.fi,.ci{border-radius:8px}.start-meta{border:0;padding-top:0}",candy:".stit{font-weight:700}.ci{border-width:1px;border-radius:8px}.sbt{border-bottom:0}.cf{border:0}.start-meta{border:0;padding-top:0}",aurora:".stit{font-weight:500}.fi,.ci{border-radius:8px}.start-meta{border:0;padding-top:0}",medical:".stit{font-weight:500}.ci,.fi{border-radius:8px}.start-intro{padding:0}.single-header{border-bottom-width:1px}.start-meta{border:0;padding-top:0}",forest:".stit{font-weight:500}.ci,.fi{border-radius:8px}.start-meta{border:0;padding-top:0}",sunset:".stit{font-weight:500}.start-card .cover-image{border:0;border-radius:8px}.ci,.fi{border-radius:8px}.start-meta{border:0;padding-top:0}",ocean:".start-card .cover-image{border:0;padding:0;border-radius:8px}.ci,.fi{border-radius:8px}.start-meta{border:0;padding-top:0}",defi:".stit{font-weight:500}.fi,.ci{border-radius:8px}.cf{border:0}.start-meta{border:0;padding-top:0}"},Ie={default:".card{border-top:3px solid var(--theme-ink)}.sbt{border-radius:999px}",soft:".card{box-shadow:0 18px 50px color-mix(in srgb,var(--c1) 9%,transparent)}.sbt{border-radius:18px}",cyber:".card{clip-path:polygon(16px 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%,0 16px)}",serious:".card{border-top:5px solid var(--tx)}.stit{font-weight:500}.sbt{background:var(--tx)!important;color:var(--theme-canvas)}",retro:".card{box-shadow:8px 8px 0 var(--theme-ink)}.stag{transform:rotate(-1deg)}",nature:".card{border-left:6px solid var(--theme-ink)}.stit{max-width:13ch}",luxury:".card{border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink)}.stit{letter-spacing:.03em}",kawaii:".card{border-radius:22px 8px 22px 8px}.sbt{border-radius:22px 8px 22px 8px}",brutalist:".card{border:3px solid var(--tx);box-shadow:10px 10px 0 var(--tx)}",glass:".card{border-width:1px 1px 4px;background:color-mix(in srgb,var(--theme-surface) 90%,transparent)}",newspaper:".card{border-top:5px double var(--tx);border-bottom:5px double var(--tx)}.stit{text-transform:none}",midnight:".card{border-top:1px solid var(--theme-ink)}.sbt{border-radius:999px}",candy:".card{box-shadow:7px 7px 0 var(--theme-ink)}.sbt{border-bottom:5px solid var(--theme-ink)}",ink:".card{border-left:9px solid var(--tx)}.stit{font-weight:400}",aurora:".card{border:1px solid var(--theme-ink)}.sbt{border-radius:999px}",paper:".card{border:1px solid var(--bd2);box-shadow:3px 4px 0 var(--bd)}",neon80s:".card{border-left:5px solid var(--c1);border-bottom:5px solid var(--c2)}",medical:".card{border-top:6px solid var(--theme-ink)}.stag{font-family:ui-monospace,monospace}",forest:".card{border-radius:28px 0 28px 0;border-left:5px solid var(--theme-ink)}",sunset:".card{border-top:8px solid var(--theme-ink)}.stit{font-weight:500}",chalk:".card{border:2px dashed var(--tx2)}.fi,.ci{border-style:dashed}",ocean:".card{border-radius:0 24px 0 24px;border-bottom:5px solid var(--theme-ink)}.single-header{border-bottom-width:4px}",crypto:".card{clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px);border-left:4px solid var(--theme-ink)}",trading:".card{border-top:4px solid var(--theme-ink)}.cn,.stag{font-family:ui-monospace,monospace}",defi:".card{clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px),0 10px)}",bullrun:".card{border-left:7px solid var(--theme-ink)}.stit{font-weight:800}",bearish:".card{border-right:7px solid var(--theme-ink)}.stit{font-weight:800}",bloomberg:".card{border:0;border-top:5px solid #f28c28}.cn,.stag,.fi{font-family:ui-monospace,monospace}.sbt,.nb{background:#f28c28!important;color:#111}",gold:".card{border:4px double var(--theme-ink)}.stag{letter-spacing:.16em}",matrix:".card{border:1px solid var(--theme-ink);box-shadow:inset 5px 0 var(--theme-ink)}.cn,.stag,.fi,.ci{font-family:ui-monospace,monospace}"};function Ee(o,a=!1){const[r,i,n]=K[o]||K.default,d=a?"body{background-image:none}body::before{display:none}":`body{background-image:none;isolation:isolate}body::before{content:'';display:block;position:fixed;inset:0;background-image:${r};background-size:${i};background-position:center;opacity:${n};pointer-events:none;z-index:-1}body::after{display:none}`,l=o==="chalk"?".stit{font-size:44px}.sdesc,.cs,.ci span,.fi,.dd{font-size:19px}.stag,.start-meta,.cn,.sbt,.nb{font-size:18px}":"";return`${d}
${ze[o]||""}
${Ie[o]||""}
@media(max-width:600px){.stit{font-size:32px}.sbt{width:100%}.ct{font-size:22px}}
${l}`}const H={default:"border-radius:999px",soft:"border-radius:18px;box-shadow:0 4px 0 var(--bd2)!important",cyber:"border-radius:0;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);border:1px solid var(--theme-ink)",serious:"border-radius:0;border:1px solid var(--tx);background:var(--theme-surface)!important;color:var(--tx)",retro:"border-radius:4px;border:2px solid var(--tx);box-shadow:5px 5px 0 var(--theme-ink)!important",nature:"border-radius:24px 6px 24px 6px",luxury:"border-radius:0;border-top:1px solid var(--theme-ink);border-bottom:1px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)",kawaii:"border-radius:22px 8px 22px 8px;border:2px dashed var(--theme-ink)",brutalist:"border-radius:0;border:3px solid var(--tx);box-shadow:6px 6px 0 var(--tx)!important",glass:"border-radius:8px;border:1px solid var(--bd2);background:var(--theme-surface)!important;color:var(--tx);box-shadow:0 4px 12px color-mix(in srgb,var(--theme-ink) 12%,transparent)!important",newspaper:"border-radius:0;border-top:3px double var(--tx);border-bottom:3px double var(--tx)",midnight:"border-radius:999px;border:1px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)",candy:"border-radius:8px;border-bottom:5px solid var(--theme-ink)",ink:"border-radius:0;border-bottom:2px solid var(--tx);background:var(--theme-surface)!important;color:var(--tx)",aurora:"border-radius:999px;border:3px double var(--theme-ink)",paper:"border-radius:2px;border:3px double var(--tx);box-shadow:2px 2px 0 var(--bd2)!important",neon80s:"border-radius:0;clip-path:polygon(6% 0,100% 0,94% 100%,0 100%)",medical:"border-radius:6px;border-left:5px solid var(--theme-ink)",forest:"border-radius:28px 0 28px 0;border:1px solid var(--theme-ink)",sunset:"border-radius:20px 20px 4px 4px",chalk:"border-radius:4px;border:2px dashed var(--tx2);background:var(--theme-surface)!important;color:var(--tx)",ocean:"border-radius:0 24px 0 24px;border-bottom:3px solid var(--theme-ink)",crypto:"border-radius:0;clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,12px 100%,0 50%)",trading:"border-radius:0;border:1px solid var(--tx);box-shadow:inset 0 -3px var(--theme-ink)!important",defi:"border-radius:0;clip-path:polygon(8px 0,calc(100% - 8px) 0,100% 8px,100% calc(100% - 8px),calc(100% - 8px) 100%,8px 100%,0 calc(100% - 8px),0 8px)",bullrun:"border-radius:4px 16px 4px 4px;border-left:7px solid var(--theme-ink)",bearish:"border-radius:4px;border-right:7px solid var(--theme-ink)",bloomberg:"border-radius:0;border-top:2px solid var(--theme-ink);border-bottom:2px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)",gold:"border-radius:999px;border:4px double var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)",matrix:"border-radius:0;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));border:1px solid var(--theme-ink);background:var(--theme-surface)!important;color:var(--tx)"};function Te(o,a){const r=H[o]||H.default,i=["ink","paper","sunset","chalk"].includes(o);return`
.wrap{max-width:580px}.start-intro,.start-actions{min-width:0}
.stit{font-size:36px;line-height:1.45;margin-bottom:16px}.sdesc{font-size:15px;line-height:1.8;margin-bottom:28px}
.start-meta{border:0;padding:0;margin-top:20px!important}
.sbt,.nb,.dcta,.single-page .single-submit{min-height:56px;padding:14px 24px;border:0;border-radius:6px;box-shadow:none;font-size:15px;${r}}
.sbt:hover,.nb:hover,.dcta:hover,.single-page .single-submit:hover{${r};filter:brightness(.96)}
.sbt{max-width:100%;gap:16px}.cf{margin-top:28px}.fi,.ci{min-height:56px}
.single-page .wrap{max-width:620px}.single-page .single-title{font-size:30px;line-height:1.5}
.single-page .single-question{padding:26px 0}.single-page .ct{font-size:17px;line-height:1.6}
${i?".stit,.dt,.single-title{font-size:38px}.sdesc,.cs{font-size:18px}":""}
${a&&a!=="'Noto Sans KR',sans-serif"?"":'.fi,.ci span,.ls,.la span{font-family:"Noto Sans KR",sans-serif}'}
@media(max-width:600px){body{padding:24px 20px 40px}.stit{font-size:32px}.ct{font-size:22px}.start-card .cover-image{max-height:300px}.single-page .single-title{font-size:28px}${i?".stit{font-size:38px}":""}}
`}const Me=[{id:"clean_white",name:"미니멀",desc:"밝고 단정한 기본형"},{id:"clean_graphite",name:"다크",desc:"차분한 차콜 중심의 화면"},{id:"soft",name:"소프트",desc:"부드러운 여백과 둥근 인상"},{id:"ocean",name:"오션",desc:"맑은 해안 에디토리얼"},{id:"glass",name:"글래스",desc:"깊이감 있는 다크 레이어"}],Ge=[{label:"Noto Sans KR",value:"'Noto Sans KR',sans-serif",preview:"가나다"},{label:"Gmarket Sans",value:"'Gmarket Sans',sans-serif",preview:"가나다"},{label:"IBM Plex Sans KR",value:"'IBM Plex Sans KR',sans-serif",preview:"가나다"},{label:"Nanum Gothic",value:"'Nanum Gothic',sans-serif",preview:"가나다"},{label:"Nanum Barun Gothic",value:"'Nanum Barun Gothic',sans-serif",preview:"가나다"},{label:"KoPub Batang",value:"'KoPub Batang',serif",preview:"가나다"},{label:"Nanum Myeongjo",value:"'Nanum Myeongjo',serif",preview:"가나다"},{label:"Noto Serif KR",value:"'Noto Serif KR',serif",preview:"가나다"},{label:"Gowun Batang",value:"'Gowun Batang',serif",preview:"가나다"},{label:"Black Han Sans",value:"'Black Han Sans',sans-serif",preview:"가나다"},{label:"Gowun Dodum",value:"'Gowun Dodum',sans-serif",preview:"가나다"},{label:"Do Hyeon",value:"'Do Hyeon',sans-serif",preview:"가나다"},{label:"Jua",value:"'Jua',sans-serif",preview:"가나다"},{label:"Sunflower",value:"'Sunflower',sans-serif",preview:"가나다"},{label:"Dokdo",value:"'Dokdo',cursive",preview:"가나다"},{label:"Single Day",value:"'Single Day',cursive",preview:"가나다"},{label:"Gaegu",value:"'Gaegu',cursive",preview:"가나다"},{label:"Hi Melody",value:"'Hi Melody',cursive",preview:"가나다"},{label:"Cute Font",value:"'Cute Font',cursive",preview:"가나다"},{label:"Stylish",value:"'Stylish',sans-serif",preview:"가나다"},{label:"East Sea Dokdo",value:"'East Sea Dokdo',cursive",preview:"가나다"},{label:"Nanum Pen Script",value:"'Nanum Pen Script',cursive",preview:"가나다"},{label:"Nanum Brush Script",value:"'Nanum Brush Script',cursive",preview:"가나다"},{label:"Montserrat",value:"'Montserrat',sans-serif",preview:"Aa가나"},{label:"Playfair Display",value:"'Playfair Display',serif",preview:"Aa가나"},{label:"Space Grotesk",value:"'Space Grotesk',sans-serif",preview:"Aa가나"},{label:"DM Sans",value:"'DM Sans',sans-serif",preview:"Aa가나"}];function Be(o,a,r,i){const n=ve(o,a);if(n)return n;const d=U(o,i);return[ke(o,a,r,d),Ee(o),Te(o,i)].join(`
`)}function Le(o,a,r){var l;const i=[],n=new Set;let d=0;for(;d>=0&&d<o&&!n.has(d);){i.push(d),n.add(d);const b=(l=a[d])==null?void 0:l[r[d]];if(b==="done")break;const g=Number(b);d=b!=null&&Number.isInteger(g)&&g>=0&&g<o?g:d+1}return i}const qe=`
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
`,Ne=`
const getSinglePagePath=${Le.toString()};
function singlePath(){
  const selected={};
  QS.forEach((q,i)=>{const el=document.querySelector('#g'+q.id+' .ci.ck');if(el?.dataset.oi!=null)selected[i]=el.dataset.oi;});
  return getSinglePagePath(TOTAL,BRANCH,selected);
}
function updateSinglePath(){
  const visible=new Set(singlePath());
  QS.forEach((q,i)=>{document.getElementById('sl'+i).hidden=!visible.has(i);});
}
function singleEnter(event){
  if(event.key!=='Enter'||event.isComposing)return;
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
    ans['Q'+(i+1)+'_답']=(ok?'✅정답':'❌오답')+'(선택:'+selected.querySelector('span').textContent+')';
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
    const button=document.getElementById('sb');button.disabled=false;button.classList.remove('ld2');
    tst(event.data.message||'저장하지 못했습니다. 다시 제출해주세요.','fail');
  }
});
updateSinglePath();
`,Oe=`
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
`,Ce=`
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
`,Ae=`
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
`;function Pe(o){return o==="ocean"?Ce:o==="glass"?Ae:""}function s(o){return String(o||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function u(o){return String(o||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")}function De(o,a,r,i={},n={}){var M;const{animType:d=0,fontFamily:l="'Noto Sans KR',sans-serif",conceptTheme:b="default",useStart:g=!0,bgBlur:m=0,bgOverlay:O=.5,bgOverlayColor:k="#000000",allowBack:S=!0,autoNext:h=!1,useConfetti:C=!0,useKb:_=!0,layout:Y="steps",submitBtnText:F="제출하기",waitForSubmit:X=!1,startTag:Q="✦ Form",startBtnText:J="시작하기",startDesc:E="",doneTitle:W="제출 완료!",doneDesc:Z="응답해주셔서 감사합니다 🎉",doneCta:P="",doneUrl:T="",donePdfUrl:V="",scriptUrl:ee="https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec"}=i,f=Y==="single",z=_&&!f,te=V||(/\.pdf(\?|#|$)/i.test(T)?T:""),B=Object.hasOwn(n,"coverImgData")?n.coverImgData:i.coverImgData??null,L=n.qImgData??i.qImgData??{},q=Object.hasOwn(n,"bgImgData")?n.bgImgData:i.bgImgData??null,$=a.length;if(!$)return'<html><body style="background:#0e0e14;color:var(--tx3);font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:14px">질문을 추가해주세요.</body></html>';const R=a.some(e=>e.type==="quiz"),re=JSON.stringify(a.reduce((e,t,v)=>(t.type==="quiz"&&(e[v]={correct:t.correctAnswer??0,explanation:t.explanation||""}),e),{})),oe=JSON.stringify(a.reduce((e,t,v)=>{var p;if((t.type==="single"||t.type==="quiz")&&((p=t.branches)!=null&&p.length)){const x={};t.branches.forEach(I=>{I.targetIdx!=null&&(x[I.optionIdx]=I.targetIdx)}),Object.keys(x).length&&(e[v]=x)}return e},{}));JSON.stringify(a.map(e=>e.id));const ae=Be(b,r.c1,r.c2,l),ie=Pe(b),ne=Se(U(b,l)),se=["@keyframes siU{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}@keyframes soU{from{opacity:1}to{opacity:0;transform:translateY(-40px)}}@keyframes siD{from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}}@keyframes soD{from{opacity:1}to{opacity:0;transform:translateY(40px)}}.en{animation:siU .38s ease both}.ex{animation:soU .28s ease both}.ep{animation:siD .38s ease both}.xp{animation:soD .28s ease both}","@keyframes fdi{from{opacity:0;transform:scale(.94);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}@keyframes fdo{from{opacity:1;filter:blur(0)}to{opacity:0;transform:scale(1.05);filter:blur(6px)}}.en,.ep{animation:fdi .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fdo .28s ease both}","@keyframes fxIn{from{opacity:0;transform:perspective(700px) rotateX(14deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fxOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateX(-14deg) scale(.97)}}.en,.ep{animation:fxIn .4s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:fxOut .28s ease both}","@keyframes fyIn{from{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyInR{from{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}to{opacity:1;transform:none}}@keyframes fyOut{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(16deg) scale(.97)}}@keyframes fyOutR{from{opacity:1}to{opacity:0;transform:perspective(700px) rotateY(-16deg) scale(.97)}}.en{animation:fyIn .42s cubic-bezier(.22,1,.36,1) both}.ex{animation:fyOut .28s ease both}.ep{animation:fyInR .42s cubic-bezier(.22,1,.36,1) both}.xp{animation:fyOutR .28s ease both}","@keyframes ziIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}@keyframes ziOut{from{opacity:1;transform:none}to{opacity:0;transform:scale(1.2)}}.en,.ep{animation:ziIn .4s cubic-bezier(.34,1.4,.64,1) both}.ex,.xp{animation:ziOut .28s ease both}","@keyframes slIn{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}}@keyframes slOut{from{opacity:1}to{opacity:0;transform:translateX(-60px)}}@keyframes slInR{from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}}@keyframes slOutR{from{opacity:1}to{opacity:0;transform:translateX(60px)}}.en{animation:slIn .38s cubic-bezier(.22,1,.36,1) both}.ex{animation:slOut .28s ease both}.ep{animation:slInR .38s cubic-bezier(.22,1,.36,1) both}.xp{animation:slOutR .28s ease both}","@keyframes bnIn{0%{opacity:0;transform:translateY(60px) scale(.9)}60%{transform:translateY(-8px) scale(1.02)}80%{transform:translateY(4px)}100%{opacity:1;transform:none}}@keyframes bnOut{0%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(.95)}}.en,.ep{animation:bnIn .55s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:bnOut .28s ease both}","@keyframes rzIn{from{opacity:0;transform:rotate(-8deg) scale(.85)}to{opacity:1;transform:none}}@keyframes rzOut{from{opacity:1}to{opacity:0;transform:rotate(8deg) scale(.85)}}.en,.ep{animation:rzIn .45s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:rzOut .28s ease both}","@keyframes glIn{0%{opacity:0;transform:translateX(-4px) skewX(3deg)}20%{transform:translateX(3px) skewX(-2deg)}40%{transform:translateX(-2px) skewX(1deg)}100%{opacity:1;transform:none}}@keyframes glOut{0%{opacity:1}50%{transform:translateX(4px) skewX(-3deg)}100%{opacity:0;transform:translateX(-4px)}}.en,.ep{animation:glIn .45s ease both}.ex,.xp{animation:glOut .28s ease both}","@keyframes ufIn{from{opacity:0;transform:translateY(-30px) scaleY(.6);transform-origin:top}to{opacity:1;transform:none}}@keyframes ufOut{from{opacity:1}to{opacity:0;transform:translateY(30px) scaleY(.6);transform-origin:bottom}}.en,.ep{animation:ufIn .42s cubic-bezier(.22,1,.36,1) both}.ex,.xp{animation:ufOut .28s ease both}"][d]||"",de=a.map((e,t)=>{const v=L[e.id]&&f?`<img class="question-image" src="${s(L[e.id])}" loading="lazy" decoding="async" alt="">`:L[e.id]?`<img class="question-image" src="${L[e.id]}" loading="lazy" decoding="async" alt="">`:"";let p="";if(e.type==="short")p=`<input type="text" class="fi" id="f${e.id}" placeholder="${s(e.placeholder||"답변을 입력하세요...")}" onkeydown="if(event.key==='Enter')gn(${t})">`;else if(e.type==="long")p=`<textarea class="fi" id="f${e.id}" style="height:110px;resize:none;padding-top:13px;line-height:1.6" placeholder="${s(e.placeholder||"답변을 입력하세요...")}"></textarea>`;else if(e.type==="phone")p=`<div style="position:relative"><div style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tx3);pointer-events:none">🇰🇷 +82</div><input type="tel" class="fi" id="f${e.id}" style="padding-left:72px" placeholder="010-0000-0000" inputmode="tel" onkeydown="if(event.key==='Enter')gn(${t})"></div>`;else if(e.type==="email")p=`<input type="email" class="fi" id="f${e.id}" placeholder="example@email.com" inputmode="email" onkeydown="if(event.key==='Enter')gn(${t})">`;else if(e.type==="multiple"){const c=(e.options||[]).map(w=>`<div class="ci" onclick="pick(this,'g${e.id}',true)"><div class="cb"></div><span>${s(w)}</span></div>`).join(""),y=e.other?`<div class="ci" onclick="pickOther(this,'g${e.id}',true)"><div class="cb"></div><input class="oi" placeholder="기타..." id="oi${e.id}" onclick="event.stopPropagation()"></div>`:"";p=`<div class="cg" id="g${e.id}">${c}${y}</div>`}else if(e.type==="single"){const c=(e.options||[]).map((w,A)=>`<div class="ci si" data-oi="${A}" onclick="pick(this,'g${e.id}',false)"><div class="cb rb"></div><span>${s(w)}</span></div>`).join(""),y=e.other?`<div class="ci si" onclick="pickOther(this,'g${e.id}',false)"><div class="cb rb"></div><input class="oi" placeholder="기타..." id="oi${e.id}" onclick="event.stopPropagation()"></div>`:"";p=`<div class="cg" id="g${e.id}">${c}${y}</div>`}else if(e.type==="quiz"){const c=(e.options||[]).map((y,w)=>`<div class="ci si qo" data-oi="${w}" onclick="pickQuiz(this,'g${e.id}',${t})"><div class="cb rb"></div><span>${s(y)}</span></div>`).join("");p=`<div class="cg" id="g${e.id}">${c}</div><div class="qfb" id="qfb${t}" style="display:none"></div>`}else e.type==="legal"&&(p=`<div class="ls">${s(e.legalText||"").replace(/\n/g,"<br>")}</div><div class="la" id="la${e.id}" onclick="this.classList.toggle('ck')"><div class="ld"></div><span style="font-size:13px;color:var(--tx2);font-weight:300"><strong style="color:var(--tx);font-weight:500">위 내용에 동의합니다.</strong></span></div>`);if(f){if(["single","multiple","quiz"].includes(e.type)){const c=e.type==="multiple",y=c?"checkbox":"radio",w=(e.options||[]).map((me,ue)=>`<label class="ci${c?"":" si"}" data-oi="${ue}"><input class="native-choice" type="${y}" name="g${e.id}" onchange="pick(this.parentElement,'g${e.id}',${c})"><div class="cb${c?"":" rb"}"></div><span>${s(me)}</span></label>`).join(""),A=e.other&&e.type!=="quiz"?`<label class="ci${c?"":" si"}"><input class="native-choice" type="${y}" name="g${e.id}" aria-label="기타" onchange="if(${c}&&!this.checked)pick(this.parentElement,'g${e.id}',true);else pickOther(this.parentElement,'g${e.id}',${c})"><div class="cb${c?"":" rb"}"></div><input class="oi" placeholder="기타..." aria-label="기타 답변" id="oi${e.id}" onfocus="pickOther(this.parentElement,'g${e.id}',${c})"></label>`:"";p=`<div class="cg" id="g${e.id}" role="group" aria-labelledby="label${e.id}">${w}${A}</div>`}else e.type==="legal"&&(p=`<div class="ls">${s(e.legalText||"").replace(/\n/g,"<br>")}</div><label class="la" id="la${e.id}"><input class="native-choice" type="checkbox" onchange="this.parentElement.classList.toggle('ck',this.checked)"><div class="ld"></div><span>위 내용에 동의합니다.</span></label>`);return p=p.replace(/ onkeydown="[^"]*"/g,"").replace(/class="fi"/g,`class="fi" aria-labelledby="label${e.id}" aria-describedby="hint${e.id} e${t}" aria-required="${!!e.required}"`),`<section class="single-question" id="sl${t}" aria-labelledby="label${e.id}">
        ${v}<div class="question-heading"><label class="ct" id="label${e.id}" for="f${e.id}">${s(e.label||"질문")}</label><span class="required">${e.required?"필수":"선택"}</span></div>
        <div class="cs" id="hint${e.id}"${e.hint?"":" hidden"}>${s(e.hint||"")}</div>
        ${p}<div class="em" id="e${t}" role="alert"></div>
      </section>`}const x=t===$-1,I=S?`<button class="bb" onclick="gp(${t})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>`:"<span></span>",xe=e.type==="quiz"?`<button class="nb" id="qcb${t}" onclick="quizCheck(${t})"><span class="nl">정답 확인</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
<button class="nb" id="qnb${t}" onclick="gn(${t})" style="display:none"><span class="nl">${x?"결과 보기 🎉":"다음 질문"}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`:`<button class="nb" onclick="${x?"sub()":"gn("+t+")"}"${x?' id="sb"':""}><span class="sp"></span><span class="nl">${x?"신청 완료하기 🎉":"다음 질문"}</span><svg class="na" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`;return`<div class="sl" id="sl${t}" style="display:none">
  <div class="card">${v}
    <div class="cn">STEP ${String(t+1).padStart(2,"0")} / ${String($).padStart(2,"0")}</div>
    <div class="ct">${s(e.label||"질문")}</div>
    ${e.hint?`<div class="cs">${s(e.hint)}</div>`:""}
    <div style="margin-top:6px">${p}</div>
    <div class="em" id="e${t}"></div>
    <div class="cf">${I}${xe}</div>
  </div>
</div>`}).join(""),pe=a.map((e,t)=>{if(e.type==="short"||e.type==="long"){const v=["이름","성함","성명","닉네임","name"].some(x=>String(e.label||"").toLowerCase().includes(x.toLowerCase())),p=["전화","연락처","휴대폰","핸드폰","번호","phone","mobile","tel"].some(x=>String(e.label||"").toLowerCase().includes(x.toLowerCase()));return`case ${t}:{const v=document.getElementById('f${e.id}')?.value.trim()||'';${e.required?`if(!v){er(${t},'답변을 입력해주세요.');return false;}`:""}${v?`if(v){const nv=v.replace(/[s._-·•・,，。!@#$%^&*+=~\`|\\/?:;[]{}<>"']/g,'');const lw=nv.toLowerCase();const badWords=['샘플','sample','demo','dummy','asdf','qwer','확인용','삭제','연습'];if(!nv||nv.length<2||/^[0-9]+$/.test(nv)||/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(nv)||(/^(.)\\1+$/.test(nv)&&nv.length<=4)||badWords.some(w=>lw.includes(w.toLowerCase()))){er(${t},'정확한 이름을 입력해주세요.');return false;}}`:""}${p?`if(v){const n=v.replace(/[-\\s()]/g,'');const bad=new Set(['01000000000','01011111111','01022222222','01033333333','01044444444','01055555555','01066666666','01077777777','01088888888','01099999999','01012345678','01012341234','01012121212','01010101010','01098765432']);const tail=n.slice(3);const badPhone=!!n&&(!/^010\\d{8}$/.test(n)||bad.has(n)||(tail&&new Set(tail.split('')).size===1)||['12345678','23456789','34567890','87654321','98765432'].some(seq=>n.includes(seq)));if(badPhone){er(${t},'올바른 전화번호를 입력해주세요.');return false;}}`:""}ans['${u(e.label||"q"+t)}']=v;break;}`}return e.type==="phone"?`case ${t}:{const v=document.getElementById('f${e.id}')?.value.trim()||'';const n=v.replace(/[-\\s()]/g,'');const bad=new Set(['01000000000','01011111111','01022222222','01033333333','01044444444','01055555555','01066666666','01077777777','01088888888','01099999999','01012345678','01012341234','01012121212','01010101010','01098765432']);const tail=n.slice(3);const badPhone=!!n&&(!/^010\\d{8}$/.test(n)||bad.has(n)||(tail&&new Set(tail.split('')).size===1)||['12345678','23456789','34567890','87654321','98765432'].some(seq=>n.includes(seq)));${e.required?`if(!n){er(${t},'전화번호를 입력해주세요.');return false;}`:""}if(badPhone){er(${t},'올바른 전화번호를 입력해주세요.');return false;}ans['${u(e.label||"전화번호")}']=v;break;}`:e.type==="email"?`case ${t}:{const v=document.getElementById('f${e.id}')?.value.trim()||'';if((${!!e.required}&&!v)||(v&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v))){er(${t},'올바른 이메일을 입력해주세요.');return false;}ans['${u(e.label||"이메일")}']=v;break;}`:e.type==="multiple"?`case ${t}:{const sel=[...document.querySelectorAll('#g${e.id} .ci.ck')].map(el=>{const oi=el.querySelector('.oi');return oi?oi.value||'기타':el.querySelector('span').textContent;});${e.required?`if(!sel.length){er(${t},'하나 이상 선택해주세요.');return false;}`:""}ans['${u(e.label||"q"+t)}']=sel.join(', ');break;}`:e.type==="single"?`case ${t}:{const el=document.querySelector('#g${e.id} .ci.ck');const oi=el?.querySelector('.oi');const sel=oi?oi.value||'기타':el?.querySelector('span')?.textContent||'';${e.required?`if(!sel){er(${t},'선택해주세요.');return false;}`:""}ans['${u(e.label||"q"+t)}']=sel;break;}`:e.type==="quiz"?`case ${t}:{const el=document.querySelector('#g${e.id} .ci.ck');${e.required?`if(!el){er(${t},'보기를 선택해주세요.');return false;}`:""}break;}`:e.type==="legal"?`case ${t}:{${e.required?`if(!document.getElementById('la${e.id}')?.classList.contains('ck')){er(${t},'동의가 필요합니다.');return false;}`:""}ans['${u(e.label||"동의")}']=document.getElementById('la${e.id}')?.classList.contains('ck')?'동의':'미동의';break;}`:`case ${t}:break;`}).join(`
`),le=((M=a.find(e=>e.type==="short"))==null?void 0:M.label)||"",ce=g&&!f?`<div id="ss" class="sl active" style="display:flex"><div class="card">
    ${B?`<img class="cover-image" src="${B}" loading="eager" decoding="async" alt="">`:""}
    <div class="stag">${s(Q)}</div>
    <div class="stit">${s(o).replace(/\n/g,"<br>")}</div>
    ${E?`<div class="sdesc">${s(E)}</div>`:""}
    <button class="sbt" onclick="sf()" onmousedown="rp(event,this)"><span>${s(J)}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    <div style="font-size:12px;color:var(--tx3);margin-top:14px">총 ${$}개 질문</div>
  </div></div>`:"",be=C?`function cf(){const w=document.getElementById('cfw'),colors=['${r.c1}','${r.c2}','#f0eff8','#4ade80','#fbbf24','#f472b6','#38bdf8'];for(let i=0;i<90;i++){const p=document.createElement('div'),c=colors[i%colors.length],sz=5+Math.random()*8;p.style.cssText='position:absolute;top:-12px;left:'+Math.random()*100+'vw;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(Math.random()>.5?'50%':'3px')+';animation:cff '+(1.6+Math.random()*1.6)+'s '+(Math.random()*.9)+'s linear forwards';w.appendChild(p);}setTimeout(()=>w.innerHTML='',4500);}`:"",ge=z?`document.addEventListener('keydown',e=>{if(document.activeElement?.tagName==='TEXTAREA')return;if(e.key==='Enter'||e.key==='ArrowRight'){if(cur<0)sf();else if(cur<TOTAL){const q=QS[cur];if(q&&q.type==='quiz')quizCheck(cur);else gn(cur);}}if((e.key==='ArrowLeft'||e.key==='Backspace')&&document.activeElement?.tagName!=='INPUT'){if(${S}&&(cur>0||HIST.length>0))gp(cur);}});`:"",fe=R?'<div id="qscore" style="margin:10px 0 4px;font-size:15px;font-weight:600"></div>':"";return`<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>${s(o)}</title>
<link href="https://fonts.googleapis.com/css2?family=Gmarket+Sans:wght@300;500;700&display=swap" rel="stylesheet">
<link href="${ne}" rel="stylesheet">
<style>
:root{--c1:${r.c1};--c2:${r.c2};--tx:#f0eff8;--tx2:#9997ab;--tx3:#7a788f;--bg2:#1a1a28;--bd:rgba(255,255,255,.09);--bd2:rgba(255,255,255,.15);--ls-bg:rgba(255,255,255,.025)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${l};min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden;-webkit-font-smoothing:antialiased;position:relative}
${q?`#bg-img{position:fixed;inset:0;z-index:-2;background-image:url('${q}');background-size:cover;background-position:center;filter:blur(${m}px);transform:scale(${m>0?1.05:1});transition:filter .3s}#bg-overlay{position:fixed;inset:0;z-index:-1;background:${k};opacity:${O}}`:""}
#pw{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(255,255,255,.06);z-index:50}
#pf{height:100%;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:0 3px 3px 0;transition:width .6s cubic-bezier(.4,0,.2,1);position:relative}
#pf::after{content:'';position:absolute;right:-2px;top:-2px;bottom:-2px;width:7px;border-radius:50%;background:var(--c2);box-shadow:0 0 10px 2px var(--c2)}
#sc{position:fixed;top:14px;right:18px;font-size:12px;color:var(--tx3);z-index:50;font-variant-numeric:tabular-nums;transition:opacity .3s}
#gb{position:fixed;top:10px;left:14px;z-index:50;display:none;align-items:center;gap:5px;font-size:13px;color:var(--tx3);background:none;border:none;cursor:pointer;font-family:inherit;transition:color .2s,transform .2s;padding:6px 4px}
#gb:hover{color:var(--tx);transform:translateX(-3px)}#gb.v{display:flex}
#kh{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(122,120,143,.5);display:flex;align-items:center;gap:6px;pointer-events:none;z-index:10;transition:opacity .5s;white-space:nowrap}
#kh kbd{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:2px 8px;font-family:monospace;font-size:11px}
.wrap{position:relative;z-index:1;width:100%;max-width:540px}
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
${ae}
${l!=="'Noto Sans KR',sans-serif"?`body{font-family:${l}!important}.ct,.stit{font-family:${l}!important}`:""}
.nb{background:linear-gradient(135deg,${r.c1},${r.c2})!important}.nb:hover{box-shadow:0 8px 28px color-mix(in srgb,${r.c1} 40%,transparent)!important}
.sbt{background:linear-gradient(135deg,${r.c1},${r.c2})!important}
.ci.ck{border-color:${r.c1}!important}.ci.ck .cb{background:${r.c1}!important;border-color:${r.c1}!important}
.cn{color:${r.c1}!important}.card::before{background:linear-gradient(90deg,transparent,${r.c1},${r.c2},transparent)!important}
#pf{background:linear-gradient(90deg,${r.c1},${r.c2})!important}
${se}
@media(max-width:480px){.card{padding:28px 22px 22px;border-radius:20px}.ct{font-size:19px}}
${f?qe:""}
${Oe}
${ie}
${q&&b.startsWith("clean_")?"body{background:transparent}":""}
</style></head><body${f?' class="single-page"':""}>
${q?'<div id="bg-img"></div><div id="bg-overlay"></div>':""}
<div id="pw"><div id="pf"></div></div>
<div id="sc"></div>
<button id="gb" onclick="gp(cur)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>이전</button>
<div id="cfw"></div>
${z?'<div id="kh"><kbd>Enter</kbd> 또는 <kbd>→</kbd> 로 다음으로</div>':""}
<div id="tst"></div>
<div class="wrap">
  ${ce}
  ${f?`<main class="card single-sheet" id="single-form">
    <header class="single-header">
      ${B?`<img class="single-cover" src="${s(B)}" decoding="async" alt="">`:""}
      <h1 class="single-title">${s(o||"신청서")}</h1>
      ${E?`<p class="single-desc">${s(E)}</p>`:""}
    </header>`:""}
  ${de}
  ${f?`<footer class="single-footer"><button class="nb single-submit" id="sb" type="button" onclick="submitSingle()"><span class="sp"></span><span class="nl">${s(F||"제출하기")}</span></button></footer></main>`:""}
  <div class="sl" id="done"><div class="card done-card">
    <div class="dr"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
    <div class="dt">${s(W)}</div>
    ${fe}
    <div class="dd"><span class="dn" id="dn"></span>${s(Z)}</div>
    ${P&&T?`<a class="dcta" href="${s(T)}" target="_blank">${s(P)} →</a>`:""}
    <button class="drst" onclick="rst()">다시 제출하기</button>
  </div></div>
</div>
<script>
const SU='${u(ee)}';
const SINGLE_PAGE=${f};
const WAIT_FOR_SUBMIT=${f&&!!X};
const TOTAL=${$};
const QUIZ=${re};
const BRANCH=${oe};
const QS=${JSON.stringify(a.map(e=>({id:e.id,type:e.type})))};
const HIST=[];
let cur=${f?"0":"-1"},anim=false,submitted=false;
let qzScore=0,qzTotal=0,qzDone={};
const ans={};
upUI();
${!g&&!f?"initFirst();":""}
function initFirst(){cur=0;const s=document.getElementById('sl0');if(s){s.style.display='flex';s.classList.add('active');const i=s.querySelector('input,textarea');if(i)setTimeout(()=>i.focus(),80);}upUI();}
function sid(i){return i<0?'ss':i>=TOTAL?'done':'sl'+i}
function upUI(){
  if(SINGLE_PAGE)return;
  if(cur<0||cur>=TOTAL){document.getElementById('pf').style.width=cur>=TOTAL?'100%':'0%';document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';return;}
  document.getElementById('pf').style.width=((cur+1)/TOTAL*100)+'%';
  document.getElementById('sc').textContent=(cur+1)+' / '+TOTAL;
  document.getElementById('sc').style.opacity='1';
  document.getElementById('gb').className=(${S}&&(cur>0||HIST.length>0))?'v':'';
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
  if(anim)return;if(!vld(s))return;
  const br=BRANCH[s];
  let next=s+1;
  if(br){
    const el=document.querySelector('#g'+QS[s].id+' .ci.ck');
    const oi=el?parseInt(el.dataset.oi??-1):-1;
    if(oi>=0&&br[oi]!=null){const t=br[oi];if(t==='done'){finishForm();return;}next=parseInt(t);}
  }
  HIST.push(cur);
  if(next>=TOTAL){finishForm();return;}
  const f=cur;cur=next;
  go(f,cur,'n');upUI();
}
function gp(s){
  if(anim)return;
  const prev=HIST.length>0?HIST.pop():(cur>0?cur-1:0);
  const f=cur;cur=prev;go(f,cur,'p');upUI();
}
function pick(el,gid,multi){
  if(el.classList.contains('qdisabled'))return;
  if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));
  el.classList.toggle('ck');el.style.transform='scale(0.96)';setTimeout(()=>el.style.transform='',100);
  if(SINGLE_PAGE){syncChoices(gid);updateSinglePath();}
  ${h&&!f?"if(!multi){const s=document.querySelectorAll('#'+gid+' .ci.ck').length;if(s===1)setTimeout(()=>gn(cur),320);}":""}}
function syncChoices(gid){document.querySelectorAll('#'+gid+' .ci').forEach(el=>{const input=el.querySelector('.native-choice');if(input)input.checked=el.classList.contains('ck');});}
function pickOther(el,gid,multi){if(!multi)document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));el.classList.add('ck');if(SINGLE_PAGE){syncChoices(gid);updateSinglePath();}el.querySelector('.oi')?.focus();}
function pickQuiz(el,gid,qi){
  if(qzDone[qi])return;
  document.querySelectorAll('#'+gid+' .ci').forEach(c=>c.classList.remove('ck'));
  el.classList.add('ck');
}
function quizCheck(qi){
  if(qzDone[qi])return;
  const qd=QUIZ[qi];if(!qd)return;
  const gid='g'+QS[qi].id;
  const sel=document.querySelector('#'+gid+' .ci.ck');
  if(!sel){er(qi,'보기를 선택해주세요.');return;}
  const selOi=parseInt(sel.dataset.oi);
  const ok=selOi===qd.correct;
  qzDone[qi]=true;qzTotal++;if(ok)qzScore++;
  ans['Q'+(qi+1)+'_답']=(ok?'✅정답':'❌오답')+'(선택:'+sel.querySelector('span').textContent+')';
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
    fb.innerHTML=(ok?'✅ 정답입니다!':'❌ 오답입니다.')+(qd.explanation?'<br><span style="font-size:12px;opacity:.85">💡 '+qd.explanation+'</span>':'');
  }
  const cb=document.getElementById('qcb'+qi),nb=document.getElementById('qnb'+qi);
  if(cb)cb.style.display='none';
  if(nb)nb.style.display='flex';
}
function er(i,m){const e=document.getElementById('e'+i);e.textContent='⚠ '+m;e.classList.add('on');}
function ce(){document.querySelectorAll('.em').forEach(e=>{e.textContent='';e.classList.remove('on')});document.querySelectorAll('.fi').forEach(f=>f.classList.remove('er'));}
function vld(s){ce();switch(s){${pe}default:break;}return true;}
function finishForm(){
  if(submitted)return;
  submitted=true;
  ans._ts=new Date().toLocaleString('ko-KR');
  ans._formTitle=${JSON.stringify(o||"").replace(/</g,"\\u003c")};
  try{window.parent.postMessage({type:'FORM_SUBMIT',answers:ans,pdfUrl:'${u(te)}'},'*');}catch(e){}
  if(SU){try{fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});}catch(e){}}
  if(WAIT_FOR_SUBMIT){const btn=document.getElementById('sb');btn.disabled=true;btn.classList.add('ld2');return;}
  completeForm();
}
function completeForm(){
  const f=cur;cur=TOTAL;
  const dn=document.getElementById('dn');
  if(dn){const nk='${u(le)}';if(ans[nk])dn.textContent=ans[nk]+', ';}
  ${R?"const sc=document.getElementById('qscore');if(sc&&qzTotal>0){const p=Math.round(qzScore/qzTotal*100);sc.textContent='🏆 점수: '+qzScore+' / '+qzTotal+' ('+p+'%)';sc.style.color=p>=70?'#4ade80':p>=40?'#fbbf24':'#f87171';}":""}
  document.getElementById('sc').style.opacity='0';document.getElementById('gb').className='';
  ${z?"document.getElementById('kh').style.opacity='0';":""}
  if(SINGLE_PAGE){document.getElementById('single-form').hidden=true;document.getElementById('done').style.display='flex';window.scrollTo(0,0);}
  else go(f,TOTAL,'n');
  document.getElementById('pf').style.width='100%';
  ${C?"if(!qzTotal||qzScore===qzTotal)setTimeout(cf,420);else if(qzScore>0)setTimeout(cf,420);":""}
  tst('✅ 완료되었습니다!','ok');
}
async function sub(){
  if(SINGLE_PAGE){submitSingle();return;}
  if(anim)return;if(!vld(${$-1}))return;
  const btn=document.getElementById('sb');if(btn){btn.classList.add('ld2');btn.disabled=true;}
  finishForm();
  if(btn){btn.classList.remove('ld2');btn.disabled=false;}
}
function rst(){
  submitted=false;ce();
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
  ${z?"document.getElementById('kh').style.opacity='1';":""}
  const f=cur;cur=-1;
  ${g?"go(f,-1,'p');upUI();":"setTimeout(initFirst,460);"}
}
${be}
function rp(e,btn){const r=btn.getBoundingClientRect(),sz=Math.max(r.width,r.height)*2,el=document.createElement('span');el.className='rp';el.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';btn.appendChild(el);setTimeout(()=>el.remove(),560);}
function tst(m,t){const el=document.getElementById('tst');el.textContent=m;el.className=t+' on';setTimeout(()=>el.className='',3200);}
${ge}
${f?Ne:""}
${z?"setTimeout(()=>document.getElementById('kh').style.opacity='0',5000);":""}
<\/script></body></html>`}export{Me as C,Ge as F,Re as a,De as g};
