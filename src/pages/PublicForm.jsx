import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

function normalizePhoneValue(value) {
  let n = String(value || '').replace(/[^0-9]/g, '').trim();
  if (n.startsWith('8210') && n.length === 12) n = '0' + n.slice(2);
  if (n.startsWith('82') && n.length === 12) n = '0' + n.slice(2);
  return n;
}

function looksLikeValidPhone(value) {
  const n = normalizePhoneValue(value);
  return /^010\d{8}$/.test(n);
}

const BAD_PHONE_VALUES = new Set([
  '01000000000', '01011111111', '01022222222', '01033333333', '01044444444',
  '01055555555', '01066666666', '01077777777', '01088888888', '01099999999',
  '01012345678', '01012341234', '01012121212', '01010101010', '01098765432'
]);

function isBadPhoneValue(value) {
  const n = normalizePhoneValue(value);
  if (!n) return false;
  if (!looksLikeValidPhone(n)) return true;
  if (BAD_PHONE_VALUES.has(n)) return true;
  const tail = n.slice(3);
  if (/^(\d)\1+$/.test(tail)) return true;
  return ['12345678', '23456789', '34567890', '87654321', '98765432'].some(seq => n.includes(seq));
}

function answerForQuestion(answers, question, fallback) {
  const label = question?.label || fallback;
  return answers?.[label] ?? answers?.[fallback] ?? '';
}

function validateSubmissionAnswers(answers, questions) {
  for (const question of questions || []) {
    if (question.type === 'phone') {
      const value = answerForQuestion(answers, question, '전화번호');
      if (value && isBadPhoneValue(value)) return '올바른 전화번호를 입력해주세요.';
    }
    if (question.type === 'short' || question.type === 'long') {
      const label = String(question.label || '').toLowerCase();
      const isPhoneField = ['전화', '연락처', '휴대폰', '핸드폰', '번호', 'phone', 'mobile', 'tel'].some(word => label.includes(word.toLowerCase()));
      if (isPhoneField) {
        const value = answerForQuestion(answers, question, question.label || '');
        if (value && isBadPhoneValue(value)) return '올바른 전화번호를 입력해주세요.';
      }
    }
  }
  return '';
}

function clientFormPatch() {
  return `<script>
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

    function makePoliteText(){
      var dd = document.querySelector('.dd');
      if (dd) {
        dd.innerHTML = dd.innerHTML
          .replace(/안내드릴게요/g, '안내드리겠습니다')
          .replace(/드릴게요/g, '드리겠습니다')
          .replace(/할게요/g, '하겠습니다')
          .replace(/최프로,/g, '최프로님,');
      }
      var dt = document.querySelector('.dt');
      if (dt && dt.textContent.trim() === '신청 완료!') dt.textContent = '신청이 완료되었습니다!';
    }
    makePoliteText();
    setTimeout(makePoliteText, 300);
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
    const fetchForm = async () => {
      try {
        setLoading(true);
        const decodedSlug = decodeURIComponent(slug);
        
        const { data, error: supabaseError } = await supabase
          .from('forms')
          .select('*')
          .eq('slug', decodedSlug)
          .eq('is_published', true)
          .single();

        if (supabaseError || !data) throw new Error("폼을 찾을 수 없습니다.");

        setForm(data);
        incrementViewCount(decodedSlug);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchForm();
  }, [slug]);

  useEffect(() => {
    if (!form) return;
    const handler = async (event) => {
      if (event.data?.type === 'FORM_SUBMIT') {
        try {
          const validationMessage = validateSubmissionAnswers(event.data.answers, form.questions || []);
          if (validationMessage) {
            iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR', message: validationMessage }, '*');
            alert(validationMessage);
            return;
          }
          openPdfFile(event.data?.pdfUrl);
          await supabase.from('responses').insert([{ form_id: form.id, answers: event.data.answers }]);
          console.log("✅ 저장 완료");
        } catch (err) {
          iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR' }, '*');
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  if (loading) return <div className={styles.center}><div className={styles.spinner}></div></div>;
  if (error || !form) return <div className={styles.center}><h2>폼을 찾을 수 없습니다</h2></div>;

  const assets = {
    coverImgData: form.cover_url,
    bgImgData: form.background_url,
    qImgData: form.q_images || {}
  };

  const settings = {
    ...(form.settings || {}),
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
