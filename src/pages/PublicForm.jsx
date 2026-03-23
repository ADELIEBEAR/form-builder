import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // 변수명 'he'가 아니라 'supabase'로 통일합니다.
import { generateFormHTML } from '../lib/generateHTML';
import styles from './PublicForm.module.css';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // 1. 조회수 1 올리는 함수 (안전한 버전)
  const incrementViewCount = async (targetSlug) => {
    try {
      // .catch 에러 방지를 위해 표준 await 방식으로 호출합니다.
      const { error: rpcError } = await supabase.rpc('increment_views', { target_slug: targetSlug });
      if (rpcError) console.error("조회수 업데이트 중 DB 에러:", rpcError.message);
    } catch (err) {
      console.error("조회수 업데이트 실패:", err.message);
    }
  };

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        // [중요] 한글 주소(%EB%...)를 다시 한글로 변환
        const decodedSlug = decodeURIComponent(slug);
        console.log("🔍 조회 중인 Slug:", decodedSlug);

        // 2. Supabase에서 데이터 가져오기 (.single() 필수)
        const { data, error: supabaseError } = await supabase
          .from('forms')
          .select('*')
          .eq('slug', decodedSlug)
          .eq('is_published', true)
          .single(); // 상자(배열) 말고 알맹이(객체) 하나만 가져오기

        if (supabaseError || !data) {
          throw new Error("폼을 찾을 수 없거나 비공개 상태입니다.");
        }

        setForm(data);
        
        // 3. 데이터를 성공적으로 가져왔을 때만 조회수 증가 실행
        incrementViewCount(decodedSlug);

      } catch (err) {
        console.error("🚨 로딩 에러:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchForm();
  }, [slug]);

  // 응답 제출 처리 (postMessage 수신 로직)
  useEffect(() => {
    if (!form) return;
    const handler = async (event) => {
      if (event.data?.type === 'FORM_SUBMIT') {
        try {
          const { error: submitErr } = await supabase
            .from('responses')
            .insert([{ form_id: form.id, answers: event.data.answers }]);
          if (submitErr) throw submitErr;
          console.log("✅ 응답 저장 완료!");
        } catch (err) {
          console.error('❌ 응답 저장 실패:', err);
          iframeRef.current?.contentWindow?.postMessage({ type: 'SUBMIT_ERROR' }, '*');
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [form]);

  if (loading) return <div className={styles.center}><div className={styles.spinner}></div></div>;

  if (error || !form) {
    return (
      <div className={styles.center}>
        <div className={styles.notFound}>
          <div className={styles.ico}>✦</div>
          <h2>폼을 찾을 수 없습니다</h2>
          <p>링크가 잘못되었거나 비공개 상태예요.</p>
          <button onClick={() => window.location.reload()} className={styles.retryBtn}>다시 시도하기</button>
        </div>
      </div>
    );
  }

  // 4. 미리보기와 100% 동일하게 렌더링하기 위해 generateFormHTML 활용
  let html = generateFormHTML(
    form.title,
    form.questions || [],
    { 
      c1: form.theme_c1, 
      c2: form.theme_c2, 
      bgUrl: form.background_url, 
      coverUrl: form.cover_url 
    },
    form.settings || {},
    {
      coverImgData: form.cover_url,
      bgImgData: form.background_url
    }
  );

  // 버튼 클릭 시 Supabase에 저장되도록 postMessage 로직 심기
  html = html.replace(
    /await fetch\(SU,[\s\S]*?body:JSON\.stringify\(ans\)\}\);/g,
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
