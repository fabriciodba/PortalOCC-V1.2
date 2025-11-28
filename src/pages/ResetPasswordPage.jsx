import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import MessageBox from "../components/MessageBox";
import { apiResetPassword } from "../services/api";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const query = useQuery();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenFromQuery = query.get("token") || "";
    setToken(tokenFromQuery);
  }, [query]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setMsgType(null);

    if (!token) {
      setMsg("Token de redefinição não encontrado.");
      setMsgType("error");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMsg("Preencha todos os campos.");
      setMsgType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMsg("A nova senha deve ter pelo menos 6 caracteres.");
      setMsgType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("As senhas não conferem.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);
      const mensagem = await apiResetPassword({ token, newPassword });
      setMsg(mensagem);
      setMsgType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg(err.message || "Erro ao redefinir a senha. Tente novamente.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Informe a nova senha para sua conta. Este link só é válido por um período limitado."
      activeTab={null}
      showTabs={false}
    >
      <form id="reset-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="new-password"></label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            placeholder="Nova senha"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password"></label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirmar nova senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </button>

        <div className="links-extra">
          <Link to="/login">Voltar ao login</Link>
        </div>

        <MessageBox message={msg} type={msgType} />
      </form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
