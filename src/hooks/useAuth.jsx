import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    // 로그인 상태 변경 감지만으로 충분 (getSession 중복 호출 제거)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // onAuthStateChange가 초기 세션을 즉시 emit하지 않는 경우 fallback
    const timer = setTimeout(async () => {
      if (!mounted.current) return
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted.current) return
      setUser(session?.user ?? null)
      setLoading(false)
    }, 300)

    return () => {
      mounted.current = false
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
