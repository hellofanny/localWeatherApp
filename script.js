//What's the weather like?

var currentLat = "";
var currentLon = "";
var temperature;

//Free Code Camp Weather API 
var baseURL = "https://fcc-weather-api.glitch.me/api/current?lat=";

function getCoordinators() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, handle_error);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function handle_error(error) {

    //console.log(error.code);

    $("#message-error").show(); 

    var errorMessage;
    switch (error.code) {
        case 1:
            errorMessage = "Please allow the request for Geolocation.";
            break;
        case 2:
            errorMessage = "Sorry, location information is unavailable.";
            break;
        case 3:
            errorMessage = "The request to get user location timed out.";
            break;
        default:
            errorMessage = "An unknown error occurred. Try again."
    }
    $('#message-error').text(errorMessage);
}

function setPosition(position) {
    console.log("lat:" + position.coords.latitude);
    console.log("lon:" + position.coords.longitude);

    currentLat = position.coords.latitude;
    currentLon = position.coords.longitude;

    getWeather();
}

function getWeather() {

    //var testURL = "https://fcc-weather-api.glitch.me/api/current?lat=35&lon=139";
    var requestURL = baseURL + currentLat + "&lon=" + currentLon;

    $.getJSON(requestURL,
        function (data) {
            temperature = data.main.temp;
            $("#temperature").text(temperature.toPrecision(2) + "º");
            console.log(data);
            $("#weather").text(data.weather[0].main);
            var iconURL = data.weather[0].icon;
            $("#icon-weather").attr("src", iconURL);
            var place = data.name + ", " + data.sys.country;
            $("#place").text(place);
            console.log("Its working!");
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log("Failed to retrieve weather!");
        })
    $.ajaxSetup({ cache: false });
    $("#loader").hide();
    $("#display-infos").show();
    fixToggle();
}

$("#scales-options p").click(function () {
    $("#scales-options p").removeClass('selected');
    $(this).addClass('selected');
    if ($(this).attr("id") == "fahrenheit") {
        $("#temperature").text(convertToFahrenheit() + "º");
    } else {
        $("#temperature").text(temperature.toPrecision(2) + "º");
    }
});

function convertToFahrenheit() {
    return ((temperature * 1.8) + 32).toPrecision(2);
}

function getDayAndTime() {
    var date = new Date();
    var hours = date.getHours(),
        minutes = date.getMinutes(),
        month = date.getMonth(),
        day = date.getDate(),
        weekdayIndex = date.getDay(),
        amPm = ' am';

    if (hours > 12) {
        hours -= 12;
        amPm = ' pm';
    } else if (hours === 0) {
        hours = 12;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    var monthsNames = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"];

    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    $("#day-time").text(weekday[weekdayIndex] + ", " + monthsNames[month] + " " + day);
    $("#time").text("updated at " + hours + ":" + minutes + amPm);
}


$(document).ready(function () {
    $("#display-infos").hide();
    getCoordinators();
});

//window.addEventListener("DOMContentLoaded", getCoordinators);
window.addEventListener("DOMContentLoaded", getDayAndTime);

$("#refresh").click(function () {
    $("#message-error").hide(); 
    $("#display-infos").hide();    
    $("#loader").show();
    getCoordinators();
    getDayAndTime();
});


function fixToggle() {
    if ($("#fahrenheit").hasClass('selected')) {
        $("#fahrenheit").removeClass('selected');
        $("#celsius").addClass('selected');
    }
}
