import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, submitResponse } from '../lib/supabase';
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // 1. 데이터 가져오기
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);
        const decodedSlug = decodeURIComponent(slug);

        const { data, error: supabaseError } = await supabase
          .from('forms')
          .select('*')
          .eq('slug', decodedSlug)
          .eq('is_published', true)
          .single();

        if (supabaseError || !data) throw new Error('폼을 찾을 수 없거나 비공개 상태입니다.');

        setForm(data);

        // 조회수 증가
        supabase.rpc('increment_view_count', { form_id: data.id }).catch(() => {});

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchForm();
  }, [slug]);

  // 2. iframe 응답 제출 로직
  useEffect(() => {
    if (!form) return;
    const handler = async (event) => {
      if (event.data?.type === 'FORM_SUBMIT') {
        try {
          await submitResponse(form.id, event.data.answers);
          // 구글 시트 싱크
          if (form.sheet_id) {
            fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sheet-sync`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ form_id: form.id, answers: event.data.answers }),
            }).catch(() => {});
          }
        } catch (err) {
          console.error('응답 저장 실패:', err);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  if (loading) return (
    <div className={styles.center}>
      <div className={styles.spinner}></div>
    </div>
  );

  if (error || !form) return (
    <div className={styles.center}>
      <div className={styles.notFound}>
        <div className={styles.ico}>✦</div>
        <h2>폼을 찾을 수 없습니다</h2>
        <p>{error || '링크가 잘못되었거나 비공개 상태예요.'}</p>
        <button onClick={() => window.location.reload()} className={styles.retryBtn}>다시 시도</button>
      </div>
    </div>
  );

  // 4. HTML 생성 - settings에서 이미지 꺼내서 전달
  const formSettings = form.settings || {};
  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    formSettings,
    {
      coverImgData: formSettings.coverImgData || null,
      bgImgData: formSettings.bgImgData || null,
      qImgData: formSettings.qImgData || {},
    }
  );

  html = html.replace(
    `await fetch(SU,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(ans)});`,
    `window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*');`
  );

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
