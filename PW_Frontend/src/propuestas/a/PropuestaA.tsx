import LayoutPropuesta from '../comun/LayoutPropuesta'
import CabeceraA from './CabeceraA'
import HeroA from './HeroA'
import './a.css'

export default function PropuestaA() {
  return <LayoutPropuesta letra="A" base="/propuesta-a" clase="pa" Cabecera={CabeceraA} Hero={HeroA} />
}
