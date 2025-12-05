import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import userImg from "../assets/img/user.png";

const SLIDES = [
  {
    id: 1,
    image: "https://picsum.photos/1600/400?random=1",
    title: "Monitoramento em tempo real",
    description: "Acompanhe seus ambientes de forma centralizada pelo Portal OCC.",
  },
  {
    id: 2,
    image: "https://picsum.photos/1600/400?random=2",
    title: "Visão unificada",
    description: "Reúna informações de times e sistemas em um único painel.",
  },
  {
    id: 3,
    image: "https://picsum.photos/1600/400?random=3",
    title: "Automação e eficiência",
    description: "Ganhe agilidade no dia a dia com automações e integrações.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);


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

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);



  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
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
          </ul>
        </nav>

        {menuOpen && (
          <div
            className="side-menu-backdrop"
            onClick={closeMenu}
          />
        )}
      </header>

      <section className="hero-slider">
        <div className="hero-slider-inner">
          <img
            src={SLIDES[currentSlide].image}
            alt={SLIDES[currentSlide].title}
            className="hero-slider-image"
          />
          <div className="hero-slider-overlay">
            <h2>{SLIDES[currentSlide].title}</h2>
            <p>{SLIDES[currentSlide].description}</p>
          </div>
        </div>
        <div className="hero-slider-dots">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={
                index === currentSlide ? "slider-dot slider-dot-active" : "slider-dot"
              }
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

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
