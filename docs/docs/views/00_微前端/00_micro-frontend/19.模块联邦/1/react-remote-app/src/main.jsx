import { createRoot } from "react-dom/client";
import { HelloCard } from "./HelloCard.jsx";
import "./app.css";

createRoot(document.querySelector("#root")).render(
  <main className="page">
    <p className="eyebrow">React Remote · localhost:5302</p>
    <h1>React 子应用</h1>
    <p>它可以独立运行，也可以把业务卡片暴露给 Vue 主应用。</p>
    <HelloCard name="独立访问者" />
  </main>,
);
