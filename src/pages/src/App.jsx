import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import Responses from './pages/Responses'
import PublicForm from './pages/PublicForm'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#7a788f', fontSize:'14px' }}>로딩 중...</div>
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/builder" element={<PrivateRoute><Builder /></PrivateRoute>} />
      <Route path="/builder/:formId" element={<PrivateRoute><Builder /></PrivateRoute>} />
      <Route path="/responses/:formId" element={<PrivateRoute><Responses /></PrivateRoute>} />
      <Route path="/f/:slug" element={<PublicForm />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
