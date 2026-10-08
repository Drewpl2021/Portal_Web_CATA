import { obtenerSitio } from '../api/servicios'
import { useRecurso } from '../hooks/useRecurso'

export default function Pie() {
  const r = useRecurso('sitio', obtenerSitio)
  const anio = new Date().getFullYear()

  return (
    <footer className="pie">
      {r.estado === 'listo' ? (
        <>
          <p>
            © {anio} {r.datos.nombre}.{r.datos.promotora && ` ${r.datos.promotora}.`}
          </p>
          {r.datos.portalAcademicoUrl && (
            <a href={r.datos.portalAcademicoUrl} target="_blank" rel="noreferrer">
              Portal académico<span className="visually-hidden"> (se abre en otra pestaña)</span>
            </a>
          )}
        </>
      ) : (
        <p>© {anio}</p>
      )}
    </footer>
  )
}
