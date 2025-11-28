import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userImg from "../assets/img/user.png";

function HomePage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuarioLogado");

    if (!stored) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUsuario(parsed);

      const savedTheme = window.localStorage.getItem("theme") || "light";
      if (typeof document !== "undefined") {
        document.body.classList.remove("theme-light", "theme-dark");
        document.body.classList.add(savedTheme === "dark" ? "theme-dark" : "theme-light");
      }
    } catch {
      localStorage.removeItem("usuarioLogado");
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  if (!usuario) {
    return null;
  }

  const fotoUsuario = usuario.foto || userImg;
  const tooltip = `${usuario.nome} (${usuario.email})`;

  return (
    <div className="page-index">
      <header className="home-topbar">
        <div className="home-topbar-left">
          <div className="home-logo">Portal OCC</div>
          <nav>
            <ul className="home-topbar-nav">
              <li>
                <Link to="/" className="home-nav-link">
                  Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="home-topbar-right">
          <button
            type="button"
            className="home-user-avatar-wrapper"
            onClick={() => navigate("/conta")}
            title={tooltip}
          >
            <img
              src={fotoUsuario}
              alt={usuario.nome}
              className="home-user-avatar"
            />
          </button>
          <button
            type="button"
            className="btn-ghost btn-logout-top"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      <main>
        <h1>
          Bem-vindo, <span id="home-title-name">{usuario.nome}</span>
        </h1>
        <p>
          Esta é a página inicial do sistema. Use esta área para colocar:
        </p>
        <ul>
          <li>Resumo de informações;</li>
          <li>Atalhos para outras funcionalidades;</li>
          <li>Indicadores e gráficos;</li>
          <li>Demais recursos que precisar.</li>
        </ul>
      </main>
    </div>
  );
}

export default HomePage;
