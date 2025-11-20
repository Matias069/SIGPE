import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/auth/useAuth';
// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Navbar.css'.
import "../styles/Navbar.css";

export default function Navbar() 
{
  const { orientador } = useAuth();
  const isAuthenticated = !!orientador;
  // Verifica se é admin (garante false se user for null)
  const isAdmin = orientador?.isAdmin || false;
  
  const location = useLocation();
  const navItems = [
    { name: "Página Inicial", path: "/" },
    { name: "Projetos", path: "/projetos" },
  ];
  if (isAuthenticated && isAdmin){
    navItems.push(
      { name: "Cadastrar Aluno", path: "/cadastraraluno" },
      { name: "Cadastrar Avaliador", path: "/cadastraravaliador" },
      { name: "Cadastrar Orientador", path: "/cadastrarorientador" },
      { name: "Cadastrar Turma", path: "/cadastrarturma" },
    );
  }
  if (isAuthenticated){
    navItems.push(
      { name: "Cadastrar Projeto", path: "/cadastrarprojeto" },
    );
  }
  if (!isAuthenticated){
    navItems.push(
      { name: "Entrar", path: "/login" },
    );
  } else {
    navItems.push(
      { name: "Sair", path: "/logout" },
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2 style={{color: '#000000'}}>SIGPE</h2>
      </div>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
