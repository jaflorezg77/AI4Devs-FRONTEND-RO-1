import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

/**
 * Obtiene las fases y candidatos de una posición.
 * @param {string} positionId
 * @returns {Promise<{phases: Array, candidates: Array}>}
 */
export async function getPositionKanban(positionId) {
  console.log('🔍 getPositionKanban - URL:', `${API_URL}/positions/${positionId}/candidates`);
  console.log('🔍 getPositionKanban - positionId:', positionId);
  
  try {
    const response = await axios.get(`${API_URL}/positions/${positionId}/candidates`);
    console.log('✅ getPositionKanban - Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ getPositionKanban - Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    throw error;
  }
}

/**
 * Obtiene el flujo de entrevistas y el nombre de la posición.
 * @param {string} positionId
 * @returns {Promise<Object>}
 */
export async function getInterviewFlow(positionId) {
  console.log('🔍 getInterviewFlow - URL:', `${API_URL}/positions/${positionId}/interviewflow`);
  console.log('🔍 getInterviewFlow - positionId:', positionId);

  try {
    const response = await axios.get(`${API_URL}/positions/${positionId}/interviewflow`);
    console.log('✅ getInterviewFlow - Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ getInterviewFlow - Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    throw error;
  }
}

/**
 * Actualiza la fase de un candidato.
 * @param {string} candidateId - ID del candidato
 * @param {string} applicationId - ID de la aplicación
 * @param {string} newPhase - Nombre de la nueva fase
 * @returns {Promise<any>}
 */
export async function updateCandidatePhase(candidateId, applicationId, newPhase) {
  console.log('🔍 updateCandidatePhase - Datos:', {
    url: `${API_URL}/candidates/${candidateId}`,
    candidateId,
    applicationId,
    newPhase
  });

  try {
    const response = await axios.put(`${API_URL}/candidates/${candidateId}`, {
      applicationId: applicationId, // Usar el applicationId real
      currentInterviewStep: newPhase
    });
    console.log('✅ updateCandidatePhase - Respuesta exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ updateCandidatePhase - Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    throw error;
  }
} 