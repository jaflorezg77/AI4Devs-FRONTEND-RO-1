import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';
import { getPositionKanban, updateCandidatePhase, getInterviewFlow } from '../services/kanbanService';
import { getPosition } from '../services/positionService';

function PositionKanbanPage({ positionId }) {
  const navigate = useNavigate();
  console.log('🔄 PositionKanbanPage - Renderizando con positionId:', positionId);
  
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positionDetails, setPositionDetails] = useState(null);

  useEffect(() => {
    console.log('🔄 PositionKanbanPage - useEffect iniciado');
    setLoading(true);
    
    Promise.all([
      getPositionKanban(positionId), // candidatos
      getInterviewFlow(positionId),  // fases y descripción
      getPosition(positionId),       // detalles de la posición
    ])
      .then(([candidates, flowResponse, positionData]) => {
        console.log('✅ PositionKanbanPage - Datos recibidos:', {
          candidates,
          flowResponse,
          positionData
        });

        setPositionDetails(positionData);
        
        // Acceder correctamente a la estructura del backend
        // El backend devuelve { interviewFlow: { interviewSteps: [...] } }
        let phases = [];
        if (flowResponse && flowResponse.interviewFlow && flowResponse.interviewFlow.interviewSteps) {
          phases = flowResponse.interviewFlow.interviewSteps;
          console.log('📋 Fases del interviewFlow:', phases);
        } else {
          console.warn('⚠️ No se encontraron fases en la respuesta del backend');
          // Usar fases por defecto si no hay datos
          phases = [
            { id: 1, name: 'Initial Screening', orderIndex: 1 },
            { id: 2, name: 'Technical Interview', orderIndex: 2 },
            { id: 3, name: 'Manager Interview', orderIndex: 3 }
          ];
        }
        
        console.log('📋 Fases finales a usar:', phases);
        
        const formattedPosition = {
          id: positionId,
          phases: phases,
          candidates: candidates || [],
        };
        
        console.log('📦 PositionKanbanPage - Datos formateados:', formattedPosition);
        setPosition(formattedPosition);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ PositionKanbanPage - Error al cargar datos:', err);
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, [positionId]);

  const handleUpdateCandidatePhase = async (candidateId, newPhase) => {
    console.log('🔄 handleUpdateCandidatePhase - Iniciando actualización:', {
      candidateId,
      newPhase
    });
    
    try {
      // Encontrar el candidato en la lista para obtener su applicationId
      const candidate = position.candidates.find(c => c.id.toString() === candidateId.toString());
      if (!candidate) {
        throw new Error(`Candidato con ID ${candidateId} no encontrado`);
      }
      
      console.log('📋 Candidato encontrado:', candidate);
      console.log('📋 ApplicationId del candidato:', candidate.applicationId);
      
      await updateCandidatePhase(candidateId, candidate.applicationId, newPhase);
      console.log('✅ handleUpdateCandidatePhase - Fase actualizada correctamente');
      
      // Refresca los datos del kanban tras actualizar
      const [candidates, flowResponse] = await Promise.all([
        getPositionKanban(positionId),
        getInterviewFlow(positionId),
      ]);

      let phases = [];
      if (flowResponse && flowResponse.interviewFlow && flowResponse.interviewFlow.interviewSteps) {
        phases = flowResponse.interviewFlow.interviewSteps;
      } else {
        phases = [
          { id: 1, name: 'Initial Screening', orderIndex: 1 },
          { id: 2, name: 'Technical Interview', orderIndex: 2 },
          { id: 3, name: 'Manager Interview', orderIndex: 3 }
        ];
      }
      
      const updatedPosition = {
        id: positionId,
        phases: phases,
        candidates: candidates || [],
      };
      
      console.log('📦 handleUpdateCandidatePhase - Datos actualizados:', updatedPosition);
      setPosition(updatedPosition);
    } catch (err) {
      console.error('❌ handleUpdateCandidatePhase - Error:', err);
      setError('Error al actualizar la fase del candidato');
    }
  };

  const handleBack = () => {
    navigate('/positions');
  };

  if (loading) {
    console.log('⏳ PositionKanbanPage - Mostrando estado de carga');
    return <div className="d-flex justify-content-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>;
  }
  
  if (error) {
    console.log('❌ PositionKanbanPage - Mostrando error:', error);
    return <div className="alert alert-danger m-3" role="alert">{error}</div>;
  }
  
  if (!position) {
    console.log('⚠️ PositionKanbanPage - No hay datos para mostrar');
    return <div className="alert alert-warning m-3" role="alert">No hay datos para mostrar.</div>;
  }

  console.log('✅ PositionKanbanPage - Renderizando KanbanBoard con datos:', position);
  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <button 
            onClick={handleBack}
            className="btn btn-outline-primary mb-4"
            style={{ position: 'absolute', left: '1rem' }}
          >
            <i className="bi bi-arrow-left"></i> Volver a Posiciones
          </button>
          <h1 className="text-center">
            {positionDetails?.title || 'Proceso de Selección'}
            {positionDetails?.company && (
              <small className="d-block text-muted fs-5 mt-2">
                {positionDetails.company}
              </small>
            )}
          </h1>
          {positionDetails?.location && (
            <p className="text-center text-muted mb-0">
              <i className="bi bi-geo-alt"></i> {positionDetails.location}
            </p>
          )}
          {positionDetails?.deadline && (
            <p className="text-center text-muted">
              <i className="bi bi-calendar"></i> Fecha límite: {new Date(positionDetails.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <KanbanBoard
        position={position}
        updateCandidatePhase={handleUpdateCandidatePhase}
      />
    </div>
  );
}

export default PositionKanbanPage; 