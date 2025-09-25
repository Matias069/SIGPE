// src/App.tsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/paginaInicial"; // Importe a nova página
import LoginPage from "./pages/login";
import "./index.css";

function App() {
    return (
        <Routes>
            {/* Rota da Página Inicial */}
            <Route path="/" element={<HomePage />} />

            {/* Rota de Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Adicione outras rotas aqui, como a de projetos */}
            {/* <Route path="/projetos" element={<ProjectsPage />} /> */}
        </Routes>
    );
}

export default App;