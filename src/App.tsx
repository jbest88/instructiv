
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
import { AuthProvider } from '@/contexts/AuthContext';
import Auth from './pages/Auth';
import ProjectsPage from './pages/ProjectsPage';

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <PanelProvider>
          <Router>
            <Routes>
              <Route path="/" element={<ProjectContent />} />
              <Route path="/scene-view" element={<SceneView />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
            <Toaster />
          </Router>
        </PanelProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
