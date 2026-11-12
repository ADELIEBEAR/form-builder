import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, getFormBySlug } from '../lib/supabase';
import { generateFormHTML } from '../lib/generateHTML';
import { getAnswerKeys } from '../lib/answerKeys';
import { isPhoneQuestion, isValidPhone } from '../lib/phoneValidation';
import styles from './PublicForm.module.css';

function validateSubmissionAnswers(answers, questions) {
  const keys = getAnswerKeys(questions || []);
  for (const [i, question] of (questions || []).entries()) {
    const value = answers?.[keys[i]];
    if (isPhoneQuestion(question) && value && !isValidPhone(value)) return '올바른 전화번호를 입력해주세요.';
  }
  return '';
}

async function saveResponse(formId, answers) {
  const response = await fetch('/api/submit-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formId, answers }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || '응답을 저장하지 못했습니다. 다시 시도해주세요.');
  }
}

export function clientFormPatch() {
  return `<script>
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
      if (dt && /신청\s*완료/.test(dt.textContent || '')) dt.textContent = '신청이 완료되었습니다!';

      var dn = document.getElementById('dn');
      if (dn) {
        var raw = (dn.textContent || '').trim();
        if (raw) {
          var name = raw.replace(/[,，]\s*$/, '').replace(/님\s*$/, '').trim();
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
<\/script>`;
}

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  const submitting = useRef(null);

  const openPdfFile = (pdfUrl) => {
    if (!pdfUrl || typeof pdfUrl !== 'string') return;
    const trimmedUrl = pdfUrl.trim();
    if (!trimmedUrl) return;

    const popup = window.open(trimmedUrl, '_blank', 'noopener,noreferrer');
    if (popup) return;

    const link = document.createElement('a');
    link.href = trimmedUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const incrementViewCount = async (targetSlug) => {
    try {
      await supabase.rpc('increment_views', { target_slug: targetSlug });
    } catch (err) {
      console.error("조회수 업데이트 실패:", err.message);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);
        const decodedSlug = decodeURIComponent(slug);
        
        const data = await getFormBySlug(decodedSlug);
        if (!active) return;
        if (!data) throw new Error("폼을 찾을 수 없습니다.");

        setForm(data);
        incrementViewCount(decodedSlug);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    if (slug) fetchForm();
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!form) return;
    const handler = async (event) => {
      if (event.source === iframeRef.current?.contentWindow && event.data?.type === 'FORM_SUBMIT') {
        if (submitting.current?.formId === form.id) return;
        const attempt = { formId: form.id, source: event.source };
        submitting.current = attempt;
        try {
          const validationMessage = validateSubmissionAnswers(event.data.answers, form.questions || []);
          if (validationMessage) {
            iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR', message: validationMessage }, '*');
            alert(validationMessage);
            return;
          }
          await saveResponse(form.id, event.data.answers);
          if (attempt.source === iframeRef.current?.contentWindow) {
            attempt.source.postMessage({ type: 'SUBMIT_SUCCESS' }, '*');
            openPdfFile(event.data?.pdfUrl);
          }
        } catch (err) {
          if (attempt.source === iframeRef.current?.contentWindow) attempt.source.postMessage({ type: 'SUBMIT_ERROR', message: err.message }, '*');
        } finally {
          if (submitting.current === attempt) submitting.current = null;
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  if (loading) return <div className={styles.center}><div className={styles.spinner}></div></div>;
  if (error || !form) return <div className={styles.center}><h2>폼을 찾을 수 없습니다</h2></div>;

  const assets = {
    coverImgData: form.cover_url || form.settings?.coverImgData || null,
    bgImgData: form.background_url || form.settings?.bgImgData || null,
    qImgData: form.q_images || form.settings?.qImgData || {}
  };

  const settings = {
    ...(form.settings || {}),
    waitForSubmit: true,
    doneTitle: (form.settings?.doneTitle || '신청이 완료되었습니다!'),
    doneDesc: (form.settings?.doneDesc || '신청해주셔서 감사합니다. 확인 후 안내드리겠습니다.'),
    scriptUrl: (form.settings?.scriptUrl) || 'https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec'
  };

  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    settings,
    assets
  );

  html = html.replace('</body></html>', `${clientFormPatch()}</body></html>`);

  return (
    <div className={styles.wrap}>
      <iframe
        ref={iframeRef}
        className={styles.iframe}
        srcDoc={html}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        title={form.title}
      />
    </div>
  );
};

export default PublicForm;
