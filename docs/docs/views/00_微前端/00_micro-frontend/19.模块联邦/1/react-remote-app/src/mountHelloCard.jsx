import { createRoot } from "react-dom/client";
import { HelloCard } from "./HelloCard.jsx";

export function mountHelloCard(container, initialProps) {
  const root = createRoot(container);
  let currentProps = initialProps;

  const render = () => root.render(<HelloCard {...currentProps} />);
  render();

  return {
    update(nextProps) {
      currentProps = { ...currentProps, ...nextProps };
      render();
    },
    unmount() {
      root.unmount();
    },
  };
}
