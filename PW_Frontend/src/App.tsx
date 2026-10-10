import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './portal/Layout'

// reducedMotion="user": solo quien tiene activado «reducir movimiento» recibe la versión sin desplazamientos.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* basename: el sitio también funciona en una subcarpeta (base en vite.config.ts) */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
