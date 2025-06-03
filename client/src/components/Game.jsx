import React, { useState, useEffect } from "react";
import { playersSuperLig } from "../../playersSuperLig";
import { playersAllTime } from "../../playersAllTime";
import Result from "./Result";
import { useParams, useNavigate } from "react-router-dom";

export default function Game({ initialMode }) {
  const params = useParams ? useParams() : {};
  const urlMode = params.mode;
  const mode = urlMode || initialMode || "superlig";
  const playerList = mode === "superlig" ? playersSuperLig : playersAllTime;
  const [chosenPlayer, setChosenPlayer] = useState(() => {
    return playerList[Math.floor(Math.random() * playerList.length)];
  });
  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [streak, setStreak] = useState(() => {
    const stored = localStorage.getItem("streak");
    return stored ? parseInt(stored, 10) : 0;
  });
  const [timedMode, setTimedMode] = useState(mode === "timed");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [extraHints, setExtraHints] = useState(0);
  const [points, setPoints] = useState(100);
  const navigate = useNavigate ? useNavigate() : null;

  const maxGuesses = 5;
  const hints = [
    `Uyruk: ${chosenPlayer.nationality}`,
    `Pozisyon: ${chosenPlayer.position}`,
    `Kulüp: ${
      chosenPlayer.club ||
      (chosenPlayer.clubs ? chosenPlayer.clubs.join(", ") : "")
    }`,
    chosenPlayer.played_in_turkey
      ? `Türkiye'de oynadığı yıllar: ${chosenPlayer.played_in_turkey}`
      : null,
    `İlginç bilgi: ${chosenPlayer.fun_fact}`,
  ].filter(Boolean);
  // Calculate how many hints to show (initial + extra)
  const hintsToShow = Math.min(guesses.length + 1 + extraHints, hints.length);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setHighlightedIndex(0);
      return;
    }
    const filtered = playerList
      .map((p) => p.name)
      .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()));
    setSuggestions(filtered);
    setHighlightedIndex(0);
  };
  const handleInputKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === "Tab") {
      e.preventDefault();
      setInputValue(suggestions[highlightedIndex]);
      setSuggestions([]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    }
  };
  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const guess = inputValue.trim();
      setGuesses([...guesses, guess]);
      setInputValue("");
      if (timedMode) {
        if (guess.toLowerCase() === chosenPlayer.name.toLowerCase()) {
          setCorrectCount((c) => c + 1);
        } else {
          setWrongCount((w) => w + 1);
        }
        setChosenPlayer(
          playerList[Math.floor(Math.random() * playerList.length)]
        );
        setGuesses([]);
        setSuggestions([]);
        setHighlightedIndex(0);
        setExtraHints(0); // Reset extra hints for new player
      } else {
        if (guess.toLowerCase() === chosenPlayer.name.toLowerCase()) {
          setIsCorrect(true);
          setShowResult(true);
          setExtraHints(0); // Reset extra hints on correct guess
        } else if (guesses.length + 1 >= maxGuesses) {
          setIsCorrect(false);
          setShowResult(true);
          setExtraHints(0); // Reset extra hints on game over
        }
      }
    }
  };

  const handlePlayAgain = () => {
    setChosenPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
    setGuesses([]);
    setInputValue("");
    setShowResult(false);
    setIsCorrect(false);
    setExtraHints(0); // Reset extra hints for new player
    setPoints(100); // Reset points when restarting the game
  };

  const handleSkip = () => {
    setWrongCount((w) => w + 1);
    setChosenPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
    setGuesses([]);
    setInputValue("");
    setSuggestions([]);
    setHighlightedIndex(0);
    setExtraHints(0); // Reset extra hints for new player
  };

  const handleGetHint = () => {
    if (hintsToShow < hints.length && points > 0) {
      setExtraHints(extraHints + 1);
      setPoints(points - 10); // Decrease points by 10 for each hint
    }
  };

  // Timer effect for timed mode
  useEffect(() => {
    if (!timedMode || showResult || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timedMode, timeLeft, showResult, gameOver]);

  // Update streak when result is shown
  useEffect(() => {
    if (showResult) {
      if (isCorrect) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("streak", newStreak);
      } else if (streak !== 0) {
        setStreak(0);
        localStorage.setItem("streak", 0);
      }
    }
    // eslint-disable-next-line
  }, [showResult]);

  // When game is over in timed mode, show result summary
  if (timedMode && gameOver) {
    return (
      <div className="flex flex-col items-center mt-12 relative">
        <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center relative">
          <h2 className="text-3xl font-extrabold mb-6 tracking-wide text-blue-700">
            Süre doldu!
          </h2>
          <div className="mb-4 text-xl text-gray-700 text-center">
            Toplam doğru:{" "}
            <span className="font-bold text-green-600">{correctCount}</span>
          </div>
          <div className="mb-4 text-xl text-gray-700 text-center">
            Toplam yanlış:{" "}
            <span className="font-bold text-red-600">{wrongCount}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all text-lg mt-4"
          >
            Tekrar Oyna
          </button>
          <button
            onClick={() => navigate && navigate("/futbolcukim")}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold shadow hover:bg-gray-300 transition-all text-lg mt-4"
          >
            Başlangıca git
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <Result
        isCorrect={isCorrect}
        correctName={chosenPlayer.name}
        onPlayAgain={handlePlayAgain}
        streak={streak}
      />
    );
  }

  return (
    <>
      {timedMode && (
        <div className="flex flex-col items-center mb-4">
          <div className="text-2xl font-bold text-blue-700 mb-2">
            Kalan Süre: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
          <div className="flex gap-6 mb-2">
            <span className="text-green-600 font-bold">
              Doğru: {correctCount}
            </span>
            <span className="text-red-600 font-bold">Yanlış: {wrongCount}</span>
          </div>
        </div>
      )}
      <div className="mb-2 text-blue-600 font-bold text-2xl text-center tracking-wide drop-shadow-sm">
        <span className="inline-block px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full shadow">
          Art arda: {streak}
        </span>
        <span className="inline-block px-4 py-1 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full shadow ml-2">
          Puan: {points}
        </span>
      </div>
      <div className="flex justify-center mb-4 gap-4">
        <button
          onClick={() => navigate && navigate("/futbolcukim")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold shadow"
        >
          Başlangıca geri dön
        </button>
        <button
          type="button"
          onClick={handleGetHint}
          disabled={hintsToShow >= hints.length || points <= 0}
          className="px-4 py-2 bg-yellow-400 text-white rounded font-semibold shadow hover:bg-yellow-500 transition-all text-lg disabled:opacity-50"
        >
          İpucu Al (-10 puan)
        </button>
      </div>
      <div className="mb-6 p-6 bg-white rounded-lg shadow-lg border border-blue-100 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
          İp uçları
        </h2>
        <ul className="list-disc pl-8 space-y-2">
          {hints.slice(0, hintsToShow).map((hint, idx) => (
            <li key={idx} className="text-gray-800 text-lg">
              {hint}
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={handleInputSubmit}
        className="flex flex-col items-center gap-2 max-w-xl mx-auto"
      >
        <label htmlFor="player-guess" className="w-full">
          <span className="block text-base font-medium text-gray-700 mb-1">
            Futbolcuyu tahmin et
          </span>
          <div className="relative">
            <input
              type="text"
              id="player-guess"
              className="w-full rounded border-2 border-blue-300 focus:border-blue-500 shadow-sm sm:text-lg px-4 py-2 transition-all duration-150 outline-none"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              disabled={guesses.length >= maxGuesses}
              autoComplete="off"
              placeholder="Bir futbolcunun ismini yaz..."
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-blue-200 rounded shadow z-20 max-h-48 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <li
                    key={s}
                    className={`px-4 py-2 cursor-pointer text-base ${
                      idx === highlightedIndex
                        ? "bg-blue-100 font-semibold"
                        : "hover:bg-blue-50"
                    }`}
                    onMouseDown={() => {
                      setInputValue(s);
                      setSuggestions([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </label>
        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-all text-lg disabled:opacity-50"
          disabled={guesses.length >= maxGuesses}
        >
          Tahmini gönder
        </button>
        {timedMode && (
          <button
            type="button"
            onClick={handleSkip}
            className="mt-2 px-6 py-2 bg-yellow-400 text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition-all text-lg"
          >
            Soruyu Geç
          </button>
        )}
      </form>
      <div className="mt-8 max-w-xl mx-auto p-4 bg-white rounded-lg shadow border border-blue-100">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">
          Tahminler{" "}
          <span className="text-gray-500">
            ({guesses.length}/{maxGuesses})
          </span>
          :
        </h2>
        <ul className="list-decimal pl-8 space-y-1">
          {guesses.map((guess, idx) => (
            <li key={idx} className="text-gray-800 text-base">
              {guess}
            </li>
          ))}
        </ul>
        <div className="mt-2 text-red-600 font-semibold text-center">
          {guesses.length >= maxGuesses && !showResult && "No guesses left!"}
        </div>
      </div>
    </>
  );
}
