import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/big-shoulders-display/800.css'
import '@fontsource/big-shoulders-display/900.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import './styles/tokens.css'
import './styles/base.css'
import Home from './pages/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
