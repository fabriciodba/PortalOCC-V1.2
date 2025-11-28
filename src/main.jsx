import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/css/styles.css";

if (typeof window !== "undefined" && typeof document !== "undefined") {
  const savedTheme = window.localStorage.getItem("theme") || "light";
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(savedTheme === "dark" ? "theme-dark" : "theme-light");
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
