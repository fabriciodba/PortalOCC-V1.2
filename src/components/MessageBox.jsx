import React from "react";

function MessageBox({ message, type }) {
  if (!message) return null;

  const className = ["mensagem"];
  if (type === "error") className.push("erro");
  if (type === "success") className.push("sucesso");

  return <div className={className.join(" ")}>{message}</div>;
}

export default MessageBox;
