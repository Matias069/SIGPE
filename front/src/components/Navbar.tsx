import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../contexts/auth/useAuth";

const Navbar = () => {
   const { orientador, logout } = useAuth();

   return (
      <div className="navbar bg-base-100 shadow-sm px-4">
         {/* Botão SIGPE → abre o sidebar */}
         <label
            htmlFor="my-drawer-1"
            className="btn btn-ghost text-xl drawer-button"
         >
            SIGPE
         </label>

         {/* Espaçador */}
         <div className="flex-1"></div>

         {/* Botão Settings → dropdown */}
         {orientador && (
            <div className="dropdown dropdown-end">
               <button tabIndex={0} className="btn btn-ghost">
                  <Settings className="w-5 h-5" />
               </button>

               <ul
                  tabIndex={-1}
                  className="dropdown-content menu bg-emerald-100 rounded-box w-52 p-2 shadow-md z-50"
               >
                  <li>
                     <button
                        className="flex items-center gap-2"
                        onClick={logout} // chama função de logout
                     >
                        <LogOut className="w-4 h-4" />
                        Sair
                     </button>
                  </li>
               </ul>
            </div>
         )}
      </div>
   );
};

export default Navbar;
