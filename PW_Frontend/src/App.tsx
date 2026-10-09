import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Layout from './portal/Layout'

// reducedMotion="user": solo quien tiene activado «reducir movimiento» recibe la versión sin desplazamientos.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
