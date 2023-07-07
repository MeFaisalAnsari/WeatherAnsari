import React, { useEffect, useState } from "react";
import icons from "./assets/icons";
import logo from "./assets/img/favicon.png";
import SearchIcon from "@mui/icons-material/Search";
import AirIcon from "@mui/icons-material/Air";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import ExtraInfo from "./ExtraInfo";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [isDay, setIsDay] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchData = async (city) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(weatherInfo(data));
        setIsDay(checkDay(data));
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        setError("");
      } else {
        setError("City not found! Please enter correct name.");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch weather data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData("london");
  }, []);

  const handleSubmit = async (e) => {
    if (city !== "" && e.key === "Enter") {
      fetchData(city);
      setCity("");
    }
  };

  const checkDay = (data) => {
    const sunrise = getAdjustedDate(
      new Date(data.sys.sunrise * 1000),
      data.timezone
    ).getTime();
    const sunset = getAdjustedDate(
      new Date(data.sys.sunset * 1000),
      data.timezone
    ).getTime();
    const currentTime = getAdjustedDate(new Date(), data.timezone).getTime();

    if (currentTime > sunrise && currentTime < sunset) {
      return true;
    } else {
      return false;
    }
  };

  const getAdjustedDate = (date, timezone) => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60;
    const adjustedDate = new Date(
      date.getTime() + timezoneOffset * 1000 + timezone * 1000
    );
    return adjustedDate;
  };

  const getFormattedTime = (date) => {
    const formatTime = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formatTime;
  };

  const weatherInfo = (data) => {
    const monthsName = [
      "Januar",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = getAdjustedDate(new Date(), data.timezone);
    const day = String(date.getDate()).padStart(2, "0");
    const month = monthsName[date.getMonth()];
    const year = date.getFullYear();

    const sunriseTime = getFormattedTime(
      getAdjustedDate(new Date(data.sys.sunrise * 1000), data.timezone)
    );

    return {
      name: data.name,
      country: data.sys.country,
      date: `${day} ${month} ${year}`,
      time: getFormattedTime(date),
      icon: icons[`img${data.weather[0].icon}`],
      weatherType: data.weather[0].main,
      temperature: Math.round(data.main.temp),
      wind: data.wind.speed,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      sunrise: sunriseTime,
    };
  };

  const {
    name,
    country,
    date,
    time,
    temperature,
    icon,
    weatherType,
    wind,
    humidity,
    sunrise,
  } = weatherData;

  return (
    <div
      className={`app ${
        isDay ? "" : "night"
      } min-h-screen text-white flex flex-col py-2 gap-4 justify-center items-center`}
    >
      <div className="flex justify-center items-center drop-shadow gap-4">
        <img src={logo} alt="WeatherAnsari" className="w-12" />
        <h4 className="text-3xl font-semibold">WeatherAnsari</h4>
      </div>
      <div className="mx-auto w-[85%] sm:w-[400px] bg-glass p-6 sm:p-8">
        <div className="flex bg-white rounded-lg gap-2 px-4 py-3 text-slate-500 shadow-lg w-full">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search city..."
            className="border-none outline-none w-full"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleSubmit}
          />
        </div>
        <div className={`app-content ${isLoading ? "" : "show-data"}`}>
          {error ? (
            <div className="flex text-center justify-center items-center my-40 drop-shadow font-semibold">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="mt-4 drop-shadow">
                <p className="text-xl font-semibold">
                  {name}, {country}
                </p>
                <p className="text-sm">{date}</p>
                <p className="text-sm">{time}</p>
              </div>
              <div className="flex gap-6 sm:gap-12 justify-center items-center mt-8">
                <img
                  src={icon}
                  alt={weatherType}
                  className="w-28 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                />
                <div className="flex items-start drop-shadow">
                  <div className="text-center">
                    <h4 className="text-[90px] leading-none font-semibold">
                      {temperature}
                    </h4>
                    <p className="text-xl tracking-widest uppercase">
                      {weatherType}
                    </p>
                  </div>
                  <div className="text-xl">&deg; C</div>
                </div>
              </div>

              <div className="mt-8 flex justify-between text-center drop-shadow">
                <ExtraInfo
                  Icon={AirIcon}
                  title="Wind"
                  value={wind}
                  unit="km/h"
                />
                <ExtraInfo
                  Icon={WaterDropOutlinedIcon}
                  title="Humidity"
                  value={humidity}
                  unit="%"
                />
                <ExtraInfo
                  Icon={WbSunnyOutlinedIcon}
                  title="Sunrise"
                  value={sunrise}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <p className="mt-4 drop-shadow">
        Made with <FavoriteIcon /> by{" "}
        <a
          href="http://faisalansari.me/"
          target="_blank"
          className="hover:underline"
        >
          Faisal Ansari
        </a>
      </p>
    </div>
  );
};

export default App;
