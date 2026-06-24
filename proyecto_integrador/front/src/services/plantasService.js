import { apiUrl } from '../config/api.js';

// Servicio para interactuar con la API de plantas medicinales

class PlantasService {
  // ==================== PLANTAS ====================
  
  /**
   * Obtener todas las plantas
   */
  async getAllPlantas() {
    try {
      const response = await fetch(apiUrl('/api/plantas'));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las plantas');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getAllPlantas:', error);
      throw error;
    }
  }
  
  /**
   * Obtener una planta por ID
   */
  async getPlantaById(id) {
    try {
      const response = await fetch(apiUrl(`/api/plantas/${id}`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener la planta');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getPlantaById:', error);
      throw error;
    }
  }
  
  /**
   * Buscar plantas por término
   */
  async searchPlantas(termino) {
    try {
      const response = await fetch(apiUrl(`/api/plantas/buscar/${encodeURIComponent(termino)}`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al buscar plantas');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en searchPlantas:', error);
      throw error;
    }
  }
  
  /**
   * Obtener información completa de una planta (con todas sus relaciones)
   */
  async getPlantaCompleta(id) {
    try {
      const response = await fetch(apiUrl(`/api/plantas/${id}/completa`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener la información completa');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getPlantaCompleta:', error);
      throw error;
    }
  }
  
  /**
   * Obtener propiedades de una planta
   */
  async getPlantaPropiedades(id) {
    try {
      const response = await fetch(apiUrl(`/api/plantas/${id}/propiedades`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las propiedades');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getPlantaPropiedades:', error);
      throw error;
    }
  }
  
  /**
   * Obtener enfermedades que trata una planta
   */
  async getPlantaEnfermedades(id) {
    try {
      const response = await fetch(apiUrl(`/api/plantas/${id}/enfermedades`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las enfermedades');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getPlantaEnfermedades:', error);
      throw error;
    }
  }
  
  /**
   * Obtener usos principales de una planta
   */
  async getPlantaUsos(id) {
    try {
      const response = await fetch(apiUrl(`/api/plantas/${id}/usos`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener los usos');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getPlantaUsos:', error);
      throw error;
    }
  }
  
  // ==================== ENFERMEDADES ====================
  
  /**
   * Obtener todas las enfermedades
   */
  async getAllEnfermedades() {
    try {
      const response = await fetch(apiUrl('/api/enfermedades'));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las enfermedades');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getAllEnfermedades:', error);
      throw error;
    }
  }
  
  /**
   * Obtener una enfermedad por ID
   */
  async getEnfermedadById(id) {
    try {
      const response = await fetch(apiUrl(`/api/enfermedades/${id}`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener la enfermedad');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getEnfermedadById:', error);
      throw error;
    }
  }
  
  /**
   * Obtener plantas que tratan una enfermedad específica
   */
  async getEnfermedadPlantas(id) {
    try {
      const response = await fetch(apiUrl(`/api/enfermedades/${id}/plantas`));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las plantas');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getEnfermedadPlantas:', error);
      throw error;
    }
  }
  
  // ==================== PROPIEDADES ====================
  
  /**
   * Obtener todas las propiedades
   */
  async getAllPropiedades() {
    try {
      const response = await fetch(apiUrl('/api/propiedades'));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las propiedades');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getAllPropiedades:', error);
      throw error;
    }
  }
  
  // ==================== CATEGORÍAS ====================
  
  /**
   * Obtener todas las categorías de plantas
   */
  async getCategoriasPlanta() {
    try {
      const response = await fetch(apiUrl('/api/categorias-plantas'));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las categorías');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getCategoriasPlanta:', error);
      throw error;
    }
  }
  
  /**
   * Obtener todas las categorías de enfermedades
   */
  async getCategoriasEnfermedad() {
    try {
      const response = await fetch(apiUrl('/api/categorias-enfermedades'));
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener las categorías');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error en getCategoriasEnfermedad:', error);
      throw error;
    }
  }
}

export default new PlantasService();
