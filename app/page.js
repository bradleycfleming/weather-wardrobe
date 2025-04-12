"use client";
import Image from "next/image";
import Outfit from "./components/Outfit";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [formality, setFormality] = useState("3");
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [temp, setTemp] = useState(null);
  const [wind, setWind] = useState(null);
  const [rain, setRain] = useState(null);

  const handleFormalityChange = (e) => {
    setFormality(e.target.value);
  };

  const handleCityChange = async (e) => {
    const inputValue = e.target.value;
    setCity(inputValue);

    if (inputValue.length > 1) {
      // console.log(e.target.value)

      const citySuggestions = await getCityLocation(inputValue);

      if (citySuggestions.length > 0) {
        setSuggestions(citySuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const city = suggestion;
    setCity(city.name);
    setShowSuggestions(false);

    getWeatherByLocation(city.lat, city.lon, setTemp, setWind, setRain);
  };

  const success = (position) => {
    const { latitude, longitude } = position.coords;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    // Deselect the input
    document.getElementById("cityInput").blur();

    getWeatherByLocation(latitude, longitude, setTemp, setWind, setRain);
  };

  const error = () => {
    alert("Sorry, no position available.");
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
      setCity("Your location");
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="">
      <main className="mx-auto min-h-screen max-w-screen-md px-6 py-12 md:px-12 md:py-16 lg:py-24">
        <div className="flex flex-col items-center min-h-screen">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-primary">
            Weather Wardrobe
          </h1>
          <div className="w-full flex flex-col items-center mb-8 relative">
            <label className="input input-md w-full">
              <input
                id="cityInput"
                type="text"
                placeholder="What is your city? "
                className="grow text-base "
                value={city}
                onChange={handleCityChange}
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

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full max-w-md bg-base-100 rounded-md shadow-md z-10">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-base-300 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}, {suggestion.state}, {suggestion.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="range"
            id="formality"
            min={1}
            max={5}
            value={formality}
            onChange={handleFormalityChange}
            className="range range-sm range-primary w-full max-w-md mb-3"
            step={1}
          />
          <div className="w-full  flex justify-between px-2 max-w-md mb-8 text-sm">
            <span>Casual</span>
            <span>Daily</span>
            <span>Smart</span>
          </div>

          <Outfit
            id="outfit"
            className="hidden rounded-box "
            formality={formality}
            temp={temp}
            wind={wind}
            rain={rain}
          ></Outfit>

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

async function getCityLocation(city) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}&limit=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch city location");
    }

    const cityLocation = await response.json();
    return cityLocation;
  } catch (error) {
    alert(`Error fetching city location: ${error.message}`);
  }
}

async function getWeatherByLocation(lat, lon, setTemp, setWind, setRain) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    // Weather
    const weatherData = await response.json();

    console.log(weatherData.wind);
    console.log(weatherData.rain);

    setTemp(weatherData.main.feels_like);
    setWind(weatherData.wind);
    setRain(weatherData.rain);
    displayResults(weatherData);
  } catch (error) {
    alert(`Error fetching weather data: ${error.message}`);
  }
}

function displayResults(weatherData) {
  const tempElement = document.getElementById("temp");
  const descriptionElement = document.getElementById("description");
  const iconElement = document.getElementById("weatherIcon");
  tempElement.innerHTML = `${weatherData.main.temp} °F`;
  descriptionElement.innerHTML = `${weatherData.weather[0].main}`;
  iconElement.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  document.getElementById("display").classList.remove("hidden");
  document.getElementById("outfit").classList.remove("hidden");
}
