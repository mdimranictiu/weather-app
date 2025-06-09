import { IoSearchSharp } from "react-icons/io5";
import { IoSunny } from "react-icons/io5";
import { TbSunset2 } from "react-icons/tb";
import { IoMdCloudOutline } from "react-icons/io";
import { FaWind } from "react-icons/fa";
import pressureImg from '../../public/img/pressure.jpg'
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

interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
const Home = () => {

    const [location,setLocation]=useState<string>('')
    const [loading,setLoading]=useState<boolean>(false)
    const [weather,setWeather]=useState< WeatherData | null>(null)
    const [Error,setError]=useState<string>('')
     const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
    console.log(location)

 const API_KEY = import.meta.env.VITE_API_KEY;


    // get geolocation
 useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError("");

      try {
        if (!location) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            const res = await axios.get<WeatherData>(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
            );

            setWeather(res.data);
            setLocation(res?.data?.name)
             const fetchLocation = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );

        const data = response.data;
        console.log('from' ,data)
        setCountry(data.address.country);
        setCity(data.address.county || '');
      } catch (error) {
        console.error("Location fetch failed:", error);
      }
    };

    fetchLocation();
            setLoading(false);
          });
     
        } else {
          const geoRes = await axios.get<GeoLocation[]>(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${API_KEY}`
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

          setWeather({...weatherRes.data,name: location});
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
        setLoading(false);
      }
    };
             const fetchLocation = async () => {
      try {
        setCountry('')
        setCity('')
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );

        const data = response.data;
        console.log('from' ,data)
        setCountry(data.address.country);
        setCity(data.address.county || '');
      } catch (error) {
        console.error("Location fetch failed:", error);
      }
    };

    fetchWeather();
  }, [location]);
  console.log(weather)

  const time= new Date();
  const month=time.toLocaleString('default',{month: 'long'});
  const year= time.getFullYear();
  const date= time.getDate();
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const hour= time.getHours()
  const minutes= time.getMinutes()
  const ampm = hour >= 12 ? 'PM' : 'AM';


  


  return (
    <div className="w-[80%] py-10 mx-auto">
      <div className="flex max-sm:flex-col-reverse  gap-10">
        <div className="bg-[#FFFFFF] w-[70%] max-sm:w-full ">
          <div className="p-5">
           <div className="flex max-sm:flex-col  items-center gap-5">
            <div className="w-[30%] max-sm:w-full">
                <h2 className="text-2xl font-bold">{`${month}   ${year}`}</h2>
                <p className="text-xl text-gray-500">{`${dayName} ${month} ${date} ${year}`}</p>
            </div>
            <div className=" w-[70%] max-sm:w-full relative  rounded-xl">
                <input type="text"  onChange={(e)=>setLocation(e.target.value)} placeholder="Search location here" className="py-3 px-15  w-full rounded-xl border-none" />
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
                <h2 className="text-3xl font-bold">12 KM/H</h2>
               </div>
            </div>
            <div>
               <FaAngleDown className="text-red-600"></FaAngleDown>
                <p className="text-gray-400 text-xl">12%</p>
            </div>
           </div>
           <div className="flex justify-between shadow-2xl p-5  items-center">
            <div className="flex items-center ">
               <img className=" w-[50px] h-[50px]" src={pressureImg} alt="PressureImage" /> 
               <div className="flex gap-2 flex-col">
                <h3 className="text-gray-500 text-xl">Pressure</h3>
                <h2 className="text-3xl font-bold">12 KM/H</h2>
               </div>
            </div>
            <div>
                <FaAngleDown className="text-red-600"></FaAngleDown>
                <p className="text-gray-400 text-xl">12%</p>
            </div>
           </div>
           <div className="flex justify-between shadow-2xl p-5 items-center">
            <div className="flex gap-5 items-center">
               <BsCloudRainHeavy className="text-2xl"></BsCloudRainHeavy>
               <div className="flex gap-2 flex-col">
                <h3 className="text-gray-500 text-xl">Rain Chance</h3>
                <h2 className="text-3xl font-bold">12 KM/H</h2>
               </div>
            </div>
            <div>
                <FaAngleUp className="text-green-700"></FaAngleUp>
                <p className="text-gray-400 text-xl">12%</p>
            </div>
           </div>
           <div className="flex justify-between shadow-2xl p-5  items-center">
            <div className="flex gap-5  items-center">
               <IoSunny className="text-2xl"></IoSunny>
               <div className="flex gap-2 flex-col">
                <h3 className="text-gray-500 text-xl">U,v Index</h3>
                <h2 className="text-3xl font-bold">12 KM/H</h2>
               </div>
            </div>
            <div>
               <FaAngleDown className="text-red-600"></FaAngleDown>
                <p className="text-gray-400 text-xl">12%</p>
            </div>
           </div>
           </div>
           </div>
          </div>
        </div>
        <div className="bg-[#213562] w-[30%] max-sm:w-full rounded-xl p-3  text-white">

            <div className="p-5 h-full">
             <div className="flex items-center py-5 justify-between ">
               {loading? (
                <p>Loading .....</p>
               ):
                (
                     <div >
                    <h2 className="text-2xl ">{location}</h2>
                    <h4>{city} ,{country}</h4>
                </div>
                )
               }
                <div className="text-2xl">
                    <span>{hour}: {minutes} {ampm}</span>
                </div>

             </div>
             <div className="py-5 ">
                <IoMdCloudOutline className="text-6xl"></IoMdCloudOutline>
             </div>
             <div className="py-5 flex items-center justify-between">
                <h2 className="text-3xl font-bold">20 degree C</h2>
                <h3 className="text-xl">Dramatic Cloudy</h3>
             </div>

             <hr />
             <div className="py-5">
                <h3 className="text-xl font-semibold">Chance of rain</h3>
                <div className="flex mt-10 gap-5 justify-around">
                <p>7 PM</p>
                <div>
                    <input type="range"  min={0} max="100" value="50" className="range range-info " />
                </div>
                <p>Percentage</p>

                    
                </div>
                <div className="flex mt-10 gap-5 justify-around">
                <p>7 PM</p>
                <div>
                    <input type="range"  min={0} max="100" value="50" className="range range-info " />
                </div>
                <p>Percentage</p>

                    
                </div>
                <div className="flex mt-10 gap-5 justify-around">
                <p>7 PM</p>
                <div>
                    <input type="range"  min={0} max="100" value="50" className="range range-info " />
                </div>
                <p>Percentage</p>

                    
                </div>
                <div className="flex mt-10 gap-5 justify-around">
                <p>7 PM</p>
                <div>
                    <input type="range"  min={0} max="100" value="50" className="range range-info " />
                </div>
                <p>Percentage</p>

                    
                </div>
                <div className="flex mt-10 gap-5 justify-around">
                <p>7 PM</p>
                <div>
                    <input type="range"  min={0} max="100" value="50" className="range range-info " />
                </div>
                <p>Percentage</p>

                    
                </div>

             </div>
             <div className="py-5">
                <h2 className="text-2xl font-bold mb-5">Sunrise & Sunset</h2>
                <div className=" flex  flex-col gap-5">
                <div className="flex justify-between items-center  px-5 py-2 rounded-xl">
                 <div className="flex gap-5 items-center justify-between">
                    <IoSunny className="text-2xl"></IoSunny>
                    <div className="gap-5">
                        <h3>Sunrise</h3>
                         <h3>4.20 AM</h3>
                    </div>
                    
                 </div>
                 <p>4 Hours Ago</p>
                </div>
                      <div className="flex justify-between items-center  px-5 py-2 rounded-xl">
                 <div className="flex gap-5 items-center justify-between">
                    <TbSunset2 className="text-2xl"></TbSunset2>
                    <div className="gap-5">
                        <h3>Sunrise</h3>
                         <h3>4.20 AM</h3>
                    </div>
                    
                 </div>
                 <p>4 Hours Ago</p>
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
