export function getSinglePagePath(total, branches, selected) {
  const path = []
  const visited = new Set()
  let index = 0
  while (index >= 0 && index < total && !visited.has(index)) {
    path.push(index)
    visited.add(index)
    const target = branches[index]?.[selected[index]]
    if (target === 'done') break
    const next = Number(target)
    index = target != null && Number.isInteger(next) && next >= 0 && next < total ? next : index + 1
  }
  return path
}

export const singlePageCSS = `
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
`

export const singlePageJS = `
const getSinglePagePath=${getSinglePagePath.toString()};
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
`
