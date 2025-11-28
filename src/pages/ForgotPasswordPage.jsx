import React, { useState } from "react";
import { Link } from "react-router-dom";
import MessageBox from "../components/MessageBox";
import { apiForgotPassword } from "../services/api";

/**
 * Tela "Esqueci minha senha"
 * Layout mais limpo e alinhado com o HTML original (forgot-password.html),
 * sem abas e com foco apenas no formulário.
 */
function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setMsgType(null);

    if (!email) {
      setMsg("Informe o e-mail.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);
      const mensagem = await apiForgotPassword(email);
      setMsg(mensagem);
      setMsgType("success");
    } catch (err) {
      setMsg(err.message || "Erro ao solicitar redefinição. Tente novamente.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-auth">
      <div className="container">
        <h1>Esqueci minha senha</h1>

        <p style={{ fontSize: "0.9rem", marginBottom: 16 }}>
          Informe o e-mail cadastrado para receber o link de redefinição de senha.
        </p>

        <form id="forgot-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="forgot-email"></label>
            <input
              type="email"
              id="forgot-email"
              name="forgot-email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar e-mail de redefinição"}
          </button>

          <MessageBox message={msg} type={msgType} />
        </form>

        <div className="link-area" style={{ marginTop: 12 }}>
          <Link to="/login">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
