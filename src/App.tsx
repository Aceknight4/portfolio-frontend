import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './AuthContext';
import ProtectedRoute      from './components/ProtectedRoute';
import Navbar              from './components/Navbar';
import Home                from './pages/Home';
import Projects            from './pages/Projects';
import ProjectDetail       from './pages/ProjectDetail';
import Skills              from './pages/Skills';
import ExperiencePage      from './pages/Experience';
import Contact             from './pages/Contact';
import Login               from './pages/Login';
import Dashboard           from './dashboard/Dashboard';
import ProjectsManager     from './dashboard/ProjectsManager';
import SkillsManager       from './dashboard/SkillsManager';
import ExperienceManager   from './dashboard/ExperienceManager';
import MessagesInbox       from './dashboard/MessagesInbox';
import ProfileEditor       from './dashboard/ProfileEditor';
import Footer from './components/Footer';


function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
          <Route path="/projects/:id" element={<PublicLayout><ProjectDetail /></PublicLayout>} />
          <Route path="/skills" element={<PublicLayout><Skills /></PublicLayout>} />
          <Route path="/experience" element={<PublicLayout><ExperiencePage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          {/* auth */}
          <Route path="/login" element={<Login />} />
          {/* dashboard — protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/projects" element={<ProtectedRoute><ProjectsManager /></ProtectedRoute>} />
          <Route path="/dashboard/skills" element={<ProtectedRoute><SkillsManager /></ProtectedRoute>} />
          <Route path="/dashboard/experience" element={<ProtectedRoute><ExperienceManager /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><MessagesInbox /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><ProfileEditor /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}