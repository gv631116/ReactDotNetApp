import { useEffect, useState } from 'react';
import './App.css';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
interface CityWeather {
    cityName: string;
    data: Forecast[];
}

function App() {
    const [forecasts, setForecasts] = useState<CityWeather[]>([{ cityName: "New York", data: []}, {cityName: "Tokyo", data: []}, {cityName: "London", data: [] }, { cityName: "Beijin", data: []}]);

    useEffect(() => {
        // trigger all three requests at once
        forecasts.forEach(city => {
            populateWeatherData(city.cityName);
        });
    }, []);

    return (
        <div className="container">
            <h1 id="tableLabel" className="my-4">Weather Forecasts</h1>
            
            {forecasts.map(city => (
                <div key={city.cityName} className="card mb-4 shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h3 className="mb-0">{city.cityName}</h3>
                    </div>
                    <div className="card-body p-0">
                        <table className="table table-striped mb-0">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Temp. (C)</th>
                                    <th>Temp. (F)</th>
                                    <th>Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {city.data.length > 0 ? (
                                    // If we have data, show the rows
                                    city.data.map((f, index) => (
                                        <tr key={`${city.cityName}-${index}`}>
                                            <td>{f.date}</td>
                                            <td>{f.temperatureC}</td>
                                            <td>{f.temperatureF}</td>
                                            <td>{f.summary}</td>
                                        </tr>
                                    ))
                                ) : (
                                    // If data is empty, show loading for THIS city
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="spinner-border text-primary mr-2" role="status"></div>
                                            <em>Loading {city.cityName} forecast...</em>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );

    async function populateWeatherData(cityName: string) {
        const response = await fetch(`weatherforecast?city=${cityName}`);
        if (response.ok) {
            const data: Forecast[] = await response.json();
            
            // This prevents race conditions where one city overwrite another.
            setForecasts(prevForecasts => 
                prevForecasts.map(city => 
                    city.cityName === cityName ? { ...city, data: data } : city
                )
            );
        }
    }
}

export default App;