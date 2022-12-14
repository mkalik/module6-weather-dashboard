//stuff for weather dashboard
//weather
//https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=3fa0ec19d970372ca90240e7399b6728
//geo location
//seems like this one is more useful
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid=3fa0ec19d970372ca90240e7399b6728
clearSearchInput();
if (localStorage.length != 0) {
    var keys = Object.keys(localStorage);
    console.log(keys);
    for (let i = 0; i < localStorage.length; i++) {
        createPrevSearch(keys[i]);
    }
}
function clearSearchInput() {
    document.querySelector('#city-search').value = '';
}

var citySearch = document.querySelector('#search-button');
var weatherIcons = {
    Thunderstorm: 'fa-solid fa-bolt',
    Rain: 'fa-solid fa-cloud-showers-heavy',
    Clouds: 'fa-solid fa-cloud',
    Snow: 'fa-solid fa-snowflake',
    Clear: 'fa-solid fa-sun',
    Mist: 'fa-solid fa-smog',
    Drizzle: 'fa-solid fa-cloud-rain',
};
var USsearch = true;
function checkEnter(event) {
    if (event.keyCode == 13) {
        SearchCheck(event);
    }
}
function SearchCheck(event) {
    event.preventDefault();
    var searchInput = document.querySelector('#city-search').value;
    if (searchInput === '') {
        alert('please enter a city!');
    } else {
        console.log(searchInput);
        if (searchInput.split(',').length > 1) {
            console.log('hello');
            var split = searchInput.split(',');
            searchInput = `${split[0]},US-${split[1].trim().toUpperCase()},USA`;
            console.log(searchInput);
            getCity(searchInput).then(function (spot) {
                clearSearchInput();
                getWeather(spot);
            });
        } else {
            alert('Please enter your city followed by a comma and a state!');
            clearSearchInput();
        }
    }
}
function createWeatherDash(key) {
    console.log(key);
    var weatherIcon = document.createElement('i');
    var weatherInfo = JSON.parse(localStorage.getItem(key));
    var dash = document.querySelector('#weather-dash');
    dash.removeAttribute('style');
    var currInfo = document.querySelector('#weather-now');
    var curr = document.createElement('div');
    curr.textContent = key;
    var currDay = new Date();
    console.log(weatherInfo[0].weather[0]);
    currInfo.innerHTML = `<h2 style = 'font-size:20px'>${key} (${currDay.toLocaleDateString()}) <i class = '${
        weatherIcons[weatherInfo[0].weather[0].main]
    }'></h2>`;
    currInfo.innerHTML += `<ul><li>Temp: ${weatherInfo[0].main.temp} °F</li><li>Wind: ${weatherInfo[0].wind.speed} MPH</li><li>Humidity: ${weatherInfo[0].main.humidity} %</li></ul>`;

    var foreInfo = document.querySelector('#weather-info').children;
    var days = Array.from(foreInfo);
    console.log(days);
    console.log(weatherInfo);
    for (let x = 0; x < 5; x++) {
        console.log(days[x]);
        days[x].setAttribute('style', 'background:#006859;color:#ffffff');
        days[x].innerHTML = `<h3>(${new Date(
            weatherInfo[x + 1].dt * 1000
        ).toLocaleDateString()}) <i class = '${
            weatherIcons[weatherInfo[x + 1].weather[0].main]
        }'</h3>`;
        days[x].innerHTML += `<ul><li>Temp: ${
            weatherInfo[x + 1].main.temp
        } °F</li><li>Wind: ${
            weatherInfo[x + 1].wind.speed
        } MPH</li><li>Humidity: ${
            weatherInfo[x + 1].main.humidity
        } %</li></ul>`;
    }
}

function createPrevSearch(city) {
    var prevSearchBox = document.querySelector('#prev-weather');
    var search = document.createElement('div');
    search.setAttribute(
        'class',
        'prev-search tag is-medium is-child has-text-centered block'
    );
    search.textContent = `${city}`;
    search.addEventListener('click', function (event) {
        console.log(event.target);
        createWeatherDash(event.target.innerHTML);
    });
    prevSearchBox.append(search);
}

function clearLocal() {
    localStorage.clear();
    window.location.reload();
}
function localStore(name, info) {
    localStorage.setItem(name, JSON.stringify(info));
}
async function getWeather(spot) {
    if (spot === undefined) {
        return;
    }
    let lat = spot[0];
    let lon = spot[1];
    var currWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3fa0ec19d970372ca90240e7399b6728&units=imperial`;
    var weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=3fa0ec19d970372ca90240e7399b6728&units=imperial`;

    var fiveDays = [];
    await fetch(currWeatherAPI)
        .then((data) => data.json())
        .then((curr) => (console.log(curr), fiveDays.push(curr)));
    var forecast = await fetch(weatherAPI)
        .then((data) => data.json())
        .then(function (weather) {
            console.log(weather);
            for (let i = 7; i <= weather.list.length; i++) {
                if (i % 8 == 0) {
                    console.log(i);
                    fiveDays.push(weather.list[i - 1]);
                }
            }
            console.log(fiveDays);
            var search = `${weather.city.name}, ${spot[2].split('-')[1]}`;
            console.log('in else');
            var keys = Object.keys(localStorage);
            for (let i = 0; i < localStorage.length; i++) {
                let place = JSON.parse(localStorage.getItem(keys[i]));
                let [l_lon, l_lat] = [place[0].coord.lon, place[0].coord.lat];
                if (
                    fiveDays[0].coord.lon == l_lon &&
                    fiveDays[0].coord.lat == l_lat
                ) {
                    console.log('in nested if');
                    localStore(keys[i], fiveDays);
                    createWeatherDash(keys[i]);
                    return;
                }
            }

            // }

            // else if (localStorage.getItem(weather.city.name) == null) {
            // console.log('in if');
            // console.log(search);
            localStore(search, fiveDays);
            createPrevSearch(search);
            // // localStore(weather.city.name, fiveDays);
            createWeatherDash(search);
        });
}

async function getCity(city) {
    var geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=3fa0ec19d970372ca90240e7399b6728`;
    var spot = await fetch(geoAPI)
        .then((data) => data.json())
        .then(function (location) {
            if (location.length != 0) {
                console.log(location);
                return [location[0].lat, location[0].lon, city.split(',')[1]];
            } else {
                return Promise.reject();
            }
        })
        .catch(function (reject) {
            alert(
                `sorry we couldnt find ${city}, please make sure you spelled it correctly`
            );
            return reject;
        });
    console.log(spot);
    return spot;
}
