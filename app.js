const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const apiKey = require("./config");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

app.post('/', function(req, res){
    const query = req.body.cityName;
    //const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&APPID=" + apiKey + "&units=metric";
    
    https.get(url, function(response){
        response.on("data",function(data){
            //console.log(JSON.parse(data));
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp
        const desc =  weatherData.weather[0].description
        const icon = weatherData.weather[0].icon
        const imgUrl = "https://openweathermap.org/img/wn/"+ icon +"@2x.png"

        const weatherInfo = "<h1>The current weather at "+ query +" is " + temp + " Degree celsius</h1>" +
                            "<img src=" + imgUrl + ">" +
                            "<p>The weather is currently " + desc + "</p>";
            
            res.send(weatherInfo);
        })
    })
});



app.listen(3000, function(){
    console.log("Server is running on port 3000");
})