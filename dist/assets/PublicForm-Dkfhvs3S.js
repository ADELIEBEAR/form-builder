import{l as D,r as i,j as u,y as U,c as L}from"./index-Bca1m6ho.js";import{g as N,d as W}from"./generateHTML-CwdLouE9.js";import{i as B,a as H}from"./phoneValidation-DnkXk63Q.js";const O="_center_l9fxq_1",K="_wrap_l9fxq_17",A="_iframe_l9fxq_29",Q="_spinner_l9fxq_41",f={center:O,wrap:K,iframe:A,spinner:Q};function V(s,e){const c=W(e||[]);for(const[a,p]of(e||[]).entries()){const g=s==null?void 0:s[c[a]];if(B(p)&&g&&!H(g))return"올바른 전화번호를 입력해주세요."}return""}async function Z(s,e){const c=await fetch("/api/submit-response",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({formId:s,answers:e})});if(!c.ok){const a=await c.json().catch(()=>null);throw new Error((a==null?void 0:a.error)||"응답을 저장하지 못했습니다. 다시 시도해주세요.")}}function $(){return`<script>
(function(){
  try {
    function politeSentence(text){
      return String(text || '')
        .replace(/안내드릴게요/g, '안내드리겠습니다')
        .replace(/드릴게요/g, '드리겠습니다')
        .replace(/해드릴게요/g, '해드리겠습니다')
        .replace(/할게요/g, '하겠습니다')
        .replace(/보내드릴게요/g, '보내드리겠습니다')
        .replace(/전송할게요/g, '전송하겠습니다')
        .replace(/공유할게요/g, '공유하겠습니다');
    }

    function makePoliteText(){
      var dt = document.querySelector('.dt');
      if (dt && /신청s*완료/.test(dt.textContent || '')) dt.textContent = '신청이 완료되었습니다!';

      var dn = document.getElementById('dn');
      if (dn) {
        var raw = (dn.textContent || '').trim();
        if (raw) {
          var name = raw.replace(/[,，]s*$/, '').replace(/님s*$/, '').trim();
          if (name) dn.textContent = name + '님, ';
        }
      }

      var dd = document.querySelector('.dd');
      if (dd) dd.innerHTML = politeSentence(dd.innerHTML);
    }

    var oldFinish = typeof finishForm === 'function' ? finishForm : null;
    if (oldFinish) {
      finishForm = function(){
        var result = oldFinish.apply(this, arguments);
        setTimeout(makePoliteText, 0);
        setTimeout(makePoliteText, 80);
        setTimeout(makePoliteText, 250);
        setTimeout(makePoliteText, 700);
        return result;
      };
    }

    makePoliteText();
    setTimeout(makePoliteText, 300);
    setTimeout(makePoliteText, 1000);
  } catch(e) {}
})();
<\/script>`}const X=()=>{var x,_,T,S,v,b;const{slug:s}=D(),[e,c]=i.useState(null),[a,p]=i.useState(!0),[g,y]=i.useState(null),m=i.useRef(null),h=i.useRef(null),M=t=>{if(!t||typeof t!="string")return;const r=t.trim();if(!r||window.open(r,"_blank","noopener,noreferrer"))return;const n=document.createElement("a");n.href=r,n.target="_blank",n.rel="noopener noreferrer",document.body.appendChild(n),n.click(),n.remove()},q=async t=>{try{await L.rpc("increment_views",{target_slug:t})}catch(r){console.error("조회수 업데이트 실패:",r.message)}};if(i.useEffect(()=>{let t=!0;return s&&(async()=>{try{p(!0),y(null);const o=decodeURIComponent(s),n=await U(o);if(!t)return;if(!n)throw new Error("폼을 찾을 수 없습니다.");c(n),q(o)}catch(o){t&&y(o.message)}finally{t&&p(!1)}})(),()=>{t=!1}},[s]),i.useEffect(()=>{if(!e)return;const t=async r=>{var o,n,k,P,F,R,E,I;if(r.source===((o=m.current)==null?void 0:o.contentWindow)&&((n=r.data)==null?void 0:n.type)==="FORM_SUBMIT"){if(((k=h.current)==null?void 0:k.formId)===e.id)return;const l={formId:e.id,source:r.source};h.current=l;try{const d=V(r.data.answers,e.questions||[]);if(d){(F=(P=m.current)==null?void 0:P.contentWindow)==null||F.postMessage({type:"SUBMIT_ERROR",message:d},"*"),alert(d);return}await Z(e.id,r.data.answers),l.source===((R=m.current)==null?void 0:R.contentWindow)&&(l.source.postMessage({type:"SUBMIT_SUCCESS"},"*"),M((E=r.data)==null?void 0:E.pdfUrl))}catch(d){l.source===((I=m.current)==null?void 0:I.contentWindow)&&l.source.postMessage({type:"SUBMIT_ERROR",message:d.message},"*")}finally{h.current===l&&(h.current=null)}}};return window.addEventListener("message",t),()=>window.removeEventListener("message",t)},[e]),a)return u.jsx("div",{className:f.center,children:u.jsx("div",{className:f.spinner})});if(g||!e)return u.jsx("div",{className:f.center,children:u.jsx("h2",{children:"폼을 찾을 수 없습니다"})});const j={coverImgData:e.cover_url||((x=e.settings)==null?void 0:x.coverImgData)||null,bgImgData:e.background_url||((_=e.settings)==null?void 0:_.bgImgData)||null,qImgData:e.q_images||((T=e.settings)==null?void 0:T.qImgData)||{}},C={...e.settings||{},waitForSubmit:!0,doneTitle:((S=e.settings)==null?void 0:S.doneTitle)||"신청이 완료되었습니다!",doneDesc:((v=e.settings)==null?void 0:v.doneDesc)||"신청해주셔서 감사합니다. 확인 후 안내드리겠습니다.",scriptUrl:((b=e.settings)==null?void 0:b.scriptUrl)||"https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec"};let w=N(e.title,e.questions||[],{c1:e.theme_c1,c2:e.theme_c2},C,j);return w=w.replace("</body></html>",`${$()}</body></html>`),u.jsx("div",{className:f.wrap,children:u.jsx("iframe",{ref:m,className:f.iframe,srcDoc:w,sandbox:"allow-scripts allow-popups allow-popups-to-escape-sandbox",title:e.title})})};export{$ as clientFormPatch,X as default};
