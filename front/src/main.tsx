import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import 'bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore: allow side-effect CSS import without type declarations
import "./index.css"; // importa Tailwind

// Renderize a aplicação React
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
