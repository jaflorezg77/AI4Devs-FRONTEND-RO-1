import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

/**
 * Obtiene el listado de posiciones desde el backend.
 * @returns {Promise<Array>}
 */
export async function getPositions() {
  try {
    const response = await axios.get(`${API_URL}/positions`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    throw error;
  }
}

/**
 * Obtiene una posición específica por su ID
 * @param {string} positionId - ID de la posición
 * @returns {Promise<Object>}
 */
export async function getPosition(positionId) {
  try {
    const response = await axios.get(`${API_URL}/positions/${positionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener posición:', error);
    throw error;
  }
} 