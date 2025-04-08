"use client";
import Image from "next/image";
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
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 text-primary">
            Weather Wardrobe
          </h1>
          <div className="flex flex-col items-center ">
            <div className="w-full ">
              <input
                type="text"
                placeholder="Where are you located? "
                className="input mt-2"
              />
              <input
                type="range"
                id="formality"
                min={1}
                max={5}
                value={formality}
                onChange={handleFormalityChange}
                className="range range-sm md:range-md range-primary mt-8 "
                step={1}
              />
              <div className="flex justify-between px-2 mt-3 text-sm">
                <span>Casual</span>
                <span>Daily</span>
                <span>Smart</span>
              </div>
            </div>{" "}
          </div>

          <button className="btn btn-primary m-10 " onClick={getLocation}>
            Get Outfit
          </button>
          <div id="display" className="stats stats-primary shadow hidden">
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
  const tempElement = document.getElementById("temp");
  const descriptionElement = document.getElementById("description");
  const iconElement = document.getElementById("weatherIcon");
  tempElement.innerHTML = `${weatherData.main.temp} °F`;
  descriptionElement.innerHTML = `${weatherData.weather[0].main}`;
  iconElement.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

}

function success(position) {
  const { latitude, longitude } = position.coords;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  getWeatherByLocation(latitude, longitude);
}

function error() {
  alert("Sorry, no position available.");
}
