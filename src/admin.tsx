import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AdminPanel from './pages/Admin'
import './index.css'

// Criar elemento root se não existir
const rootElement = document.getElementById('root') || (() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
  return root
})()

// Configurar o documento
document.title = 'IsaPass Admin'

// Criar favicon
const favicon = document.createElement('link')
favicon.rel = 'icon'
favicon.type = 'image/x-icon'
favicon.href = '/favicon.ico'
document.head.appendChild(favicon)

// Configurar viewport
const viewport = document.createElement('meta')
viewport.name = 'viewport'
viewport.content = 'width=device-width, initial-scale=1.0'
document.head.appendChild(viewport)

// Renderizar aplicação
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminPanel />
    </BrowserRouter>
  </React.StrictMode>,
)
