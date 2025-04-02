// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");
const messagesRoutes = require("./routes/messages");

// Load env vars only in dev
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// Dynamic CORS for local + AWS Amplify
const allowedOrigins = [
  "http://localhost:3000",
  "https://main.d1vidfdr0slgdn.amplifyapp.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

app.use(express.json()); // to parse JSON body

app.get("/api/projects", (req, res) => {
  fs.readFile("./projects.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to load projects" });
    res.json(JSON.parse(data));
  });
});

app.get("/api/weather", async (req, res) => {
  const city = "Halifax";
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.main || !data.weather) {
      console.error("⚠️ OpenWeatherMap error:", data);
      return res.status(500).json({ error: "Failed to fetch weather", details: data });
    }

    const result = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };

    res.json(result);
  } catch (error) {
    console.error("❌ Weather API error:", error);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.use("/api/messages", messagesRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});