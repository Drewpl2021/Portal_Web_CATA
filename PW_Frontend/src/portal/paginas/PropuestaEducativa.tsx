import CabeceraPropuesta from '../secciones/CabeceraPropuesta'

// Propuesta Educativa: por ahora solo su cabecera. El resto de la página se construye más adelante.
export default function PropuestaEducativa() {
  return (
    <>
      <CabeceraPropuesta />
      <section className="f-seccion f-proximamente" aria-label="Contenido de la página">
        <div className="f-seccion__interior">
          <p className="f-vacio">El detalle de la propuesta educativa por niveles se publicará en esta página.</p>
        </div>
      </section>
    </>
  )
}
