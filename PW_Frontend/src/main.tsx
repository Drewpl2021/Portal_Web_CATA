import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/big-shoulders-display/800.css'
import '@fontsource/big-shoulders-display/900.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource-variable/schibsted-grotesk/index.css'
import './styles/tokens.css'
import './styles/base.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
