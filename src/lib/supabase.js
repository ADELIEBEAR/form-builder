import { createClient } from '@supabase/supabase-js'
import { getFormImageSettings, storeInlineImages } from './imageAssets.js'
import { fetchAllResponsePages, orderResponsePage } from './responseSync.js'
export { RESPONSE_PAGE_SIZE } from './responseSync.js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    lockAcquireTimeout: 15000,  // 5초 → 15초로 늘려서 lock 경합 방지
  }
})

// 구글 로그인
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',
      scopes: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  })
  if (error) throw error
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 현재 유저
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 폼 목록 가져오기
export async function getForms(userId) {
  const { data, error } = await supabase
    .from('forms')
    .select('id, title, theme_c1, theme_c2, is_published, slug, created_at, updated_at, memo, group_tag, sheet_id, sheet_url, questions')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data || []
}

// 폼 하나 가져오기
export async function getForm(formId, columns = '*') {
  const { data, error } = await supabase
    .from('forms')
    .select(columns)
    .eq('id', formId)
    .single()
  if (error) throw error
  return data
}

// 폼 저장 (생성 or 업데이트)
export async function saveForm(userId, form) {
  const settings = await storeInlineImages(supabase, userId, form.settings || {}, form.questions)
  const payload = {
    user_id: userId,
    title: form.title,
    theme_c1: form.theme.c1,
    theme_c2: form.theme.c2,
    questions: form.questions,
    settings,
    cover_url: null,
    background_url: null,
    updated_at: new Date().toISOString(),
  }

  if (form.id) {
    const { data, error } = await supabase
      .from('forms')
      .update(payload)
      .eq('id', form.id)
      .eq('user_id', userId)
      .select('id, slug, is_published')
      .single()
    if (error) throw error
    return { ...payload, ...data }
  } else {
    const { data, error } = await supabase
      .from('forms')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select('id, slug, is_published')
      .single()
    if (error) throw error
    return { ...payload, ...data }
  }
}

// 폼 복제 (응답/공개 링크/시트 연결은 새 폼에서 다시 설정)
export async function duplicateForm(userId, formId) {
  const original = await getForm(formId)
  if (original.user_id !== userId) throw new Error('복제 권한이 없습니다')
  const settings = await storeInlineImages(supabase, userId, getFormImageSettings(original), original.questions)

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('forms')
    .insert({
      user_id: userId,
      title: `${original.title || '제목 없음'} 복사본`,
      theme_c1: original.theme_c1,
      theme_c2: original.theme_c2,
      questions: original.questions || [],
      settings,
      memo: original.memo || null,
      group_tag: original.group_tag || null,
      is_published: false,
      slug: null,
      sheet_id: null,
      sheet_url: null,
      created_at: now,
      updated_at: now,
    })
    .select('id, title, theme_c1, theme_c2, questions, group_tag, memo, is_published, slug, created_at, updated_at')
    .single()
  if (error) throw error
  return data
}

// 폼 삭제
export async function deleteForm(formId) {
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId)
  if (error) throw error
}

// 폼 발행 (slug 생성 + is_published = true)
export async function publishForm(formId, title) {
  // 한글은 로마자 변환 대신 제거하고 영문/숫자만 사용
  const slugBase = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30) || 'form'
  const slug = slugBase + '-' + Math.random().toString(36).slice(2, 7)

  const { data, error } = await supabase
    .from('forms')
    .update({ is_published: true, slug, updated_at: new Date().toISOString() })
    .eq('id', formId)
    .select('id, slug, is_published')
    .single()
  if (error) throw error
  return data
}

// 폼 비공개
export async function unpublishForm(formId) {
  const { error } = await supabase
    .from('forms')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq('id', formId)
  if (error) throw error
}

// slug로 공개 폼 가져오기 (로그인 없이)
export async function getFormBySlug(slug) {
  const { data, error } = await supabase
    .from('forms')
    .select('id, title, questions, settings, theme_c1, theme_c2, cover_url, background_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) throw error
  return data
}

export async function optimizeExistingFormImages(userId, onProgress) {
  const { data: candidates, error } = await supabase.from('forms')
    .select('id, title').eq('user_id', userId)
    .or('settings->>coverImgData.like.data:image/*,settings->>bgImgData.like.data:image/*,settings->>qImgData.like.*data:image/*')
    .order('id')
  if (error) throw error
  const result = { total: candidates.length, completed: 0, changed: 0, savedBytes: 0, failures: [] }
  onProgress({ ...result })
  for (const candidate of candidates) {
    try {
      const form = await getForm(candidate.id)
      if (form.user_id !== userId) throw new Error('폼 소유자가 변경되었습니다.')
      const settings = await storeInlineImages(supabase, userId, getFormImageSettings(form), form.questions)
      const { data, error: updateError } = await supabase.from('forms')
        .update({ settings, cover_url: null, background_url: null, updated_at: new Date().toISOString() })
        .eq('id', form.id).eq('user_id', userId).eq('updated_at', form.updated_at)
        .select('id').maybeSingle()
      if (updateError) throw updateError
      if (!data) throw new Error('다른 곳에서 수정 중인 폼입니다. 다시 시도해주세요.')
      result.changed++
      result.savedBytes += Math.max(0, new Blob([JSON.stringify(form.settings)]).size - new Blob([JSON.stringify(settings)]).size)
      try { sessionStorage.removeItem('form_' + form.id) } catch {}
    } catch (err) {
      result.failures.push({ title: candidate.title, message: err.message || '이미지 정리 실패' })
    }
    result.completed++
    onProgress({ ...result, failures: [...result.failures] })
  }
  return result
}

// 응답 제출 (로그인 없이)
export async function submitResponse(formId, answers) {
  const { error } = await supabase
    .from('responses')
    .insert({ form_id: formId, answers })
  if (error) throw error
}

// 응답 목록 가져오기 (폼 주인만)
export async function getResponses(formId, options = {}) {
  return fetchAllResponsePages((before) => {
    let q = supabase
      .from('responses')
      .select('id, form_id, answers, submitted_at, ip_address')
      .eq('form_id', formId)

    if (options.from) q = q.gte('submitted_at', options.from)
    if (options.to) q = q.lt('submitted_at', options.to)
    return orderResponsePage(q, before)
  })
}

// 여러 폼의 응답 전체 가져오기 — 전체 응답/중복 검사/대시보드/CSV용
export async function getResponsesForForms(formIds, columns = 'id, form_id, answers, submitted_at', options = {}) {
  if (!formIds?.length) return []

  return fetchAllResponsePages((before) => {
    let q = supabase
      .from('responses')
      .select(columns)
      .in('form_id', formIds)

    if (options.from) q = q.gte('submitted_at', options.from)
    if (options.to) q = q.lt('submitted_at', options.to)
    return orderResponsePage(q, before)
  })
}

// 구글 토큰 저장
export async function saveGoogleToken(userId, accessToken, refreshToken) {
  const { error } = await supabase
    .from('google_tokens')
    .upsert({ user_id: userId, access_token: accessToken, refresh_token: refreshToken, updated_at: new Date().toISOString() })
  if (error) throw error
}

// 구글 시트 생성 + 폼에 연결
export async function connectGoogleSheet(formId, title, accessToken) {
  // 1. 새 시트 생성
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: { title: `${title} - 응답` } })
  })
  if (!createRes.ok) throw new Error('시트 생성 실패')
  const sheet = await createRes.json()
  const sheetId = sheet.spreadsheetId
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`

  // 2. 헤더 행 추가는 첫 응답 때 자동으로 처리

  // 3. 폼에 sheet_id 저장
  const { error } = await supabase
    .from('forms')
    .update({ sheet_id: sheetId, sheet_url: sheetUrl, updated_at: new Date().toISOString() })
    .eq('id', formId)
  if (error) throw error

  return { sheetId, sheetUrl }
}

// 시트 연결 해제
export async function disconnectSheet(formId) {
  const { error } = await supabase
    .from('forms')
    .update({ sheet_id: null, sheet_url: null })
    .eq('id', formId)
  if (error) throw error
}
