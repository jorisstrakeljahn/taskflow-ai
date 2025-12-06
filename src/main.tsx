import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext'
import { ColorProvider } from './contexts/ColorContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ColorProvider>
  </React.StrictMode>,
)

