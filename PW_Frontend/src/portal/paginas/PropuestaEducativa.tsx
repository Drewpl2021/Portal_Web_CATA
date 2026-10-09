import AcademiaPropuesta from '../secciones/AcademiaPropuesta'
import CabeceraPropuesta from '../secciones/CabeceraPropuesta'
import Cierre from '../secciones/Cierre'
import NivelesPropuesta from '../secciones/NivelesPropuesta'
import PilaresPropuesta, { CifrasPropuesta } from '../secciones/PilaresPropuesta'
import PlataformasPropuesta from '../secciones/PlataformasPropuesta'

// Propuesta Educativa: la cabecera con la escena, las cifras, los pilares, los niveles en detalle,
// las plataformas digitales, la academia preuniversitaria y el cierre. Cada sección carga su endpoint.
export default function PropuestaEducativa() {
  return (
    <>
      <CabeceraPropuesta />
      <CifrasPropuesta />
      <PilaresPropuesta />
      <NivelesPropuesta />
      <PlataformasPropuesta />
      <AcademiaPropuesta />
      <Cierre />
    </>
  )
}
