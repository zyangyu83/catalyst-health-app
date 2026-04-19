import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { HashRouter } from "react-router-dom"; // 1. 导入 HashRouter

createRoot(document.getElementById("root")!).render(
  <HashRouter> {/* 2. 把 App 包在 HashRouter 里 */}
    <App />
  </HashRouter>
);