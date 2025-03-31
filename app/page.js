"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [formality, setFormality] = useState("Casual");


  const handleSelection = (formality) =>{
    setFormality(formality);
  }

  return (
    <div className="">
      <main className="flex">
        <button className="btn btn-primary m-10" onClick={getLocation}>
          Yuh
        </button>
        <div className="m-9">
          <details className="dropdown">
            <summary className="btn m-1">{formality}</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <a onClick={() => handleSelection("Casual")}>Casual</a>
              </li>
              <li>
                <a onClick={() => handleSelection("Daily")} >Daily</a>
              </li>
              <li>
                <a onClick={() => handleSelection("Smart")}>Smart</a>
              </li>
            </ul>
          </details>
        </div>
        <p id="data" className="m-10">
          No data currently
        </p>
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
  domElement.innerHTML += `<br>Temperature: ${weatherData.main.feels_like}°F`;
  domElement.innerHTML += `<br>Wind: ${weatherData.wind.speed} mph`;
}

function success(position) {
  const { latitude, longitude } = position.coords;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  getWeatherByLocation(latitude, longitude);
}

function error() {
  alert("Sorry, no position available.");
}
