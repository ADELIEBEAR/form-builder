import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // 🚨 FIX: 반드시 supabase를 사용합니다.
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  const incrementViewCount = async (targetSlug) => {
    try {
      // 🚨 FIX: he.rpc.catch 에러 해결! 정석 await 방식 사용
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

        if (supabaseError || !data) throw new Error("폼을 찾을 수 없거나 비공개 상태입니다.");

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
          await supabase.from('responses').insert([{ form_id: form.id, answers: event.data.answers }]);
        } catch (err) {
          iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR' }, '*');
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  if (loading) return <div className={styles.center}><div className={styles.spinner}></div></div>;
  if (error || !form) return <div className={styles.center}><h2>폼을 찾을 수 없습니다</h2><p>{error}</p></div>;

  const assets = {
    coverImgData: form.cover_url,
    bgImgData: form.background_url,
    qImgData: form.q_images || {}
  };

  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { c1: form.theme_c1, c2: form.theme_c2 },
    form.settings || {},
    assets
  );

  html = html.replace(
    /await fetch\(SU,[\s\S]*?body:JSON\.stringify\(ans\)\}\);/g,
    `window.parent.postMessage({type:'FORM_SUBMIT',answers:ans},'*');`
  );

  return (
    <div className={styles.wrap} style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <iframe 
        ref={iframeRef} 
        className={styles.iframe} 
        srcDoc={html} 
        sandbox="allow-scripts" 
        title={form.title} 
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export default PublicForm;
