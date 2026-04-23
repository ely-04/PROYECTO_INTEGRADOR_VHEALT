# API de Plantas Medicinales - Guía de Uso

## 📋 Descripción

Esta API permite consultar información sobre plantas medicinales, enfermedades, propiedades y sus relaciones directamente desde la base de datos MySQL `plantas`.

## 🔧 Configuración

### Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
PLANTAS_DB_HOST=localhost
PLANTAS_DB_PORT=3306
PLANTAS_DB_NAME=plantas
PLANTAS_DB_USER=root
PLANTAS_DB_PASSWORD=
```

## 📡 Endpoints Disponibles

### Plantas

#### `GET /api/plantas`
Obtiene todas las plantas ordenadas por nombre común.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre_comun": "Manzanilla",
      "nombre_cientifico": "Matricaria chamomilla",
      "descripcion": "...",
      "familia": "Asteraceae",
      ...
    }
  ],
  "count": 30
}
```

#### `GET /api/plantas/:id`
Obtiene una planta específica por ID.

#### `GET /api/plantas/buscar/:termino`
Busca plantas por nombre común o científico.

**Ejemplo:** `/api/plantas/buscar/manzanilla`

#### `GET /api/plantas/:id/completa`
Obtiene información completa de una planta incluyendo:
- Datos básicos de la planta
- Enfermedades que trata (con forma de uso, dosis, precauciones)
- Propiedades medicinales
- Usos principales

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre_comun": "Manzanilla",
    "enfermedades": [...],
    "propiedades": [...],
    "usos": [...]
  }
}
```

#### `GET /api/plantas/:id/enfermedades`
Obtiene las enfermedades que trata una planta específica.

#### `GET /api/plantas/:id/propiedades`
Obtiene las propiedades medicinales de una planta.

#### `GET /api/plantas/:id/usos`
Obtiene los usos principales de una planta.

### Enfermedades

#### `GET /api/enfermedades`
Obtiene todas las enfermedades.

#### `GET /api/enfermedades/:id`
Obtiene una enfermedad específica por ID.

#### `GET /api/enfermedades/:id/plantas`
Obtiene todas las plantas que tratan una enfermedad específica.

**Respuesta incluye:**
- Información de la planta
- Forma de uso recomendada
- Dosis recomendada
- Precauciones

### Propiedades

#### `GET /api/propiedades`
Obtiene todas las propiedades medicinales disponibles.

### Categorías

#### `GET /api/categorias-plantas`
Obtiene todas las categorías de plantas.

#### `GET /api/categorias-enfermedades`
Obtiene todas las categorías de enfermedades.

## 💻 Uso en React

### 1. Importar el servicio

```javascript
import plantasService from '../services/plantasService';
```

### 2. Obtener datos

```javascript
// En un componente funcional
const [plantas, setPlantas] = useState([]);

useEffect(() => {
  const loadPlantas = async () => {
    try {
      const data = await plantasService.getAllPlantas();
      setPlantas(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  loadPlantas();
}, []);
```

### 3. Buscar plantas

```javascript
const handleSearch = async (termino) => {
  try {
    const resultados = await plantasService.searchPlantas(termino);
    setPlantas(resultados);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 4. Obtener información completa

```javascript
const loadPlantaCompleta = async (id) => {
  try {
    const planta = await plantasService.getPlantaCompleta(id);
    console.log('Planta:', planta);
    console.log('Enfermedades:', planta.enfermedades);
    console.log('Propiedades:', planta.propiedades);
    console.log('Usos:', planta.usos);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 📝 Ejemplos de Uso

### Mostrar lista de plantas

```jsx
import PlantasList from './components/PlantasList';

function App() {
  return (
    <div>
      <PlantasList />
    </div>
  );
}
```

### Buscar plantas por enfermedad

```javascript
// 1. Obtener enfermedades
const enfermedades = await plantasService.getAllEnfermedades();

// 2. Obtener plantas para una enfermedad específica
const plantasParaGripe = await plantasService.getEnfermedadPlantas(enfermedadId);
```

### Filtrar por categorías

```javascript
// 1. Obtener categorías
const categorias = await plantasService.getCategoriasPlanta();

// 2. Filtrar plantas por categoría (hacer en el backend si es necesario)
const todasLasPlantas = await plantasService.getAllPlantas();
const plantasFiltradas = todasLasPlantas.filter(p => p.id_categoria === categoriaId);
```

## 🔒 Estructura de la Base de Datos

### Tablas principales:
- `plantas`: Información de plantas medicinales
- `enfermedades`: Catálogo de enfermedades
- `propiedades`: Propiedades medicinales
- `planta_enfermedad`: Relación plantas-enfermedades (incluye forma de uso, dosis, precauciones)
- `planta_propiedad`: Relación plantas-propiedades
- `usos_principales`: Usos principales de cada planta
- `categoria_plantas`: Categorías de plantas
- `categorias_enfermedades`: Categorías de enfermedades

## 🚀 Ejemplo Completo

Ver el componente `src/components/PlantasList.jsx` para un ejemplo completo de:
- Listar plantas
- Buscar plantas
- Ver detalles completos
- Manejo de estados de carga y errores

## 📌 Notas Importantes

1. **Sin datos estáticos**: Toda la información se obtiene dinámicamente de la base de datos
2. **Pool de conexiones**: Se usa un pool de conexiones para mejor rendimiento
3. **Manejo de errores**: Todos los endpoints incluyen manejo de errores
4. **Respuestas consistentes**: Todas las respuestas siguen el formato `{success, data, message}`
5. **CORS configurado**: El servidor acepta peticiones desde localhost:5173-5182

## 🔄 Iniciar el Servidor

```bash
npm run server
# o
npm run dev:full
```

El servidor estará disponible en `http://localhost:3000`
