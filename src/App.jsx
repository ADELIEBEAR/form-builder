import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Builder = lazy(() => import('./pages/Builder'))
const Responses = lazy(() => import('./pages/Responses'))
const PublicForm = lazy(() => import('./pages/PublicForm'))
const Duplicates = lazy(() => import('./pages/Duplicates'))
const AiCalc = lazy(() => import('./pages/AiCalc'))

function PageFallback() {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'var(--muted)', fontSize:'14px' }}>로딩 중...</div>
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#7a788f', fontSize:'14px' }}>로딩 중...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/builder" element={<PrivateRoute><Builder /></PrivateRoute>} />
        <Route path="/builder/:formId" element={<PrivateRoute><Builder /></PrivateRoute>} />
        <Route path="/responses/:formId" element={<PrivateRoute><Responses /></PrivateRoute>} />
        <Route path="/duplicates" element={<PrivateRoute><Duplicates /></PrivateRoute>} />
        <Route path="/ai-calc" element={<PrivateRoute><AiCalc /></PrivateRoute>} />
        <Route path="/f/:slug" element={<PublicForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
