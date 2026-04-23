import React, { useState, useEffect } from 'react';
import plantasService from '../services/plantasService';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingParticles from '../components/FloatingParticles';

// Importar imágenes de plantas
import manzanillaImg from '../assets/manzanilla.jpg';
import jengibreImg from '../assets/jengibre.jpg';
import aloeImg from '../assets/aloe.jpg';
import eucaliptoImg from '../assets/eucalipto.jpg';
import lavandaImg from '../assets/lavanda.jpg';
import arnicaImg from '../assets/arnica.jpg';
import carrecilloImg from '../assets/carrecillo.jpg';
import cedronImg from '../assets/cedron.jpg';
import laurelImg from '../assets/laurel.jpg';
import limonImg from '../assets/limon.jpg';
import nisperoImg from '../assets/nispero.jpg';
import oreganoImg from '../assets/oregano.jpg';
import pinguicaImg from '../assets/pinguica.jpg';
import santamariaImg from '../assets/santamaria.jpg';
import sosaImg from '../assets/sosa.jpg';
import tepozanImg from '../assets/tepozan.jpg';
import albahacaImg from '../assets/albahaca.jpg';
import barbaEloteImg from '../assets/barba_de_elote.jpg';
import bugambiliaImg from '../assets/bugambilia.jpg';
import dienteLeonImg from '../assets/diente_de_leon.jpg';
import epazoteImg from '../assets/epazote.jpg';
import hierbaSapoImg from '../assets/Hierba_del_sapo2.jpg';
import hierbabuenaImg from '../assets/hierbabuena.jpg';
import hinojoImg from '../assets/hinojo.jpg';
import lentejillaImg from '../assets/lentejilla.jpg';
import mentaImg from '../assets/menta.jpg';
import ortigaImg from '../assets/ortiga.jpg';
import romeroImg from '../assets/romero.jpg';
import rudaImg from '../assets/ruda.jpg';
import savilaImg from '../assets/Savila.jpg';
import tomilloImg from '../assets/tomillo.jpg';
import vaporubImg from '../assets/vaporub.jpg';

// Mapeo de nombres de plantas a imágenes
const plantasImagenes = {
  'manzanilla': manzanillaImg,
  'jengibre': jengibreImg,
  'aloe': aloeImg,
  'aloe vera': aloeImg,
  'sábila': savilaImg,
  'sabila': savilaImg,
  'savila': savilaImg,
  'sávila': savilaImg,
  'eucalipto': eucaliptoImg,
  'lavanda': lavandaImg,
  'árnica': arnicaImg,
  'arnica': arnicaImg,
  'carrecillo': carrecilloImg,
  'cedrón': cedronImg,
  'cedron': cedronImg,
  'laurel': laurelImg,
  'limón': limonImg,
  'limon': limonImg,
  'níspero': nisperoImg,
  'nispero': nisperoImg,
  'orégano': oreganoImg,
  'oregano': oreganoImg,
  'pingüica': pinguicaImg,
  'pinguica': pinguicaImg,
  'santa maría': santamariaImg,
  'santa maria': santamariaImg,
  'santamaria': santamariaImg,
  'sosa': sosaImg,
  'tepozán': tepozanImg,
  'tepozan': tepozanImg,
  'albahaca': albahacaImg,
  'barba de elote': barbaEloteImg,
  'barba elote': barbaEloteImg,
  'barbadeelote': barbaEloteImg,
  'barba_de_elote': barbaEloteImg,
  'barba-de-elote': barbaEloteImg,
  'estigmas de maíz': barbaEloteImg,
  'estigmas de maiz': barbaEloteImg,
  'estigmas': barbaEloteImg,
  'bugambilia': bugambiliaImg,
  'buganvilia': bugambiliaImg,
  'diente de león': dienteLeonImg,
  'diente de leon': dienteLeonImg,
  'diente_de_leon': dienteLeonImg,
  'epazote': epazoteImg,
  'hierba del sapo': hierbaSapoImg,
  'hierba_del_sapo': hierbaSapoImg,
  'hierbadelsapo': hierbaSapoImg,
  'hierbabuena': hierbabuenaImg,
  'hierba buena': hierbabuenaImg,
  'hinojo': hinojoImg,
  'lentejilla': lentejillaImg,
  'menta': mentaImg,
  'ortiga': ortigaImg,
  'romero': romeroImg,
  'ruda': rudaImg,
  'tomillo': tomilloImg,
  'vaporub': vaporubImg,
  'vapor rub': vaporubImg
};

const PlantasMedicinales = () => {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [plantas, setPlantas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPlanta, setExpandedPlanta] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlanta, setModalPlanta] = useState(null);

  const handleExpandPlanta = (plantaId) => {
    setExpandedPlanta(expandedPlanta === plantaId ? null : plantaId);
  };

  const handleOpenModal = async (planta) => {
    setModalOpen(true);
    setModalPlanta({ ...planta, loading: true });
    
    try {
      // Obtener información completa de la planta incluyendo usos
      const plantaCompleta = await plantasService.getPlantaCompleta(planta.id_planta);
      setModalPlanta(plantaCompleta);
    } catch (error) {
      console.error('Error al cargar información completa:', error);
      setModalPlanta(planta);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalPlanta(null);
  };

  // Cargar plantas y categorías al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar plantas y categorías en paralelo
      const [plantasData, categoriasData] = await Promise.all([
        plantasService.getAllPlantas(),
        plantasService.getCategoriasPlanta()
      ]);
      
      setPlantas(plantasData);
      
      // Agregar opción "Todas" al inicio
      setCategorias([
        { id_categoria: 'todas', nombre_categoria: 'Todas las plantas' },
        ...categoriasData
      ]);
      
    } catch (err) {
      setError('Error al cargar las plantas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const plantasFiltradas = selectedCategory === 'todas' 
    ? plantas 
    : plantas.filter(planta => planta.id_categoria === parseInt(selectedCategory));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c4a484] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando plantas medicinales...</p>
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

  return (
    <div className="bg-white min-h-screen relative">
      {/* Partículas flotantes de fondo */}
      <FloatingParticles count={18} type="leaf" showLeaves={true} />
      
      <header className="pt-12 pb-4 text-center relative z-10">
        <h1 className="text-5xl font-serif text-[#c4a484] mb-2">Plantas Medicinales</h1>
        <p className="text-lg text-gray-500">Descubre el poder curativo de la naturaleza</p>
      </header>
      
      <div className="flex max-w-7xl mx-auto px-4 gap-8">
        {/* Sidebar de filtrado */}
        <aside className="w-64 bg-[#f5f2ed] rounded-xl p-6 h-fit shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Filtrar por categoría</h3>
          <div className="flex flex-col gap-2">
            {categorias.map(categoria => (
              <button
                key={categoria.id_categoria}
                className={`text-left px-4 py-2 rounded-lg border transition-colors font-medium ${
                  selectedCategory === categoria.id_categoria || selectedCategory === categoria.id_categoria?.toString()
                    ? 'bg-[#c4a484] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#e7e2d9]'
                }`}
                onClick={() => setSelectedCategory(categoria.id_categoria?.toString() || 'todas')}
              >
                {categoria.nombre_categoria}
              </button>
            ))}
          </div>
        </aside>
        
        {/* Galería de plantas */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plantasFiltradas.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron plantas</p>
            </div>
          ) : (
            plantasFiltradas.map((planta, index) => (
              <motion.div
                key={planta.id_planta}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                whileHover={{ scale: 1.03, y: -8 }}
                className="bg-[#f5f2ed] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Imagen de la planta */}
                <div className="h-56 w-full bg-gradient-to-br from-[#e7e2d9] to-[#f5f2ed] flex items-center justify-center relative overflow-hidden">
                  {(() => {
                    // Normalizar nombre de la planta para búsqueda
                    const nombreKey = planta.nombre_comun.toLowerCase()
                      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
                      .trim();
                    
                    // Buscar con el nombre exacto primero
                    let imagen = plantasImagenes[nombreKey];
                    
                    // Si no encuentra, intentar con variaciones comunes
                    if (!imagen) {
                      // Intentar con guiones bajos en lugar de espacios
                      imagen = plantasImagenes[nombreKey.replace(/\s+/g, '_')];
                    }
                    if (!imagen) {
                      // Intentar sin espacios
                      imagen = plantasImagenes[nombreKey.replace(/\s+/g, '')];
                    }
                    if (!imagen) {
                      // Intentar con guiones
                      imagen = plantasImagenes[nombreKey.replace(/\s+/g, '-')];
                    }
                    
                    if (imagen) {
                      return (
                        <img 
                          src={imagen}
                          alt={planta.nombre_comun}
                          className="w-full h-full object-cover"
                        />
                      );
                    } else if (planta.imagen_url) {
                      return (
                        <img 
                          src={planta.imagen_url.startsWith('http') ? planta.imagen_url : `http://localhost:3000${planta.imagen_url}`}
                          alt={planta.nombre_comun}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#c4a484] to-[#2d5a27]"><span class="text-7xl text-white">🌿</span></div>';
                          }}
                        />
                      );
                    } else {
                      return (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#c4a484] to-[#2d5a27]">
                          <span className="text-7xl text-white animate-pulse">🌿</span>
                        </div>
                      );
                    }
                  })()}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif text-[#c4a484] font-bold mb-1">{planta.nombre_comun}</h3>
                      <p className="italic text-gray-500 text-sm">{planta.nombre_cientifico}</p>
                    </div>
                  </div>
                  
                  {planta.descripcion && (
                    <div className="mb-3 flex-grow">
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{planta.descripcion}</p>
                    </div>
                  )}
                  
                  {/* Botón para ver detalles */}
                  <button
                    onClick={() => handleOpenModal(planta)}
                    className="mt-4 w-full bg-[#c4a484] text-white px-4 py-3 rounded-lg hover:bg-[#b49474] transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ver Detalles
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </section>
      </div>

      {/* Modal para mostrar detalles de la planta */}
      <AnimatePresence>
        {modalOpen && modalPlanta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-[#e8d5e0] via-[#dfe7f2] to-[#d5e8e0] p-6 sticky top-0 z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-[#5a4a6a]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {modalPlanta.nombre_comun}
                  </h2>
                  {modalPlanta.nombre_cientifico && (
                    <p className="text-gray-600 text-sm italic">{modalPlanta.nombre_cientifico}</p>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="flex-shrink-0 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 ml-4 text-[#7a6a8a] shadow-sm"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] pb-20">
              <div className="space-y-6">
                {/* Descripción */}
                {modalPlanta.descripcion && (
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Descripción
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-700 text-base leading-relaxed">
                        {modalPlanta.descripcion}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Usos Principales */}
                {modalPlanta.usos && modalPlanta.usos.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Usos Principales
                    </h4>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                      <div className="space-y-3">
                        {modalPlanta.usos.map((uso, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="text-gray-800 font-medium mb-1">{uso.parte}</p>
                                <p className="text-gray-600 text-sm">{uso.preparacion}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Precauciones */}
                {modalPlanta.precauciones && (
                  <div>
                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Precauciones importantes
                    </h4>
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg p-4 shadow-sm">
                      <p className="text-red-800 text-base leading-relaxed">
                        {modalPlanta.precauciones}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mantener bloque visual (PDF/Firmas eliminados) */}
                <div className="bg-gradient-to-r from-[#f5f0f8] to-[#f0f5f8] rounded-lg p-4">
                  <div className="w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gray-300 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Descarga deshabilitada
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Módulos de PDF y firma digital eliminados.
                  </p>
                </div>
              </div>
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

export default PlantasMedicinales;