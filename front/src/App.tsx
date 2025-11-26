import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import AccessPage from "./pages/AccessPage";
import EvaluationPage from "./pages/EvaluationPage";
import RelatorioPage from "./pages/RelatorioPage";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import { AdminRoute } from "./components/routing/AdminRoute";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { EvaluatorRoute } from "./components/routing/EvaluatorRoute";

import CadastrarProjetoPage from "./pages/CadastrarProjetoPage";
import CadastrarAlunoPage from "./pages/CadastrarAlunoPage";
import CadastrarOrientadorPage from "./pages/CadastrarOrientadorPage";
import CadastrarAvaliadorPage from "./pages/CadastrarAvaliadorPage";
import CadastrarTurmaPage from "./pages/CadastrarTurmaPage";

import "./styles/App.css";

function App() {
   return (
      <BrowserRouter>
         <AuthProvider>
            {/* 🔥 Drawer global envolvendo tudo */}
            <div className="drawer">
               <input
                  id="my-drawer-1"
                  type="checkbox"
                  className="drawer-toggle"
               />

               {/* Conteúdo da aplicação */}
               <div className="drawer-content flex flex-col min-h-screen">
                  <Navbar />

                  <div className="page-container flex-1">
                     <Routes>
                        {/* Rotas Públicas */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/logout" element={<LogoutPage />} />
                        <Route path="/projetos" element={<ProjectsPage />} />

                        {/* Rotas de Avaliação */}
                        <Route
                           path="/projetos/:id/acessoavaliador"
                           element={<AccessPage />}
                        />
                        <Route element={<EvaluatorRoute />}>
                           <Route
                              path="/projetos/:id/avaliacao"
                              element={<EvaluationPage />}
                           />
                        </Route>

                        {/* Rotas do Administrador */}
                        <Route element={<AdminRoute />}>
                           <Route
                              path="/cadastraraluno"
                              element={<CadastrarAlunoPage />}
                           />
                           <Route
                              path="/cadastrarorientador"
                              element={<CadastrarOrientadorPage />}
                           />
                           <Route
                              path="/cadastraravaliador"
                              element={<CadastrarAvaliadorPage />}
                           />
                           <Route
                              path="/cadastrarturma"
                              element={<CadastrarTurmaPage />}
                           />
                           <Route
                              path="/relatorios"
                              element={<RelatorioPage />}
                           />
                        </Route>

                        {/* Rotas do Orientador */}
                        <Route element={<ProtectedRoute />}>
                           <Route
                              path="/cadastrarprojeto"
                              element={<CadastrarProjetoPage />}
                           />
                        </Route>
                     </Routes>
                  </div>
               </div>

               {/* Sidebar */}
               <Sidebar />
            </div>
         </AuthProvider>
      </BrowserRouter>
   );
}

export default App;
