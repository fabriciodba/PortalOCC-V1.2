import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiUpdateAccount, apiChangePassword } from "../services/api";
import userImg from "../assets/img/user.png";

function AccountPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dbMenuOpen, setDbMenuOpen] = useState(false);

  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [telefone, setTelefone] = useState("");
  const [time, setTime] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");
  const [tema, setTema] = useState("light");

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [saving, setSaving] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showSenhaNova, setShowSenhaNova] = useState(false);
  const [showSenhaConfirmacao, setShowSenhaConfirmacao] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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




  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
    setDbMenuOpen(false);
  }

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

  async function handleSaveAccount(e) {
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

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!usuario) return;

    setMsg("");
    setMsgType(null);

    if (!senhaAtual || !senhaNova || !senhaConfirmacao) {
      setMsg("Preencha todos os campos de senha.");
      setMsgType("erro");
      return;
    }

    if (senhaNova !== senhaConfirmacao) {
      setMsg("A confirmação da senha não confere com a nova senha.");
      setMsgType("erro");
      return;
    }

    if (senhaNova.length < 6) {
      setMsg("A nova senha deve ter pelo menos 6 caracteres.");
      setMsgType("erro");
      return;
    }

    try {
      setChangingPassword(true);

      const msgSucesso = await apiChangePassword(usuario.id, {
        currentPassword: senhaAtual,
        newPassword: senhaNova,
        confirmPassword: senhaConfirmacao,
      });

      setMsg(msgSucesso);
      setMsgType("sucesso");
      setSenhaAtual("");
      setSenhaNova("");
      setSenhaConfirmacao("");
    } catch (err) {
      setMsg(err.message || "Erro ao alterar senha.");
      setMsgType("erro");
    } finally {
      setChangingPassword(false);
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
                Painel
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
                      onClick={() => {{
                        closeMenu();
                        setDbMenuOpen(false);
                      }}}
                    >
                      CMDB
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dbs-monitor"
                      className="side-menu-link-sub"
                      onClick={() => {{
                        closeMenu();
                        setDbMenuOpen(false);
                      }}}
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


      <section className="account-section">
        <h1 className="section-title">Conta</h1>

        <div className="account-layout">
          <div className="account-column account-column-left">
            <h2 className="account-subtitle">Informações pessoais</h2>

            <form className="account-form" onSubmit={handleSaveAccount}>
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
                  disabled
                  readOnly
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

              <p className="required-text">
                O e-mail e o usuário não podem ser alterados. Os demais campos são obrigatórios.
              </p>

              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </form>
          </div>

          <div className="account-column account-column-right">
            <div className="account-card account-card-dark">
              <h2 className="account-subtitle">Personalização</h2>

              <div className="account-photo-wrapper">
                <img
                  src={fotoUsuario}
                  alt="Foto do usuário"
                  className="account-photo"
                />
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
                <label htmlFor="conta-tema-switch">Tema do portal</label>
                <div className="theme-switch">
                  <span
                    className={
                      "theme-label" + (tema === "light" ? " active" : "")
                    }
                  >
                    Claro
                  </span>
                  <label className="switch">
                    <input
                      id="conta-tema-switch"
                      type="checkbox"
                      checked={tema === "dark"}
                      onChange={(e) =>
                        handleThemeChange(e.target.checked ? "dark" : "light")
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                  <span
                    className={
                      "theme-label" + (tema === "dark" ? " active" : "")
                    }
                  >
                    Escuro
                  </span>
                </div>
              </div>
            </div>

            <div className="account-card account-card-dark">
              <h2 className="account-subtitle">Alterar senha</h2>

              <form className="account-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="senha-atual">Senha atual</label>
                  <div className="password-field">
                    <input
                      type={showSenhaAtual ? "text" : "password"}
                      id="senha-atual"
                      name="senha-atual"
                      placeholder="Digite a senha atual"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowSenhaAtual((prev) => !prev)}
                    >
                      {showSenhaAtual ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="senha-nova">Nova senha</label>
                  <div className="password-field">
                    <input
                      type={showSenhaNova ? "text" : "password"}
                      id="senha-nova"
                      name="senha-nova"
                      placeholder="Digite a nova senha"
                      value={senhaNova}
                      onChange={(e) => setSenhaNova(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowSenhaNova((prev) => !prev)}
                    >
                      {showSenhaNova ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="senha-confirmacao">Confirmar nova senha</label>
                  <div className="password-field">
                    <input
                      type={showSenhaConfirmacao ? "text" : "password"}
                      id="senha-confirmacao"
                      name="senha-confirmacao"
                      placeholder="Confirme a nova senha"
                      value={senhaConfirmacao}
                      onChange={(e) => setSenhaConfirmacao(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowSenhaConfirmacao((prev) => !prev)}
                    >
                      {showSenhaConfirmacao ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Alterando..." : "Confirmar troca de senha"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {msg && (
          <p
            className={
              msgType === "erro" ? "mensagem erro" : "mensagem sucesso"
            }
          >
            {msg}
          </p>
        )}
      </section>
    </div>
  );
}

export default AccountPage;
