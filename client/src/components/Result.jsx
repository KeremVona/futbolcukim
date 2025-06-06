import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { locales } from "../locales";

export default function Result({
  isCorrect,
  correctName,
  onPlayAgain,
  streak,
  lang,
}) {
  // Language detection
  const [language] = useState(
    lang ||
      (navigator.language && navigator.language.startsWith("tr")
        ? "tr"
        : navigator.language.startsWith("ar")
        ? "ar"
        : navigator.language.startsWith("de")
        ? "de"
        : navigator.language.startsWith("it")
        ? "it"
        : navigator.language.startsWith("fr")
        ? "fr"
        : navigator.language.startsWith("es")
        ? "es"
        : navigator.language.startsWith("pt")
        ? "pt"
        : navigator.language.startsWith("ru")
        ? "ru"
        : "en")
  );
  const t = locales[language]?.result || locales.en.result;

  const [showEffect, setShowEffect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCorrect) {
      setShowEffect(true);
      const timer = setTimeout(() => setShowEffect(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect]);

  const handleReturnToStart = () => {
    navigate("/futbolcukim");
  };

  return (
    <div className="flex flex-col items-center mt-12 relative">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center relative">
        {isCorrect && showEffect && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-bounce text-7xl text-yellow-400 drop-shadow-lg select-none">
              🎉
            </div>
          </div>
        )}
        <h2
          className={`text-3xl font-extrabold mb-6 tracking-wide ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? t.congrats : t.gameOver}
        </h2>
        <div className="mb-4 text-xl text-gray-700 text-center">
          {isCorrect ? t.correctGuess : t.wrongGuess}
        </div>
        <div className="mb-4 text-lg text-gray-800 bg-blue-50 rounded px-4 py-2 shadow-inner">
          {t.answer}{" "}
          <span className="font-bold text-blue-700">{correctName}</span>
        </div>
        <div className="mb-6 text-blue-600 font-bold text-xl bg-blue-100 rounded-full px-6 py-2 shadow">
          {t.streak} {streak}
        </div>
        <div className="flex gap-4 mt-2 w-full justify-center">
          <button
            onClick={onPlayAgain}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all text-lg"
          >
            {t.playAgain}
          </button>
          <button
            onClick={handleReturnToStart}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all text-lg"
          >
            {t.goToStart}
          </button>
          <button
            onClick={() => {
              const shareText = t.shareText(streak);
              // WhatsApp share
              if (navigator.userAgent.toLowerCase().includes("whatsapp")) {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(shareText)}`,
                  "_blank"
                );
                return;
              }
              // Web Share API
              if (navigator.share) {
                navigator.share({
                  title: "Futbolcu Kim?",
                  text: shareText,
                  url: "https://keremvona.github.io/futbolcukim/",
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert(t.copied);
              }
            }}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition-all text-lg"
          >
            {t.share}
          </button>
        </div>
      </div>
    </div>
  );
}
