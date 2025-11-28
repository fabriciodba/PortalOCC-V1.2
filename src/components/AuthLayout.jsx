import React from "react";
import { Link } from "react-router-dom";
import userImg from "../assets/img/user.png";

function AuthLayout({ title, subtitle, activeTab, showTabs = true, children }) {
  return (
    <div className="page-auth">
      <div className="container">
        {showTabs && (
          <div className="tabs">
            <Link
              to="/login"
              className={`tab ${activeTab === "login" ? "active" : ""}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`tab ${activeTab === "register" ? "active" : ""}`}
            >
              Cadastro
            </Link>
          </div>
        )}

        <h1>{title}</h1>

        <div className="auth-avatar">
          <img src={userImg} alt="Usuário" />
        </div>

        {subtitle && <p className="auth-subtitle">{subtitle}</p>}


        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
