// Context/index.jsx
import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [place, setPlace] = useState('Patna');
    const [thisLocation, setLocation] = useState('');

    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://api.openweathermap.org/data/2.5/weather',
            params: {
                q: place,
                units: 'metric',
                appid: import.meta.env.VITE_OPENWEATHERMAP_API_KEY,
            },
        };

        try {
            const response = await axios.request(options);
            console.log("API Response:", response.data); // Add this to see the structure

            const data = response.data;
            setLocation(data.name);
            setWeather({
                temperature: data.main?.temp,
                windSpeed: data.wind?.speed,
                humidity: data.main?.humidity,
                heatIndex: calculateHeatIndex(data.main?.temp, data.main?.humidity), // Optional calculation for heat index
                description: data.weather[0]?.description,
            });
        } catch (e) {
            console.error("API Error:", e);
            alert('This place does not exist');
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [place]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);

// Optional function to calculate heat index if needed
const calculateHeatIndex = (temp, humidity) => {
    if (temp && humidity) {
        return (0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (humidity * 0.094))).toFixed(2);
    }
    return 'N/A';
};
