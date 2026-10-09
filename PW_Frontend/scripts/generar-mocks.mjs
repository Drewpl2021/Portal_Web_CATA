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
  'proyecto-gastronomia': ['Proyecto: Gastronomía', 3, 2],
  'proyecto-robotica': ['Proyecto: Robótica', 3, 2],
  'proyecto-galeria-1': ['Galería del proyecto', 3, 2],
  'proyecto-galeria-2': ['Galería del proyecto', 3, 2],
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

// Cabecera de Propuesta Educativa: fotos publicadas por el propio colegio en cata.edu.pe (se enlazan, no se copian).
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

const mapaDe = (direccion) => `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`
const MAPAS = {
  central: mapaDe('Jr. Moquegua 852, Juliaca, Puno, Perú'),
  inicial: mapaDe('Jr. Raúl Porras Barrenechea 287, Juliaca, Puno, Perú'),
  jerusalen: mapaDe('Urbanización Jerusalén, Cacachi, San Miguel, San Román, Puno, Perú'),
  oasis: mapaDe('Chilla, Caracoto, San Román, Puno, Perú'),
}
const conContacto = (lista) => lista.map((x) => ({ ...x, correo: null, horario: [], mapaEmbedUrl: MAPAS[x.id] ?? null }))

const sedes = conContacto([
  { id: 'central', nombre: 'Sede Central', direccion: 'Jr. Moquegua N° 852', referencia: 'Frente al Mercado Internacional Túpac Amaru', distrito: 'Juliaca, San Román, Puno', telefono: { numero: '+5151325096', visible: '051 325096' }, nota: null, foto: img('sede-central', 'Foto de prueba: fachada de la Sede Central'), mapaUrl: null },
  { id: 'inicial', nombre: 'Sede CATA Inicial', direccion: 'Jr. Raúl Porras B. N° 287', referencia: 'Esquina con Jr. San Martín', distrito: 'Juliaca, San Román, Puno', telefono: null, nota: null, foto: img('sede-inicial', 'Foto de prueba: entrada de la Sede CATA Inicial'), mapaUrl: null },
  { id: 'jerusalen', nombre: 'Sede CATA Jerusalén', direccion: 'Titiline Independencia N° 2, Urb. Jerusalem', referencia: 'Puente Independencia, salida a Huancané', distrito: 'San Miguel, San Román, Puno', telefono: { numero: '+51937489399', visible: '937 489 399' }, nota: 'Nivel primaria.', foto: img('sede-jerusalen', 'Foto de prueba: patio de la Sede CATA Jerusalén'), mapaUrl: null },
  { id: 'oasis', nombre: 'Sede CATA Oasis', direccion: 'Av. Modesto Borda s/n, Carretera a Coata km 2.5', referencia: 'Chilla', distrito: 'Caracoto, San Román, Puno', telefono: null, nota: 'Biohuertos y talleres de alimentación saludable, arte y pintura, y música.', foto: img('sede-oasis', 'Foto de prueba: biohuerto de la Sede CATA Oasis'), mapaUrl: null },
])

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

const banner = {
  matriculas: {
    id: 'b-matriculas',
    categoria: 'matricula',
    titulo: 'Matrículas 2026 abiertas para inicial, primaria y secundaria',
    fecha: '2026-01-05',
    imagen: { url: UP + '2025/01/4.png', alt: 'Afiche: Matrículas abiertas 2026. Inicial, Primaria, Secundaria. Informes por WhatsApp al 986322833, www.cata.edu.pe. Un niño con el uniforme del colegio sonríe a la derecha.', ancho: 1900, alto: 700 },
    imagenMovil: null,
    puntoFocal: { x: 82, y: 40 },
    alineacion: 'derecha',
    accion: { etiqueta: 'Ver requisitos', destino: { tipo: 'pagina', ruta: '/matricula' } },
  },
  bienvenida: {
    id: 'b-bienvenida',
    categoria: 'aviso',
    titulo: 'Bienvenidos de nuevo al colegio',
    fecha: '2026-03-02',
    imagen: { url: UP + '2025/01/5.png', alt: 'Afiche: Bienvenido de nuevo al colegio. El mejor lugar: CATA 2026. Infórmate al 986322833, www.cata.edu.pe. Síguenos en Facebook, Twitter, YouTube e Instagram.', ancho: 1900, alto: 700 },
    imagenMovil: null,
    puntoFocal: { x: 30, y: 50 },
    alineacion: 'derecha',
    accion: { etiqueta: 'Contáctanos', destino: { tipo: 'pagina', ruta: '/contacto' } },
  },
  lideres: {
    id: 'b-lideres',
    categoria: 'noticia',
    titulo: 'Líderes que dejan huella',
    fecha: null,
    imagen: { url: UP + '2025/01/2.png', alt: 'Afiche: Líderes que dejan huella. Cuatro estudiantes sonríen en el auditorio del colegio bajo el letrero Bienvenidos. Cita: «La obra de la verdadera educación consiste en desarrollar las facultades físicas, mentales y espirituales del estudiante, preparándolo para el gozo del servicio en este mundo y para un gozo superior en el mundo venidero.» Elena G. White. Facebook: colegiocatajuliaca.', ancho: 1900, alto: 700 },
    imagenMovil: null,
    puntoFocal: { x: 58, y: 45 },
    alineacion: 'derecha',
    accion: null,
  },
  anio: {
    id: 'b-anio',
    categoria: 'aviso',
    titulo: 'Año académico 2026',
    fecha: '2026-01-05',
    imagen: { url: UP + '2025/12/Banner-CATA.png', alt: 'Banner con las letras CATA, el emblema del colegio, el año 2026 y la dirección www.cata.edu.pe.', ancho: 1900, alto: 700 },
    imagenMovil: null,
    puntoFocal: { x: 50, y: 50 },
    alineacion: 'izquierda',
    accion: null,
  },
  bus: {
    id: 'b-bus',
    categoria: 'evento',
    titulo: '¡Bienvenidos, cataínos! Un líder cataíno en cada hogar',
    fecha: '2026-02-20',
    imagen: { url: UP + '2025/01/3.png', alt: 'Afiche: ¡Bienvenidos Cataínos! «Un líder cataíno en cada hogar». Bus escolar del colegio con el logo CATA y las palabras Integridad, Abnegación e Innovación. Íconos de Facebook, YouTube y WhatsApp.', ancho: 1900, alto: 700 },
    imagenMovil: null,
    puntoFocal: { x: 70, y: 50 },
    alineacion: 'izquierda',
    accion: null,
  },
}

escribir('tipico', 'sitio', { data: sitio })
escribir('tipico', 'banners', { data: [banner.matriculas, banner.bienvenida, banner.lideres] })
escribir('corto', 'banners', { data: [{ ...banner.anio, titulo: 'CATA 2026', fecha: null }] })
escribir('largo', 'banners', { data: [
  { ...banner.matriculas, titulo: 'Proceso de matrícula 2027: inscripciones abiertas para inicial, primaria y secundaria en todas las sedes', accion: { etiqueta: 'Conoce todos los requisitos de admisión', destino: { tipo: 'pagina', ruta: '/matricula' } } },
  banner.bienvenida,
  banner.lideres,
  banner.anio,
  banner.bus,
  { id: 'b-prueba', categoria: 'evento', titulo: 'Imagen de prueba panorámica para comprobar el recorte con punto focal', fecha: '2026-09-28', imagen: img('panoramica', 'Foto de prueba: imagen panorámica'), imagenMovil: img('quienes-somos', 'Foto de prueba: versión vertical para móvil'), puntoFocal: { x: 50, y: 50 }, alineacion: 'izquierda', accion: { etiqueta: 'Ver más', destino: { tipo: 'url', url: 'https://cata.edu.pe/', externo: true } } },
] })
escribir('vacio', 'banners', { data: [] })
escribir('alt-vacio', 'banners', { data: [banner.matriculas, banner.bienvenida, banner.lideres].map((b) => ({ ...b, imagen: { ...b.imagen, alt: '' } })) })
escribir('tipico', 'propuesta-cabecera', { data: hero })
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
escribir('corto', 'propuesta-cabecera', { data: { titulo: 'Bienvenidos', bajada: null, figuras: [], accionPrincipal: { etiqueta: 'Matrícula', destino: { tipo: 'pagina', ruta: '/matricula' } }, accionSecundaria: null } })
escribir('corto', 'quienes-somos', { data: { titulo: 'Desde 1971.', parrafos: ['Colegio adventista en Juliaca.'], foto: null, simbolos: [{ nombre: 'Llama', significado: 'Luz.' }] } })
escribir('corto', 'niveles', { data: { titulo: 'Niveles', propuestaUrl: null, items: [{ id: 'i', nombre: 'Inicial', rango: null, sede: null, reconocimiento: null, foto: null }] } })
escribir('corto', 'sedes', { data: [{ id: 'c', nombre: 'Central', direccion: 'Jr. Moquegua 852', referencia: null, distrito: null, telefono: null, nota: null, foto: null, mapaUrl: null, correo: null, horario: [], mapaEmbedUrl: null }] })
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
escribir('largo', 'propuesta-cabecera', { data: { ...hero, titulo: 'Más de cincuenta años formando estudiantes con excelencia académica y valores cristianos en Juliaca', bajada: 'Colegio Adventista Túpac Amaru: educación inicial, primaria y secundaria con cosmovisión cristiana en cuatro sedes de la provincia de San Román, con talleres de música, arte, biohuertos y alimentación saludable.', accionPrincipal: { etiqueta: 'Conoce el proceso de matrícula 2027', destino: { tipo: 'pagina', ruta: '/matricula' } }, accionSecundaria: { etiqueta: 'Descubre nuestra propuesta educativa por niveles', destino: { tipo: 'pagina', ruta: '/propuesta-educativa' } } } })
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
    // Correos y horarios de prueba: el dominio example.com está reservado y nunca es real.
    correo: `secretaria-de-la-sede-de-prueba-numero-${i + 1}@example.com`,
    horario: [
      { dias: 'Lunes, martes, miércoles, jueves y viernes (horario de prueba)', horas: '7:30 a 13:00 y de 14:30 a 18:00' },
      { dias: 'Sábados', horas: '8:00 a 12:00' },
      { dias: 'Domingos y feriados', horas: 'Cerrado' },
      { dias: 'Vacaciones escolares', horas: 'Solo con cita previa por WhatsApp' },
    ],
    mapaEmbedUrl: i === 7 ? null : MAPAS[sedes[i % 4].id],
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
escribir('sin-foto', 'propuesta-cabecera', { data: { ...hero, figuras: [] } })
escribir('sin-foto', 'quienes-somos', { data: sinFoto(quienes) })
escribir('sin-foto', 'niveles', { data: sinFoto(niveles) })
escribir('sin-foto', 'sedes', { data: sinFoto(sedes) })
escribir('sin-foto', 'noticias', lista(sinFoto(noticias)))

// ── alt-vacio: imágenes decorativas ──
const altVacio = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'alt' ? '' : v)))
escribir('alt-vacio', 'propuesta-cabecera', { data: altVacio(hero) })
escribir('alt-vacio', 'quienes-somos', { data: altVacio(quienes) })
escribir('alt-vacio', 'niveles', { data: altVacio(niveles) })
escribir('alt-vacio', 'sedes', { data: altVacio(sedes) })
escribir('alt-vacio', 'noticias', lista(altVacio(noticias)))

// ── vacio: listas vacías y opcionales en null ──
escribir('vacio', 'sitio', { data: { ...sitio, portalAcademicoUrl: null, subtitulo: null, promotora: null } })
escribir('vacio', 'quienes-somos', { data: { ...quienes, foto: null, simbolos: [] } })
escribir('vacio', 'niveles', { data: { titulo: 'Inicial, primaria y secundaria', propuestaUrl: null, items: [] } })
escribir('vacio', 'sedes', { data: [] })
escribir('vacio', 'noticias', lista([]))

// ── Matrícula ──
// Requisitos, documentos y pasos: afiches publicados por el colegio en cata.edu.pe (matrícula de estudiantes
// nuevos y regulares). Se quitaron los años del afiche (2023, 2024) para que no caduquen.
// El año es el de los afiches publicados (2026); en la API lo define el colegio. Las fechas no están publicadas: son de
// prueba y la página lo dice. Las vacantes tampoco: dicen «consultar».
const cabeceraMatricula = {
  titulo: 'Proceso de matrícula',
  bajada: 'Requisitos, documentos y pasos para matricular a tu hijo o hija en inicial, primaria o secundaria.',
  anio: 2026,
  figura: { url: UP + '2023/01/CATA-Matricula_Img_1.png', alt: 'Estudiante con el uniforme del colegio y su mochila, haciendo el gesto de pulgar arriba', ancho: 500, alto: 1000 },
}
const PAGO = 'En la caja de la institución. Si hay otros medios de pago, el colegio los comunicará oficialmente y a tiempo a los padres de familia.'
const procesos = [
  {
    id: 'nuevos',
    nombre: 'Estudiantes nuevos',
    resumen: 'Para quienes postulan a CATA por primera vez.',
    listas: [
      {
        titulo: 'Requisitos para solicitar una vacante',
        items: [
          'Tener la edad cumplida al 31 de marzo, según disposición del Minedu.',
          'Solicitar la vacante con el Formulario Único de Trámite (FUT), que se adquiere en caja.',
          'Copia del DNI del estudiante y del padre de familia.',
          'Informe de progreso del estudiante del año anterior.',
          'De ser el caso, se pedirá una evaluación psicopedagógica con la psicóloga de la institución.',
        ],
      },
      {
        titulo: 'Documentos para la matrícula',
        items: [
          'Ficha de datos para la matrícula, completada por el padre de familia.',
          'Partida de nacimiento original del estudiante.',
          'Copia del DNI del estudiante y del padre de familia.',
          'Informe de progreso del estudiante del año anterior.',
          'Copia de la ficha de matrícula generada por el SIAGIE, constancia de matrícula e informe de progreso, si el estudiante estudia actualmente en otro centro educativo.',
          'Constancia de no adeudo, para estudiantes que vienen de instituciones educativas privadas.',
          'Certificado de buena conducta.',
          'Resolución directoral de traslado de la institución educativa de procedencia.',
          'Comprobante del pago por derecho de admisión.',
        ],
      },
    ],
    pasos: [
      { titulo: 'Reserva de matrícula', detalle: 'Recibida la solicitud con los requisitos, Dirección General programa una entrevista con los padres de familia y el estudiante. De ser necesario, la institución pedirá una evaluación psicológica.' },
      { titulo: 'Pago de la cuota de ingreso y la matrícula', detalle: PAGO },
      { titulo: 'Constancia de vacante', detalle: 'Secretaría la entrega al padre de familia o apoderado, para pedir los documentos a la institución de origen y hacer la matrícula oficial.' },
      { titulo: 'Firma del contrato', detalle: 'Contrato de prestación de servicios educativos.' },
    ],
  },
  {
    id: 'regulares',
    nombre: 'Estudiantes regulares',
    resumen: 'Para quienes ya estudian en CATA y continúan el próximo año.',
    listas: [
      {
        titulo: 'Requisitos',
        items: [
          'No tener deuda por el servicio de enseñanza con la institución del año anterior.',
          'No haber sido observado reincidentemente por mala conducta.',
          'Haber aprobado el año académico anterior.',
        ],
      },
    ],
    pasos: [
      { titulo: 'Actualización de datos', detalle: 'En la secretaría de la institución se actualizan los datos de los padres de familia o del apoderado.' },
      { titulo: 'Pago de la matrícula', detalle: PAGO },
      { titulo: 'Firma del contrato', detalle: 'Contrato de prestación de servicios educativos.' },
    ],
  },
]
const vacantes = {
  actualizado: null,
  nota: 'Las vacantes dependen de cada grado. Consulta la disponibilidad por WhatsApp o en la secretaría del colegio.',
  niveles: [
    { id: 'inicial', nivel: 'Inicial', detalle: '3, 4 y 5 años', estado: 'consultar', vacantes: null },
    { id: 'primaria', nivel: 'Primaria', detalle: '1.er a 6.º grado', estado: 'consultar', vacantes: null },
    { id: 'secundaria', nivel: 'Secundaria', detalle: '1.er a 5.º año', estado: 'consultar', vacantes: null },
  ],
}
const fechasMatricula = {
  nota: 'Fechas de prueba: el colegio publicará aquí su cronograma oficial.',
  items: [
    { id: 'f1', titulo: 'Solicitud de vacantes para estudiantes nuevos', inicio: '2025-11-03', fin: '2025-12-19', detalle: 'Con el FUT, en la caja de la institución.' },
    { id: 'f2', titulo: 'Matrícula de estudiantes regulares', inicio: '2025-12-01', fin: '2025-12-23', detalle: null },
    { id: 'f3', titulo: 'Matrícula de estudiantes nuevos', inicio: '2026-01-05', fin: '2026-02-27', detalle: 'Con la constancia de vacante y los documentos completos.' },
    { id: 'f4', titulo: 'Inicio de clases', inicio: '2026-03-02', fin: null, detalle: null },
  ],
}
const preguntas = [
  { id: 'edad', pregunta: '¿Qué edad debe tener mi hijo o hija para postular?', respuesta: 'Debe tener la edad cumplida al 31 de marzo del año al que postula, según la disposición del Ministerio de Educación (Minedu).' },
  { id: 'fut', pregunta: '¿Dónde consigo el FUT para solicitar la vacante?', respuesta: 'El Formulario Único de Trámite (FUT) se adquiere en la caja de la institución.' },
  { id: 'entrevista', pregunta: '¿Habrá una entrevista o una evaluación?', respuesta: 'Sí. Recibida la solicitud con los requisitos, Dirección General programa una entrevista con los padres de familia y el estudiante. De ser necesario, la psicóloga de la institución hará una evaluación psicopedagógica.' },
  { id: 'pago', pregunta: '¿Dónde se pagan la cuota de ingreso y la matrícula?', respuesta: PAGO },
  { id: 'traslado', pregunta: 'Viene de un colegio privado, ¿qué documentos adicionales necesito?', respuesta: 'La constancia de no adeudo del colegio de procedencia, además de la resolución directoral de traslado, la ficha de matrícula del SIAGIE, el informe de progreso y el certificado de buena conducta.' },
  { id: 'constancia', pregunta: '¿Para qué sirve la constancia de vacante?', respuesta: 'Secretaría la entrega al padre de familia o apoderado para pedir los documentos a la institución de origen y completar la matrícula oficial.' },
  { id: 'regulares', pregunta: 'Mi hijo o hija ya estudia en CATA, ¿qué debo hacer?', respuesta: 'Actualizar los datos en secretaría, pagar la matrícula en caja y firmar el contrato de prestación de servicios educativos. Se requiere no tener deuda del año anterior, haber aprobado el año académico y no haber sido observado reincidentemente por mala conducta.' },
]
const solicitud = {
  titulo: 'Solicitar información',
  texto: 'Escribe tu nombre y el grado que te interesa. Abriremos WhatsApp con el mensaje listo para que lo envíes al colegio.',
  mensajeWhatsapp: 'Hola, soy {nombre}. Quisiera información sobre el colegio para {grado}.',
  mensajesPorPagina: [
    { pagina: 'matricula', mensaje: 'Hola, soy {nombre}. Quisiera información sobre la matrícula para {grado}.' },
    { pagina: 'contacto', mensaje: 'Hola, soy {nombre}. Tengo una consulta para el colegio sobre {grado}.' },
  ],
}
escribir('tipico', 'matricula-cabecera', { data: cabeceraMatricula })
escribir('tipico', 'matricula-procesos', { data: procesos })
escribir('tipico', 'matricula-vacantes', { data: vacantes })
escribir('tipico', 'matricula-fechas', { data: fechasMatricula })
escribir('tipico', 'matricula-preguntas', { data: preguntas })
escribir('tipico', 'solicitud', { data: solicitud })

escribir('corto', 'matricula-cabecera', { data: { titulo: 'Matrícula', bajada: null, anio: null, figura: null } })
escribir('corto', 'matricula-procesos', { data: [{ id: 'n', nombre: 'Nuevos', resumen: null, listas: [{ titulo: 'Requisitos', items: ['DNI.'] }], pasos: [{ titulo: 'Firma', detalle: null }] }] })
escribir('corto', 'matricula-vacantes', { data: { actualizado: null, nota: null, niveles: [{ id: 'i', nivel: 'Inicial', detalle: null, estado: 'disponible', vacantes: 12 }] } })
escribir('corto', 'matricula-fechas', { data: { nota: null, items: [{ id: 'f', titulo: 'Matrícula', inicio: '2027-01-04', fin: null, detalle: null }] } })
escribir('corto', 'matricula-preguntas', { data: [{ id: 'p', pregunta: '¿Edad?', respuesta: 'Cumplida al 31 de marzo.' }] })
escribir('corto', 'solicitud', { data: { titulo: 'Informes', texto: null, mensajeWhatsapp: 'Hola, soy {nombre}. Me interesa {grado}.', mensajesPorPagina: [] } })

const textoLargo = 'Texto de prueba que llega al máximo recomendado del contrato para comprobar que el bloque se acomoda en varias líneas sin cortarse ni tapar a los demás elementos de la página, incluso en las pantallas más pequeñas.'
escribir('largo', 'matricula-cabecera', { data: { ...cabeceraMatricula, titulo: 'Proceso de matrícula y admisión para estudiantes nuevos y regulares', bajada: 'Requisitos, documentos, pasos, fechas y vacantes para matricular a tu hijo o hija en inicial, primaria o secundaria en cualquiera de las cuatro sedes del colegio en la provincia de San Román.' } })
escribir('largo', 'matricula-procesos', { data: [
  { ...procesos[0], nombre: 'Estudiantes nuevos que postulan por traslado desde otra institución educativa', resumen: textoLargo, listas: [...procesos[0].listas, { titulo: 'Lista de prueba con el máximo de quince elementos permitidos por el contrato', items: Array.from({ length: 15 }, (_, i) => `Requisito de prueba número ${i + 1}: ${textoLargo}`) }], pasos: Array.from({ length: 8 }, (_, i) => ({ titulo: `Paso de prueba número ${i + 1} con un título largo que ocupa varias líneas`, detalle: textoLargo })) },
  procesos[1],
  { id: 'inclusivos', nombre: 'Estudiantes con necesidades educativas especiales', resumen: null, listas: [{ titulo: 'Requisitos', items: [textoLargo] }], pasos: [] },
  { id: 'extranjeros', nombre: 'Estudiantes extranjeros', resumen: null, listas: [], pasos: [{ titulo: 'Convalidación de estudios', detalle: textoLargo }] },
] })
escribir('largo', 'matricula-vacantes', { data: { actualizado: '2026-10-05', nota: textoLargo, niveles: [
  { id: 'inicial', nivel: 'Educación Inicial', detalle: 'Niños y niñas de 3, 4 y 5 años de edad, en la Sede CATA Inicial', estado: 'pocas', vacantes: 3 },
  { id: 'primaria', nivel: 'Educación Primaria', detalle: 'Del primer al sexto grado, en la Sede Central y en la Sede CATA Jerusalén', estado: 'disponible', vacantes: 128 },
  { id: 'secundaria', nivel: 'Educación Secundaria', detalle: 'Del primer al quinto año de secundaria, en la Sede Central', estado: 'agotadas', vacantes: 0 },
  { id: 'inicial-3', nivel: 'Inicial de tres años', detalle: null, estado: 'consultar', vacantes: null },
  { id: 'talleres', nivel: 'Talleres de la Sede CATA Oasis', detalle: textoLargo, estado: 'disponible', vacantes: null },
  { id: 'otro', nivel: 'Nivel de prueba', detalle: null, estado: 'disponible', vacantes: 1000 },
] } })
escribir('largo', 'matricula-fechas', { data: { nota: textoLargo, items: Array.from({ length: 12 }, (_, i) => ({ id: `f${i}`, titulo: `Actividad de prueba número ${i + 1} del cronograma de matrícula con un nombre largo`, inicio: `2026-${String(11 + Math.floor(i / 6)).padStart(2, '0')}-${String(2 + (i % 6) * 4).padStart(2, '0')}`, fin: i % 2 ? `2027-02-${String(10 + i).padStart(2, '0')}` : null, detalle: i % 3 ? textoLargo : null })) } })
escribir('largo', 'matricula-preguntas', { data: Array.from({ length: 15 }, (_, i) => ({ id: `p${i}`, pregunta: `Pregunta de prueba número ${i + 1}: ¿qué pasa si la pregunta es tan larga que ocupa dos o tres líneas en un teléfono?`, respuesta: `${textoLargo} ${textoLargo}` })) })
escribir('largo', 'solicitud', { data: { titulo: 'Solicitar información sobre el proceso de matrícula y admisión', texto: textoLargo, mensajeWhatsapp: 'Hola, mi nombre es {nombre}. Quisiera recibir información completa sobre el colegio, sus sedes, niveles y propuesta educativa para {grado}. Muchas gracias.', mensajesPorPagina: [{ pagina: 'matricula', mensaje: 'Hola, mi nombre es {nombre}. Quisiera recibir información completa sobre el proceso de matrícula, los requisitos, las fechas y las vacantes para {grado}. Muchas gracias.' }, { pagina: 'contacto', mensaje: 'Hola, mi nombre es {nombre}. Quisiera hacer una consulta al colegio y que me indiquen el horario de atención de la secretaría para {grado}. Muchas gracias.' }] } })

escribir('sin-foto', 'matricula-cabecera', { data: { ...cabeceraMatricula, figura: null } })
escribir('alt-vacio', 'matricula-cabecera', { data: altVacio(cabeceraMatricula) })

escribir('vacio', 'matricula-cabecera', { data: { ...cabeceraMatricula, bajada: null, anio: null, figura: null } })
escribir('vacio', 'matricula-procesos', { data: [] })
escribir('vacio', 'matricula-vacantes', { data: { actualizado: null, nota: null, niveles: [] } })
escribir('vacio', 'matricula-fechas', { data: { nota: null, items: [] } })
escribir('vacio', 'matricula-preguntas', { data: [] })
escribir('vacio', 'solicitud', { data: { ...solicitud, texto: null, mensajesPorPagina: [] } })

// ── Contacto ──
// Redes: las que enlaza cata.edu.pe (Facebook, YouTube y TikTok). No publica un correo general.
const contacto = {
  titulo: 'Contáctanos',
  bajada: 'Cuatro sedes en San Román. Escríbenos por WhatsApp, llámanos o visítanos.',
  figura: { url: UP + '2023/01/CATA-Matricula_Img_2.png', alt: 'Estudiante con el uniforme del colegio, su mochila y un cuaderno de CATA', ancho: 500, alto: 1000 },
  correo: null,
  redes: [
    { red: 'facebook', cuenta: 'Colegio CATA', url: 'https://www.facebook.com/catajuliaca/' },
    { red: 'youtube', cuenta: 'Colegio CATA', url: 'https://www.youtube.com/@colegiocata828' },
    { red: 'tiktok', cuenta: '@colegioadventistacata', url: 'https://www.tiktok.com/@colegioadventistacata' },
  ],
}
escribir('tipico', 'contacto', { data: contacto })
escribir('corto', 'contacto', { data: { titulo: 'Contacto', bajada: null, figura: null, correo: null, redes: [contacto.redes[0]] } })
escribir('largo', 'contacto', { data: {
  ...contacto,
  titulo: 'Contáctanos y visítanos en cualquiera de nuestras cuatro sedes',
  bajada: 'Texto de prueba: cuatro sedes en la provincia de San Román, con atención por WhatsApp, por teléfono, por correo electrónico y de manera presencial en la secretaría de cada sede.',
  correo: 'mesa-de-partes-y-atencion-al-padre-de-familia-de-prueba@example.com',
  redes: [
    ...contacto.redes.map((x) => ({ ...x, cuenta: x.cuenta + ' · Colegio Adventista Túpac Amaru de Juliaca' })),
    { red: 'instagram', cuenta: 'Cuenta de prueba', url: 'https://www.instagram.com/' },
    { red: 'x', cuenta: 'Cuenta de prueba', url: 'https://x.com/' },
    { red: 'linkedin', cuenta: 'Cuenta de prueba', url: 'https://www.linkedin.com/' },
  ],
} })
escribir('sin-foto', 'contacto', { data: { ...contacto, figura: null } })
escribir('alt-vacio', 'contacto', { data: altVacio(contacto) })
escribir('vacio', 'contacto', { data: { ...contacto, bajada: null, figura: null, correo: null, redes: [] } })

// ── Proyectos ──
// Textos: los dos programas que publica cata.edu.pe (programas-de-valor, gastronomia y robotica).
// No hay fotos reales (las de esa página son ilustraciones), ni niveles, estado o fecha: van vacíos.
const proyectosLista = {
  titulo: 'Proyectos',
  bajada: 'Impulsamos el desarrollo físico, motriz, psicológico y espiritual de cada niño a través de nuestros programas educativos, fomentando su crecimiento integral.',
  categorias: [
    { id: 'alimentacion', nombre: 'Alimentación y salud' },
    { id: 'tecnologia', nombre: 'Tecnología' },
  ],
  proyectos: [
    {
      id: 'gastronomia',
      slug: 'gastronomia',
      titulo: 'Gastronomía e Industrias Alimentarias',
      lema: 'Cocinamos con propósito: salud, sabor y servicio.',
      resumen: 'Desarrolla competencias en cocina, nutrición, procesamiento y control de alimentos, fomentando la creatividad, la innovación y el emprendimiento en el sector alimentario.',
      categoria: 'alimentacion',
      niveles: [],
      estado: null,
      fecha: null,
      foto: img('proyecto-gastronomia', 'Foto de prueba: estudiantes en el taller de gastronomía'),
    },
    {
      id: 'robotica',
      slug: 'robotica',
      titulo: 'Robótica, Impresiones 3D y Computación',
      lema: 'Tecnología con propósito: creamos, servimos y transformamos.',
      resumen: 'Impulsa el desarrollo de competencias digitales en los estudiantes, promoviendo el pensamiento lógico, la resolución de problemas y la creatividad tecnológica.',
      categoria: 'tecnologia',
      niveles: [],
      estado: null,
      fecha: null,
      foto: img('proyecto-robotica', 'Foto de prueba: estudiantes programando un robot'),
    },
  ],
}
const lista_ = (titulo, items) => ({ titulo, tipo: 'lista', items: items.map((texto) => ({ titulo: null, texto })) })
const numerada = (titulo, items) => ({ titulo, tipo: 'numerada', items: items.map(([t, texto]) => ({ titulo: t, texto })) })
const galeria = [img('proyecto-galeria-1', 'Foto de prueba: trabajo del proyecto'), img('proyecto-galeria-2', 'Foto de prueba: estudiantes presentando el proyecto')]
const detalles = {
  gastronomia: {
    ...proyectosLista.proyectos[0],
    categoriaNombre: 'Alimentación y salud',
    descripcion: [
      'Taller práctico donde los estudiantes desarrollan habilidades culinarias, conocen procesos de la industria alimentaria y promueven una alimentación saludable, integrando creatividad, ciencia y valores cristianos al servicio de la comunidad.',
    ],
    secciones: [
      lista_('Objetivos', [
        'Desarrollar habilidades culinarias aplicando técnicas básicas de cocina saludable.',
        'Fomentar el conocimiento sobre la producción, conservación y transformación de alimentos.',
        'Promover hábitos alimenticios equilibrados basados en principios de salud y fe cristiana.',
        'Valorar la gastronomía como medio de servicio, emprendimiento y expresión cultural.',
      ]),
      numerada('Ejes fundamentales', [
        ['Alimentación saludable', 'Promueve el conocimiento y la práctica de hábitos nutricionales equilibrados y conscientes.'],
        ['Técnicas culinarias', 'Desarrolla habilidades prácticas en la preparación, presentación y manipulación de alimentos.'],
        ['Industrias alimentarias', 'Introduce procesos básicos de transformación, conservación y envasado de alimentos.'],
        ['Cultura y servicio', 'Valora la gastronomía como una expresión cultural y una herramienta para servir a los demás.'],
        ['Fe y cuidado del cuerpo', 'Fomenta el respeto por el cuerpo como templo de Dios, eligiendo alimentos que promuevan la salud integral.'],
      ]),
      lista_('Metodología', [
        'Aprendemos cocinando: teoría que se transforma en sabor y salud.',
        'Experimentamos, evaluamos y mejoramos cada preparación con propósito.',
        'Enseñamos a servir a través de la comida, con manos que nutren y corazón cristiano.',
        'Integramos ciencia, valores y creatividad en cada receta.',
      ]),
      lista_('Beneficios', [
        'Adquieren habilidades prácticas en cocina y manipulación segura de alimentos.',
        'Desarrollan conciencia sobre una alimentación saludable, responsable y sostenible.',
        'Fomentan el espíritu emprendedor a través de la elaboración de productos alimenticios.',
        'Aplican valores cristianos al servir con amor y cuidar el cuerpo como templo de Dios.',
      ]),
    ],
    galeria,
  },
  robotica: {
    ...proyectosLista.proyectos[1],
    categoriaNombre: 'Tecnología',
    descripcion: [
      'Curso-taller que integra robótica, impresión 3D y computación, donde los estudiantes desarrollan habilidades tecnológicas aplicadas a proyectos con sentido cristiano, fomentando la creatividad, el pensamiento crítico y el servicio a la comunidad.',
    ],
    secciones: [
      lista_('Objetivos', [
        'Desarrollar pensamiento lógico y creativo con tecnología.',
        'Diseñar y fabricar objetos reales con impresión 3D.',
        'Construir y programar robots funcionales.',
        'Impulsar el trabajo en equipo y la innovación.',
      ]),
      numerada('Ejes fundamentales', [
        ['Tecnología creativa', 'Explora herramientas digitales para diseñar, programar y construir soluciones innovadoras.'],
        ['Aprendizaje interdisciplinario', 'Integra conocimientos de computación, electrónica, física y diseño en proyectos aplicados.'],
        ['Innovación y prototipado', 'Fomenta la creación de ideas y su materialización mediante robótica e impresión 3D.'],
        ['Trabajo colaborativo', 'Promueve el desarrollo de proyectos en equipo, fortaleciendo la comunicación y la cooperación.'],
        ['Resolución de problemas', 'Desarrolla habilidades para enfrentar desafíos reales con pensamiento crítico y lógico.'],
      ]),
      lista_('Metodología', [
        'Aprender haciendo: cada clase es un proyecto.',
        'Del diseño digital a la realidad: creamos, probamos y mejoramos.',
        'La tecnología se domina con las manos, la mente y el trabajo en equipo.',
        'Más que teoría: resolvemos problemas reales con soluciones creativas.',
      ]),
      lista_('Beneficios', [
        'Desarrollan pensamiento lógico y creatividad tecnológica.',
        'Aplican su fe al crear soluciones que impactan.',
        'Descubren talentos y posibles vocaciones en ciencia y tecnología.',
        'Aprenden a trabajar en equipo con valores cristianos.',
      ]),
    ],
    galeria,
  },
}
escribir('tipico', 'proyectos', { data: proyectosLista })
for (const [slugP, d] of Object.entries(detalles)) escribir('tipico', `proyecto--${slugP}`, { data: d })

// corto: una categoría, un proyecto, lo mínimo
const cortoP = { id: 'p', slug: 'huerto', titulo: 'Huerto', lema: null, resumen: 'Biohuerto escolar.', categoria: 'c', niveles: [], estado: null, fecha: null, foto: null }
escribir('corto', 'proyectos', { data: { titulo: 'Proyectos', bajada: null, categorias: [{ id: 'c', nombre: 'Ciencia' }], proyectos: [cortoP] } })
escribir('corto', 'proyecto--huerto', { data: { ...cortoP, categoriaNombre: 'Ciencia', descripcion: ['Biohuerto escolar.'], secciones: [], galeria: [] } })

// largo: 8 categorías, 12 proyectos y textos al máximo
const categoriasLargas = ['Tecnología e innovación', 'Alimentación y salud', 'Arte, música y cultura', 'Ciencia y medio ambiente', 'Deporte y recreación', 'Fe y servicio a la comunidad', 'Emprendimiento', 'Lectura y comunicación'].map((nombre, i) => ({ id: `cat-${i + 1}`, nombre }))
const ESTADOS = ['en-curso', 'proximo', 'finalizado', null]
const proyectosLargos = Array.from({ length: 12 }, (_, i) => ({
  id: `p${i + 1}`,
  slug: `proyecto-de-prueba-${i + 1}`,
  titulo: `Proyecto de prueba número ${i + 1} con un título muy largo para comprobar el ajuste en varias líneas`,
  lema: i % 3 === 2 ? null : 'Lema de prueba que ocupa más de una línea en un teléfono para comprobar el ajuste.',
  resumen: textoLargo,
  categoria: categoriasLargas[i % 8].id,
  niveles: i % 4 === 3 ? [] : ['Inicial', 'Primaria', 'Secundaria', 'Talleres de la Sede CATA Oasis'].slice(0, (i % 4) + 1),
  estado: ESTADOS[i % 4],
  fecha: i % 5 === 4 ? null : `2026-0${(i % 9) + 1}-15`,
  foto: i % 3 === 1 ? null : img(i % 2 ? 'proyecto-robotica' : 'proyecto-gastronomia', 'Foto de prueba: proyecto escolar'),
}))
escribir('largo', 'proyectos', { data: { titulo: 'Proyectos y programas institucionales del colegio', bajada: `${textoLargo} ${textoLargo}`, categorias: categoriasLargas, proyectos: proyectosLargos } })
for (const p of proyectosLargos) {
  escribir('largo', `proyecto--${p.slug}`, { data: {
    ...p,
    categoriaNombre: categoriasLargas.find((c) => c.id === p.categoria).nombre,
    descripcion: Array.from({ length: 6 }, () => parrafoLargo),
    secciones: [
      lista_('Sección de prueba con viñetas y un título largo', Array.from({ length: 12 }, () => textoLargo)),
      numerada('Sección numerada de prueba', Array.from({ length: 12 }, (_, j) => [j % 2 ? null : `Eje de prueba ${j + 1} con título largo`, textoLargo])),
      ...Array.from({ length: 6 }, (_, j) => lista_(`Lista de prueba ${j + 1}`, [textoLargo])),
    ],
    galeria: Array.from({ length: 12 }, (_, j) => img(j % 2 ? 'proyecto-galeria-1' : 'proyecto-galeria-2', `Foto de prueba ${j + 1} de la galería`)),
  } })
}

// sin-foto y alt-vacio
escribir('sin-foto', 'proyectos', { data: sinFoto(proyectosLista) })
escribir('alt-vacio', 'proyectos', { data: altVacio(proyectosLista) })
for (const [slugP, d] of Object.entries(detalles)) {
  escribir('sin-foto', `proyecto--${slugP}`, { data: { ...sinFoto(d), galeria: [] } })
  escribir('alt-vacio', `proyecto--${slugP}`, { data: altVacio(d) })
}

// vacio: sin proyectos
escribir('vacio', 'proyectos', { data: { ...proyectosLista, bajada: null, categorias: [], proyectos: [] } })


// ── Nosotros (Institución) ──
// Textos de cata.edu.pe tal cual: new_nosotros, new_resenahistorica, new_emblema, new_himno, new_consejodirectivo y
// new_administracion. Solo se corrigieron signos rotos (comillas, espacios). El organigrama publicado es un diseño de Canva:
// su estructura no se puede leer, así que el árbol es de prueba y lo dice.
const t = (titulo, ...parrafos) => ({ tipo: 'texto', titulo, parrafos, firma: null })
const vinetas = (titulo, items) => ({ tipo: 'lista', titulo, estilo: 'vinetas', items: items.map(([ti, texto]) => ({ titulo: ti, texto, fuente: null })) })
const foto400 = (ruta, alt = '') => ({ url: UP + ruta, alt, ancho: 400, alto: 400 })
const persona = (id, nombre, cargo, ruta) => ({ id, nombre, cargo, foto: ruta ? foto400(ruta) : null })

const paginasNosotros = {
  'mision-y-vision': {
    slug: 'mision-y-vision',
    titulo: 'Misión y Visión',
    bajada: null,
    bloques: [
      { tipo: 'destacado', rotulo: 'Misión', texto: 'Formar ciudadanos íntegros y abnegados para esta vida y la eternidad.' },
      { tipo: 'destacado', rotulo: 'Visión', texto: 'Ser un líder en cada hogar con principios cristianos modelado en experiencias prácticas.' },
      {
        tipo: 'lista',
        titulo: 'Valores institucionales',
        estilo: 'tarjetas',
        items: [
          { titulo: 'Integridad', texto: '«La mayor necesidad del mundo es la de hombres que no se vendan ni se compren; hombres que sean sinceros y honrados en lo más íntimo de sus almas; hombres que no teman dar al pecado el nombre que le corresponde; hombres cuya conciencia sea tan leal al deber como la brújula al Polo; hombres que se mantengan de parte de la justicia, aunque se desplomen los cielos».', fuente: 'La Educación, p. 57' },
          { titulo: 'Abnegación', texto: '«La ley de amor requiere la dedicación del ser entero al servicio de Dios y de nuestros semejantes. Este servicio, a la vez que nos constituye en bendición para los demás, nos proporciona enormes bendiciones. La abnegación es la base de todo verdadero crecimiento. Por medio del servicio abnegado, adquieren su máximo desarrollo todas nuestras facultades. Llegamos a participar cada vez más plenamente de la naturaleza divina. Somos preparados para el cielo, porque lo recibimos en nuestro corazón».', fuente: 'La Educación, cap. 1, p. 16' },
          { titulo: 'Innovación', texto: 'Dios no es solo el Creador sino también un innovador: el Innovador por excelencia. Por definición, innovación es «una idea nueva, pensamientos creativos, nuevas imaginaciones ya sea de dispositivos o métodos». Ser innovador es ser creativo: tener la capacidad de pensar de manera original. Es lo que se necesitó para salvar a la humanidad una vez que caímos en las manos de Satanás.', fuente: null },
        ],
      },
    ],
  },
  'resena-historica': {
    slug: 'resena-historica',
    titulo: 'Reseña Histórica',
    bajada: null,
    bloques: [
      t(null, 'Los inicios del Colegio Adventista Túpac Amaru se remontan a la fundación de la Iglesia Adventista del Séptimo Día (IASD) Villa Hermosa, en la ciudad de Juliaca; la cual se organizó el 13 de mayo de 1967 en el Barrio Túpac Amaru. Las familias, los hermanos y hermanas de esta reciente iglesia se preocuparon por la educación de sus hijos y el avance de la obra adventista, lo que permitió proyectarse a instituir un centro educativo.'),
      {
        tipo: 'hitos',
        titulo: 'Fechas clave',
        items: [
          { fecha: '1911', texto: 'Se inicia la Educación Cristiana Adventista en el país, en la escuela de Utawilaya – Platería, en Puno.' },
          { fecha: '1922', texto: 'La Misión Peruana del Sur compra el fundo Chullunquiani, a casi seis kilómetros de Juliaca. Se funda la Clínica Americana.' },
          { fecha: '1923', texto: 'Entra en operación el Colegio Normal de Chullunquiani.' },
          { fecha: '13 de mayo de 1967', texto: 'Se organiza la IASD Villa Hermosa en el Barrio Túpac Amaru.' },
          { fecha: '1969 – 1970', texto: 'Se gestiona la Escuela Particular Adventista «Túpac Amaru», anexada en sus inicios a la Escuela Particular Adventista Americana.' },
          { fecha: '7 de mayo de 1971', texto: 'La Resolución Directoral Regional N° 457 reconoce el nivel primaria.' },
          { fecha: '25 de marzo de 1982', texto: 'La R.D.Z. N° 104-DZE-J reconoce el nivel secundaria.' },
          { fecha: '3 de diciembre de 1998', texto: 'La R.D. N° 6954-DREP reconoce el nivel inicial.' },
          { fecha: '2000', texto: 'La R.D. N° 4609-DREP-2000 reconoce como promotora a la Asociación Educativa Colegio Adventista Túpac Amaru (AE-CATA).' },
        ],
      },
      t('La educación adventista en el Perú', 'Para comprender esta actitud resuelta de lograr la educación anhelada para los hijos, hay que tener en cuenta la original gesta de la liberación del hombre andino emprendido por Manuel Zúñiga Camacho, quien intentó hacerlo por el camino del conocimiento y la educación, no por la violencia; sin embargo, la oposición de los poderes fácticos de aquel entonces clausuraron la naciente escuela; tal situación le llevó a solicitar ayuda a los líderes de la IASD, quienes prontamente enviaron a los misioneros Fernando y Ana Sthal. Esto permitió continuar la obra educativa en la escuela de Utawilaya – Platería del departamento de Puno; una zona caracterizada por el habla aymara. Posteriormente se suma el misionero argentino Pedro Kalbermatter, quien asume la tarea de llevar el mensaje de la Palabra de Dios a la zona quechua del departamento; acaso estas acciones fueron la primera revolución civil que buscó en el conocimiento y la educación; la liberación del hombre andino, inspirados en el Gran Maestro, que dijo: «y conoceréis la verdad, y la verdad os hará libres» (Juan 8:32). Después de esta breve reseña se concluye que esta es la primera etapa de la Educación Cristiana Adventista en el país incaico, iniciado en 1911.'),
      {
        tipo: 'texto',
        titulo: 'La educación adventista en Juliaca',
        parrafos: [
          'La Ciudad de los Vientos, Juliaca, actualmente denominada como Capital de la Integración Andina, tiene el privilegio de tener una ubicación geográfica estratégica, lo que permitió la expansión y desarrollo del evangelio en esta parte del país. En 1922, la Misión Peruana del Sur, hoy Misión del Lago Titicaca, representado por el misionero E.H. Wilcox, compra el fundo denominado Chullunquiani, ubicado a casi seis kilómetros de la ciudad de Juliaca. Dicha compra tiene el propósito de continuar la formación educativa iniciada en Platería, adicionalmente ampliar una educación superior para la formación de educadores. Hoy en día, este lugar, con mucha satisfacción es conocido como el alma mater de la Educación Cristiana Adventista Peruana.',
          'Desde este lugar se marca la segunda etapa del avance de la obra educativa adventista, aquí alcanza su pleno desarrollo. Para fines del año 1923 se tiene la dicha de tener en operación el Colegio Normal de Chullunquiani, el mismo que después de algunas décadas sería la Filial de la Universidad Peruana Unión, no obstante, existió muchas peripecias y vicisitudes hasta verlo realidad.',
          'A la obra de predicar y enseñar, como lo hacía Jesús, se une la tarea de curar y atender a los enfermos; para entonces, la obra médica adventista ya se había emprendido con los pioneros Ana y Fernando Sthal y Pedro Kalbermater, que más adelante les conllevó a la fundación de la Clínica Americana en 1922. El número de trabajadores de esta institución, tales como médicos, enfermeras, auxiliares y otros, encuentran la necesidad de habilitar un centro educativo adventista para sus hijos. De esta manera se estableció, lo que actualmente se denomina Colegio Particular Adventista Americana, siendo la segunda institución educativa adventista en la ciudad de Juliaca.',
          'La tercera Institución establecida es el Colegio Adventista Túpac Amaru, que tiene sus antecedentes en la iniciativa de los miembros de la IASD Villa Hermosa de la ciudad de Juliaca. En el afán de disponer con una educación adventista para sus hijos y en el fervor de llevar el evangelio de salvación en la región, deciden gestionar la creación de la Escuela Particular Adventista «Túpac Amaru» (1969-1970) anexado en sus inicios a la Escuela Particular Adventista Americana.',
          'Como dice la promesa «Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá» (Mateo 7:7), la IASD Villa Hermosa fue bendecida con la grata noticia de haber sido aceptada su solicitud de prestar servicios educativos de Ciclo Completo del nivel primaria, reconocido por la Resolución Directoral Regional N° 457, del 07 de mayo de 1971; siendo registrado como Director el profesor Ernesto Huaquipaco y teniendo como primeras maestras a las profesoras Lidia Marina Condori y Elvira Limachi Miranda.',
          'A medida que los alumnos avanzaban de grado y la institución gozaba del progreso paulatino en su actividad, se vio en la necesidad de articular con el siguiente nivel educativo como es secundaria, el cual se logró conseguir y ser reconocida por R.D.Z. N° 104-DZE-J, del 25 de marzo de 1982 y posteriormente se incluye el nivel Inicial, reconocida por R.D. N° 6954-DREP del 03 de diciembre de 1998. A fines de la década de los noventa se tuvo dificultades eclesiales y jurídicas, siendo necesaria su reestructuración formal y reorientación administrativa, la misma que fue llevado a cabo con la plena participación de los miembros de la IASD Villa Hermosa entre los años de 1999 y 2000. El consenso pleno de los hermanos hizo que se reconociera como promotora de la Institución a la «Asociación Educativa Colegio Adventista Túpac Amaru» (AE-CATA), conforme a la R.D. N° 4609-DREP-2000. De esta manera el Colegio Adventista Túpac Amaru pasa a ser de la asociación mencionada, representado por el Consejo Directivo y administrado conforme al Estatuto y Reglamento que los rige.',
          'Cada 30 de junio se celebra un año más de vida institucional. Los profesores y estudiantes cataínos son los principales actores de la historia académica del colegio, siendo ellos los que alcanzaron logros y satisfacciones en los diversos concursos y competencias escolares a nivel local, regional, nacional e internacional. En la actualidad se cuenta con un gran equipo docente capacitado y monitoreado por la certificadora de calidad internacional SGCE; asimismo, cuenta con una propia plataforma digital como es iCRM educativo, Docente Mentor Pro, EVA Student, Padre Mentor 3.0, y un convenio de apoyo mutuo celebrado con nuestra casa superior Universidad Peruana Unión; todo para prestar un servicio educativo a la altura de las nuevas demandas que nuestra sociedad requiere.',
          'Actualmente, conforme al Plan Maestro de la AE-CATA, se ha dado inicio a la construcción del Complejo Educativo denominado OASIS DEL MINISTERIO (Cata Oasis) en la localidad de Chilla, donde ya se cuenta con talleres como biohuertos, preparación de alimentos saludables, arte y pintura, música y un futuro espacio de innovación Maker Space. Asimismo, se puso en operación una nueva sede del Nivel primaria denominado SEDE CATA JERUSALÉN (Cacachi), ubicado en la urbanización Jerusalem del Puente Independencia, salida a Huancané.',
        ],
        firma: { nombre: 'Rolando Carcasi Condori (Pablo Roca)', detalle: 'Exprofesor del CATA' },
      },
    ],
  },
  emblema: {
    slug: 'emblema',
    titulo: 'Emblema',
    bajada: 'Logotipo del Colegio Adventista Túpac Amaru',
    bloques: [
      t(null, 'El logotipo que caracteriza a la institución fue creado con la participación de los profesores: Ricardo Mamani Flores, Sócrates Quispe Maquera, Basilio Chambi Quispe, Rufino Condori Mendoza (QEPD) y otros. Con la única finalidad de identificar al Colegio Adventista «Túpac Amaru» en los desfiles cívicos y otras actividades.'),
      vinetas('Originalmente fue diseñada de la siguiente forma', [['La A', 'Significa Adventista.'], ['La T', 'Significa Túpac.'], ['Nuevamente la A', 'Significa Amaru.']]),
      { tipo: 'imagen', imagen: { url: UP + '2023/09/Logo-adventista-1-1-fotor-bg-remover-20230918114531.png', alt: 'Logotipo original: las letras A, T y A entrelazadas, en trazo azul.', ancho: 500, alto: 483 }, pie: 'Logotipo original', transcripcion: null },
      t(null, 'Posteriormente se hizo algunas mejoras incluyendo el nombre completo de la Institución: Colegio Adventista «Túpac Amaru», además el lugar donde está ubicado que es Juliaca.'),
      { tipo: 'imagen', imagen: { url: UP + '2023/09/Logo_CATA--226x300.png', alt: 'Logotipo con el nombre completo: «Colegio Adventista "Túpac Amaru"», Juliaca. Sobre un globo azul con las letras ATA, unas manos abiertas sostienen la Biblia abierta y una llama.', ancho: 226, alto: 300 }, pie: 'Logotipo con el nombre completo de la institución', transcripcion: null },
      t('Símbolos de la Institución', 'Se tiene un conjunto de símbolos plasmados en el logotipo de la institución que son: las manos abiertas, la Biblia abierta, la llama encendida y los laureles.'),
      {
        tipo: 'lista',
        titulo: null,
        estilo: 'tarjetas',
        items: [
          { titulo: 'Manos abiertas', texto: 'Simboliza que cada docente, personal administrativo, personal de apoyo y estudiante de la Institución, siempre estará dispuesto a extender la mano a los que más los necesitan bajo las recomendaciones de las sagradas escrituras.', fuente: null },
          { titulo: 'Biblia abierta', texto: 'Simboliza la enseñanza bajo la cosmovisión cristiana basada en la Biblia.', fuente: null },
          { titulo: 'Llama de fuego', texto: 'Simboliza que cada docente, personal administrativo, personal de apoyo y estudiante de la Institución debe mantener la llama encendida del Espíritu Santo que da luz en la oscuridad.', fuente: null },
          { titulo: 'Laureles', texto: 'Simboliza la riqueza minera peruana y la abundancia de recursos naturales existentes en el país.', fuente: null },
        ],
      },
      t('Color de la Institución', 'El color principal de la institución es el color Azul Claro, y este color representa la excelencia que se refleja en los cielos de color azul. Este color nos impulsa la mejora continua que se soporta en el sistema de gestión de la calidad.'),
      { tipo: 'imagen', imagen: { url: UP + '2023/09/Logo-cata.png', alt: 'Emblema actual: el logotipo del colegio rodeado de laureles dorados, con la palabra CATA debajo.', ancho: 341, alto: 360 }, pie: 'Emblema actual', transcripcion: null },
    ],
  },
  himno: {
    slug: 'himno',
    titulo: 'Himno',
    bajada: 'Himno al CATA',
    bloques: [
      t(
        null,
        'Con el propósito de promover identidad en la comunidad educativa, se ha creado el himno oficial del Colegio Adventista «Túpac Amaru».',
        'Inicialmente se ha convocado a concurso de las letras con las directivas precisas de que debe contener y resaltar los valores, principios y el propósito por el cual fue creada esta institución el de redimir.',
        'El ganador de dicho concurso fue el profesor: Ricardo Apaza Paucar (QEPD), claro está en sus inicios se tuvo que hacer algunas mejoras como son la rima y otros aspectos propios de la poesía.',
        'Posteriormente en 1987, se convoca a concurso para la música del himno al CATA y en esa oportunidad el ganador de dicho concurso fue el profesor Basilio Chambi Quispe, un docente que estuvo desde los inicios cuando se ha creado el nivel secundario (1982) y como testimonio se tiene el oficio que se hace referencia de los resultados de dicho concurso mencionándose que la composición que más se adapta a los criterios establecidos es la presentada por B.CH.Q y la partitura original con sus dos estrofas quien actualmente vibra de emoción al escuchar cantar acompañada de la banda sinfónica de la institución este himno cuyas letras dicen así:',
      ),
      {
        tipo: 'letra',
        titulo: 'Himno al CATA',
        partes: [
          { titulo: 'Coro', versos: ['Entonemos canto de alegría', 'cataínos de esperanza', 'A Túpac Amaru templo del saber', 'Faro de la juventud y cristiandad'] },
          { titulo: 'I', versos: ['Por los siglos y siglos enhiesta', 'Impartiendo la ciencia y virtud', 'Los aymaras y quechuas te forjaron', 'Para ser un fanal del saber', 'Practicando la unión fraternal', 'Con Cristo en el corazón', 'Anunciando el evangelio', 'Y redimiendo hasta el fin'] },
          { titulo: 'II', versos: ['Alma mater bendito venimos,', 'Con amor esperanza y fe', 'De salir de tus aulas triunfantes', 'Preparados al fin para bien', 'En mi pecho llevo tus colores', 'Como la cumbre de Huayna roque', 'Adelante vamos CATA', 'Eficientes en la labor.'] },
        ],
      },
      t(
        'Significado',
        'Este himno en el coro evoca identidad, pone de manifiesto que la institución es un templo del saber comparándola con un faro que alumbra en este mundo de tinieblas y cuyo objetivo es impartir conocimientos y valores y por esta razón se debe entonar con alegría.',
        'La primera estrofa hace mención que los que forjaron la institución fueron humildes hombres y mujeres de habla aymara y quechua con el único propósito de que el evangelio sea predicado en esta parte del Perú, de esta manera cumplir con el lema de «Educar es redimir».',
        'La segunda estrofa evoca que de las aulas del CATA los estudiantes saldrán a la vida con ganas de triunfar llevando en el corazón los colores azulino, celeste y blanco que identifican a la institución.',
        'Este himno ha sido instrumentado para que una banda sinfónica interprete, claro está con el permiso y autorización del autor de la música que hoy por hoy sigue apoyando a la institución.',
        'Cada vez que se entona este himno en las ceremonias internas los corazones de los cataínos laten más fuerte porque se ha convertido en un emblema de la institución.',
        'Hoy se canta con emoción y júbilo, y las veces que se celebran los aniversarios, tanto estudiantes y exalumnos vibran de emoción y cantan con entusiasmo este himno que identifica a todo cataíno.',
      ),
      {
        tipo: 'imagen',
        imagen: { url: UP + '2023/09/himno.png', alt: 'Partitura original del Himno Oficial al Colegio Adventista «Túpac Amaru», escrita a máquina, con el coro y las estrofas.', ancho: 576, alto: 867 },
        pie: 'Partitura original del himno',
        transcripcion: [
          'Himno oficial al Colegio Adventista «Túpac Amaru».',
          'Coro: Entonemos canto de alegría al Colegio sacrosanto. A Túpac Amaru, templo del saber, faro de la juventud y cristiandad.',
          'Estrofas: Por los siglos y siglos enhiesta, impartiendo la ciencia y virtud; los aymaras y quechuas te forjaron para ser un fanal del saber. Practicando la unión fraternal con Cristo en el corazón, anunciando el Evangelio y redimiendo hasta el fin.',
          'Alma mater bendito venimos, con amor, esperanza y fe, de salir de tus aulas triunfantes preparados al fin para bien. En mi pecho llevo tus colores como la cumbre de Huayna Roque; adelante vamos, C.A.T.A., eficientes en la labor.',
          'Autor de la letra: Prof. Ricardo Apaza Paucar. Autor de la música: Prof. Basilio Chambi Quispe.',
        ],
      },
      {
        tipo: 'imagen',
        imagen: { url: UP + '2023/09/lema.png', alt: 'Oficio escrito a máquina, del 18 de julio de 1987, con la opinión del jurado del concurso de música del himno.', ancho: 546, alto: 867 },
        pie: 'Oficio del jurado del concurso de música (1987)',
        transcripcion: [
          'Juliaca, 18 de julio de 1987.',
          'Señor Prof. Ricardo Mamani Flores, Director del Colegio Particular Adventista «Túpac Amaru». Ciudad.',
          'Asunto: Nominación de Jurado. Ref.: Su Oficio Nro. 036-87/DCATAJ.',
          'En atención a su Oficio de la referencia, en primer término, debo agradecerle el honor de que fui objeto con esta nominación.',
          'En segundo lugar quiero suplicarle que me disculpe usted la inasistencia al evento de tanta trascendencia, organizado con tan noble propósito.',
          'Sin embargo, si es que fuera valedera mi opinión, con respecto a los trabajos presentados por los dignos concursantes, le hago saber lo siguiente:',
          'A mi juicio, la composición que más se adapta a los criterios que me indica usted en su oficio de la referencia, es la composición presentada por B.CH.Q, claro está que ustedes podrían darle el tiempo necesario para que, luego de esta fecha, corrija algunos pasajes (que son muy pocos) y, así se consiga una estructura que permita su cabal interpretación; me estoy refiriendo a los elementos constantes como el ritmo, la métrica y el tiempo; y, también para que permita la combinación sonora de voces e instrumentos, cuando se cante el Himno al Colegio con el marco musical de su Banda de Música, orquesta, etc.',
          'En cuanto a las otras composiciones, no declaro que haya un segundo, tercero o cuarto lugar; pues, todas me merecen los elogios del caso por su esfuerzo; quizá en algunos casos no lo hayan escrito tal cual correspondía a su inspiración y en algunos que se haya abusado muy seguidamente de un fragmento, etc. etc.',
          'En cuanto a la composición de D.T.CH., no opino puesto que no tiene la letra aprobada por ustedes, según afirma en otro concurso realizado anteriormente.',
          'Es todo cuanto tengo que opinar sobre las composiciones y mi participación como jurado.',
          'Aprovecho de la ocasión para testimoniarles los sentimientos de consideración distinguida.',
          'Atentamente, Fernando Montes Granados, L.E. 02381073.',
          'Incl./ Las 5 copias de las composiciones presentadas.',
        ],
      },
      { tipo: 'destacado', rotulo: 'Lema de la institución', texto: 'Servir con fe y sabiduría' },
      t(null, 'El lema del Colegio Adventista «Túpac Amaru» ha sido establecida con la finalidad de grabar en la mente y en los corazones de los estudiantes, docentes, padres de familia y con ese propósito cabe indicar que:'),
      vinetas(null, [
        ['Servir', 'Significa que el trabajo que se haga siendo estudiantes como docentes debe ser de servicio. Y servir se hace con humildad tal como Jesús nos enseña en su palabra.'],
        ['Con fe', 'Los conocimientos que se adquieran, los valores que se impartan en esta institución deben realizarse con la confianza en Dios, fe y esperanza de que las metas que se tracen se puedan alcanzar con éxito.'],
        ['Y sabiduría', 'Salomón pidió sabiduría de Dios y el mensaje que se quiere plasmar en la mente de los estudiantes es que todas las cosas se hagan diferenciando lo que es el bien y lo que es el mal, actuando y trabajando con prudencia.'],
      ]),
    ],
  },
  'consejo-directivo': {
    slug: 'consejo-directivo',
    titulo: 'Consejo Directivo',
    bajada: null,
    bloques: [
      {
        tipo: 'mensaje',
        titulo: 'Querida comunidad CATA:',
        parrafos: [
          'Es un honor dirigirme a ustedes como Presidente del Consejo Directivo de esta Institución donde educar es formar para la vida… y para la eternidad. En el Colegio Adventista CATA, nos diferencia una misión clara: formar ciudadanos íntegros y abnegados con principios cristianos, listos para impactar en su entorno y también prepararlos para la graduación celestial.',
          'Aquí no solo desarrollamos habilidades y conocimientos, educamos el carácter, guiados por principios y valores cristianos. Cada clase y proyecto es una oportunidad para modelar líderes con un propósito de vida, que sean luz en sus hogares y reflejo del amor de Dios en el mundo.',
          'A nuestros estudiantes: ¡están llamados a brillar con fe y propósito!',
          'A los padres: gracias por confiar en nuestra propuesta de valor que se refleja en nuestra misión educativa con sentido eterno.',
          'Y a los docentes: ustedes son los que siembren la semilla cuyos frutos se reflejan en las experiencias de liderazgo y que trascienden en el tiempo.',
          'En CATA, preparamos para esta vida… y para la vida eterna.',
        ],
        firma: { nombre: 'Alfredo Chambi Quispe', detalle: 'Presidente del Consejo Directivo' },
        foto: foto400('2025/11/29.png'),
      },
      {
        tipo: 'personas',
        titulo: 'Integrantes',
        personas: [
          persona('chambi', 'Alfredo Chambi Quispe', 'Presidente', '2025/11/29.png'),
          persona('canazaca', 'Leonidas Cañazaca Vargas', 'Vicepresidente', '2025/11/23.png'),
          persona('mamani-flores', 'Fanny Mariela Mamani Flores', 'Secretaria', '2025/11/24.png'),
          persona('sonco', 'Flor Dina Sonco Paricanaza', 'Tesorera', '2025/11/26.png'),
          persona('cuela', 'Leoncio Cuela Mamani', 'Vocal', '2025/11/27.png'),
          persona('huanca', 'Carlos Huanca Mamani', 'Vocal', '2025/11/30.png'),
          persona('puma', 'Ruben Puma Corimanya', 'Pastor', '2025/11/25.png'),
          persona('sumi', 'Roger Sumi Huaman', 'Anciano consejero', '2025/11/28.png'),
        ],
      },
    ],
  },
  administracion: {
    slug: 'administracion',
    titulo: 'Administración',
    bajada: null,
    bloques: [
      {
        tipo: 'personas',
        titulo: null,
        personas: [
          persona('lanza', 'Fredy Lanza Umiña', 'Director general', '2024/08/1v.png'),
          persona('apaza-sosa', 'Dino Apaza Sosa', 'Administrador', '2024/08/2.png'),
          persona('alca', 'Karen Alca Apaza', 'Contador(a)', '2024/08/3.png'),
          persona('cotrina', 'José Cotrina Alvarado', 'Capellanía', '2024/08/4.png'),
          persona('mamani-tarqui-e', 'Elias Mamani Tarqui', 'Psicología', '2024/08/5.png'),
          persona('aliaga', 'Elisa Aliaga Salcedo', 'Director académico general', '2024/08/6.png'),
          persona('coa', 'Kelia Coa Mamani', 'Director académico inicial y primaria', '2024/08/7.png'),
          persona('apaza-apaza', 'Edwin Apaza Apaza', 'Director académico secundaria', '2024/08/8.png'),
          persona('huahuacondori', 'Ademer Huahuacondori Aranda', 'Director académico Jerusalén', '2024/08/9.png'),
          persona('mamani-tarqui-m', 'Mary Mamani Tarqui', 'Caja', '2024/08/10.png'),
          persona('condori', 'Luz Condori Quispe', 'Secretaria general', '2024/08/11.png'),
          persona('mamani-valera', 'Griselda Mamani Valera', 'Auxiliar de contabilidad', '2024/08/12.png'),
          persona('incahuanaco', 'Ismael Incahuanaco Mamani', 'TIC', '2024/08/13.png'),
          persona('mamani-apaza', 'Guillermo Mamani Apaza', 'Director de gestión de calidad', '2024/09/FT-GM.png'),
          persona('casildo', 'Yaritza Casildo Chanducas', 'Asistente de operaciones', '2024/08/15.png'),
        ],
      },
    ],
  },
  organigrama: {
    slug: 'organigrama',
    titulo: 'Organigrama',
    bajada: 'La estructura de la institución.',
    bloques: [
      t('Datos de prueba', 'Esta estructura es de prueba: se armó solo con los cargos que el colegio publica en Consejo Directivo y Administración, para mostrar cómo se verá el organigrama. El organigrama oficial está publicado como un diseño en Canva, que no se puede leer como texto; el colegio debe enviar su estructura.'),
      {
        tipo: 'organigrama',
        titulo: 'Estructura de prueba',
        imagen: null,
        enlace: { etiqueta: 'Ver el organigrama publicado en Canva', url: 'https://www.canva.com/design/DAGgVOmdYZE/H-06nqgjCBDwERaxRbq_gw/view', externo: true },
        raiz: {
          cargo: 'Consejo Directivo',
          detalle: 'Asociación Educativa Colegio Adventista Túpac Amaru',
          hijos: [
            {
              cargo: 'Dirección General',
              detalle: null,
              hijos: [
                { cargo: 'Administración', detalle: null, hijos: [{ cargo: 'Contabilidad', detalle: null, hijos: [] }, { cargo: 'Caja', detalle: null, hijos: [] }, { cargo: 'TIC', detalle: null, hijos: [] }, { cargo: 'Operaciones', detalle: null, hijos: [] }] },
                { cargo: 'Dirección Académica General', detalle: null, hijos: [{ cargo: 'Dirección Académica de Inicial y Primaria', detalle: null, hijos: [] }, { cargo: 'Dirección Académica de Secundaria', detalle: null, hijos: [] }, { cargo: 'Dirección Académica Jerusalén', detalle: null, hijos: [] }] },
                { cargo: 'Secretaría General', detalle: null, hijos: [] },
                { cargo: 'Gestión de Calidad', detalle: null, hijos: [] },
                { cargo: 'Capellanía', detalle: null, hijos: [] },
                { cargo: 'Psicología', detalle: null, hijos: [] },
              ],
            },
          ],
        },
      },
    ],
  },
}
const SLUGS_INSTITUCION = Object.keys(paginasNosotros)
const nosotrosIndice = {
  titulo: 'Nosotros',
  bajada: 'Formar ciudadanos íntegros y abnegados para esta vida y la eternidad.',
  paginas: [
    { slug: 'mision-y-vision', resumen: 'Formar ciudadanos íntegros y abnegados para esta vida y la eternidad.' },
    { slug: 'resena-historica', resumen: 'Desde la IASD Villa Hermosa, organizada en 1967 en el Barrio Túpac Amaru.' },
    { slug: 'emblema', resumen: 'Las manos abiertas, la Biblia abierta, la llama encendida y los laureles.' },
    { slug: 'himno', resumen: '«Entonemos canto de alegría, cataínos de esperanza».' },
    { slug: 'consejo-directivo', resumen: 'Representa a la Asociación Educativa Colegio Adventista Túpac Amaru.' },
    { slug: 'administracion', resumen: 'Dirección general, administración, direcciones académicas y áreas de apoyo.' },
    { slug: 'organigrama', resumen: 'La estructura de la institución.' },
  ],
}
escribir('tipico', 'nosotros', { data: nosotrosIndice })
for (const [slugN, d] of Object.entries(paginasNosotros)) escribir('tipico', `nosotros-pagina--${slugN}`, { data: d })

// Audio de prueba: un tono de 2 segundos, para comprobar el reproductor (el colegio no publica el audio del himno)
{
  const hz = 8000
  const n = hz * 2
  const wav = Buffer.alloc(44 + n)
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + n, 4); wav.write('WAVE', 8); wav.write('fmt ', 12)
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(hz, 24)
  wav.writeUInt32LE(hz, 28); wav.writeUInt16LE(1, 32); wav.writeUInt16LE(8, 34); wav.write('data', 36); wav.writeUInt32LE(n, 40)
  for (let i = 0; i < n; i++) wav[44 + i] = 128 + Math.round(40 * Math.sin((2 * Math.PI * 440 * i) / hz) * Math.min(1, (n - i) / 800))
  fs.writeFileSync(path.join(dirImg, 'himno-prueba.wav'), wav)
}

// corto
escribir('corto', 'nosotros', { data: { titulo: 'Nosotros', bajada: null, paginas: [] } })
escribir('corto', 'nosotros-pagina--mision-y-vision', { data: { slug: 'mision-y-vision', titulo: 'Misión', bajada: null, bloques: [{ tipo: 'destacado', rotulo: 'Misión', texto: 'Educar.' }] } })
escribir('corto', 'nosotros-pagina--consejo-directivo', { data: { slug: 'consejo-directivo', titulo: 'Consejo', bajada: null, bloques: [{ tipo: 'personas', titulo: null, personas: [persona('a', 'Ana', 'Vocal', null)] }] } })

// largo: todos los tipos de bloque, al máximo
const himnoLargo = {
  ...paginasNosotros.himno,
  titulo: 'Himno oficial del Colegio Adventista Túpac Amaru de la ciudad de Juliaca',
  bajada: textoLargo,
  bloques: [
    { tipo: 'audio', titulo: 'Escucha el himno (audio de prueba)', url: MEDIOS + 'himno-prueba.wav', formato: 'audio/wav', descripcion: 'Audio de prueba: un tono de dos segundos para comprobar el reproductor. El colegio no ha publicado una grabación del himno.' },
    ...paginasNosotros.himno.bloques,
    { tipo: 'enlaces', titulo: 'Documentos de prueba', enlaces: [
      { etiqueta: 'Partitura completa del himno para banda sinfónica, con todas las voces e instrumentos', url: 'https://cata.edu.pe/', descripcion: textoLargo, formato: 'pdf' },
      { etiqueta: 'Presentación', url: 'https://www.canva.com/', descripcion: null, formato: 'presentacion' },
      { etiqueta: 'Hoja de cálculo de prueba', url: 'https://docs.google.com/', descripcion: null, formato: 'hoja' },
      { etiqueta: 'Documento de prueba', url: 'https://docs.google.com/', descripcion: null, formato: 'documento' },
      { etiqueta: 'Página web', url: 'https://cata.edu.pe/', descripcion: null, formato: 'web' },
    ] },
  ],
}
escribir('largo', 'nosotros', { data: { ...nosotrosIndice, titulo: 'Nosotros: conoce la institución, su gestión y sus documentos', bajada: textoLargo, paginas: nosotrosIndice.paginas.map((p) => ({ ...p, resumen: textoLargo })) } })
escribir('largo', 'nosotros-pagina--himno', { data: himnoLargo })
escribir('largo', 'nosotros-pagina--administracion', { data: { ...paginasNosotros.administracion, bloques: [{ tipo: 'personas', titulo: 'Personal administrativo y de apoyo de todas las sedes del colegio', personas: Array.from({ length: 40 }, (_, i) => persona(`p${i}`, 'Nombre de prueba muy largo Apellido Paterno Apellido Materno', 'Cargo de prueba con un nombre largo: Dirección Académica de Inicial y Primaria de la Sede Central', i % 3 ? '2024/08/2.png' : null)) }] } })
const nodoLargo = (n) => ({ cargo: `Cargo de prueba de nivel ${n} con un nombre largo que ocupa varias líneas`, detalle: n % 2 ? 'Nombre de prueba Apellido Apellido' : null, hijos: n < 5 ? Array.from({ length: n === 1 ? 1 : 3 }, () => nodoLargo(n + 1)) : [] })
escribir('largo', 'nosotros-pagina--organigrama', { data: { ...paginasNosotros.organigrama, bloques: [{ tipo: 'organigrama', titulo: 'Organigrama de prueba con cinco niveles', imagen: img('panoramica', 'Organigrama de prueba en imagen; la misma estructura está en la lista que sigue.'), enlace: { etiqueta: 'Ver el organigrama completo', url: 'https://cata.edu.pe/', externo: true }, raiz: nodoLargo(1) }] } })

// sin-foto: sin fotos de personas ni imágenes
const sinImagenes = (p) => ({ ...p, bloques: p.bloques.filter((b) => b.tipo !== 'imagen').map((b) => (b.tipo === 'personas' ? { ...b, personas: b.personas.map((x) => ({ ...x, foto: null })) } : b.tipo === 'mensaje' ? { ...b, foto: null } : b)) })
for (const slugN of ['emblema', 'himno', 'consejo-directivo', 'administracion']) escribir('sin-foto', `nosotros-pagina--${slugN}`, { data: sinImagenes(paginasNosotros[slugN]) })

// alt-vacio
for (const slugN of ['emblema', 'himno', 'consejo-directivo', 'administracion']) escribir('alt-vacio', `nosotros-pagina--${slugN}`, { data: altVacio(paginasNosotros[slugN]) })

// vacio: páginas sin bloques
escribir('vacio', 'nosotros', { data: { ...nosotrosIndice, bajada: null, paginas: [] } })
for (const slugN of SLUGS_INSTITUCION) escribir('vacio', `nosotros-pagina--${slugN}`, { data: { ...paginasNosotros[slugN], bajada: null, bloques: [] } })

console.log('ok')
