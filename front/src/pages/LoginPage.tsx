import "../styles/Pages.css";

export default function LoginPage() {
  return (
    <div className="centered-box">
      <h2>Entrar</h2>
      <label>Usuário</label>
      <input type="text" className="input" />

      <label>Senha</label>
      <input type="password" className="input" />

      <a href="#" className="forgot">Esqueceu a senha?</a>

      <button className="btn">Entrar</button>
    </div>
  );
}
