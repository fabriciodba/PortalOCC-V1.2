import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import MessageBox from "../components/MessageBox";
import { apiLogin } from "../services/api";

const REMEMBER_LOGIN_KEY = "loginLembrado";

function LoginPage() {
  const navigate = useNavigate();

  const [login, setLogin] = useState(""); // pode ser e-mail OU usuário
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carrega o login salvo (e-mail ou usuário) caso tenha sido marcado anteriormente
  useEffect(() => {
    // Páginas de login sempre em tema claro
    if (typeof document !== "undefined") {
      document.body.classList.remove("theme-dark", "theme-light");
      document.body.classList.add("theme-light");
    }

    try {
      const raw = localStorage.getItem(REMEMBER_LOGIN_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw);
      if (saved && typeof saved.login === "string") {
        setLogin(saved.login);
        setRememberLogin(true);
      }
    } catch {
      // Se der erro ao ler o JSON, apenas ignora
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setMsgType(null);

    if (!login || !password) {
      setMsg("Preencha todos os campos.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      const usuario = await apiLogin({ login, password });

      const usuarioLogado = {
        id: usuario.id,
        nome: usuario.nome,
        username: usuario.username,
        email: usuario.email,
        telefone: usuario.telefone,
        time: usuario.time,
        foto: usuario.foto || "",
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

      // Persiste (ou limpa) o login lembrado
      if (rememberLogin) {
        localStorage.setItem(
          REMEMBER_LOGIN_KEY,
          JSON.stringify({ login })
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
          <label htmlFor="login"></label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="E-mail ou usuário"
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
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
            Lembrar meu login
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Entrando..." : "Acessar"}
        </button>

        <div className="links-extra">
          <Link to="/forgot-password">Esqueci minha senha</Link>
        </div>

        <MessageBox message={msg} type={msgType} />
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
