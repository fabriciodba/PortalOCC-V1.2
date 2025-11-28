import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import MessageBox from "../components/MessageBox";
import { apiRegister } from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setMsgType(null);

    if (!nome || !email || !password || !confirmPassword) {
      setMsg("Preencha todos os campos.");
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
      await apiRegister({ nome, email, password });

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
        <div className="form-group">
          <label htmlFor="nome"></label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome Completo"
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

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <MessageBox message={msg} type={msgType} />
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
