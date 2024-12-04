const tileURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '& copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const issURL = "https://api.wheretheiss.at/v1/satellites/25544"

setup()

function setup() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            noCanvas()
            let videoOn = true;
            let video
            document.getElementById('cambtn').addEventListener("click", () => {
                console.log("click")
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

            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            document.getElementById('latitude').textContent = latitude
            document.getElementById('longitude').textContent = longitude

            const wetApiRes = await fetch(`/api/weather/${latitude},${longitude}`)
            const wetJson = await wetApiRes.json()
            const temperature = wetJson.current.temperature_2m
            document.getElementById('temperature').textContent = temperature

            const map = L.map('map').setView([latitude, longitude], 13)
            L.tileLayer(tileURL, { attribution }).addTo(map)
            L.marker([latitude, longitude]).addTo(map).bindPopup(`You are here and the temperature is ${temperature}&deg; C`).openPopup()

            document.getElementById('sendloc').addEventListener('click', async () => {
                const name = document.getElementById('name').value
                if (name == "") {
                    return
                }
                else {
                    video.loadPixels()
                    const image64 = video.canvas.toDataURL()
                    const data = { name, latitude, longitude, temperature, image64 }
                    const options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    }
                    const response = await fetch('/api', options)
                    const responseData = await response.json()
                    console.log(responseData)
                }
            })
        })
    }
    else {
        console.log('geolocation not available')
    }
}
