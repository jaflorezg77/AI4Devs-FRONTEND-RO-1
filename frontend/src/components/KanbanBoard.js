import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const KanbanCard = memo(({ candidate, provided, snapshot }) => (
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    className={`card mb-3 ${snapshot.isDragging ? 'dragging' : ''}`}
    style={provided.draggableProps.style}
  >
    <div className="card-body">
      <h5 className="card-title">{candidate.fullName}</h5>
      <div className="d-flex align-items-center">
        <span className="me-2">Puntuación:</span>
        <div className="d-flex align-items-center">
          {Array.from({ length: Math.min(candidate.averageScore || 0, 5) }).map((_, i) => (
            <span 
              key={i} 
              className="text-success mx-1" 
              style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
              ●
            </span>
          ))}
          {candidate.averageScore > 0 && (
            <span className="ms-2 text-muted">
              ({candidate.averageScore}/5)
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
));

KanbanCard.displayName = 'KanbanCard';

const KanbanColumn = memo(({ phase, candidates, provided, snapshot }) => {
  console.log('📋 KanbanColumn - Renderizando columna:', phase.name);
  console.log('👥 KanbanColumn - Candidatos totales:', candidates.length);
  
  const columnCandidates = candidates.filter(
    candidate => candidate.currentInterviewStep === phase.name
  );
  
  console.log(`👤 KanbanColumn - Candidatos en ${phase.name}:`, columnCandidates.length, columnCandidates);

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3">
      <div className="kanban-column h-100 bg-light rounded-3 p-3">
        <h3 className="text-center fs-5 mb-3">{phase.name}</h3>
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`kanban-cards ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
        >
          {columnCandidates.map((candidate, index) => (
            <Draggable
              key={candidate.applicationId}
              draggableId={`candidate-${candidate.id}`}
              index={index}
            >
              {(provided, snapshot) => (
                <KanbanCard 
                  candidate={candidate} 
                  provided={provided}
                  snapshot={snapshot}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      </div>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';

function KanbanBoard({ position, updateCandidatePhase }) {
  console.log('🎯 KanbanBoard - Props recibidas:', position);
  console.log('📋 KanbanBoard - Fases:', position.phases);
  console.log('👥 KanbanBoard - Candidatos:', position.candidates);

  // Verificar que tenemos fases para renderizar
  if (!position.phases || position.phases.length === 0) {
    console.warn('⚠️ KanbanBoard - No hay fases para mostrar');
    return (
      <div className="alert alert-warning">
        No hay fases de entrevista configuradas para esta posición.
      </div>
    );
  }

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // Si no hay destino o es el mismo origen, no hacemos nada
    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    // Extraer el ID del candidato del draggableId
    const candidateId = draggableId.replace('candidate-', '');
    
    // Encontrar la fase por nombre
    const phase = position.phases.find(p => p.name === destination.droppableId);
    
    // Si no encontramos la fase, no hacemos nada
    if (!phase) {
      console.error('Fase no encontrada:', destination.droppableId);
      return;
    }

    // Actualizar la fase del candidato usando el nombre de la fase
    updateCandidatePhase(candidateId, phase.name);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row g-4">
        {position.phases.map((phase) => {
          console.log('🔄 KanbanBoard - Renderizando fase:', phase);
          return (
            <Droppable droppableId={phase.name} key={phase.id}>
              {(provided, snapshot) => (
                <KanbanColumn
                  phase={phase}
                  candidates={position.candidates}
                  provided={provided}
                  snapshot={snapshot}
                />
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}

KanbanBoard.propTypes = {
  position: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    phases: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    candidates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        applicationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        fullName: PropTypes.string.isRequired,
        averageScore: PropTypes.number,
        currentInterviewStep: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  updateCandidatePhase: PropTypes.func.isRequired,
};

export default KanbanBoard; 