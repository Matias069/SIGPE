// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import 'bootstrap/dist/css/bootstrap.min.css';
// @ts-ignore: allow side-effect CSS import without type declarations
import "./index.css"; // importa Tailwind
import apiClient from './apiClient'

// Peça o cookie CSRF ao backend
apiClient.get('/sanctum/csrf-cookie').then(() => {
    // Renderize a aplicação React DEPOIS de obter o cookie
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
}).catch(error => {
    console.error("Erro ao obter cookie CSRF", error);
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: #b00020;
          font-family: sans-serif;
          text-align: center;
        ">
          <h1>Erro ao conectar com o servidor</h1>
          <p>Não foi possível obter o cookie de segurança (CSRF).</p>
          <p>Por favor, tente novamente mais tarde.</p>
        </div>
      `;
    }
});
