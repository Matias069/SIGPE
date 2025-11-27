import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/auth/useAuth";
import {
   Home,
   BookOpen,
   UserPlus,
   Users,
   FilePlus,
   LogIn,
   LogOut,
   UserCog,
   NotebookText,
} from "lucide-react";

export default function Sidebar() {
   const { orientador } = useAuth();

   const isAuthenticated = !!orientador;
   const isAdmin = orientador?.isAdmin || false;

   const icons = {
      "/": <Home size={22} className="opacity-80" />,
      "/projetos": <BookOpen size={22} className="opacity-80" />,
      "/cadastraraluno": <Users size={22} className="opacity-80" />,
      "/cadastraravaliador": <UserPlus size={22} className="opacity-80" />,
      "/cadastrarorientador": <UserCog size={22} className="opacity-80" />,
      "/cadastrarturma": <Users size={22} className="opacity-80" />,
      "/cadastrarprojeto": <FilePlus size={22} className="opacity-80" />,
      "/relatorios": <NotebookText size={22} className="opacity-80" />,
      "/login": <LogIn size={22} className="opacity-80" />,
      "/logout": <LogOut size={22} className="opacity-80" />,
   } as const;

   const navItems = [
      { name: "Página Inicial", path: "/" },
      { name: "Projetos", path: "/projetos" },
   ];

   if (isAuthenticated) {
      navItems.push({ name: "Cadastrar Projeto", path: "/cadastrarprojeto" });
   }

   if (isAuthenticated && isAdmin) {
      navItems.push(
         { name: "Cadastrar Aluno", path: "/cadastraraluno" },
         { name: "Cadastrar Avaliador", path: "/cadastraravaliador" },
         { name: "Cadastrar Orientador", path: "/cadastrarorientador" },
         { name: "Cadastrar Turma", path: "/cadastrarturma" }
      );
   }

   if (isAuthenticated && isAdmin) {
      navItems.push({ name: "Relatório de Notas", path: "/relatorios" });
   }

   navItems.push(
      !isAuthenticated
         ? { name: "Entrar", path: "/login" }
         : { name: "", path: "" }
   );

   const linkClasses =
      "flex items-center gap-x-4 p-3 rounded-lg text-emerald-200 transition-all duration-200 ease-in-out hover:bg-emerald-700/70 hover:text-white hover:pl-5";
   const activeLinkClasses =
      "bg-emerald-900/60 text-white font-semibold shadow-inner pl-5";

   return (
      <div className="drawer-side">
         <label htmlFor="my-drawer-1" className="drawer-overlay"></label>

         <aside className="bg-emerald-800 h-screen text-white w-64 p-6 flex flex-col shadow-xl overflow-y-auto">
            <nav className="flex flex-col gap-y-2">
               {navItems.map((item) => (
                  <NavLink
                     key={item.path}
                     to={item.path}
                     className={({ isActive }) =>
                        `${linkClasses} ${isActive ? activeLinkClasses : ""}`
                     }
                  >
                     {icons[item.path as keyof typeof icons] || null}
                     <span className="text-[15px]">{item.name}</span>
                  </NavLink>
               ))}
            </nav>
         </aside>
      </div>
   );
}
