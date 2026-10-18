import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./config/authConfig";
import "./index.css";
import "../i18n";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
  </React.StrictMode>
);
