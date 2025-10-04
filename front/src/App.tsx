import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import LoginPage from "./pages/LoginPage";
import AccessPage from "./pages/AccessPage";
import EvaluationPage from "./pages/EvaluationPage";

import "./styles/App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/acesso-avaliador" element={<AccessPage />} />
            <Route path="/avaliacao" element={<EvaluationPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
