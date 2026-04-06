import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

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
    scriptUrl: (form.settings?.scriptUrl) || 'https://script.google.com/macros/s/AKfycbwuAXvf42y4dN-rscrs1dGoWj7OCHgtlISqLY8hEYxviaBUDkfTOb-N6Q8VIiQbFXKlyQ/exec'
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
        sandbox="allow-scripts"
        title={form.title}
      />
    </div>
  );
};

export default PublicForm;
