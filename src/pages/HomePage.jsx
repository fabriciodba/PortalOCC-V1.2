import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  return (
    <div className="page-index">
      <aside className="sidebar">
        <div>
          <div className="sidebar-header">Portal OCC</div>

          <nav>
            <ul className="sidebar-menu">
              <li>
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                  Painel
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-label">
              <span>Usuário:</span>
              <strong id="user-name">{usuario.nome}</strong>
            </div>
            <div id="user-email" className="sidebar-user-email">
              {usuario.email}
            </div>
          </div>
          <button
            id="logout-btn"
            className="btn-logout"
            type="button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </aside>

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
