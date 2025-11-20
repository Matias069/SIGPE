// @ts-ignore: Cannot find module or type declarations for side-effect import of '../styles/Pages.css'.
import "../styles/Pages.css";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth/useAuth";

export default function LogoutPage() {
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { logout } = useAuth();

  useEffect(() => {
    const executarLogout = async () => {
      try {
        await logout();
      } catch (error: any) {
        console.error("Erro no logout:", error);
        setErro("Não foi possível encerrar sua sessão.");
      } finally {
        setIsLoading(false);
      }
    };

    executarLogout();
  }, [logout]);

  return (
    <div className="page-container">
      <div className="login-container-login">
        <div className="login-form">
          <h2>Saindo...</h2>

          {isLoading && <p>Encerrando sua sessão...</p>}
          {erro && <p className="error-message">{erro}</p>}
        </div>
      </div>
    </div>
  );
}
