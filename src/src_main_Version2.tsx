import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AudioProvider } from "./context/AudioContext";
import { initAudioApp } from "./audioInit";

const audioApi = initAudioApp({ poolSize: 4, autoplayBg: true });
// Можно при желании сразу вызвать audioApi.playBg(); но это обычно заблокировано до первого жеста.
// audioApi.playBg();

createRoot(document.getElementById("root")!).render(
  <AudioProvider>
    <App />
  </AudioProvider>
);