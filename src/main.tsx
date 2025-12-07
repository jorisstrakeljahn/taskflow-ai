import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ColorProvider } from './contexts/ColorContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ColorProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ColorProvider>
    </AuthProvider>
  </React.StrictMode>,
)

