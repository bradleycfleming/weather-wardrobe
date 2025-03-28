"use client";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <main className="flex">
        <button className="btn btn-primary m-10" onClick={getLocation}>
          Yuh
        </button>
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
    document.getElementById("data").innerHTML = "Geolocation is not supported by this browser.";
  }
}

async function getWeatherByLocation(lat, lon) {
  const apiKey = "c980e344905edd7f86d4dec9270bc869"; 
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const weatherData = await response.json();
    document.getElementById("data").innerHTML = `Weather: ${weatherData.weather[0].description}, Temperature: ${weatherData.main.feels_like}°F`;
  } catch (error) {
    document.getElementById("data").innerHTML = `Error fetching weather data: ${error.message}`;
  }
}

function success(position) {
  const { latitude, longitude } = position.coords;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  getWeatherByLocation(latitude, longitude);
}

function error() {
  alert("Sorry, no position available.");
}
