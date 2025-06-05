import React, { useState } from "react";
import img1 from "../../public/1.jpg";
import { locales } from "../locales";

export default function Start({ onStart, lang }) {
  const [mode, setMode] = useState("superlig");
  // Language detection
  const [language, setLanguage] = useState(
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

  const t = locales[language]?.start || locales.en.start;

  const handleStart = (e) => {
    e.preventDefault();
    if (onStart) onStart(mode);
  };

  return (
    <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
      <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div className="text-left">
          <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 drop-shadow-lg sm:text-5xl sm:leading-none md:text-6xl mb-4">
            {t.title.split(" ")[0]}{" "}
            <span className="font-bold">{t.title.split(" ")[1]} </span>
            <span className="text-4xl font-semibold rounded-full text-blue-700">
              {t.title.split(" ")[2]}
            </span>
          </h2>
          <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t.description}
          </p>
          <form className="mt-5 sm:flex md:mt-8" onSubmit={handleStart}>
            <div className="mb-4">
              <label className="font-semibold mr-2">{t.gameMode}</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="superlig">{t.superlig}</option>
                <option value="alltime">{t.alltime}</option>
                <option value="timed">{t.timed}</option>
              </select>
            </div>
            <div className="rounded-md shadow lg:ml-2">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
              >
                {t.start}
              </button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <button
                type="button"
                onClick={() => {
                  const shareText = `Futbolcu Kim oyununu dene! Süper Lig ve efsane futbolcuları tahmin et: https://keremvona.github.io/futbolcukim/`;
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
                    alert("Paylaşım panoya kopyalandı!");
                  }
                }}
                className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-blue-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
              >
                {t.share}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
        <div className="relative w-full p-3 rounded  md:p-8">
          <div className="rounded-lg bg-white text-black w-full">
            <img
              src={img1}
              alt=""
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
