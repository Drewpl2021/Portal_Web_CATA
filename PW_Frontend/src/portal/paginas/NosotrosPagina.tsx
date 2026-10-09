import { useParams } from 'react-router-dom'
import { obtenerPaginaNosotros } from '../../api/servicios'
import { NOSOTROS, subpaginaPublicada, tituloDeRuta } from '../../sitio/mapa'
import EquipoDocente from '../contenido/EquipoDocente'
import PaginaContenido from '../contenido/PaginaContenido'
import Pendiente from './Pendiente'

// Subpágina de Nosotros. Las de los grupos publicados usan el layout de contenido;
// un grupo que no esté publicado sigue «en construcción». Personal Docente suma la lista de docentes.
export default function NosotrosPagina() {
  const { slug = '' } = useParams()
  const ruta = `/nosotros/${slug}`
  const grupo = NOSOTROS.find((g) => g.enlaces.some((e) => e.ruta === ruta))

  if (!grupo || !subpaginaPublicada(ruta)) return <Pendiente titulo={tituloDeRuta(ruta)} />
  return (
    <PaginaContenido
      padre={{ etiqueta: 'Nosotros', ruta: '/nosotros' }}
      grupo={grupo}
      ruta={ruta}
      clave={`nosotros:${slug}`}
      cargar={() => obtenerPaginaNosotros(slug)}
      extra={slug === 'personal-docente' ? <EquipoDocente /> : undefined}
    />
  )
}
