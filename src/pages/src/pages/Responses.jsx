import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getForm, getResponses } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import styles from './Responses.module.css'

export default function Responses() {
  const { formId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    Promise.all([getForm(formId), getResponses(formId)])
      .then(([f, r]) => { setForm(f); setResponses(r || []) })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [formId])

  // 모든 응답 키 수집
  const allKeys = [...new Set(
    responses.flatMap(r => Object.keys(r.answers || {})).filter(k => !k.startsWith('_'))
  )]

  // CSV 다운로드
  function downloadCSV() {
    const headers = ['제출 시간', ...allKeys]
    const rows = responses.map(r => [
      new Date(r.submitted_at).toLocaleString('ko-KR'),
      ...allKeys.map(k => r.answers?.[k] || '')
    ])
    const csv = [headers, ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${form?.title || '응답'}_${new Date().toLocaleDateString('ko-KR')}.csv`
    a.click()
    showToast('✅ CSV 다운로드 완료!', 'ok')
  }

  // 구글 시트로 열기 (CSV 다운로드 후 안내)
  function openInSheets() {
    downloadCSV()
    showToast('📊 CSV 파일을 구글 시트에서 열어보세요!', 'info')
  }

  function showToast(msg, type) {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  function formatDate(d) {
    return new Date(d).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  if (loading) return (
    <div className={styles.loadWrap}>
      <div className={styles.spinner}></div>
    </div>
  )

  return (
    <div className={styles.wrap}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          </button>
          <div>
            <h1 className={styles.title}>{form?.title || '응답'}</h1>
            <p className={styles.sub}>총 {responses.length}개 응답</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/builder/${formId}`)}>폼 편집</button>
          <button className="btn btn-ghost btn-sm" onClick={downloadCSV}>⬇ CSV</button>
          <button className="btn btn-primary btn-sm" onClick={openInSheets}>📊 구글 시트로</button>
        </div>
      </div>

      {/* 응답 없음 */}
      {responses.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIco}>📭</div>
          <h2>아직 응답이 없어요</h2>
          <p>폼 공유 링크를 배포해서 응답을 받아보세요!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate(`/builder/${formId}`)}>
            폼 공유하기 →
          </button>
        </div>
      ) : (
        /* 응답 테이블 */
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thNum}>#</th>
                <th className={styles.thDate}>제출 시간</th>
                {allKeys.map(k => <th key={k} className={styles.th}>{k}</th>)}
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => (
                <tr key={r.id} className={styles.tr}>
                  <td className={styles.tdNum}>{responses.length - i}</td>
                  <td className={styles.tdDate}>{formatDate(r.submitted_at)}</td>
                  {allKeys.map(k => (
                    <td key={k} className={styles.td}>{r.answers?.[k] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className={`toast-wrap show ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
