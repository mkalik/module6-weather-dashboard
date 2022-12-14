//stuff for weather dashboard
//weather
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=3fa0ec19d970372ca90240e7399b6728
//geo location
//seems like this one is more useful
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid=3fa0ec19d970372ca90240e7399b6728
if (localStorage.length != 0) {
    var keys = Object.keys(localStorage);
    console.log(keys);
    for (let i = 0; i < localStorage.length; i++) {
        createPrevSearch(keys[i]);
    }
}

var citySearch = document.querySelector('#search-button');

var USsearch = true;
citySearch.addEventListener('click', function (event) {
    event.preventDefault();
    var searchInput = document.querySelector('#city-search').value;
    if (searchInput === '') {
        alert('please enter a city!');
    } else {
        console.log(searchInput);
        if (searchInput.split(',').length > 1) {
            console.log('hello');
            var split = searchInput.split(',');
            searchInput = `${split[0]},US-${split[1].trim()}`;
            console.log(searchInput);
        }
        getCity(searchInput).then((spot) => getWeather(spot));
        // .then(createWeatherDash());
    }
});
function createWeatherDash(key) {
    var weatherInfo = JSON.parse(localStorage.getItem(key));
    var dash = document.querySelector('#weather-dash');
    dash.removeAttribute('style');
    var currInfo = document.querySelector('#weather-now');
    var curr = document.createElement('div');
    curr.textContent = key;
    var currDay = new Date();
    currInfo.append(`${key}(${currDay.toLocaleDateString()})`);
    var foreInfo = document.querySelector('#weather-info').children;
    var days = Array.from(foreInfo);
    console.log(days);
    console.log(weatherInfo);
    for (let x = 0; x < 5; x++) {
        console.log(days[x]);
        days[x].innerHTML = new Date(
            weatherInfo[x + 1].dt * 1000
        ).toLocaleDateString();
    }
}

function createPrevSearch(city) {
    var prevSearchBox = document.querySelector('#prev-weather');
    var search = document.createElement('div');
    search.setAttribute(
        'class',
        'tag is-medium is-child has-text-centered block'
    );
    search.textContent = `${city}`;
    prevSearchBox.append(search);
}
function clearLocal() {
    localStorage.clear();
}
function localStore(name, info) {
    localStorage.setItem(name, JSON.stringify(info));
}
async function getWeather(spot) {
    let lat = spot[0];
    let lon = spot[1];
    var currWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3fa0ec19d970372ca90240e7399b6728`;
    var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=3fa0ec19d970372ca90240e7399b6728`;
    var fiveDays = [];
    await fetch(currWeatherAPI)
        .then((data) => data.json())
        .then((curr) => fiveDays.push(curr.main));
    var forecast = await fetch(weatherAPI)
        .then((data) => data.json())
        .then(function (weather) {
            console.log(weather);
            for (let i = 0; i < weather.list.length; i++) {
                if (i % 8 == 0) {
                    fiveDays.push(weather.list[i]);
                }
            }
            console.log(fiveDays);
            if (localStorage.getItem(weather.city.name == null)) {
                createPrevSearch(weather.city.name);
            }
            localStore(weather.city.name, fiveDays);
            createWeatherDash(weather.city.name);
        });
}

async function getCity(city) {
    var geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=3fa0ec19d970372ca90240e7399b6728`;
    var spot = await fetch(geoAPI)
        .then((data) => data.json())
        .then(function (location) {
            console.log(location);
            return [location[0].lat, location[0].lon];
        });
    console.log(spot);
    return spot;
}
