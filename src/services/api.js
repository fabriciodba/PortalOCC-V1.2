export const API_BASE_URL = "http://127.0.0.1:8000";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiLogin({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await readJson(response);

  if (!response.ok) {
    let msg = "E-mail ou senha inválidos.";
    if (data && data.detail) msg = data.detail;
    throw new Error(msg);
  }

  return data;
}

export async function apiRegister({ nome, email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password }),
  });

  const data = await readJson(response);

  if (!response.ok) {
    let msg = "Erro ao cadastrar usuário.";
    if (data && data.detail) msg = data.detail;
    throw new Error(msg);
  }

  return data;
}

export async function apiForgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await readJson(response);
  const msg = data && data.detail ? data.detail : null;

  if (!response.ok) {
    throw new Error(msg || "Erro ao solicitar redefinição de senha.");
  }

  return msg || "Enviamos um e-mail com instruções para redefinir sua senha.";
}

export async function apiResetPassword({ token, newPassword }) {
  const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  const data = await readJson(response);
  const msg = data && data.detail ? data.detail : null;

  if (!response.ok) {
    throw new Error(msg || "Token inválido ou expirado.");
  }

  return msg || "Senha redefinida com sucesso!";
}
