import LoginPage from "./pages/login";
import { Routes, Route } from "react-router-dom";
import "./index.css";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
