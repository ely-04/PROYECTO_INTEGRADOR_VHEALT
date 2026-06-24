import React, { useState, useEffect } from 'react';
import plantasService from '../services/plantasService';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingParticles from '../components/FloatingParticles';

const Enfermedades = () => {
  const [selectedEnfermedad, setSelectedEnfermedad] = useState(null);
  const [enfermedades, setEnfermedades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [plantasPorEnfermedad, setPlantasPorEnfermedad] = useState({});
  const [carouselIndex, setCarouselIndex] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEnfermedad, setModalEnfermedad] = useState(null);

  // Cargar enfermedades y categorías al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar enfermedades y categorías en paralelo
      const [enfermedadesData, categoriasData] = await Promise.all([
        plantasService.getAllEnfermedades(),
        plantasService.getCategoriasEnfermedad()
      ]);
      
      setEnfermedades(enfermedadesData);
      
      // Agregar opción "Todas" al inicio
      setCategorias([
        { id_categoria: 'todas', nombre: 'Todas' },
        ...categoriasData
      ]);
      
    } catch (err) {
      setError('Error al cargar la información: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar plantas cuando se expande una enfermedad
  const handleExpandEnfermedad = async (enfermedadId) => {
    // Si ya está expandida, colapsarla
    if (selectedEnfermedad === enfermedadId) {
      setSelectedEnfermedad(null);
      return;
    }

    setSelectedEnfermedad(enfermedadId);
  };

  // Abrir modal con plantas
  const handleOpenModal = async (enfermedad) => {
    setModalEnfermedad(enfermedad);
    setModalOpen(true);
    setCarouselIndex(prev => ({ ...prev, [enfermedad.id_enfermedad]: 0 }));
    
    // Si ya tenemos las plantas cargadas, no volver a cargarlas
    if (plantasPorEnfermedad[enfermedad.id_enfermedad]) {
      return;
    }

    try {
      const plantas = await plantasService.getEnfermedadPlantas(enfermedad.id_enfermedad);
      setPlantasPorEnfermedad(prev => ({
        ...prev,
        [enfermedad.id_enfermedad]: plantas
      }));
    } catch (err) {
      console.error('Error cargando plantas:', err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalEnfermedad(null);
  };

  const nextPlanta = (enfermedadId, totalPlantas) => {
    setCarouselIndex(prev => ({
      ...prev,
      [enfermedadId]: ((prev[enfermedadId] || 0) + 1) % totalPlantas
    }));
  };

  const prevPlanta = (enfermedadId, totalPlantas) => {
    setCarouselIndex(prev => ({
      ...prev,
      [enfermedadId]: ((prev[enfermedadId] || 0) - 1 + totalPlantas) % totalPlantas
    }));
  };

  const enfermedadesFiltradas = filtroCategoria === 'todas' 
    ? enfermedades 
    : enfermedades.filter(e => e.id_categoria === parseInt(filtroCategoria));

  // Convertir síntomas de texto a array
  const getSintomasArray = (sintomas) => {
    if (!sintomas) return [];
    return sintomas.split(',').map(s => s.trim()).filter(s => s);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c4a484] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando enfermedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const enfermedadesHardcoded = [
    {
      id: 1,
      nombre: 'Dolor de Cabeza',
      categoria: 'neurologica',
      descripcion: 'Dolor localizado en la cabeza o cuello, puede ser tensional o migrañoso.',
      sintomas: ['Dolor pulsante', 'Sensibilidad a la luz', 'Náuseas', 'Tensión muscular'],
      plantasRecomendadas: [
        {
          nombre: 'Menta',
          uso: 'Aplicar aceite esencial diluido en las sienes',
          preparacion: 'Masaje suave con 2-3 gotas mezcladas con aceite portador'
        },
        {
          nombre: 'Lavanda',
          uso: 'Aromaterapia o infusión relajante',
          preparacion: 'Inhalar vapor o beber té de lavanda'
        },
        {
          nombre: 'Sauce Blanco',
          uso: 'Infusión analgésica natural',
          preparacion: '1 cucharadita de corteza en agua caliente por 10 minutos'
        }
      ],
      prevencion: ['Mantener horarios regulares de sueño', 'Evitar estrés excesivo', 'Hidratación adecuada'],
      cuandoConsultar: 'Si el dolor es severo, recurrente o acompañado de fiebre alta.'
    },
    {
      id: 2,
      nombre: 'Resfriado Común',
      categoria: 'respiratoria',
      descripcion: 'Infección viral del tracto respiratorio superior.',
      sintomas: ['Congestión nasal', 'Estornudos', 'Dolor de garganta', 'Tos leve'],
      plantasRecomendadas: [
        {
          nombre: 'Equinácea',
          uso: 'Fortalecer el sistema inmunológico',
          preparacion: 'Tintura o cápsulas según indicaciones del producto'
        },
        {
          nombre: 'Jengibre',
          uso: 'Reducir inflamación y aliviar síntomas',
          preparacion: 'Té con jengibre fresco, miel y limón'
        },
        {
          nombre: 'Eucalipto',
          uso: 'Descongestionar vías respiratorias',
          preparacion: 'Vaporizaciones con hojas o aceite esencial'
        }
      ],
      prevencion: ['Lavado frecuente de manos', 'Evitar contacto con personas enfermas', 'Mantener sistema inmune fuerte'],
      cuandoConsultar: 'Si los síntomas persisten más de 10 días o hay fiebre alta.'
    },
    {
      id: 3,
      nombre: 'Indigestión',
      categoria: 'digestiva',
      descripcion: 'Malestar estomacal después de comer, también conocido como dispepsia.',
      sintomas: ['Dolor estomacal', 'Sensación de llenura', 'Acidez', 'Náuseas'],
      plantasRecomendadas: [
        {
          nombre: 'Manzanilla',
          uso: 'Calmar el estómago y reducir inflamación',
          preparacion: 'Infusión después de las comidas'
        },
        {
          nombre: 'Menta',
          uso: 'Aliviar espasmos digestivos',
          preparacion: 'Té de menta fresca o seca'
        },
        {
          nombre: 'Hinojo',
          uso: 'Reducir gases y mejorar digestión',
          preparacion: 'Masticar semillas o preparar infusión'
        }
      ],
      prevencion: ['Comer despacio', 'Evitar comidas muy grasas', 'No acostarse inmediatamente después de comer'],
      cuandoConsultar: 'Si hay dolor severo, vómitos persistentes o pérdida de peso.'
    },
    {
      id: 4,
      nombre: 'Insomnio',
      categoria: 'neurologica',
      descripcion: 'Dificultad para conciliar o mantener el sueño.',
      sintomas: ['Dificultad para dormir', 'Despertares frecuentes', 'Cansancio diurno', 'Irritabilidad'],
      plantasRecomendadas: [
        {
          nombre: 'Valeriana',
          uso: 'Inductor natural del sueño',
          preparacion: 'Infusión 30 minutos antes de dormir'
        },
        {
          nombre: 'Pasiflora',
          uso: 'Reducir ansiedad y promover relajación',
          preparacion: 'Té o tintura antes de acostarse'
        },
        {
          nombre: 'Manzanilla',
          uso: 'Efecto calmante y relajante',
          preparacion: 'Infusión tibia antes de dormir'
        }
      ],
      prevencion: ['Mantener horarios regulares', 'Evitar cafeína por la tarde', 'Crear ambiente relajante'],
      cuandoConsultar: 'Si el insomnio persiste más de 2 semanas o afecta significativamente la vida diaria.'
    },
    {
      id: 5,
      nombre: 'Ansiedad Leve',
      categoria: 'neurologica',
      descripcion: 'Estado de inquietud, nerviosismo o preocupación.',
      sintomas: ['Nerviosismo', 'Palpitaciones', 'Sudoración', 'Tensión muscular'],
      plantasRecomendadas: [
        {
          nombre: 'Tilo',
          uso: 'Efecto tranquilizante natural',
          preparacion: 'Infusión de flores 2-3 veces al día'
        },
        {
          nombre: 'Melisa',
          uso: 'Calmar nervios y reducir estrés',
          preparacion: 'Té de hojas frescas o secas'
        },
        {
          nombre: 'Lavanda',
          uso: 'Aromaterapia relajante',
          preparacion: 'Difusor, baños aromáticos o almohadas de lavanda'
        }
      ],
      prevencion: ['Técnicas de respiración', 'Ejercicio regular', 'Meditación o mindfulness'],
      cuandoConsultar: 'Si la ansiedad es severa, persistente o interfiere con las actividades diarias.'
    }
  ];

  return (
    <div className="bg-white min-h-screen relative">
      {/* Partículas flotantes de fondo */}
      <FloatingParticles count={15} type="flower" showLeaves={true} />
      
      <header className="pt-12 pb-4 text-center relative z-10">
        <h1 className="text-5xl font-serif text-[#c4a484] mb-2">Guía de Enfermedades</h1>
        <p className="text-lg text-gray-500">Tratamientos naturales para dolencias comunes</p>
      </header>
      
      <div className="flex max-w-7xl mx-auto px-4 gap-8">
        {/* Sidebar de filtrado */}
        <aside className="w-64 bg-[#f5f2ed] rounded-xl p-6 h-fit shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Filtrar por categoría</h3>
          <div className="flex flex-col gap-2">
            {categorias.map(cat => (
              <button
                key={cat.id_categoria}
                className={`text-left px-4 py-2 rounded-lg border transition-colors font-medium ${
                  filtroCategoria === cat.id_categoria || filtroCategoria === cat.id_categoria?.toString()
                    ? 'bg-[#c4a484] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#e7e2d9]'
                }`}
                onClick={() => setFiltroCategoria(cat.id_categoria?.toString() || 'todas')}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </aside>

        {/* Galería de enfermedades */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enfermedadesFiltradas.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron enfermedades</p>
            </div>
          ) : (
            enfermedadesFiltradas.map((enfermedad, index) => {
              const sintomas = getSintomasArray(enfermedad.sintomas);
              const plantas = plantasPorEnfermedad[enfermedad.id_enfermedad] || [];
              
              return (
                <motion.div
                  key={enfermedad.id_enfermedad}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-[#f5f2ed] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-serif text-[#c4a484] font-bold mb-1">{enfermedad.nombre}</h3>
                      <p className="italic text-gray-500 text-sm line-clamp-2">
                        {enfermedad.descripcion}
                      </p>
                    </div>
                    
                    {sintomas.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm">Síntomas principales:</h4>
                        <div className="flex flex-wrap gap-2">
                          {sintomas.slice(0, 2).map((sintoma, index) => (
                            <span key={index} className="bg-[#c4a484] text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              {sintoma}
                            </span>
                          ))}
                          {sintomas.length > 2 && (
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                              +{sintomas.length - 2} más
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Botón para ver plantas */}
                    <button
                      onClick={() => handleOpenModal(enfermedad)}
                      className="mt-4 w-full bg-[#c4a484] text-white px-4 py-3 rounded-lg hover:bg-[#b49474] transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                      </svg>
                      Ver Plantas Recomendadas
                      <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">
                        {plantasPorEnfermedad[enfermedad.id_enfermedad]?.length || '...'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </section>
      </div>

      {/* Modal para mostrar plantas */}
      <AnimatePresence>
        {modalOpen && modalEnfermedad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-[#e8d5e0] via-[#dfe7f2] to-[#d5e8e0] p-6 sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-[#5a4a6a]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {modalEnfermedad.nombre}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {modalEnfermedad.descripcion}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="flex-shrink-0 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 ml-4 text-[#7a6a8a] shadow-sm"
                >
                  ×
                </button>
              </div>
              
              {plantasPorEnfermedad[modalEnfermedad.id_enfermedad] && (
                <div className="mt-4 flex items-center gap-2 bg-white/70 rounded-lg px-4 py-2 backdrop-blur shadow-sm">
                  <svg className="w-5 h-5 text-[#6a8a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="font-semibold text-[#6a8a6a]">
                    {plantasPorEnfermedad[modalEnfermedad.id_enfermedad].length} plantas recomendadas
                  </span>
                </div>
              )}
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] pb-20">
              {!plantasPorEnfermedad[modalEnfermedad.id_enfermedad] ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#c4a484] mb-4"></div>
                  <p className="text-gray-500 text-lg">Cargando plantas medicinales...</p>
                </div>
              ) : plantasPorEnfermedad[modalEnfermedad.id_enfermedad].length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500 text-lg">No hay plantas recomendadas para esta enfermedad</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Carrusel en el Modal */}
                  <div className="overflow-hidden rounded-xl">
                    <div 
                      className="transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${(carouselIndex[modalEnfermedad.id_enfermedad] || 0) * 100}%)`
                      }}
                    >
                      <div className="flex">
                        {plantasPorEnfermedad[modalEnfermedad.id_enfermedad].map((planta, index) => (
                          <div 
                            key={index} 
                            className="min-w-full px-2"
                          >
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200">
                              {/* Header de la planta */}
                              <div className="flex items-center gap-4 mb-6">
                                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#d5e8d5] to-[#b8d5c8] rounded-full flex items-center justify-center shadow-xl">
                                  <svg className="w-10 h-10 text-[#5a7a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-2xl font-bold text-[#2d5a27] mb-1">
                                    {planta.nombre_comun}
                                  </h3>
                                  {planta.nombre_cientifico && (
                                    <p className="text-gray-500 italic text-base">{planta.nombre_cientifico}</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Descripción */}
                              {planta.descripcion && (
                                <div className="mb-6">
                                  <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Descripción
                                  </h4>
                                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <p className="text-gray-700 text-base leading-relaxed">
                                      {planta.descripcion}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Precauciones */}
                              {planta.precauciones && (
                                <div>
                                  <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-lg">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Precauciones importantes
                                  </h4>
                                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
                                    <p className="text-red-800 text-base leading-relaxed">
                                      {planta.precauciones}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Controles del carrusel */}
                  {plantasPorEnfermedad[modalEnfermedad.id_enfermedad].length > 1 && (
                    <>
                      {/* Botones de navegación */}
                      <button
                        onClick={() => prevPlanta(modalEnfermedad.id_enfermedad, plantasPorEnfermedad[modalEnfermedad.id_enfermedad].length)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gradient-to-r from-[#b8d5e8] to-[#c8d5e8] hover:from-[#a8c5d8] hover:to-[#b8c5d8] text-[#5a6a7a] w-12 h-12 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center font-bold text-2xl z-10"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => nextPlanta(modalEnfermedad.id_enfermedad, plantasPorEnfermedad[modalEnfermedad.id_enfermedad].length)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gradient-to-r from-[#b8d5e8] to-[#c8d5e8] hover:from-[#a8c5d8] hover:to-[#b8c5d8] text-[#5a6a7a] w-12 h-12 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center font-bold text-2xl z-10"
                      >
                        ›
                      </button>
                      
                      {/* Indicadores de posición */}
                      <div className="flex justify-center items-center gap-3 mt-8 mb-4 pb-4">
                        {plantasPorEnfermedad[modalEnfermedad.id_enfermedad].map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCarouselIndex(prev => ({ ...prev, [modalEnfermedad.id_enfermedad]: index }))}
                            className={`transition-all duration-300 rounded-full border-2 flex-shrink-0 ${
                              (carouselIndex[modalEnfermedad.id_enfermedad] || 0) === index
                                ? 'w-12 h-4 bg-gradient-to-r from-[#d5a8c8] to-[#b8c5e8] border-[#b8c5e8] shadow-md'
                                : 'w-4 h-4 bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm'
                            }`}
                            aria-label={`Ir a planta ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      {/* Contador */}
                      <div className="text-center pb-4">
                        <span className="text-base font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-full inline-block">
                          Planta {(carouselIndex[modalEnfermedad.id_enfermedad] || 0) + 1} de {plantasPorEnfermedad[modalEnfermedad.id_enfermedad].length}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-[#f5f0f8] to-[#f0f5f8] sticky bottom-0">
              <button
                onClick={handleCloseModal}
                className="w-full bg-gradient-to-r from-[#a8b8d8] to-[#b8c8d8] text-white px-6 py-3 rounded-lg hover:from-[#98a8c8] hover:to-[#a8b8c8] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Enfermedades;