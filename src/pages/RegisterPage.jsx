import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import MessageBox from "../components/MessageBox";
import { apiRegister } from "../services/api";

function RegisterPage() {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.remove("theme-dark", "theme-light");
      document.body.classList.add("theme-light");
    }
  }, []);

  const navigate = useNavigate();

  // Dados pessoais
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [time, setTime] = useState("");

  // Dados de login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setMsgType(null);

    // Validações básicas
    if (
      !nome ||
      !email ||
      !telefone ||
      !time ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      setMsg("Todos os campos são obrigatórios. Preencha todos os campos.");
      setMsgType("error");
      return;
    }

    if (username.length < 3) {
      setMsg("O usuário deve ter pelo menos 3 caracteres.");
      setMsgType("error");
      return;
    }

    if (password.length < 6) {
      setMsg("A senha deve ter pelo menos 6 caracteres.");
      setMsgType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("As senhas não conferem.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);
      await apiRegister({
        nome,
        username,
        email,
        telefone,
        time,
        password,
      });

      setMsg("Usuário cadastrado com sucesso!");
      setMsgType("success");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setMsg(err.message || "Erro ao tentar cadastrar. Tente novamente.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Cadastro"
      subtitle="Faça o Cadastro para acessar."
      activeTab="register"
      showTabs={true}
    >
      <form id="register-form" onSubmit={handleSubmit}>
        <h2 className="section-title">Dados de login</h2>

        <div className="form-group">
          <label htmlFor="username"></label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Usuário"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password"></label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirmar senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <h2 className="section-title">Dados pessoais</h2>

        <div className="form-group">
          <label htmlFor="nome"></label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

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
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone"></label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            placeholder="Telefone"
            required
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time"></label>
          <select
            id="time"
            name="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ color: time ? "#111827" : "#9ca3af" }}
          >
            <option value="">Selecione a equipe</option>
            <option value="N1">N1</option>
            <option value="DBA">DBA</option>
            <option value="SRE">SRE</option>
          </select>
        </div>

        <p className="required-text">
          Todos os campos são obrigatórios.
        </p>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <MessageBox message={msg} type={msgType} />
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
