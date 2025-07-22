import React from 'react';
import { render, screen } from '@testing-library/react';
import KanbanBoard from '../src/components/KanbanBoard';

// Mock de props mínimas para la historia 1
const mockPosition = {
  id: '1',
  title: 'Desarrollador Backend',
};

describe('KanbanBoard - Historia 1: Visualización de título y navegación', () => {
  test('debe mostrar el título de la posición en la parte superior', () => {
    render(<KanbanBoard position={mockPosition} />);
    expect(screen.getByText('Desarrollador Backend')).toBeInTheDocument();
  });

  test('debe mostrar un botón o flecha para volver al listado de posiciones', () => {
    render(<KanbanBoard position={mockPosition} />);
    // Busca un botón con texto "Volver" o un rol de button con aria-label
    const backButton = screen.getByRole('button', { name: /volver/i });
    expect(backButton).toBeInTheDocument();
  });
});

describe('KanbanBoard - Historia 2: Visualización de fases del proceso', () => {
  const mockPhases = [
    { id: 'phase1', name: 'CV recibido' },
    { id: 'phase2', name: 'Entrevista técnica' },
    { id: 'phase3', name: 'Oferta' },
  ];
  const mockPosition = {
    id: '1',
    title: 'Desarrollador Backend',
    phases: mockPhases,
  };

  test('debe renderizar una columna por cada fase recibida', () => {
    render(<KanbanBoard position={mockPosition} />);
    mockPhases.forEach(phase => {
      // Busca el encabezado de la columna por el nombre de la fase
      expect(screen.getByText(phase.name)).toBeInTheDocument();
    });
  });

  test('los nombres de las fases aparecen en la parte superior de cada columna', () => {
    render(<KanbanBoard position={mockPosition} />);
    mockPhases.forEach(phase => {
      // Busca el encabezado de la columna por el nombre de la fase
      const columnHeader = screen.getByText(phase.name);
      expect(columnHeader.tagName).toMatch(/H[1-6]/i); // Debe ser un encabezado
    });
  });
});

describe('KanbanBoard - Historia 3: Visualización de candidatos en formato tarjeta', () => {
  const mockPhases = [
    { id: 'phase1', name: 'CV recibido' },
    { id: 'phase2', name: 'Entrevista técnica' },
  ];
  const mockCandidates = [
    { id: 'cand1', fullName: 'Ana López', averageScore: 8.5, phaseId: 'phase1' },
    { id: 'cand2', fullName: 'Juan Pérez', averageScore: null, phaseId: 'phase2' },
    { id: 'cand3', fullName: 'María Ruiz', averageScore: 7.2, phaseId: 'phase1' },
  ];
  const mockPosition = {
    id: '1',
    title: 'Desarrollador Backend',
    phases: mockPhases,
    candidates: mockCandidates,
  };

  test('cada candidato aparece como tarjeta en la columna correspondiente a su fase', () => {
    render(<KanbanBoard position={mockPosition} />);
    // Ana y María deben estar en la columna de "CV recibido"
    const phase1Column = screen.getByTestId('kanban-column-phase1');
    expect(phase1Column).toHaveTextContent('Ana López');
    expect(phase1Column).toHaveTextContent('María Ruiz');
    // Juan debe estar en la columna de "Entrevista técnica"
    const phase2Column = screen.getByTestId('kanban-column-phase2');
    expect(phase2Column).toHaveTextContent('Juan Pérez');
  });

  test('cada tarjeta muestra el nombre completo y la puntuación media si está disponible', () => {
    render(<KanbanBoard position={mockPosition} />);
    // Ana tiene puntuación
    expect(screen.getByText('Ana López')).toBeInTheDocument();
    expect(screen.getByText(/8.5/)).toBeInTheDocument();
    // Juan no tiene puntuación
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.queryByText(/null/)).not.toBeInTheDocument();
    // María tiene puntuación
    expect(screen.getByText('María Ruiz')).toBeInTheDocument();
    expect(screen.getByText(/7.2/)).toBeInTheDocument();
  });
}); 