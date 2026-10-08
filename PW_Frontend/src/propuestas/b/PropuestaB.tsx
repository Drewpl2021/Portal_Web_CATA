import LayoutPropuesta from '../comun/LayoutPropuesta'
import CabeceraB from './CabeceraB'
import HeroB from './HeroB'
import './b.css'

export default function PropuestaB() {
  return <LayoutPropuesta letra="B" base="/propuesta-b" clase="pb" Cabecera={CabeceraB} Hero={HeroB} />
}
