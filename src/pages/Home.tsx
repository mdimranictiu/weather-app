import { IoSearchSharp } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";
import { TbSunset2 } from "react-icons/tb";
import { IoMdCloudOutline } from "react-icons/io";
import { FaLeaf, FaWind } from "react-icons/fa";
import pressureImg from "../../public/img/pressure.jpg";
import { BsCloudRainHeavy } from "react-icons/bs";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface HourlyWeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  hourly: {
    dt: number;
    temp: number;
    pop: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
}
interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
// interface timestamp{
//   time: string;
// }
const Home = () => {
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [Error, setError] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  console.log(location);
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [userSearched, setUserSearched] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Handle Search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value.toUpperCase());
    setUserSearched(true);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (location && userSearched) {
          setLoading(true);
          setTimestamp(null);
          const geoRes = await axios.get<GeoLocation[]>(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
              location
            )}&limit=1&appid=${API_KEY}`
          );

          const geo = geoRes.data[0];
          if (!geo) {
            setError("Location not found.");
            setLoading(false);
            return;
          }

          const { lat, lon } = geo;

          const weatherRes = await axios.get<WeatherData>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
          );

          setWeather({ ...weatherRes.data, name: location });
          const timeData = new Date(weatherRes?.data?.dt * 1000);
          setTimestamp(timeData);
          setUserSearched(false);
          setLoading(false);
        } else if(location===''){
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              const res = await axios.get<WeatherData>(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
              );

              setWeather(res.data);
              console.log(res.data);
              setLocation(res?.data?.name);
              const timeData = new Date(res?.data?.dt * 1000);
              setTimestamp(timeData);
              setLoading(false);
              setUserSearched(false);
            },
            (error) => {
              setError("Geolocation permission denied or failed.");
              setLoading(false);
            }
          );
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError("Failed to fetch weather data.");
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const time = new Date();
  const month = time.toLocaleString("default", { month: "long" });
  const year = time.getFullYear();
  const date = time.getDate();
  const dayName = time.toLocaleDateString("en-US", { weekday: "long" });

  const WeatherIcon = weather?.clouds?.all > 60 ? IoMdCloudOutline : IoSunny;

  return (
    <div className="w-[80%] py-10 mx-auto">
      <div className="flex max-sm:flex-col gap-10">
        <div className="bg-[#FFFFFF] w-[70%] max-sm:w-full ">
          <div className="p-5">
            <div className="flex max-sm:flex-col  items-center gap-5">
              <div className="w-[30%] max-sm:w-full">
                <h2 className="text-2xl font-bold">{`${month}   ${year}`}</h2>
                <p className="text-xl text-gray-500">{`${dayName} ${month} ${date} ${year}`}</p>
              </div>
              <div className=" w-[70%] max-sm:w-full relative  rounded-xl">
                <input
                  type="text"
                  onChange={handleSearch}
                  placeholder="Search location here"
                  className="py-3 px-15  w-full rounded-xl border-none"
                />
                <IoSearchSharp className="absolute -mt-8 ml-5 text-xl"></IoSearchSharp>
              </div>
            </div>
            <div className="py-5 mt-10 ">
              <h2 className="text-2xl font-bold px-5 py-10">Today Overview</h2>
              <div className="py-5  grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                <div className="flex justify-between shadow-2xl  p-5 items-center">
                  <div className="flex items-center gap-5">
                    <FaWind className="text-2xl"></FaWind>
                    <div className="flex gap-2 flex-col">
                      <h3 className="text-gray-500 text-xl">Wind Speed</h3>
                      <h2 className="text-3xl font-bold">
                        {`${weather ? weather?.wind?.speed : "loading"} M/Sec`}{" "}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between shadow-2xl p-5  items-center">
                  <div className="flex items-center ">
                    <img
                      className=" w-[50px] h-[50px]"
                      src={pressureImg}
                      alt="PressureImage"
                    />
                    <div className="flex gap-2 flex-col">
                      <h3 className="text-gray-500 text-xl">Pressure</h3>
                      <h2 className="text-3xl font-bold">{`${
                        weather ? weather?.main?.pressure : "loading"
                      } hpa`}</h2>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between shadow-2xl p-5 items-center">
                  <div className="flex gap-5 items-center">
                    <BsCloudRainHeavy className="text-2xl"></BsCloudRainHeavy>
                    <div className="flex gap-2 flex-col">
                      <h3 className="text-gray-500 text-xl">Humidity</h3>
                      <h2 className="text-3xl font-bold">{`${
                        weather ? weather?.main?.humidity : "loading"
                      } %`}</h2>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between shadow-2xl p-5  items-center">
                  <div className="flex gap-5  items-center">
                    <IoSunny className="text-2xl"></IoSunny>
                    <div className="flex gap-2 flex-col">
                      <h3 className="text-gray-500 text-xl">Feels Like</h3>
                      <h2 className="text-3xl font-bold">{weather? weather?.main?.feels_like : "loading"} &#176; C</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#213562] w-[30%] max-sm:w-full rounded-xl p-3  text-white">
          <div className="p-5 h-full">
            <div className="flex items-center py-5 justify-between ">
              {loading ? (
                <p>Loading .....</p>
              ) : (
                <div>
                  <h2 className="text-2xl ">
                   {weather ? `${location}, ${weather?.sys?.country}` : "Loading"}

                  </h2>
                  <h4>{timestamp?.toLocaleString()}</h4>
                </div>
              )}
              <div className="text-2xl">
                <h2 className="text-xl font-semibold"></h2>
              </div>
            </div>
            <div className="py-5 ">
              <WeatherIcon className="text-6xl" />
            </div>
            <div className="py-5 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                {weather?.main?.temp}&#176; C
              </h2>

              <h3 className="text-xl">
                {weather?.clouds?.all > 85
                  ? "Cloudy"
                  : weather?.clouds?.all > 70
                  ? "Mostly Cloudy"
                  : weather?.clouds?.all > 30
                  ? "Partly Cloudy"
                  : "Clear"}
              </h3>
            </div>

            <hr />
            <div className="py-5">
              <h2 className="text-2xl font-bold mb-5">Sunrise & Sunset</h2>
              <div className=" flex  flex-col gap-5">
                <div className="flex justify-between items-center  px-5 py-2 rounded-xl">
                  <div className="flex gap-5 items-center justify-between">
                    <IoSunny className="text-2xl"></IoSunny>
                    <div className="gap-5">
                      <h3>Sunrise</h3>
                      <h3>{weather ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</h3>
                    </div>
                  </div>
        
                </div>
                <div className="flex justify-between items-center  px-5 py-2 rounded-xl">
                  <div className="flex gap-5 items-center justify-between">
                    <TbSunset2 className="text-2xl"></TbSunset2>
                    <div className="gap-5">
                      <h3>Sunset</h3>
                      <h3>{weather ? new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
