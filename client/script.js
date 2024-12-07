const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json");
const tileURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '& copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const issURL = "https://api.wheretheiss.at/v1/satellites/25544"
const currentUrl = window.location.href;

function setup() {


    if ('geolocation' in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        navigator.geolocation.watchPosition(async (position) => {

            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            document.getElementById('latitude').textContent = latitude
            document.getElementById('longitude').textContent = longitude

            document.getElementById("warning").textContent = "Hover to Unblur Coordinates"


            const map = L.map('map').setView([latitude + 0.02, longitude], 13)
            L.tileLayer(tileURL, { attribution }).addTo(map)
            let mark = L.marker([latitude, longitude]).addTo(map)


            let wetApiRes;
            if (currentUrl.includes("localhost")) {
                wetApiRes = await fetch(`http://localhost:3000/weather/${latitude},${longitude}`);
            } else {
                wetApiRes = await fetch(`https://web-selfie-app.vercel.app/weather/${latitude},${longitude}`);
            }

            const wetJson = await wetApiRes.json()
            let temperature = wetJson.current.temperature_2m
            document.getElementById('temperature').textContent = temperature

            mark.bindPopup(`<p style="color:black">You are here, and today's temperature in your area is ${temperature}&deg; C</p>`).openPopup()

        }, (error) => {
            console.warn(`ERROR(${error.code}): ${error.message}`);
        }, options)

    }
    else {
        console.log('geolocation not available')
    }
}
setup()
