const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessConatiner = document.querySelector(".grant-location-container");
const grantAccessBtn = document.querySelector("[data-grantAceess]");

const searchInput = document.querySelector("[data-searchInput]")
const searchForm = document.querySelector("[data-formContainer]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-infoContainer");

const cityName = document.querySelector("[data-cityname]");
const countryIcon = document.querySelector("[data-countryIcon]");
const weatherDesc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windSpeed = document.querySelector("[data-windSpeed]");
const humidity = document.querySelector("[data-humidity]");
const clouds = document.querySelector("[data-Cloudness]");
const notFoundPage = document.querySelector(".not-found");



let currentTab = userTab;
const API_KEY = "bb826b49867f84bbd66ffe434f13d1dd";
currentTab.classList.add("current-tab");

getFromSeassionStorage()

function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab
        currentTab.classList.add("current-tab");

   if(!searchForm.classList.contains("active")){
    userInfoContainer.classList.remove("active");
    grantAccessConatiner.classList.remove("active");
    searchForm.classList.add("active");
 }
 else{
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    
    getFromSeassionStorage();
 }

 }
}


userTab.addEventListener("click", () =>{
    switchTab(userTab);
})

searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
})


function getFromSeassionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessConatiner.classList.add("active");

    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
const {lat , lon} = coordinates;
grantAccessConatiner.classList.remove("active");
loadingScreen.classList.add("active");

// api call 
try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    notFoundPage.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(err){
    loadingScreen.classList.remove("active");
    console.log(err);
}
}


function renderWeatherInfo(weatherInfo) {
    
    
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
    
}



function getLocation() {

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition)
        }
    
        else {
            console.log("No geoLocation Support");
        }
    }

    function showPosition(position){
        const userCoordinates ={
             lat : position.coords.latitude,
             lon : position.coords.longitude
            }
            sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); // for saving the coordinates on sessionStorage.
            fetchUserWeatherInfo(userCoordinates); // for showing in ui
           
        }


grantAccessBtn.addEventListener('click', getLocation);


searchForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if (cityName===""){
        return;
    }
    
    else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    
loadingScreen.classList.add("active");
userInfoContainer.classList.remove("active");
grantAccessConatiner.classList.remove("active");

try{

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    // console.log(data?.name);
    if (data?.name === undefined ){

       
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        notFoundPage.classList.add("active");
       
       
    } else {
        
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    
    renderWeatherInfo(data);}
}
catch(err)
{
    
    console.log(err)
}
 
}
// async function fetchWeatherDetails() {
// let city = "goa";

// try {
// const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
// const data = await response.json();

// renderWeatherInfo(data);
// console.log("weather data", data); // here we have to take care with syntax 
// }
// catch(error) {
//     console.log(error);
// }
// }

// async function coustomWeatherDetails() {
// let latitude = 23.3333;
// let longitude = 28.0666;

// try{
//     let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//     let data = await result.json(); 
//     renderWeatherInfo(data);
// }
// catch(error){
//     console.log(error);
// }
// }

// function getLocation() {

//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition)
//     }

//     else {
//         console.log("No geoLocation Support");
//     }
// }

// function showPosition(position){
//     let lati = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lati)
//     console.log(longi)
// }