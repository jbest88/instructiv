
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import SceneView from './pages/SceneView';
import { MainContent } from './components/MainContent';
import { ProjectProvider } from '@/contexts/project';
import { PanelProvider } from '@/contexts/PanelContext';
import { Toaster } from "@/components/ui/toaster";
import ProjectContent from './pages/Index';

function App() {
  return (
    <ProjectProvider>
      <PanelProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProjectContent />} />
            <Route path="/scene-view" element={<SceneView />} />
          </Routes>
          <Toaster />
        </Router>
      </PanelProvider>
    </ProjectProvider>
  );
}

export default App;
