import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import AccessPage from "./pages/AccessPage";
import EvaluationPage from "./pages/EvaluationPage";
import CadastrarProjetoPage from "./pages/CadastrarProjetoPage";
import { AuthProvider } from './contexts/AuthContext';

// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "./styles/App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <div className="page-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projetos" element={<ProjectsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/acessoavaliador" element={<AccessPage />} />
              <Route path="/avaliacao" element={<EvaluationPage />} />
              <Route path="/cadastrar" element={<CadastrarProjetoPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
