import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import Navbar from "./Navbar";

function mountNavbar() {
  const el = document.getElementById("navbar-root");
  if (!el) {
    console.warn("#navbar-root not found; navbar island not mounted.");
    return;
  }
  const root = createRoot(el);
  root.render(<Navbar />);
}

// Mount only after all resources (incl. CSS) have loaded to avoid FOUC/layout warnings.
if (document.readyState === "complete") {
  mountNavbar();
} else {
  window.addEventListener("load", () => {
    mountNavbar();
  }, { once: true });
}
