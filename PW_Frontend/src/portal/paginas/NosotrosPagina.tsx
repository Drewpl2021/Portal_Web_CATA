import { useParams } from 'react-router-dom'
import { obtenerPaginaNosotros } from '../../api/servicios'
import { RUTAS, rutaDeSubpagina, useMapa } from '../../sitio/mapa'
import EquipoDocente from '../contenido/EquipoDocente'
import PaginaContenido, { PaginaNoEncontrada } from '../contenido/PaginaContenido'
import { CabeceraCargando } from '../secciones/CabeceraPagina'

// Subpágina de Nosotros, con el layout de contenido. Solo se abren las que están en los grupos de
// /v1/navegacion: una que el colegio sacó del menú (o dejó en borrador) muestra «Página no encontrada».
// Personal Docente suma la lista de docentes.
export default function NosotrosPagina() {
  const { slug = '' } = useParams()
  const mapa = useMapa()
  const ruta = rutaDeSubpagina(slug)
  const grupo = mapa.nosotros.find((g) => g.enlaces.some((e) => e.ruta === ruta))
  const padre = { etiqueta: mapa.etiquetaDe('nosotros') || mapa.pie.nosotros, ruta: RUTAS.nosotros }

  // Una subpágina que no está en la navegación de la compilación puede ser nueva: se espera a la del
  // navegador antes de decir que no existe.
  if (!grupo) return mapa.definitivo ? <PaginaNoEncontrada padre={padre} /> : <CabeceraCargando />
  return (
    <PaginaContenido
      padre={padre}
      grupo={grupo}
      ruta={ruta}
      clave={`nosotros:${slug}`}
      cargar={() => obtenerPaginaNosotros(slug)}
      extra={slug === 'personal-docente' ? <EquipoDocente /> : undefined}
    />
  )
}
