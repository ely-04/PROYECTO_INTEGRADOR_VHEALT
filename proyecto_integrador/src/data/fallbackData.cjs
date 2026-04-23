const categoria_plantas = [
  { id_categoria: 1, nombre_categoria: 'Digestivas' },
  { id_categoria: 2, nombre_categoria: 'Relajantes' },
  { id_categoria: 3, nombre_categoria: 'Respiratorias' },
  { id_categoria: 4, nombre_categoria: 'Piel y cicatrización' },
  { id_categoria: 5, nombre_categoria: 'Antiinflamatorias' },
  { id_categoria: 6, nombre_categoria: 'Diuréticas/depurativas' },
];

const categorias_enfermedades = [
  { id_categoria: 1, nombre: 'Respiratorias' },
  { id_categoria: 2, nombre: 'Digestivas' },
  { id_categoria: 3, nombre: 'Neurológicas' },
];

// Dataset “fallback” amplio (para funcionar sin MySQL).
// Nota: estos IDs y campos imitan el shape de la BD para no romper el frontend.
const plantas = [
  {
    id_planta: 1,
    nombre_comun: 'Manzanilla',
    nombre_cientifico: 'Matricaria chamomilla',
    descripcion: 'Planta con propiedades calmantes y digestivas, usada comúnmente en infusiones.',
    precauciones: 'Evitar en caso de alergia a Asteraceae.',
    id_categoria: 1,
    imagen_url: null,
  },
  {
    id_planta: 2,
    nombre_comun: 'Jengibre',
    nombre_cientifico: 'Zingiber officinale',
    descripcion: 'Raíz utilizada para náuseas y como antiinflamatorio natural.',
    precauciones: 'Consultar si se toman anticoagulantes.',
    id_categoria: 5,
    imagen_url: null,
  },
  {
    id_planta: 3,
    nombre_comun: 'Aloe Vera',
    nombre_cientifico: 'Aloe barbadensis',
    descripcion: 'Gel usado para quemaduras leves e hidratación de la piel.',
    precauciones: 'No consumir internamente sin supervisión médica.',
    id_categoria: 4,
    imagen_url: null,
  },
  {
    id_planta: 4,
    nombre_comun: 'Eucalipto',
    nombre_cientifico: 'Eucalyptus globulus',
    descripcion: 'Usado para aliviar congestión y como expectorante en vaporizaciones.',
    precauciones: 'Evitar en niños pequeños y no ingerir aceite esencial.',
    id_categoria: 3,
    imagen_url: null,
  },
  {
    id_planta: 5,
    nombre_comun: 'Lavanda',
    nombre_cientifico: 'Lavandula angustifolia',
    descripcion: 'Planta aromática relajante, útil para estrés e insomnio leve.',
    precauciones: 'Puede causar somnolencia.',
    id_categoria: 2,
    imagen_url: null,
  },
  {
    id_planta: 6,
    nombre_comun: 'Árnica',
    nombre_cientifico: 'Arnica montana',
    descripcion: 'Uso tópico en golpes y molestias musculares.',
    precauciones: 'No aplicar en heridas abiertas.',
    id_categoria: 5,
    imagen_url: null,
  },
  {
    id_planta: 7,
    nombre_comun: 'Carrecillo',
    nombre_cientifico: 'Rhipsalis baccifera',
    descripcion: 'Tradicionalmente usada como depurativa y diurética.',
    precauciones: 'Consultar en caso de enfermedad renal.',
    id_categoria: 6,
    imagen_url: null,
  },
  {
    id_planta: 8,
    nombre_comun: 'Cedrón',
    nombre_cientifico: 'Aloysia citriodora',
    descripcion: 'Ayuda a la digestión y puede aportar efecto relajante.',
    precauciones: 'Evitar en embarazo y lactancia.',
    id_categoria: 2,
    imagen_url: null,
  },
  {
    id_planta: 9,
    nombre_comun: 'Laurel',
    nombre_cientifico: 'Laurus nobilis',
    descripcion: 'Usado en infusión suave para malestar digestivo.',
    precauciones: 'No consumir en exceso.',
    id_categoria: 1,
    imagen_url: null,
  },
  {
    id_planta: 10,
    nombre_comun: 'Limón',
    nombre_cientifico: 'Citrus limon',
    descripcion: 'Fuente de vitamina C, usado tradicionalmente en resfriados.',
    precauciones: 'Puede irritar estómago sensible.',
    id_categoria: 3,
    imagen_url: null,
  },
  {
    id_planta: 11,
    nombre_comun: 'Níspero',
    nombre_cientifico: 'Eriobotrya japonica',
    descripcion: 'Uso tradicional en infusión de hojas.',
    precauciones: 'Consultar si hay tratamiento para glucosa.',
    id_categoria: 6,
    imagen_url: null,
  },
  {
    id_planta: 12,
    nombre_comun: 'Orégano',
    nombre_cientifico: 'Origanum vulgare',
    descripcion: 'Uso tradicional en molestias respiratorias y digestivas.',
    precauciones: 'Evitar dosis altas en embarazo.',
    id_categoria: 3,
    imagen_url: null,
  },
  {
    id_planta: 13,
    nombre_comun: 'Pingüica',
    nombre_cientifico: 'Arctostaphylos pungens',
    descripcion: 'Uso tradicional como diurética.',
    precauciones: 'Beber agua suficiente durante su uso.',
    id_categoria: 6,
    imagen_url: null,
  },
  {
    id_planta: 14,
    nombre_comun: 'Santa María',
    nombre_cientifico: 'Tanacetum parthenium',
    descripcion: 'Uso tradicional en dolor de cabeza/migraña.',
    precauciones: 'Evitar en embarazo.',
    id_categoria: 2,
    imagen_url: null,
  },
  {
    id_planta: 15,
    nombre_comun: 'Sosa',
    nombre_cientifico: 'Solanum americanum',
    descripcion: 'Uso tradicional tópico en problemas de piel.',
    precauciones: 'Solo uso externo.',
    id_categoria: 4,
    imagen_url: null,
  },
  {
    id_planta: 16,
    nombre_comun: 'Tepozán',
    nombre_cientifico: 'Buddleja cordata',
    descripcion: 'Uso tradicional en lavados/uso externo por sus propiedades.',
    precauciones: 'Preferentemente uso externo.',
    id_categoria: 4,
    imagen_url: null,
  },
  // Plantas extra usadas en el mapeo de imágenes del frontend
  { id_planta: 17, nombre_comun: 'Albahaca', nombre_cientifico: 'Ocimum basilicum', descripcion: 'Uso tradicional digestivo.', precauciones: '', id_categoria: 1, imagen_url: null },
  { id_planta: 18, nombre_comun: 'Barba de elote', nombre_cientifico: 'Zea mays (estigmas)', descripcion: 'Uso tradicional diurético.', precauciones: '', id_categoria: 6, imagen_url: null },
  { id_planta: 19, nombre_comun: 'Bugambilia', nombre_cientifico: 'Bougainvillea spp.', descripcion: 'Uso tradicional respiratorio.', precauciones: '', id_categoria: 3, imagen_url: null },
  { id_planta: 20, nombre_comun: 'Diente de león', nombre_cientifico: 'Taraxacum officinale', descripcion: 'Uso tradicional depurativo.', precauciones: '', id_categoria: 6, imagen_url: null },
  { id_planta: 21, nombre_comun: 'Epazote', nombre_cientifico: 'Dysphania ambrosioides', descripcion: 'Uso tradicional digestivo.', precauciones: 'Evitar dosis altas.', id_categoria: 1, imagen_url: null },
  { id_planta: 22, nombre_comun: 'Hierba del sapo', nombre_cientifico: 'Eryngium heterophyllum', descripcion: 'Uso tradicional.', precauciones: '', id_categoria: 6, imagen_url: null },
  { id_planta: 23, nombre_comun: 'Hierbabuena', nombre_cientifico: 'Mentha spicata', descripcion: 'Uso tradicional digestivo.', precauciones: '', id_categoria: 1, imagen_url: null },
  { id_planta: 24, nombre_comun: 'Hinojo', nombre_cientifico: 'Foeniculum vulgare', descripcion: 'Uso tradicional para gases/digestión.', precauciones: '', id_categoria: 1, imagen_url: null },
  { id_planta: 25, nombre_comun: 'Lentejilla', nombre_cientifico: 'Lens culinaris', descripcion: 'Uso tradicional.', precauciones: '', id_categoria: 6, imagen_url: null },
  { id_planta: 26, nombre_comun: 'Menta', nombre_cientifico: 'Mentha × piperita', descripcion: 'Uso tradicional en digestión y dolor de cabeza.', precauciones: '', id_categoria: 1, imagen_url: null },
  { id_planta: 27, nombre_comun: 'Ortiga', nombre_cientifico: 'Urtica dioica', descripcion: 'Uso tradicional depurativo.', precauciones: '', id_categoria: 6, imagen_url: null },
  { id_planta: 28, nombre_comun: 'Romero', nombre_cientifico: 'Salvia rosmarinus', descripcion: 'Uso tradicional.', precauciones: '', id_categoria: 5, imagen_url: null },
  { id_planta: 29, nombre_comun: 'Ruda', nombre_cientifico: 'Ruta graveolens', descripcion: 'Uso tradicional.', precauciones: 'Evitar en embarazo.', id_categoria: 2, imagen_url: null },
  { id_planta: 30, nombre_comun: 'Sábila', nombre_cientifico: 'Aloe barbadensis', descripcion: 'Sinónimo de Aloe Vera.', precauciones: '', id_categoria: 4, imagen_url: null },
  { id_planta: 31, nombre_comun: 'Tomillo', nombre_cientifico: 'Thymus vulgaris', descripcion: 'Uso tradicional respiratorio.', precauciones: '', id_categoria: 3, imagen_url: null },
  { id_planta: 32, nombre_comun: 'Vaporub', nombre_cientifico: '', descripcion: 'Elemento de referencia del frontend.', precauciones: '', id_categoria: 3, imagen_url: null },
];

const enfermedades = [
  {
    id_enfermedad: 1,
    nombre: 'Dolor de Cabeza',
    descripcion: 'Dolor localizado en la cabeza o cuello, puede ser tensional o migrañoso.',
    sintomas: 'Dolor pulsante, sensibilidad a la luz, náuseas, tensión muscular',
    id_categoria: 3,
  },
  {
    id_enfermedad: 2,
    nombre: 'Resfriado Común',
    descripcion: 'Infección viral del tracto respiratorio superior.',
    sintomas: 'Congestión nasal, estornudos, dolor de garganta, tos leve',
    id_categoria: 1,
  },
  {
    id_enfermedad: 3,
    nombre: 'Indigestión',
    descripcion: 'Malestar estomacal después de comer, también conocido como dispepsia.',
    sintomas: 'Dolor estomacal, sensación de llenura, acidez, náuseas',
    id_categoria: 2,
  },
  {
    id_enfermedad: 4,
    nombre: 'Insomnio',
    descripcion: 'Dificultad para conciliar o mantener el sueño.',
    sintomas: 'Dificultad para dormir, despertares frecuentes, cansancio diurno',
    id_categoria: 3,
  },
  {
    id_enfermedad: 5,
    nombre: 'Ansiedad Leve',
    descripcion: 'Estado de inquietud, nerviosismo o preocupación.',
    sintomas: 'Nerviosismo, palpitaciones, sudoración, tensión muscular',
    id_categoria: 3,
  },
];

const planta_enfermedad = [
  // Dolor de cabeza
  { id_planta: 26, id_enfermedad: 1 }, // Menta
  { id_planta: 5, id_enfermedad: 1 }, // Lavanda
  { id_planta: 14, id_enfermedad: 1 }, // Santa María
  // Resfriado
  { id_planta: 2, id_enfermedad: 2 }, // Jengibre
  { id_planta: 4, id_enfermedad: 2 }, // Eucalipto
  { id_planta: 31, id_enfermedad: 2 }, // Tomillo
  { id_planta: 19, id_enfermedad: 2 }, // Bugambilia
  // Indigestión
  { id_planta: 1, id_enfermedad: 3 }, // Manzanilla
  { id_planta: 26, id_enfermedad: 3 }, // Menta
  { id_planta: 24, id_enfermedad: 3 }, // Hinojo
  { id_planta: 23, id_enfermedad: 3 }, // Hierbabuena
  // Insomnio / Ansiedad
  { id_planta: 5, id_enfermedad: 4 }, // Lavanda
  { id_planta: 1, id_enfermedad: 4 }, // Manzanilla
  { id_planta: 8, id_enfermedad: 5 }, // Cedrón
  { id_planta: 5, id_enfermedad: 5 }, // Lavanda
];

const usos_principales = [
  { id_planta: 1, parte: 'Flores', preparacion: 'Infusión: 1 cucharada por taza, 5-10 min.' },
  { id_planta: 2, parte: 'Raíz', preparacion: 'Té: hervir rodajas 10 min.' },
  { id_planta: 4, parte: 'Hojas', preparacion: 'Vaporizaciones: hojas en agua caliente.' },
  { id_planta: 5, parte: 'Flores', preparacion: 'Infusión o aromaterapia con difusor.' },
  { id_planta: 26, parte: 'Hojas', preparacion: 'Infusión: 1 cucharadita por taza, 5-7 min.' },
  { id_planta: 24, parte: 'Semillas', preparacion: 'Infusión: 1 cucharadita por taza, 5-10 min.' },
];

module.exports = {
  plantas,
  enfermedades,
  categoria_plantas,
  categorias_enfermedades,
  planta_enfermedad,
  usos_principales,
};

