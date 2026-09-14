import React from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../src/hooks/useAuth.jsx'
import { ThemeProvider } from '../src/lib/themeContext.jsx'
import Builder from '../src/pages/Builder.jsx'
import '../src/index.css'

createRoot(document.getElementById('root')).render(
  <MemoryRouter>
    <AuthProvider>
      <ThemeProvider><Builder /></ThemeProvider>
    </AuthProvider>
  </MemoryRouter>,
)
