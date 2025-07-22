import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidate from './components/AddCandidateForm'; 
import Positions from './components/Positions'; 
import PositionKanbanPage from './components/PositionKanbanPage';

// Wrapper para extraer el id de la URL y pasarlo como prop
function PositionKanbanRouteWrapper() {
  const { id } = useParams();
  return <PositionKanbanPage positionId={id} />;
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id/kanban" element={<PositionKanbanRouteWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;