import "./index.css";

import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("rp>>init");

const body = document.getElementsByTagName("body")[0];
const div = document.createElement("div");
div.setAttribute("id", "zagi_root");
body.appendChild(div);
//---
ReactDOM.createRoot(div).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
