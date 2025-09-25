import { Link } from "react-router-dom";

const IfrjLogo = () => (
  <svg width="100" height="40" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <text x="0" y="30" fontSize="20" fontWeight="bold">IFRJ</text>
    <text x="0" y="40" fontSize="10">Instituto Federal Rio de Janeiro</text>
  </svg>
);

function Navbar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><Link to="/">Página Inicial</Link></li>
            <li><Link to="/projetos">Projetos</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          <IfrjLogo />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Página Inicial</Link></li>
          <li><Link to="/projetos">Projetos</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link to="/login" className="btn btn-primary">Entrar</Link>
      </div>
    </div>
  );
}

export default Navbar;