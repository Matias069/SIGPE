import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../contexts/auth/useAuth";

const Navbar = () => {
   const { orientador, logout } = useAuth();

   return (
      <div className="navbar px-4 shadow-sm bg-[#3FA956] text-white">
         {/* Botão SIGPE → abre o sidebar */}
         <label
            htmlFor="my-drawer-1"
            className="btn btn-ghost text-xl drawer-button 
                       text-white hover:text-black hover:bg-[#4ECB72] 
                       transition rounded-xl ml-6"
         >
            SIGPE
         </label>

         {/* Espaçador */}
         <div className="flex-1"></div>

         {/* Botão Settings → dropdown */}
         {orientador && (
            <div className="dropdown dropdown-end">
               <button
                  tabIndex={0}
                  className="btn btn-ghost text-white 
                             hover:bg-[#4ECB72] hover:text-black 
                             transition rounded-xl"
               >
                  <Settings className="w-5 h-5" />
               </button>

               <ul
                  tabIndex={-1}
                  className="dropdown-content menu w-52 p-2 shadow-lg z-50
                             bg-[#E4FFE9] text-black rounded-xl"
               >
                  <li>
                     <button
                        onClick={logout}
                        className="flex items-center gap-2 
                                   hover:bg-[#C8FFD5] hover:text-black 
                                   rounded-md transition"
                     >
                        <LogOut className="w-6 h-6" />
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
