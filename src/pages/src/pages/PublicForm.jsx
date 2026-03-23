import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Supabase 설정 파일 경로가 맞는지 꼭 확인하세요!

const PublicForm = () => {
  // 1. URL에서 :slug 부분을 가져옵니다 (예: ai-t0v2s)
  const { slug } = useParams();
  
  // 2. 상태 관리 (데이터, 로딩, 에러)
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        setError(null);

        // [중요] 한글이나 특수문자가 섞인 slug를 위해 디코딩을 먼저 합니다.
        const decodedSlug = decodeURIComponent(slug);
        console.log("🔍 현재 조회 중인 Slug:", decodedSlug);

        // 3. Supabase에서 데이터 가져오기
        // .single()을 붙여야 데이터가 '배열'이 아닌 '객체' 하나로 옵니다.
        const { data, error: supabaseError } = await supabase
          .from('forms')
          .select('*')
          .eq('slug', decodedSlug)
          .eq('is_published', true) // 발행된 폼만 가져오기
          .single();

        if (supabaseError) {
          console.error("❌ Supabase에서 데이터를 못 찾았습니다:", supabaseError.message);
          throw new Error("폼을 찾을 수 없거나 비공개 상태입니다.");
        }

        if (!data) {
          console.warn("⚠️ 일치하는 데이터가 없습니다.");
          throw new Error("존재하지 않는 폼입니다.");
        }

        console.log("✅ 가져온 폼 데이터 전체:", data);

        // 4. 가져온 데이터를 상태에 저장
        // 정프로님 DB 구조상 'questions'는 이 데이터 안에 JSONB 형태로 들어있을 거예요.
        setForm(data);

      } catch (err) {
        console.error("🚨 에러 발생 상세:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchForm();
    }
  }, [slug]);

  // 5. 로딩 중 화면
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">폼을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 6. 에러 발생 시 화면 (정프로님이 보셨던 '폼을 찾을 수 없습니다' 화면)
  if (error || !form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h1 className="text-2xl font-bold mb-2">폼을 찾을 수 없습니다</h1>
          <p className="text-gray-400">링크가 잘못되었거나 비공개 상태예요.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  // 7. 정상적으로 데이터를 불러왔을 때의 화면
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* 상단 헤더 부분 */}
        <div className="bg-blue-600 p-8 text-white">
          <h1 className="text-3xl font-bold">{form.title}</h1>
          {form.description && (
            <p className="mt-2 text-blue-100 opacity-90">{form.description}</p>
          )}
        </div>

        {/* 폼 본문 (질문 리스트) */}
        <div className="p-8 space-y-8">
          {form.questions && form.questions.length > 0 ? (
            form.questions.map((q, index) => (
              <div key={index} className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800">
                  {q.title || q.label} 
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {/* 질문 타입에 따른 입력창 (여기서는 일단 텍스트 입력창 위주로 예시) */}
                <input
                  type="text"
                  placeholder="답변을 입력해 주세요"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              작성된 질문이 없는 폼입니다.
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="pt-6">
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition duration-200 transform hover:-translate-y-1">
              제출하기
            </div>
          </div>
        </div>
      </div>
      
      {/* 하단 푸터 (로고 등) */}
      <p className="text-center mt-8 text-gray-400 text-sm">
        Powered by Jeong Pro Formbuilder
      </p>
    </div>
  );
};

export default PublicForm;
