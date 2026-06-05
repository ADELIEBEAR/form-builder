import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

function normalizePhoneValue(value) {
  let n = String(value || '').replace(/[^0-9]/g, '').trim();
  // iframe 전화번호 입력 UI가 국가번호(+82)를 붙여 보내는 경우 보정
  // +82 10-1234-5678 / 821012345678 -> 01012345678
  if (n.startsWith('8210') && n.length === 12) n = '0' + n.slice(2);
  if (n.startsWith('82') && n.length === 12) n = '0' + n.slice(2);
  return n;
}

function looksLikeValidPhone(value) {
  const n = normalizePhoneValue(value);
  // 국내 휴대폰 DB 기준: 010 + 8자리, 총 11자리만 정상
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

const BAD_NAME_KEYWORDS = ['샘플', 'sample', 'demo', 'dummy', 'asdf', 'qwer', '확인용', '삭제', '연습'];

function isBadNameValue(value) {
  const v = String(value || '').trim();
  if (!v) return false;
  const compact = v.replace(/[\s._\-·•・,，。!@#$%^&*+=~`|\\/?:;\[\]{}()<>"']/g, '');
  const lower = compact.toLowerCase();
  if (!compact) return true;
  if (compact.length < 2) return true;
  if (/^[0-9]+$/.test(compact)) return true;
  if (/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(compact)) return true;
  if (/^(.)\1+$/.test(compact) && compact.length <= 4) return true;
  if (BAD_NAME_KEYWORDS.some(k => lower.includes(k.toLowerCase()))) return true;
  return false;
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
      const isNameField = ['이름', '성함', '성명', '닉네임', 'name'].some(word => label.includes(word.toLowerCase()));
      const isPhoneField = ['전화', '연락처', '휴대폰', '핸드폰', '번호', 'phone', 'mobile', 'tel'].some(word => label.includes(word.toLowerCase()));
      // 이름은 오타/닉네임/짧은 값이 들어와도 전화번호가 정상이면 정상 접수한다.
      // DB 품질 판단은 이름보다 전화번호 검증을 우선한다.
      if (isPhoneField) {
        const value = answerForQuestion(answers, question, question.label || '');
        if (value && isBadPhoneValue(value)) return '올바른 전화번호를 입력해주세요.';
      }
    }
  }
  return '';
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

  // 조회수 증가 함수 (로직 유지)
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

  // 응답 제출 처리 (postMessage 방식 유지)
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

  // ── [핵심 Fix] 다른 건 안 건드리고, 이미지 데이터만 assets로 묶어서 전달 ──
  const assets = {
    coverImgData: form.cover_url,     // DB에서 가져온 커버 이미지
    bgImgData: form.background_url,   // DB에서 가져온 배경 이미지
    qImgData: form.q_images || {}     // 질문별 이미지들
  };

  // settings에 scriptUrl 없으면 기본 백업 URL 사용
  const settings = {
    ...(form.settings || {}),
    scriptUrl: (form.settings?.scriptUrl) || 'https://script.google.com/macros/s/AKfycby-KqvP9P5agWpkwa_GgH9xKaVQHzwbRZ_JerZOQ-fyHa1SpzRk5jZNSWfMCeg_LctKWw/exec'
  };

  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    settings,
    assets
  );

  // iframe 임베드 플래그 주입 — finishForm에서 postMessage로 전송

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