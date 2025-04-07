"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [formality, setFormality] = useState("Casual");
  const dropDownRef = useRef(null);

  const handleSelection = (formality) => {
    setFormality(formality);
    closeDropdown();
  };

  const handleClickOutside = (event) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    if (dropDownRef.current) {
      // This will close the dropdown by removing the open attribute
      dropDownRef.current.removeAttribute("open");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      <main className="mx-auto min-h-screen max-w-screen-md px-6 py-12 md:px-12 md:py-16 lg:py-24">
        <div className="flex flex-col items-center min-h-screen">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 text-primary">
            Weather Wardrobe
          </h1>
          <input
            type="text"
            placeholder="Where are you located? "
            className="input"
          />
          <div className="flex justify-center">
            <button className="btn btn-primary m-10 " onClick={getLocation}>
              Get Outfit
            </button>
            <div className="m-10">
              <details className="dropdown" ref={dropDownRef}>
                <summary id="formalityDropdown" className="btn w-20">{formality}</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                  <li>
                    <a onClick={() => handleSelection("Casual")}>Casual</a>
                  </li>
                  <li>
                    <a onClick={() => handleSelection("Daily")}>Daily</a>
                  </li>
                  <li>
                    <a onClick={() => handleSelection("Smart")}>Smart</a>
                  </li>
                </ul>
              </details>
            </div>
          </div>
          <p id="data" className="m-10">
            No data currently
          </p>
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
  const domElement = document.getElementById("data");
  domElement.innerHTML = `Weather: ${weatherData.weather[0].main}`;
  domElement.innerHTML += `<br>Feels Like Temperature: ${weatherData.main.feels_like}°F`;
  domElement.innerHTML += `<br>Wind: ${weatherData.wind.speed} mph`;
  domElement.innerHTML += `<br>Formality: ${document.getElementById("formalityDropdown").innerHTML}`;
}

function success(position) {
  const { latitude, longitude } = position.coords;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  getWeatherByLocation(latitude, longitude);
}

function error() {
  alert("Sorry, no position available.");
}
