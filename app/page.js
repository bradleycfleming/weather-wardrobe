"use client";
import Image from "next/image";
import Outfit from "./components/Outfit";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [formality, setFormality] = useState(3);

  const handleFormalityChange = (e) => {
    setFormality(e.target.value);
  };

  return (
    <div className="">
      <main className="mx-auto min-h-screen max-w-screen-md px-6 py-12 md:px-12 md:py-16 lg:py-24">
        <div className="flex flex-col items-center min-h-screen">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-primary">
            Weather Wardrobe
          </h1>
          <div className="w-full flex flex-col items-center mb-8">
              <label className="input input-md">
                <input
                  type="text"
                  placeholder="Where are you located? " 
                  className="grow text-base"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 inline-block ml-2 hover:text-primary hover:cursor-pointer transition"
                  onClick={getLocation}
                >
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                </svg>
              </label>

              <input
                type="range"
                id="formality"
                min={1}
                max={5}
                value={formality}
                onChange={handleFormalityChange}
                className="range range-xs md:range-sm range-primary mt-8"
                step={1}
              />
              <div className="w-full max-w-xs flex justify-between px-2 mt-3 text-sm">
                <span>Casual</span>
                <span>Daily</span>
                <span>Smart</span>
              </div>
          </div>

          {/* <button className="btn btn-primary m-8 " onClick={getLocation}>
            Get Outfit
          </button> */}

          <Outfit id="outfit" className="hidden rounded-box " formality={formality}></Outfit>

          <div id="display" className="stats stats-primary shadow hidden mt-5">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <img
                  id="weatherIcon"
                  src="https://openweathermap.org/img/wn/10d@2x.png"
                  alt="Weather"
                  width={50}
                  height={50}
                />
              </div>
              <div id="description" className="stat-value"></div>
              <div id="temp" className="stat-desc"></div>
            </div>
          </div>
        </div>
      </main>
      <footer className=""></footer>
    </div>
  );
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    document.getElementById("data").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

async function getWeatherByLocation(lat, lon) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    // Weather
    const weatherData = await response.json();
    displayResults(weatherData);
  } catch (error) {
    document.getElementById(
      "data"
    ).innerHTML = `Error fetching weather data: ${error.message}`;
  }
}

function displayResults(weatherData) {
  document.getElementById("display").classList.remove("hidden");
  document.getElementById("outfit").classList.remove("hidden");

  const tempElement = document.getElementById("temp");
  const descriptionElement = document.getElementById("description");
  const iconElement = document.getElementById("weatherIcon");
  tempElement.innerHTML = `${weatherData.main.temp} °F`;
  descriptionElement.innerHTML = `${weatherData.weather[0].main}`;
  iconElement.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
}

function success(position) {
  const { latitude, longitude } = position.coords;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  getWeatherByLocation(latitude, longitude);
}

function error() {
  alert("Sorry, no position available.");
}
