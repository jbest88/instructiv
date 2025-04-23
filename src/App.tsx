
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import SceneView from './pages/SceneView';
import { MainContent } from './components/MainContent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/scene-view" element={<SceneView />} />
      </Routes>
    </Router>
  );
}

export default App;
