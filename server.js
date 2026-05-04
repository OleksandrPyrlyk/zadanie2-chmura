const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const AUTHOR = "Oleksandr Pyrlyk";

const locations = {
    "Polska": {
        "Warszawa": { latitude: 52.2297, longitude: 21.0122 },
        "Kraków": { latitude: 50.0647, longitude: 19.9450 }
    },
    "Ukraina": {
        "Kijów": { latitude: 50.4501, longitude: 30.5234 },
        "Lwów": { latitude: 49.8397, longitude: 24.0297 }
    },
    "Niemcy": {
        "Berlin": { latitude: 52.5200, longitude: 13.4050 },
        "Monachium": { latitude: 48.1351, longitude: 11.5820 }
    }
};

function getWeatherDescription(code) {
    const descriptions = {
        0: "Bezchmurnie",
        1: "Głównie bezchmurnie",
        2: "Częściowe zachmurzenie",
        3: "Zachmurzenie całkowite",
        45: "Mgła",
        48: "Mgła osadzająca szadź",
        51: "Lekka mżawka",
        53: "Umiarkowana mżawka",
        55: "Gęsta mżawka",
        61: "Lekki deszcz",
        63: "Umiarkowany deszcz",
        65: "Intensywny deszcz",
        71: "Lekki śnieg",
        73: "Umiarkowany śnieg",
        75: "Intensywny śnieg",
        80: "Lekkie opady przelotne",
        81: "Umiarkowane opady przelotne",
        82: "Silne opady przelotne",
        95: "Burza"
    };

    return descriptions[code] || "Nieznany stan pogody";
}

app.use(express.static("public"));

app.get("/api/weather", async (req, res) => {
    const country = req.query.country;
    const city = req.query.city;

    if (!country || !city) {
        return res.status(400).json({
            error: "Brak kraju lub miasta"
        });
    }

    const countryData = locations[country];

    if (!countryData || !countryData[city]) {
        return res.status(404).json({
            error: "Nie znaleziono lokalizacji"
        });
    }

    const { latitude, longitude } = countryData[city];

    try {
        const apiUrl =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&timezone=auto`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error("Błąd API pogodowego");
        }

        const data = await response.json();
        const current = data.current;

        res.json({
            country,
            city,
            weather: {
                temperature: `${current.temperature_2m}°C`,
                description: getWeatherDescription(current.weather_code),
                humidity: `${current.relative_humidity_2m}%`,
                wind: `${current.wind_speed_10m} km/h`,
                time: current.time
            }
        });
    } catch (error) {
        res.status(500).json({
            error: "Nie udało się pobrać aktualnej pogody z API"
        });
    }
});

app.listen(PORT, () => {
    const startDate = new Date().toISOString();

    console.log(`Data uruchomienia aplikacji: ${startDate}`);
    console.log(`Autor programu: ${AUTHOR}`);
    console.log(`Aplikacja nasłuchuje na porcie TCP: ${PORT}`);
});