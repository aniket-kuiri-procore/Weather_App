const express = require('express');
const app = express();
const path = require('path');


async function get_weather_details(city) {
    const https = require('https');
    let weatherDetails = {}
    const apiKey = '2999625636d66de37263c74cb86edf32'; 
    //const city = 'Mumbai';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Use metric for Celsius
    return new Promise((resolve, reject) => { 
        https.get(apiUrl, (res) => {
            let data = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            res.on('end', () => {
            try {
                const weatherData = JSON.parse(data);
                console.log('Weather Data for Mumbai:');
                //console.log(JSON.stringify(weatherData, null, 2)); // Pretty print JSON

                // You can access specific information like this:
                //console.log(`\nTemperature: ${weatherData.main.temp}°C`);
                //console.log(`Description: ${weatherData.weather[0].description}`);
                //console.log(`Humidity: ${weatherData.main.humidity}%`);
                //console.log(`Wind Speed: ${weatherData.wind.speed} m/s`);
                //weatherDetails = JSON.stringify(weatherData, null, 2)
                //console.log("Weather Details: " + weatherDetails)
                resolve(weatherData)

            } catch (e) {
                console.error('Error parsing JSON:', e);
                reject(e)
            }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            reject(e)
        });
    })
}


// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where your EJS files are

// Define a route to render the weather page
app.get('/weather', (req, res) => {
  const data = {
    name: "User"
  };
  if (req.query.city) {
    const city = req.query.city;
    console.log(`City parameter: ${city}`);
    // make a call to weather api to get weather details 
    data.city = city; // Pass the city to the EJS template
  }
  get_weather_details(data.city).then(result => {
    console.log(result)
    res.render('weather', { data: result })
  })
   // Express handles the template rendering
});

/*app.get('*', (req, res) => { // Catch-all route
  res.status(404).send('404 Not Found');
}); */

const port = 3002;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});