import{l as N,r as c,j as m,y as W,c as B}from"./index-Byp5YJXJ.js";import{g as H,e as O}from"./generateHTML-BvRTyd1g.js";import{i as K,a as A}from"./phoneValidation-DnkXk63Q.js";const Q="_center_nvpoa_1",V="_wrap_nvpoa_9",Z="_iframe_nvpoa_15",$="_spinner_nvpoa_21",f={center:Q,wrap:V,iframe:Z,spinner:$};function z(s,e){const l=O(e||[]);for(const[a,g]of(e||[]).entries()){const h=s==null?void 0:s[l[a]];if(K(g)&&h&&!A(h))return"올바른 전화번호를 입력해주세요."}return""}async function J(s,e){const l=await fetch("/api/submit-response",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({formId:s,answers:e})});if(!l.ok){const a=await l.json().catch(()=>null);throw new Error((a==null?void 0:a.error)||"응답을 저장하지 못했습니다. 다시 시도해주세요.")}}function G(){return`<script>
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
<\/script>`}const te=()=>{var v,T,S,b,k,P;const{slug:s}=N(),[e,l]=c.useState(null),[a,g]=c.useState(!0),[h,x]=c.useState(null),d=c.useRef(null),w=c.useRef(null),U=n=>{if(!n||typeof n!="string")return;const t=n.trim();if(!t||window.open(t,"_blank","noopener,noreferrer"))return;const r=document.createElement("a");r.href=t,r.target="_blank",r.rel="noopener noreferrer",document.body.appendChild(r),r.click(),r.remove()},D=async n=>{try{await B.rpc("increment_views",{target_slug:n})}catch(t){console.error("조회수 업데이트 실패:",t.message)}};if(c.useEffect(()=>{let n=!0;return s&&(async()=>{try{g(!0),x(null);const o=decodeURIComponent(s),r=await W(o);if(!n)return;if(!r)throw new Error("폼을 찾을 수 없습니다.");l(r),D(o)}catch(o){n&&x(o.message)}finally{n&&g(!1)}})(),()=>{n=!1}},[s]),c.useEffect(()=>{if(!e)return;const n=async t=>{var o,r,F,R,E,I,M,j;if(t.source===((o=d.current)==null?void 0:o.contentWindow)&&((r=t.data)==null?void 0:r.type)==="FORM_SUBMIT"){if(((F=w.current)==null?void 0:F.formId)===e.id)return;const u={formId:e.id,source:t.source};w.current=u;let i=null,C=!1;try{const p=z(t.data.answers,e.questions||[]);if(p){(E=(R=d.current)==null?void 0:R.contentWindow)==null||E.postMessage({type:"SUBMIT_ERROR",message:p},"*"),alert(p);return}const _=typeof((I=t.data)==null?void 0:I.pdfUrl)=="string"?t.data.pdfUrl.trim():"";/^https?:\/\//i.test(_)&&(i=window.open("","_blank")),await J(e.id,t.data.answers),u.source===((M=d.current)==null?void 0:M.contentWindow)&&(u.source.postMessage({type:"SUBMIT_SUCCESS"},"*"),C=!0,i?(i.opener=null,i.location.replace(_)):U(_))}catch(p){u.source===((j=d.current)==null?void 0:j.contentWindow)&&u.source.postMessage({type:"SUBMIT_ERROR",message:p.message},"*")}finally{C||i==null||i.close(),w.current===u&&(w.current=null)}}};return window.addEventListener("message",n),()=>window.removeEventListener("message",n)},[e]),a)return m.jsx("div",{className:f.center,children:m.jsx("div",{className:f.spinner})});if(h||!e)return m.jsx("div",{className:f.center,children:m.jsx("h2",{children:"폼을 찾을 수 없습니다"})});const q={coverImgData:e.cover_url||((v=e.settings)==null?void 0:v.coverImgData)||null,bgImgData:e.background_url||((T=e.settings)==null?void 0:T.bgImgData)||null,qImgData:e.q_images||((S=e.settings)==null?void 0:S.qImgData)||{}},L={...e.settings||{},waitForSubmit:!0,doneTitle:((b=e.settings)==null?void 0:b.doneTitle)||"신청이 완료되었습니다!",doneDesc:((k=e.settings)==null?void 0:k.doneDesc)||"신청해주셔서 감사합니다. 확인 후 안내드리겠습니다.",scriptUrl:((P=e.settings)==null?void 0:P.scriptUrl)||"https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec"};let y=H(e.title,e.questions||[],{c1:e.theme_c1,c2:e.theme_c2},L,q);return y=y.replace("</body></html>",`${G()}</body></html>`),m.jsx("div",{className:f.wrap,children:m.jsx("iframe",{ref:d,className:f.iframe,srcDoc:y,sandbox:"allow-scripts allow-popups allow-popups-to-escape-sandbox",title:e.title})})};export{G as clientFormPatch,te as default};
