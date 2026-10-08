import LayoutPropuesta from '../comun/LayoutPropuesta'
import CabeceraC from './CabeceraC'
import HeroC from './HeroC'
import './c.css'

export default function PropuestaC() {
  return <LayoutPropuesta letra="C" base="/propuesta-c" clase="pc" Cabecera={CabeceraC} Hero={HeroC} />
}
