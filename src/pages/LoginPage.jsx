import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import MessageBox from "../components/MessageBox";
import { apiLogin } from "../services/api";

const REMEMBER_LOGIN_KEY = "loginLembrado";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carrega o e-mail salvo (caso o usuário tenha marcado "Lembrar meu login")
  useEffect(() => {
    try {
      const raw = localStorage.getItem(REMEMBER_LOGIN_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      if (saved && typeof saved.email === "string") {
        setEmail(saved.email);
        setRememberLogin(true);
      }
    } catch {
      // Se der erro ao ler o JSON, apenas ignoramos.
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setMsgType(null);

    if (!email || !password) {
      setMsg("Preencha todos os campos.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      const usuario = await apiLogin({ email, password });

      const usuarioLogado = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      // Persiste (ou limpa) o e-mail lembrado
      if (rememberLogin) {
        localStorage.setItem(
          REMEMBER_LOGIN_KEY,
          JSON.stringify({ email })
        );
      } else {
        localStorage.removeItem(REMEMBER_LOGIN_KEY);
      }

      setMsg("Login realizado com sucesso!");
      setMsgType("success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setMsg(err.message || "Erro ao tentar fazer login. Tente novamente.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Command Center"
      subtitle="Faça o Login para acessar o portal."
      activeTab="login"
      showTabs={true}
    >
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email"></label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password"></label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <div className="remember-and-toggle">
          <label className="remember-login-label">
            <input
              type="checkbox"
              checked={rememberLogin}
              onChange={(e) => setRememberLogin(e.target.checked)}
            />
            Lembrar-me
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Entrando..." : "Acessar"}
        </button>

        <div className="link-area">
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </div>

        <MessageBox message={msg} type={msgType} />
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
