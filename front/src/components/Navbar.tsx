import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navItems = [
    { name: "Página Inicial", path: "/" },
    { name: "Projetos", path: "/projetos" },
    { name: "Entrar", path: "/login" },
  ];

  return (
    <nav className="navbar">
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
