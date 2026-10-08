// Genera src/api/mock/<escenario>/<recurso>.json y public/mock/*.svg
import fs from 'node:fs'
import path from 'node:path'

const raiz = process.argv[2]
const dirMock = path.join(raiz, 'src/api/mock')
const dirImg = path.join(raiz, 'public/mock')
const MEDIOS = 'https://medios.prueba.cata.edu.pe/'

const escribir = (escenario, recurso, cuerpo) => {
  const dir = path.join(dirMock, escenario)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, `${recurso}.json`), JSON.stringify(cuerpo, null, 2) + '\n')
}

// ── Imágenes de prueba ──
const placeholders = {
  'sede-central': ['Sede Central', 4, 3],
  'sede-inicial': ['Sede CATA Inicial', 4, 3],
  'sede-jerusalen': ['Sede CATA Jerusalén', 4, 3],
  'sede-oasis': ['Sede CATA Oasis', 4, 3],
  'quienes-somos': ['Quiénes somos', 4, 5],
  'nivel-inicial': ['Nivel Inicial', 3, 2],
  'nivel-primaria': ['Nivel Primaria', 3, 2],
  'nivel-secundaria': ['Nivel Secundaria', 3, 2],
  'noticia-1': ['Noticia', 3, 2],
  'noticia-2': ['Comunicado', 3, 2],
  'panoramica': ['Imagen panorámica', 16, 5],
}
fs.mkdirSync(dirImg, { recursive: true })
for (const [archivo, [etiqueta, w, h]] of Object.entries(placeholders)) {
  const W = 1200
  const H = Math.round((W * h) / w)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><pattern id="r" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="28" height="28" fill="#d9eef8"/><rect width="14" height="28" fill="#cce8f5"/></pattern></defs>
  <rect width="${W}" height="${H}" fill="url(#r)"/>
  <rect x="${W / 2 - 300}" y="${H / 2 - 70}" width="600" height="140" rx="10" fill="#ffffff"/>
  <text x="${W / 2}" y="${H / 2 - 8}" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="#212853">FOTO DE PRUEBA</text>
  <text x="${W / 2}" y="${H / 2 + 40}" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#4a5180">${etiqueta} · ${w}:${h}</text>
</svg>
`
  fs.writeFileSync(path.join(dirImg, `${archivo}.svg`), svg)
}
const img = (archivo, alt) => {
  const [, w, h] = placeholders[archivo]
  return { url: `${MEDIOS}${archivo}.svg`, alt, ancho: 1200, alto: Math.round((1200 * h) / w) }
}

// ── Escenario típico: contenido real de cata.edu.pe; noticias e imágenes son de prueba ──
// Años de reconocimiento de cada nivel: cata.edu.pe/new_resenahistorica (R.D. Regional N° 457 del
// 07-05-1971, R.D.Z. N° 104-DZE-J del 25-03-1982 y R.D. N° 6954-DREP del 03-12-1998).
const ICRM = 'https://cata.icrmedu.com/Academico/Paginas/Login.aspx'

const sitio = {
  nombre: 'Colegio Adventista Túpac Amaru',
  nombreCorto: 'CATA',
  subtitulo: 'Inicial · Primaria · Secundaria',
  ciudad: 'Juliaca',
  anioFundacion: 1971,
  telefono: { numero: '+5151325096', visible: '051 325096' },
  whatsapp: { numero: '+51986322833', visible: '986 322 833' },
  direccion: { linea: 'Jr. Moquegua N° 852', referencia: 'Frente al Mercado Internacional Túpac Amaru', distrito: 'Juliaca, San Román, Puno' },
  portalAcademicoUrl: ICRM,
  promotora: 'Asociación Educativa Colegio Adventista Túpac Amaru',
}

const sec = (seccion) => ({ tipo: 'seccion', seccion })
const rutas = {
  familias: {
    nombre: 'Familias que nos conocen',
    bajada: 'Conoce el colegio y pide información sin compromiso.',
    paradas: [
      { id: 'f1', etiqueta: 'Quiénes somos', detalle: 'Desde 1971', destino: sec('quienes-somos') },
      { id: 'f2', etiqueta: 'Niveles', detalle: 'Inicial, primaria, secundaria', destino: sec('niveles') },
      { id: 'f3', etiqueta: 'Sedes', detalle: 'Cuatro en San Román', destino: sec('sedes') },
    ],
    accion: {
      etiqueta: 'Solicitar información',
      detalle: 'Te respondemos por WhatsApp',
      mensajeWhatsapp: 'Hola, soy {nombre}. Quisiera información sobre {grado} en CATA.',
    },
  },
  comunidad: {
    nombre: 'Comunidad CATA',
    bajada: 'Comunicados, noticias y accesos para familias y alumnos.',
    paradas: [
      { id: 'c1', etiqueta: 'Noticias', detalle: 'Lo último del colegio', destino: sec('noticias') },
      { id: 'c2', etiqueta: 'Matrícula', detalle: 'Requisitos', destino: { tipo: 'url', url: 'https://cata.edu.pe/new_matricula/', externo: true } },
      { id: 'c3', etiqueta: 'Contacto', detalle: 'Teléfono y WhatsApp', destino: sec('contacto') },
    ],
    terminal: { id: 'c4', etiqueta: 'Portal académico', detalle: 'iCRM educativo', destino: { tipo: 'url', url: ICRM, externo: true } },
  },
}

// Hero de Inicio: fotos publicadas por el propio colegio en cata.edu.pe (se enlazan, no se copian).
const UP = 'https://cata.edu.pe/wp-content/uploads/'
const hero = {
  titulo: 'Mejoramos la experiencia de aprendizaje',
  bajada: 'Colegio Adventista Túpac Amaru: inicial, primaria y secundaria en cuatro sedes de Juliaca, desde 1971.',
  figuras: [
    { tipo: 'recorte', imagen: { url: UP + '2023/01/CATA-Matricula_Img_2.png', alt: 'Estudiante con el uniforme del colegio, su mochila y un cuaderno de CATA', ancho: 500, alto: 1000 } },
    { tipo: 'recorte', imagen: { url: UP + '2023/01/CATA-Matricula_Img_1.png', alt: 'Estudiante con el uniforme del colegio y su mochila, haciendo el gesto de pulgar arriba', ancho: 500, alto: 1000 } },
    { tipo: 'foto', imagen: { url: UP + '2025/05/Sin-titulo-1200-x-900-px.png', alt: 'Niño con el uniforme del colegio y lentes, sonriendo y abrazando una Santa Biblia', ancho: 1200, alto: 900 } },
  ],
  accionPrincipal: { etiqueta: 'Proceso de matrícula', destino: { tipo: 'pagina', ruta: '/matricula' } },
  accionSecundaria: { etiqueta: 'Conoce la propuesta educativa', destino: { tipo: 'pagina', ruta: '/propuesta-educativa' } },
}

const aviso = {
  id: '15',
  titulo: 'Año académico 2026',
  texto: 'Conoce las novedades del nuevo año en todas nuestras sedes.',
  imagen: {
    url: 'https://cata.edu.pe/wp-content/uploads/2025/12/Banner-CATA.png',
    alt: 'Emblema del Colegio Adventista Túpac Amaru junto al año 2026 y la dirección www.cata.edu.pe',
    ancho: 1900,
    alto: 700,
  },
  enlace: null,
  vigenteDesde: '2026-01-05T00:00:00-05:00',
  vigenteHasta: null,
}

const quienes = {
  titulo: 'Educación adventista en Juliaca desde 1971.',
  parrafos: [
    'El colegio nació de la Iglesia Adventista del Séptimo Día Villa Hermosa, organizada en 1967 en el barrio Túpac Amaru. Sus familias quisieron una escuela para sus hijos, y en 1971 se reconoció el nivel primaria.',
    'Hoy lo promueve la Asociación Educativa Colegio Adventista Túpac Amaru. Su equipo docente trabaja con la certificadora de calidad SGCE y el colegio mantiene un convenio con la Universidad Peruana Unión.',
  ],
  foto: { url: UP + '2025/05/Sin-titulo-1200-x-900-px.png', alt: 'Niño con el uniforme del colegio y lentes, sonriendo y abrazando una Santa Biblia', ancho: 1200, alto: 900 },
  simbolos: [
    { nombre: 'Las manos abiertas', significado: 'Estar dispuestos a extender la mano a quien más lo necesita.' },
    { nombre: 'La Biblia abierta', significado: 'Enseñar bajo la cosmovisión cristiana basada en la Biblia.' },
    { nombre: 'La llama encendida', significado: 'Mantener viva la luz del Espíritu Santo en la oscuridad.' },
    { nombre: 'Los laureles', significado: 'La riqueza y los recursos naturales del Perú.' },
  ],
}

const niveles = {
  titulo: 'Inicial, primaria y secundaria',
  propuestaUrl: 'https://cata.edu.pe/new_propuestaeducativa/',
  items: [
    { id: 'inicial', nombre: 'Inicial', rango: '3, 4 y 5 años', sede: 'Sede CATA Inicial', reconocimiento: 'Reconocido en 1998', foto: img('nivel-inicial', 'Foto de prueba: niños de inicial en su aula') },
    { id: 'primaria', nombre: 'Primaria', rango: '1.er a 6.º grado', sede: 'También en Sede CATA Jerusalén', reconocimiento: 'Reconocido en 1971', foto: img('nivel-primaria', 'Foto de prueba: estudiantes de primaria leyendo') },
    { id: 'secundaria', nombre: 'Secundaria', rango: '1.er a 5.º año', sede: null, reconocimiento: 'Reconocido en 1982', foto: img('nivel-secundaria', 'Foto de prueba: estudiantes de secundaria en el laboratorio') },
  ],
}

const sedes = [
  { id: 'central', nombre: 'Sede Central', direccion: 'Jr. Moquegua N° 852', referencia: 'Frente al Mercado Internacional Túpac Amaru', distrito: 'Juliaca, San Román, Puno', telefono: { numero: '+5151325096', visible: '051 325096' }, nota: null, foto: img('sede-central', 'Foto de prueba: fachada de la Sede Central'), mapaUrl: null },
  { id: 'inicial', nombre: 'Sede CATA Inicial', direccion: 'Jr. Raúl Porras B. N° 287', referencia: 'Esquina con Jr. San Martín', distrito: 'Juliaca, San Román, Puno', telefono: null, nota: null, foto: img('sede-inicial', 'Foto de prueba: entrada de la Sede CATA Inicial'), mapaUrl: null },
  { id: 'jerusalen', nombre: 'Sede CATA Jerusalén', direccion: 'Titiline Independencia N° 2, Urb. Jerusalem', referencia: 'Puente Independencia, salida a Huancané', distrito: 'San Miguel, San Román, Puno', telefono: { numero: '+51937489399', visible: '937 489 399' }, nota: 'Nivel primaria.', foto: img('sede-jerusalen', 'Foto de prueba: patio de la Sede CATA Jerusalén'), mapaUrl: null },
  { id: 'oasis', nombre: 'Sede CATA Oasis', direccion: 'Av. Modesto Borda s/n, Carretera a Coata km 2.5', referencia: 'Chilla', distrito: 'Caracoto, San Román, Puno', telefono: null, nota: 'Biohuertos y talleres de alimentación saludable, arte y pintura, y música.', foto: img('sede-oasis', 'Foto de prueba: biohuerto de la Sede CATA Oasis'), mapaUrl: null },
]

const noticias = [
  { id: 'n4', slug: 'horario-de-atencion-de-secretaria', tipo: 'comunicado', titulo: 'Horario de atención de secretaría', resumen: 'Comunicado de prueba: la secretaría atiende de lunes a viernes por la mañana en la Sede Central.', fecha: '2026-10-06', foto: null, enlace: null },
  { id: 'n3', slug: 'taller-de-musica-en-oasis', tipo: 'noticia', titulo: 'Taller de música en la sede Oasis', resumen: 'Noticia de prueba sobre los talleres que ya funcionan en Chilla.', fecha: '2026-09-28', foto: img('noticia-1', 'Foto de prueba: estudiantes en el taller de música'), enlace: null },
  { id: 'n2', slug: 'reunion-de-padres-de-familia', tipo: 'comunicado', titulo: 'Reunión de padres de familia', resumen: null, fecha: '2026-09-15', foto: null, enlace: { etiqueta: 'Ver el comunicado completo', url: 'https://cata.edu.pe/', externo: true } },
  { id: 'n1', slug: 'aniversario-institucional', tipo: 'noticia', titulo: 'Aniversario institucional', resumen: 'Noticia de prueba: cada 30 de junio el colegio celebra un año más de vida institucional.', fecha: '2026-06-30', foto: img('noticia-2', 'Foto de prueba: desfile por el aniversario del colegio'), enlace: null },
]

const grados = [
  { nivel: 'Inicial', opciones: ['3 años', '4 años', '5 años'] },
  { nivel: 'Primaria', opciones: ['1.er grado', '2.º grado', '3.er grado', '4.º grado', '5.º grado', '6.º grado'] },
  { nivel: 'Secundaria', opciones: ['1.er año', '2.º año', '3.er año', '4.º año', '5.º año'] },
]

const lista = (items, limite = 6) => ({ data: items.slice(0, limite), meta: { pagina: 1, limite, total: items.length } })

escribir('tipico', 'sitio', { data: sitio })
escribir('tipico', 'rutas', { data: rutas })
escribir('tipico', 'aviso', { data: aviso })
escribir('tipico', 'hero', { data: hero })
// Cifras reales. Falta el número de alumnos: lo debe dar el colegio.
escribir('tipico', 'cifras', { data: [
  { id: 'anios', valor: 55, sufijo: null, etiqueta: 'años educando en Juliaca' },
  { id: 'sedes', valor: 4, sufijo: null, etiqueta: 'sedes en San Román' },
  { id: 'niveles', valor: 3, sufijo: null, etiqueta: 'niveles: inicial, primaria y secundaria' },
] })
escribir('vacio', 'cifras', { data: [] })
escribir('largo', 'cifras', { data: [
  { id: 'anios', valor: 55, sufijo: null, etiqueta: 'años formando estudiantes con valores cristianos en la ciudad de Juliaca' },
  { id: 'sedes', valor: 4, sufijo: null, etiqueta: 'sedes en la provincia de San Román, departamento de Puno' },
  { id: 'niveles', valor: 3, sufijo: null, etiqueta: 'niveles educativos completos' },
  { id: 'convenio', valor: 1, sufijo: null, etiqueta: 'convenio con la Universidad Peruana Unión' },
] })
escribir('tipico', 'quienes-somos', { data: quienes })
escribir('tipico', 'niveles', { data: niveles })
escribir('tipico', 'sedes', { data: sedes })
escribir('tipico', 'noticias', lista(noticias))
escribir('tipico', 'grados', { data: grados })

// ── corto: lo mínimo que el contrato permite ──
escribir('corto', 'sitio', { data: { ...sitio, subtitulo: null, promotora: null, direccion: { linea: 'Jr. Moquegua 852', referencia: null, distrito: null } } })
escribir('corto', 'rutas', {
  data: {
    familias: { nombre: 'Admisión', bajada: null, paradas: [{ id: 'f1', etiqueta: 'Sedes', detalle: null, destino: sec('sedes') }], accion: { etiqueta: 'Escríbenos', detalle: null, mensajeWhatsapp: 'Hola, soy {nombre}. Información para {grado}.' } },
    comunidad: { nombre: 'Familias', bajada: null, paradas: [{ id: 'c1', etiqueta: 'Noticias', detalle: null, destino: sec('noticias') }], terminal: null },
  },
})
escribir('corto', 'hero', { data: { titulo: 'Bienvenidos', bajada: null, figuras: [], accionPrincipal: { etiqueta: 'Matrícula', destino: { tipo: 'pagina', ruta: '/matricula' } }, accionSecundaria: null } })
escribir('corto', 'aviso', { data: { id: '1', titulo: 'Matrícula', texto: null, imagen: null, enlace: null, vigenteDesde: '2026-10-01T00:00:00-05:00', vigenteHasta: null } })
escribir('corto', 'quienes-somos', { data: { titulo: 'Desde 1971.', parrafos: ['Colegio adventista en Juliaca.'], foto: null, simbolos: [{ nombre: 'Llama', significado: 'Luz.' }] } })
escribir('corto', 'niveles', { data: { titulo: 'Niveles', propuestaUrl: null, items: [{ id: 'i', nombre: 'Inicial', rango: null, sede: null, reconocimiento: null, foto: null }] } })
escribir('corto', 'sedes', { data: [{ id: 'c', nombre: 'Central', direccion: 'Jr. Moquegua 852', referencia: null, distrito: null, telefono: null, nota: null, foto: null, mapaUrl: null }] })
escribir('corto', 'noticias', lista([{ id: 'n1', slug: 'aviso', tipo: 'comunicado', titulo: 'Aviso', resumen: null, fecha: '2026-10-07', foto: null, enlace: null }]))
escribir('corto', 'grados', { data: [{ nivel: 'Inicial', opciones: ['3 años'] }] })

// ── largo: en y por encima de los máximos recomendados ──
const parrafoLargo =
  'El colegio nació de la Iglesia Adventista del Séptimo Día Villa Hermosa, organizada el 13 de mayo de 1967 en el barrio Túpac Amaru de la ciudad de Juliaca. Las familias, los hermanos y hermanas de esta reciente iglesia se preocuparon por la educación de sus hijos y por el avance de la obra adventista, lo que permitió proyectarse a instituir un centro educativo que con los años creció hasta ofrecer los niveles inicial, primaria y secundaria en varias sedes de la provincia de San Román, siempre con una formación integral.'
const nombreSedeLargo = ['Sede CATA Complejo Educativo Oasis del Ministerio', 'Sede CATA Jerusalén Urbanización Jerusalem Cacachi']
escribir('largo', 'sitio', {
  data: {
    ...sitio,
    nombre: 'Colegio Particular Adventista Túpac Amaru de la Ciudad de Juliaca',
    subtitulo: 'Educación inicial, primaria y secundaria con cosmovisión cristiana desde mil novecientos setenta y uno',
    direccion: { linea: 'Jirón Moquegua número 852, cercado de la ciudad de Juliaca', referencia: 'Frente al Mercado Internacional Túpac Amaru, a media cuadra de la avenida principal', distrito: 'Juliaca, provincia de San Román, departamento de Puno' },
    promotora: 'Asociación Educativa Colegio Adventista Túpac Amaru, promotora reconocida por R.D. N° 4609-DREP-2000',
  },
})
escribir('largo', 'rutas', {
  data: {
    familias: {
      nombre: 'Familias que quieren conocer el colegio',
      bajada: 'Conoce nuestra historia, nuestros niveles y todas las sedes, y pide información sin ningún compromiso.',
      paradas: [
        { id: 'f1', etiqueta: 'Quiénes somos y misión', detalle: 'Más de cincuenta años educando en Juliaca', destino: sec('quienes-somos') },
        { id: 'f2', etiqueta: 'Niveles educativos', detalle: 'Inicial, primaria y secundaria completa', destino: sec('niveles') },
        { id: 'f3', etiqueta: 'Nuestras sedes', detalle: 'Cuatro sedes en la provincia de San Román', destino: sec('sedes') },
        { id: 'f4', etiqueta: 'Propuesta educativa', detalle: 'Metodología por niveles y talleres', destino: { tipo: 'url', url: 'https://cata.edu.pe/new_propuestaeducativa/', externo: true } },
      ],
      accion: { etiqueta: 'Solicitar información ahora', detalle: 'Te respondemos por WhatsApp el mismo día', mensajeWhatsapp: 'Hola, mi nombre es {nombre}. Quisiera recibir información sobre la admisión para {grado} en el Colegio Adventista Túpac Amaru, incluyendo requisitos, fechas y costos.' },
    },
    comunidad: {
      nombre: 'Comunidad educativa del colegio CATA',
      bajada: 'Comunicados oficiales, noticias de todas las sedes y accesos directos para familias, alumnos y docentes.',
      paradas: [
        { id: 'c1', etiqueta: 'Noticias y comunicados', detalle: 'Lo último publicado por el colegio', destino: sec('noticias') },
        { id: 'c2', etiqueta: 'Matrícula 2027', detalle: 'Requisitos, cronograma y documentos', destino: { tipo: 'url', url: 'https://cata.edu.pe/new_matricula/', externo: true } },
        { id: 'c3', etiqueta: 'Contacto y ubicación', detalle: 'Teléfono, WhatsApp y dirección', destino: sec('contacto') },
        { id: 'c4', etiqueta: 'Sedes del colegio', detalle: 'Direcciones y cómo llegar', destino: sec('sedes') },
      ],
      terminal: { id: 'c5', etiqueta: 'Portal académico iCRM', detalle: 'Notas, asistencia y tareas en línea', destino: { tipo: 'url', url: ICRM, externo: true } },
    },
  },
})
escribir('largo', 'hero', { data: { ...hero, titulo: 'Más de cincuenta años formando estudiantes con excelencia académica y valores cristianos en Juliaca', bajada: 'Colegio Adventista Túpac Amaru: educación inicial, primaria y secundaria con cosmovisión cristiana en cuatro sedes de la provincia de San Román, con talleres de música, arte, biohuertos y alimentación saludable.', accionPrincipal: { etiqueta: 'Conoce el proceso de matrícula 2027', destino: { tipo: 'pagina', ruta: '/matricula' } }, accionSecundaria: { etiqueta: 'Descubre nuestra propuesta educativa por niveles', destino: { tipo: 'pagina', ruta: '/propuesta-educativa' } } } })
escribir('largo', 'aviso', {
  data: {
    id: '99',
    titulo: 'Proceso de admisión 2027: inscripciones abiertas para inicial, primaria y secundaria en todas las sedes',
    texto: 'Las familias interesadas pueden acercarse a cualquiera de nuestras cuatro sedes de lunes a viernes, de 8:00 a 13:00, con el DNI del estudiante y del apoderado, la libreta de notas del año anterior y la constancia de no adeudo del colegio de procedencia.',
    imagen: img('panoramica', 'Foto de prueba: banner panorámico con el texto Admisión 2027, inscripciones abiertas'),
    enlace: { etiqueta: 'Ver todos los requisitos de admisión 2027', url: 'https://cata.edu.pe/new_matricula/', externo: true },
    vigenteDesde: '2026-09-01T08:00:00-05:00',
    vigenteHasta: '2027-02-28T23:59:59-05:00',
  },
})
escribir('largo', 'quienes-somos', {
  data: {
    titulo: 'Más de cincuenta años de educación adventista en la ciudad de Juliaca y la provincia de San Román.',
    parrafos: Array.from({ length: 6 }, () => parrafoLargo),
    foto: img('quienes-somos', 'Foto de prueba: estudiantes de los tres niveles reunidos en el patio principal de la Sede Central durante la formación del lunes, con banderas'),
    simbolos: Array.from({ length: 8 }, (_, i) => ({ nombre: `Símbolo número ${i + 1} del emblema institucional`, significado: 'Simboliza que cada docente, personal administrativo, personal de apoyo y estudiante de la institución siempre estará dispuesto a ayudar.' })),
  },
})
escribir('largo', 'niveles', {
  data: {
    titulo: 'Educación inicial, primaria y secundaria completa',
    propuestaUrl: 'https://cata.edu.pe/new_propuestaeducativa/',
    items: [
      { id: 'inicial', nombre: 'Educación Inicial', rango: 'Niños y niñas de 3, 4 y 5 años de edad', sede: 'Sede CATA Inicial, Jr. Raúl Porras Barrenechea', reconocimiento: 'Reconocido por R.D. N° 6954-DREP en 1998', foto: img('nivel-inicial', 'Foto de prueba: niños de inicial') },
      { id: 'primaria', nombre: 'Educación Primaria', rango: 'Del primer al sexto grado de primaria', sede: 'Sede Central y Sede CATA Jerusalén en Cacachi', reconocimiento: 'Reconocido por R.D. Regional N° 457 en 1971', foto: img('nivel-primaria', 'Foto de prueba: estudiantes de primaria') },
      { id: 'secundaria', nombre: 'Educación Secundaria', rango: 'Del primer al quinto año de secundaria', sede: 'Sede Central, Jr. Moquegua N° 852', reconocimiento: 'Reconocido por R.D.Z. N° 104-DZE-J en 1982', foto: img('nivel-secundaria', 'Foto de prueba: estudiantes de secundaria') },
      { id: 'talleres', nombre: 'Talleres Oasis', rango: 'Biohuertos, música, arte y alimentación', sede: 'Sede CATA Oasis, Chilla, Caracoto', reconocimiento: null, foto: null },
    ],
  },
})
escribir('largo', 'sedes', {
  data: Array.from({ length: 8 }, (_, i) => ({
    ...sedes[i % 4],
    id: `sede-${i + 1}`,
    nombre: nombreSedeLargo[i % 2],
    direccion: 'Avenida Modesto Borda sin número, Carretera salida a Coata kilómetro 2.5',
    referencia: 'A la altura del puente Independencia, salida a Huancané, frente al grifo',
    nota: 'Biohuertos y talleres de preparación de alimentos saludables, arte y pintura, música y un futuro espacio de innovación Maker Space.',
  })),
})
escribir('largo', 'noticias', lista(
  Array.from({ length: 23 }, (_, i) => ({
    id: `n${i + 1}`,
    slug: `noticia-larga-${i + 1}`,
    tipo: i % 2 ? 'noticia' : 'comunicado',
    titulo: 'Comunicado de prueba con un título muy largo para comprobar que la lista de noticias se acomoda en varias líneas sin cortarse',
    resumen: 'Resumen de prueba que llega al máximo recomendado del contrato. Sirve para comprobar que el texto se ajusta a un ancho de lectura cómodo y que, si hace falta, se recorta con puntos suspensivos sin perder el enlace al contenido completo de la noticia publicada.',
    fecha: `2026-09-${String(28 - i).padStart(2, '0')}`,
    foto: i % 3 === 0 ? img('noticia-1', 'Foto de prueba') : null,
    enlace: { etiqueta: 'Leer el comunicado completo en la web del colegio', url: 'https://cata.edu.pe/', externo: true },
  })),
))
escribir('largo', 'grados', { data: grados })

// ── sin-foto: todas las imágenes en null ──
const sinFoto = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'foto' || k === 'imagen' ? null : v)))
escribir('sin-foto', 'aviso', { data: sinFoto(aviso) })
escribir('sin-foto', 'hero', { data: { ...hero, figuras: [] } })
escribir('sin-foto', 'quienes-somos', { data: sinFoto(quienes) })
escribir('sin-foto', 'niveles', { data: sinFoto(niveles) })
escribir('sin-foto', 'sedes', { data: sinFoto(sedes) })
escribir('sin-foto', 'noticias', lista(sinFoto(noticias)))

// ── alt-vacio: imágenes decorativas ──
const altVacio = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'alt' ? '' : v)))
escribir('alt-vacio', 'aviso', { data: altVacio(aviso) })
escribir('alt-vacio', 'hero', { data: altVacio(hero) })
escribir('alt-vacio', 'quienes-somos', { data: altVacio(quienes) })
escribir('alt-vacio', 'niveles', { data: altVacio(niveles) })
escribir('alt-vacio', 'sedes', { data: altVacio(sedes) })
escribir('alt-vacio', 'noticias', lista(altVacio(noticias)))

// ── vacio: listas vacías y opcionales en null ──
escribir('vacio', 'sitio', { data: { ...sitio, portalAcademicoUrl: null, subtitulo: null, promotora: null } })
escribir('vacio', 'rutas', { data: { ...rutas, comunidad: { ...rutas.comunidad, terminal: null } } })
escribir('vacio', 'aviso', { data: null })
escribir('vacio', 'quienes-somos', { data: { ...quienes, foto: null, simbolos: [] } })
escribir('vacio', 'niveles', { data: { titulo: 'Inicial, primaria y secundaria', propuestaUrl: null, items: [] } })
escribir('vacio', 'sedes', { data: [] })
escribir('vacio', 'noticias', lista([]))

console.log('ok')
