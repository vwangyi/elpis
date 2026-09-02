import "./hello-card.css";

export function HelloCard({ name, onConfirm }) {
  return (
    <article className="remote-hello-card">
      <span>REACT REMOTE</span>
      <h2>你好，{name}</h2>
      <p>这张卡片由 React 子应用在运行时提供。</p>
      <button type="button" onClick={() => onConfirm?.(`React 子应用已收到 ${name} 的操作`)}>
        确认收到
      </button>
    </article>
  );
}
