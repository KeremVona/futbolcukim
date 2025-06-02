import React, { useState } from "react";
import img1 from "../../public/1.jpg";

export default function Start({ onStart }) {
  const [mode, setMode] = useState("superlig");

  const handleStart = (e) => {
    e.preventDefault();
    if (onStart) onStart(mode);
  };

  return (
    <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8">
      <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
        <div className="text-left">
          <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-700 drop-shadow-lg sm:text-5xl sm:leading-none md:text-6xl mb-4">
            Futbolcuları <span className="font-bold">Tahmin </span>
            <span className="text-4xl font-semibold rounded-full text-blue-700">
              Et
            </span>
          </h2>
          <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Milliyeti, pozisyonu ve ilginç bilgiler gibi ipuçlarından Süper Lig
            yıldızlarını tahmin et. Hepsini doğru söyleyebilir misin? Kendine
            meydan oku ve gerçek bir futbol uzmanı ol!
          </p>
          <form className="mt-5 sm:flex md:mt-8" onSubmit={handleStart}>
            <div className="mb-4">
              <label className="font-semibold mr-2">Oyun Modu:</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="superlig">Süper Lig (Güncel Oyuncular)</option>
                <option value="alltime">Tüm Zamanlar</option>
              </select>
            </div>
            <div className="rounded-md shadow lg:ml-2">
              <button
                type="submit"
                className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
              >
                Oyuna başla
              </button>
            </div>
            {/*<div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="flex items-center justify-center w-full px-8 py-3 text-base font-medium leading-6 text-blue-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-blue-600 focus:outline-none focus:shadow-outline-blue md:py-4 md:text-lg md:px-10"
              >
                Nasıl oynanır
              </a>
            </div>*/}
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
