const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const ejs = require("ejs");
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.get('/', function(req, res){
    res.render('home');
});

app.post('/', function(req, res){
    const query = req.body.cityName;
    //const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&APPID=" + process.env.API_KEY + "&units=metric";
    
    https.get(url, function(response){
        response.on("data",function(data){
            // console.log(JSON.parse(data));
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp
        const desc =  weatherData.weather[0].description
        const icon = weatherData.weather[0].icon
        const imgUrl = "https://openweathermap.org/img/wn/"+ icon +"@2x.png"

         // Set a condition for the background image
        let condition = weatherData.weather[0].main;
        let backgroundImage = '';
        // Select images based on condition
        switch(condition.toLowerCase()) {
            case 'clouds': backgroundImage = '/images/cloudy.jpg'; break;
            case 'rain': backgroundImage = '/images/rainy.jpg'; break;
            case 'mist': backgroundImage = '/images/rainy.jpg'; break;
            case 'snow': backgroundImage = '/images/snowy.jpg'; break;
            case 'clear': backgroundImage = '/images/sunny.jpg'; break;
            default: backgroundImage = '/images/default.jpg';
        }

        const timezoneOffsetSeconds = weatherData.timezone; // Offset in seconds
        const timestamp = weatherData.dt; // UTC timestamp

        // Convert the UTC timestamp to local time in the specified timezone
        const localTime = new Date(timestamp * 1000 + timezoneOffsetSeconds * 1000);

        // Format the local time as HH:MM
        const formattedTime = localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Set to true for 12-hour clock format, false for 24-hour format
        timeZone: 'UTC', // Use the city name as timezone identifier (replace with your preferred identifier)
        });
            
        res.render('weather', {query: query, desc: desc, imgUrl:imgUrl, temp: temp, bgimg: backgroundImage, time: formattedTime, zone: weatherData.name});
        })
    })
});



app.listen(3000, function(){
    console.log("Server is running on port 3000");
})