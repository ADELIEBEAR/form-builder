import{l as N,r as c,j as u,y as D,c as U}from"./index-CAa8dQST.js";import{g as j}from"./generateHTML-BmpWH4M2.js";const B="_center_l9fxq_1",V="_wrap_l9fxq_17",W="_iframe_l9fxq_29",H="_spinner_l9fxq_41",d={center:B,wrap:V,iframe:W,spinner:H};function L(t){let e=String(t||"").replace(/[^0-9]/g,"").trim();return e.startsWith("8210")&&e.length===12&&(e="0"+e.slice(2)),e.startsWith("82")&&e.length===12&&(e="0"+e.slice(2)),e}function $(t){const e=L(t);return/^010\d{8}$/.test(e)}const z=new Set(["01000000000","01011111111","01022222222","01033333333","01044444444","01055555555","01066666666","01077777777","01088888888","01099999999","01012345678","01012341234","01012121212","01010101010","01098765432"]);function q(t){const e=L(t);if(!e)return!1;if(!$(e)||z.has(e))return!0;const r=e.slice(3);return/^(\d)\1+$/.test(r)?!0:["12345678","23456789","34567890","87654321","98765432"].some(o=>e.includes(o))}function C(t,e,r){const o=(e==null?void 0:e.label)||r;return(t==null?void 0:t[o])??(t==null?void 0:t[r])??""}function G(t,e){for(const r of e||[]){if(r.type==="phone"){const o=C(t,r,"전화번호");if(o&&q(o))return"올바른 전화번호를 입력해주세요."}if(r.type==="short"||r.type==="long"){const o=String(r.label||"").toLowerCase();if(["전화","연락처","휴대폰","핸드폰","번호","phone","mobile","tel"].some(a=>o.includes(a.toLowerCase()))){const a=C(t,r,r.label||"");if(a&&q(a))return"올바른 전화번호를 입력해주세요."}}}return""}async function Q(t,e){if(!(await fetch("/.netlify/functions/submit-response",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({formId:t,answers:e})})).ok)throw new Error("응답을 저장하지 못했습니다.")}function K(){return`<script>
(function(){
  try {
    var bad = new Set(['01000000000','01011111111','01022222222','01033333333','01044444444','01055555555','01066666666','01077777777','01088888888','01099999999','01012345678','01012341234','01012121212','01010101010','01098765432']);
    function cleanPhone(value){
      var n = String(value || '').replace(/[^0-9]/g, '');
      if (n.indexOf('8210') === 0 && n.length === 12) n = '0' + n.slice(2);
      if (n.indexOf('82') === 0 && n.length === 12) n = '0' + n.slice(2);
      return n;
    }
    function goodPhone(value){
      var n = cleanPhone(value);
      if (!/^010\\d{8}$/.test(n)) return false;
      if (bad.has(n)) return false;
      var tail = n.slice(3);
      if (/^(\\d)\\1+$/.test(tail)) return false;
      return !['12345678','23456789','34567890','87654321','98765432'].some(function(seq){ return n.indexOf(seq) >= 0; });
    }

    var oldVld = typeof vld === 'function' ? vld : null;
    if (oldVld) {
      vld = function(s){
        var ok = oldVld(s);
        if (ok) return true;
        var slide = document.getElementById('sl' + s);
        if (!slide) return false;
        var input = slide.querySelector('input,textarea');
        if (!input) return false;
        var label = (slide.querySelector('.ct') && slide.querySelector('.ct').textContent) || '';
        var isPhoneField = input.type === 'tel' || ['전화','연락처','휴대폰','핸드폰','번호','phone','mobile','tel'].some(function(w){ return label.toLowerCase().indexOf(w.toLowerCase()) >= 0; });
        var value = input.value || '';
        if (!isPhoneField || !value || !goodPhone(value)) return false;
        if (typeof ce === 'function') ce();
        if (typeof ans !== 'undefined') ans[label || '전화번호'] = value.trim();
        return true;
      };
    }

    document.addEventListener('keydown', function(e){
      if (typeof SINGLE_PAGE !== 'undefined' && SINGLE_PAGE) return;
      var tag = e.target && e.target.tagName;
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON')) {
        if (tag === 'TEXTAREA') return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation && e.stopImmediatePropagation();
        if (e.key === 'Enter') {
          if (typeof cur !== 'undefined' && cur < 0 && typeof sf === 'function') sf();
          else if (typeof cur !== 'undefined' && typeof TOTAL !== 'undefined' && cur < TOTAL && typeof gn === 'function') {
            var q = (typeof QS !== 'undefined') ? QS[cur] : null;
            if (q && q.type === 'quiz' && typeof quizCheck === 'function') quizCheck(cur);
            else gn(cur);
          }
        }
      }
    }, true);

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
<\/script>`}const X=()=>{var h,y,v,w,x,S;const{slug:t}=N(),[e,r]=c.useState(null),[o,m]=c.useState(!0),[a,I]=c.useState(null),f=c.useRef(null),R=i=>{if(!i||typeof i!="string")return;const n=i.trim();if(!n||window.open(n,"_blank","noopener,noreferrer"))return;const s=document.createElement("a");s.href=n,s.target="_blank",s.rel="noopener noreferrer",document.body.appendChild(s),s.click(),s.remove()},O=async i=>{try{await U.rpc("increment_views",{target_slug:i})}catch(n){console.error("조회수 업데이트 실패:",n.message)}};if(c.useEffect(()=>{t&&(async()=>{try{m(!0);const n=decodeURIComponent(t),l=await D(n);if(!l)throw new Error("폼을 찾을 수 없습니다.");r(l),O(n)}catch(n){I(n.message)}finally{m(!1)}})()},[t]),c.useEffect(()=>{if(!e)return;const i=async n=>{var l,s,T,P,_,E,b,k,F;if(n.source===((l=f.current)==null?void 0:l.contentWindow)&&((s=n.data)==null?void 0:s.type)==="FORM_SUBMIT")try{const p=G(n.data.answers,e.questions||[]);if(p){(P=(T=f.current)==null?void 0:T.contentWindow)==null||P.postMessage({type:"SUBMIT_ERROR",message:p},"*"),alert(p);return}R((_=n.data)==null?void 0:_.pdfUrl),await Q(e.id,n.data.answers),(b=(E=f.current)==null?void 0:E.contentWindow)==null||b.postMessage({type:"SUBMIT_SUCCESS"},"*"),console.log("✅ 저장 완료")}catch{(F=(k=f.current)==null?void 0:k.contentWindow)==null||F.postMessage({type:"SUBMIT_ERROR"},"*")}};return window.addEventListener("message",i),()=>window.removeEventListener("message",i)},[e]),o)return u.jsx("div",{className:d.center,children:u.jsx("div",{className:d.spinner})});if(a||!e)return u.jsx("div",{className:d.center,children:u.jsx("h2",{children:"폼을 찾을 수 없습니다"})});const A={coverImgData:e.cover_url||((h=e.settings)==null?void 0:h.coverImgData)||null,bgImgData:e.background_url||((y=e.settings)==null?void 0:y.bgImgData)||null,qImgData:e.q_images||((v=e.settings)==null?void 0:v.qImgData)||{}},M={...e.settings||{},waitForSubmit:!0,doneTitle:((w=e.settings)==null?void 0:w.doneTitle)||"신청이 완료되었습니다!",doneDesc:((x=e.settings)==null?void 0:x.doneDesc)||"신청해주셔서 감사합니다. 확인 후 안내드리겠습니다.",scriptUrl:((S=e.settings)==null?void 0:S.scriptUrl)||"https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec"};let g=j(e.title,e.questions||[],{c1:e.theme_c1,c2:e.theme_c2},M,A);return g=g.replace("</body></html>",`${K()}</body></html>`),u.jsx("div",{className:d.wrap,children:u.jsx("iframe",{ref:f,className:d.iframe,srcDoc:g,sandbox:"allow-scripts allow-popups allow-popups-to-escape-sandbox",title:e.title})})};export{K as clientFormPatch,X as default};
