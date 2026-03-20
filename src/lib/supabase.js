import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 구글 로그인
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',
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
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

// 폼 하나 가져오기
export async function getForm(formId) {
  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single()
  if (error) throw error
  return data
}

// 폼 저장 (생성 or 업데이트)
export async function saveForm(userId, form) {
  const payload = {
    user_id: userId,
    title: form.title,
    theme_c1: form.theme.c1,
    theme_c2: form.theme.c2,
    questions: form.questions,
    settings: form.settings || {},
    updated_at: new Date().toISOString(),
  }

  if (form.id) {
    const { data, error } = await supabase
      .from('forms')
      .update(payload)
      .eq('id', form.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('forms')
      .insert({ ...payload, created_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data
  }
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
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40) + '-' + Math.random().toString(36).slice(2, 7)

  const { data, error } = await supabase
    .from('forms')
    .update({ is_published: true, slug, updated_at: new Date().toISOString() })
    .eq('id', formId)
    .select()
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
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) throw error
  return data
}

// 응답 제출 (로그인 없이)
export async function submitResponse(formId, answers) {
  const { error } = await supabase
    .from('responses')
    .insert({ form_id: formId, answers })
  if (error) throw error
}

// 응답 목록 가져오기 (폼 주인만)
export async function getResponses(formId) {
  const { data, error } = await supabase
    .from('responses')
    .select('*')
    .eq('form_id', formId)
    .order('submitted_at', { ascending: false })
  if (error) throw error
  return data
}
