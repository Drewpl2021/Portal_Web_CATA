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
// El año, las fechas y las vacantes NO están publicados: el año y las fechas son de prueba y las vacantes dicen «consultar».
const cabeceraMatricula = {
  titulo: 'Proceso de matrícula',
  bajada: 'Requisitos, documentos y pasos para matricular a tu hijo o hija en inicial, primaria o secundaria.',
  anio: 2027,
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
    { id: 'f1', titulo: 'Solicitud de vacantes para estudiantes nuevos', inicio: '2026-11-02', fin: '2026-12-18', detalle: 'Con el FUT, en la caja de la institución.' },
    { id: 'f2', titulo: 'Matrícula de estudiantes regulares', inicio: '2026-12-01', fin: '2026-12-23', detalle: null },
    { id: 'f3', titulo: 'Matrícula de estudiantes nuevos', inicio: '2027-01-04', fin: '2027-02-26', detalle: 'Con la constancia de vacante y los documentos completos.' },
    { id: 'f4', titulo: 'Inicio de clases', inicio: '2027-03-01', fin: null, detalle: null },
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
  mensajeWhatsapp: 'Hola, soy {nombre}. Quisiera información sobre la matrícula para {grado}.',
}
escribir('tipico', 'matricula-cabecera', { data: cabeceraMatricula })
escribir('tipico', 'matricula-procesos', { data: procesos })
escribir('tipico', 'matricula-vacantes', { data: vacantes })
escribir('tipico', 'matricula-fechas', { data: fechasMatricula })
escribir('tipico', 'matricula-preguntas', { data: preguntas })
escribir('tipico', 'matricula-solicitud', { data: solicitud })

escribir('corto', 'matricula-cabecera', { data: { titulo: 'Matrícula', bajada: null, anio: null, figura: null } })
escribir('corto', 'matricula-procesos', { data: [{ id: 'n', nombre: 'Nuevos', resumen: null, listas: [{ titulo: 'Requisitos', items: ['DNI.'] }], pasos: [{ titulo: 'Firma', detalle: null }] }] })
escribir('corto', 'matricula-vacantes', { data: { actualizado: null, nota: null, niveles: [{ id: 'i', nivel: 'Inicial', detalle: null, estado: 'disponible', vacantes: 12 }] } })
escribir('corto', 'matricula-fechas', { data: { nota: null, items: [{ id: 'f', titulo: 'Matrícula', inicio: '2027-01-04', fin: null, detalle: null }] } })
escribir('corto', 'matricula-preguntas', { data: [{ id: 'p', pregunta: '¿Edad?', respuesta: 'Cumplida al 31 de marzo.' }] })
escribir('corto', 'matricula-solicitud', { data: { titulo: 'Informes', texto: null, mensajeWhatsapp: 'Hola, soy {nombre}. Me interesa {grado}.' } })

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
escribir('largo', 'matricula-solicitud', { data: { titulo: 'Solicitar información sobre el proceso de matrícula y admisión', texto: textoLargo, mensajeWhatsapp: 'Hola, mi nombre es {nombre}. Quisiera recibir información completa sobre el proceso de matrícula, los requisitos, las fechas y las vacantes para {grado}. Muchas gracias.' } })

escribir('sin-foto', 'matricula-cabecera', { data: { ...cabeceraMatricula, figura: null } })
escribir('alt-vacio', 'matricula-cabecera', { data: altVacio(cabeceraMatricula) })

escribir('vacio', 'matricula-cabecera', { data: { ...cabeceraMatricula, bajada: null, anio: null, figura: null } })
escribir('vacio', 'matricula-procesos', { data: [] })
escribir('vacio', 'matricula-vacantes', { data: { actualizado: null, nota: null, niveles: [] } })
escribir('vacio', 'matricula-fechas', { data: { nota: null, items: [] } })
escribir('vacio', 'matricula-preguntas', { data: [] })
escribir('vacio', 'matricula-solicitud', { data: { ...solicitud, texto: null } })

console.log('ok')
