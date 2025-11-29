import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiUpdateAccount } from "../services/api";
import userImg from "../assets/img/user.png";

function AccountPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [telefone, setTelefone] = useState("");
  const [time, setTime] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");
  const [tema, setTema] = useState("light");

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("usuarioLogado");

    if (!stored) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUsuario(parsed);
      setNome(parsed.nome || "");
      setUsername(parsed.username || "");
      setTelefone(parsed.telefone || "");
      setTime(parsed.time || "");
      setFotoPreview(parsed.foto || "");

      const savedTheme = window.localStorage.getItem("theme") || "light";
      setTema(savedTheme);
      if (typeof document !== "undefined") {
        document.body.classList.remove("theme-light", "theme-dark");
        document.body.classList.add(savedTheme === "dark" ? "theme-dark" : "theme-light");
      }
    } catch {
      localStorage.removeItem("usuarioLogado");
      navigate("/login");
    }
  }, [navigate]);



  function handleThemeChange(novoTema) {
    setTema(novoTema);
    if (typeof document !== "undefined") {
      document.body.classList.remove("theme-light", "theme-dark");
      document.body.classList.add(novoTema === "dark" ? "theme-dark" : "theme-light");
    }
    window.localStorage.setItem("theme", novoTema);
  }

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  function handleFotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!usuario) return;

    setMsg("");
    setMsgType(null);

    if (!nome || !username || !telefone || !time) {
      setMsg("Preencha todos os campos da conta.");
      setMsgType("erro");
      return;
    }

    if (username.length < 3) {
      setMsg("O usuário deve ter pelo menos 3 caracteres.");
      setMsgType("erro");
      return;
    }

    try {
      setSaving(true);

      const atualizado = await apiUpdateAccount(usuario.id, {
        nome,
        username,
        telefone,
        time,
        foto: fotoPreview || usuario.foto || "",
      });

      const usuarioAtualizado = {
        ...usuario,
        nome: atualizado.nome,
        username: atualizado.username,
        telefone: atualizado.telefone,
        time: atualizado.time,
        foto: atualizado.foto ?? (fotoPreview || usuario.foto || ""),
      };

      setUsuario(usuarioAtualizado);
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));

      setMsg("Dados da conta atualizados com sucesso.");
      setMsgType("sucesso");
    } catch (err) {
      setMsg(err.message || "Erro ao atualizar dados da conta.");
      setMsgType("erro");
    } finally {
      setSaving(false);
    }
  }

  if (!usuario) {
    return null;
  }

  const fotoUsuario = fotoPreview || usuario.foto || userImg;
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
                  Painel
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="home-topbar-right">
          <button
            type="button"
            className="home-user-avatar-wrapper"
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

      <section className="account-section">
        <h1 className="section-title">Conta</h1>

        <div className="account-photo-wrapper">
          <img
            src={fotoUsuario}
            alt="Foto do usuário"
            className="account-photo"
          />
        </div>

        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="conta-nome">Nome</label>
            <input
              type="text"
              id="conta-nome"
              name="conta-nome"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="conta-username">Usuário</label>
            <input
              type="text"
              id="conta-username"
              name="conta-username"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="conta-email">Email</label>
            <input
              type="email"
              id="conta-email"
              name="conta-email"
              value={usuario.email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="conta-telefone">Telefone</label>
            <input
              type="tel"
              id="conta-telefone"
              name="conta-telefone"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="conta-time">Equipe</label>
            <select
              id="conta-time"
              name="conta-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              
            >
              <option value="">Selecione a equipe</option>
              <option value="N1">N1</option>
              <option value="DBA">DBA</option>
              <option value="SRE">SRE</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="conta-foto">Foto do usuário</label>
            <input
              type="file"
              id="conta-foto"
              name="conta-foto"
              accept="image/*"
              onChange={handleFotoChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="conta-tema">Tema</label>
            <select
              id="conta-tema"
              name="conta-tema"
              value={tema}
              onChange={(e) => handleThemeChange(e.target.value)}
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>

          <p className="required-text">
            O e-mail não pode ser alterado. Os demais campos são obrigatórios.
          </p>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>

          {msg && (
            <p
              className={
                msgType === "erro" ? "mensagem erro" : "mensagem sucesso"
              }
            >
              {msg}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}

export default AccountPage;
