import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const hideSplash = () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    splash.classList.add("hide");
    setTimeout(() => splash.remove(), 500);
  }
};

createRoot(document.getElementById("root")!).render(<App />);

// Hide splash after app mounts (min 1.2s for animation to play)
setTimeout(hideSplash, 1200);
