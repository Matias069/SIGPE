import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import AccessPage from "./pages/AccessPage";
import EvaluationPage from "./pages/EvaluationPage";
import CadastrarProjetoPage from "./pages/CadastrarProjetoPage";
import CadastrarAlunosPage from "./pages/CadastrarAlunosPage";
import CadastrarOrientadorPage from "./pages/CadastrarOrientadorPage";
import CadastrarAvaliadorPage from "./pages/CadastrarAvaliadorPage";
import CadastrarTurmasPage from "./pages/CadastrarTurmasPage";
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
              <Route path="/cadastrarprojeto" element={<CadastrarProjetoPage />} />
              <Route path="/cadastraralunos" element={<CadastrarAlunosPage />} />
              <Route path="/cadastrarorientador" element={<CadastrarOrientadorPage />} />
              <Route path="/cadastraravaliador" element={<CadastrarAvaliadorPage />} />
              <Route path="/cadastrarturmas" element={<CadastrarTurmasPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
