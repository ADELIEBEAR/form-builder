// Presentation only: original theme geometry, keyframes and runtime stay intact.
export const formRefinementCSS = `
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
`;
