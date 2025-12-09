import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userImg from "../assets/img/user.png";

function DbsMonitorPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dbMenuOpen, setDbMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("usuarioLogado");
    if (!stored) {
      navigate("/login");
      return;
    }
    try {
      setUsuario(JSON.parse(stored));
    } catch (error) {
      console.error("Erro ao ler usuário do localStorage:", error);
      navigate("/login");
    }
  }, [navigate]);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
    setDbMenuOpen(false);
  }

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
        <button
          type="button"
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Abrir menu de navegação"
        >
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </button>

        <div className="home-topbar-left">
          <div className="home-logo">Portal OCC</div>
        </div>

        <nav className={menuOpen ? "side-menu side-menu-open" : "side-menu"}>
          <div className="side-menu-user">
            <button
              type="button"
              className="home-user-avatar-wrapper"
              onClick={() => {
                closeMenu();
                navigate("/conta");
              }}
              title={tooltip}
            >
              <img
                src={fotoUsuario}
                alt={usuario.nome}
                className="home-user-avatar"
              />
            </button>
            <div className="side-menu-user-info">
              <span className="side-menu-user-name">{usuario.nome}</span>
              <span className="side-menu-user-email">{usuario.email}</span>
            </div>
            <button
              type="button"
              className="side-menu-logout"
              onClick={handleLogout}
              aria-label="Sair"
            >
              <span className="logout-icon-arrow">
                <span className="logout-arrow-line"></span>
              </span>
            </button>
          </div>

          <ul className="side-menu-list">
            <li>
              <Link
                to="/"
                className="side-menu-link"
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>

            <li className={dbMenuOpen ? "side-menu-item side-menu-item-open" : "side-menu-item"}>
              <button
                type="button"
                className="side-menu-link side-menu-link-dropdown"
                onClick={() => setDbMenuOpen((prev) => !prev)}
              >
                <span>Banco de dados</span>
                <span className="side-menu-dropdown-arrow">
                  {dbMenuOpen ? "▲" : "▼"}
                </span>
              </button>

              {dbMenuOpen && (
                <ul className="side-menu-sublist">
                  <li>
                    <Link
                      to="/cmdb"
                      className="side-menu-link-sub"
                      onClick={() => {
                        closeMenu();
                        setDbMenuOpen(false);
                      }}
                    >
                      CMDB
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dbs-monitor"
                      className="side-menu-link-sub"
                      onClick={() => {
                        closeMenu();
                        setDbMenuOpen(false);
                      }}
                    >
                      DBs Monitor
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {menuOpen && (
          <div
            className="side-menu-backdrop"
            onClick={closeMenu}
          />
        )}
      </header>

      <main className="page-content">
        <h1>DBs Monitor</h1>
        <p>
          Página para exibição de dashboards, métricas e status dos bancos
          de dados monitorados.
        </p>
      </main>
    </div>
  );
}

export default DbsMonitorPage;
