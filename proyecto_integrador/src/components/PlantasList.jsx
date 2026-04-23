import { useState, useEffect } from 'react';
import plantasService from '../services/plantasService';

/**
 * Componente de ejemplo para mostrar el listado de plantas medicinales
 * desde la base de datos MySQL
 */
function PlantasList() {
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar todas las plantas al montar el componente
  useEffect(() => {
    loadPlantas();
  }, []);

  const loadPlantas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await plantasService.getAllPlantas();
      setPlantas(data);
    } catch (err) {
      setError('Error al cargar las plantas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadPlantas();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await plantasService.searchPlantas(searchTerm);
      setPlantas(data);
    } catch (err) {
      setError('Error al buscar plantas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const plantaCompleta = await plantasService.getPlantaCompleta(id);
      console.log('Información completa de la planta:', plantaCompleta);
      // Aquí puedes mostrar un modal o navegar a una página de detalle
      alert(`Planta: ${plantaCompleta.nombre_comun}\n\nEnfermedades que trata: ${plantaCompleta.enfermedades.length}\nPropiedades: ${plantaCompleta.propiedades.length}`);
    } catch (err) {
      alert('Error al cargar los detalles: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando plantas medicinales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Plantas Medicinales
      </h1>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar plantas por nombre común o científico..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Buscar
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                loadPlantas();
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Contador de resultados */}
      <p className="text-gray-600 mb-4">
        {plantas.length} planta{plantas.length !== 1 ? 's' : ''} encontrada{plantas.length !== 1 ? 's' : ''}
      </p>

      {/* Lista de plantas */}
      {plantas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron plantas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plantas.map((planta) => (
            <div
              key={planta.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                {planta.nombre_comun}
              </h3>
              
              {planta.nombre_cientifico && (
                <p className="text-sm italic text-gray-600 mb-3">
                  {planta.nombre_cientifico}
                </p>
              )}
              
              {planta.descripcion && (
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {planta.descripcion}
                </p>
              )}
              
              {planta.familia && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Familia:</span> {planta.familia}
                </p>
              )}
              
              <button
                onClick={() => handleViewDetails(planta.id)}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantasList;
