import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Home from './pages/Home'
import IndicePropuestas from './propuestas/IndicePropuestas'
import PropuestaA from './propuestas/a/PropuestaA'
import PropuestaB from './propuestas/b/PropuestaB'
import PropuestaC from './propuestas/c/PropuestaC'

// reducedMotion="user": solo quien tiene activado «reducir movimiento» recibe la versión sin desplazamientos.
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propuestas" element={<IndicePropuestas />} />
          <Route path="/propuesta-a/*" element={<PropuestaA />} />
          <Route path="/propuesta-b/*" element={<PropuestaB />} />
          <Route path="/propuesta-c/*" element={<PropuestaC />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}
