const express = require("express");
const axios = require("axios");
const app = express();

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Guest";

  // Get client IP
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    // Get location information (you might need to use a proper API key for real-world usage)
    const locationResponse = await axios.get(
      `http://ip-api.com/json/${clientIp}`
    );
    const locationData = locationResponse.data;
    const city = locationData.city || "Unknown location";

    // Get weather information
    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=f80c0ba5e91947a698f201354240407&q=${city}`
    );
    const temperature = weatherResponse.data.current.temp_c;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
