const myHeaders = new Headers()
myHeaders.append("Content-Type", "application/json");
const tileURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '& copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const issURL = "https://api.wheretheiss.at/v1/satellites/25544"
const currentUrl = window.location.href;

function setup() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {

            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            document.getElementById('latitude').textContent = latitude
            document.getElementById('longitude').textContent = longitude

            let wetApiRes;
            if (currentUrl.includes("localhost")) {
                wetApiRes = await fetch(`http://localhost:3000/api/weather/${latitude},${longitude}`);
            } else {
                wetApiRes = await fetch(`https://web-selfie-app.vercel.app/api/weather/${latitude},${longitude}`);
            }

            const wetJson = await wetApiRes.json()
            const temperature = wetJson.current.temperature_2m
            document.getElementById('temperature').textContent = temperature

            const map = L.map('map').setView([latitude, longitude], 13)
            L.tileLayer(tileURL, { attribution }).addTo(map)
            L.marker([latitude, longitude]).addTo(map).bindPopup(`<p style="color:black">You are here, and today's temperature in your area is ${temperature}&deg; C</p>`).openPopup()

            document.getElementById("warning").textContent = "Hover to Unblur Coordinates"

            noCanvas()
            let videoOn = true;
            let video
            document.getElementById('cambtn').addEventListener("click", () => {
                if (videoOn) {
                    video = createCapture(VIDEO)
                    video.size(320, 240)
                    document.querySelector('video').id = "video_i"
                    videoOn = false;
                } else {
                    if (video) {
                        video.remove()
                        video.stop()
                        videoOn = true
                    }
                }
            })




            document.getElementById('sendloc').addEventListener('click', async () => {
                const name = document.getElementById('name').value
                if (name == "") {
                    return
                }
                else {
                    video.loadPixels()
                    const image64 = video.canvas.toDataURL()
                    const data = { name, latitude, longitude, temperature, image64 }
                    const raw = JSON.stringify(data);
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };

                    let response;
                    if (currentUrl.includes("localhost")) {
                        response = await fetch("http://localhost:3000/api/data", requestOptions);
                    } else {
                        response = await fetch('https://web-selfie-app.vercel.app/api/data', requestOptions);
                    }
                    const responseData = await response.json()

                }
            })
        })





    }
    else {
        console.log('geolocation not available')
    }
}
setup()
