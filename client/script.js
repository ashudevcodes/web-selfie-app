const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json");
const tileURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const issURL = "https://api.wheretheiss.at/v1/satellites/25544"
const currentUrl = window.location.href;
let latitude = 0
let longitude = 0
let marked = true

let map = L.map('map', { minZoom: 2 }).setView([latitude + 0.02, longitude], 1)

const myIcon = L.icon({
    iconUrl: 'https://media.wheretheiss.at/v/423aa9eb/img/iss.png',
})

async function getISS() {
    const response = await fetch(issURL)
    let data = await response.json()
    const marker = L.marker([data.latitude, data.longitude, data.altitude], { icon: myIcon }).addTo(map)
    document.getElementById("iss").textContent = `${data.velocity.toFixed(4)} ${data.units}`
    setInterval(() => {
        map.removeLayer(marker)
    }, 1000)
    return { issla: data.latitude, isslo: data.longitude }
}

document.getElementById('showiss').addEventListener('click',async ()=>{
    const getIssData = await getISS()
    map.setView([getIssData.issla,getIssData.isslo],2)
})

async function fetchWeather() {
    let wetApiRes;
    if (currentUrl.includes("localhost")) {
        wetApiRes = await fetch(`http://localhost:3000/weather/${latitude},${longitude}`);
    } else {
        wetApiRes = await fetch(`https://web-selfie-app.vercel.app/weather/${latitude},${longitude}`);
    }
    const wetJson = await wetApiRes.json()
    const temperature = wetJson.current.temperature_2m
    return temperature
}

function setup() {


    if ('geolocation' in navigator) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        navigator.geolocation.watchPosition(async (position) => {

            let Colatitude = position.coords.latitude
            let Colongitude = position.coords.longitude
            document.getElementById('latitude').textContent = Colatitude
            document.getElementById('longitude').textContent = Colongitude

            document.getElementById('showme').addEventListener('click',async ()=>{
                map.setView([Colatitude,Colongitude],13)
            })

            document.getElementById("warning").textContent = "Hover to unblur Coordinates, double-tap to zoom in, and pinch to zoom out on the map"

            if (marked) {
                marked = false
                map.setView([Colatitude + 0.02, Colongitude], 13)
                let mark = L.marker([Colatitude, Colongitude]).addTo(map)
                const temperature = await fetchWeather()
                mark.bindPopup(`<p style="color:black">You are here, and today's temperature in your area is ${temperature}&deg; C</p>`).openPopup()

                console.log(latitude, longitude)
            }

            const temp = await fetchWeather()
            document.getElementById('temperature').textContent = temp

        }, (error) => {
            map = L.map('map', { minZoom: 2 }).setView([latitude, longitude], 1)
            console.warn(`ERROR(${error.code}): ${error.message}`);
        }, options)

    }
    else {
        console.log('geolocation not available')
    }
}
setup()


L.tileLayer(tileURL, { attribution }).addTo(map)
setInterval(getISS, 1000)