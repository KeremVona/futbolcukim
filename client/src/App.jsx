import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Start from "./components/Start";
import Game from "./components/Game";

function StartScreen() {
  const navigate = useNavigate();
  // Detect browser language
  const lang =
    navigator.language && navigator.language.startsWith("tr") ? "tr" : "en";
  const handleStart = (mode) => {
    navigate(`/game/${mode}`);
  };
  return <Start onStart={handleStart} lang={lang} />;
}

function GameScreen() {
  // Get mode from URL
  const mode = window.location.pathname.split("/").pop();
  // Detect browser language
  const lang =
    navigator.language && navigator.language.startsWith("tr") ? "tr" : "en";
  return <Game initialMode={mode} lang={lang} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/futbolcukim" element={<StartScreen />} />
        <Route path="/game/:mode" element={<GameScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
