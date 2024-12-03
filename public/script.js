const tileURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
const attribution = '& copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const issURL = "https://api.wheretheiss.at/v1/satellites/25544"

setup()

function setup() {
    if ('geolocation' in navigator) {
        console.log("geoLocatioan is available")
        navigator.geolocation.getCurrentPosition((position) => {
            noCanvas()
            const video = createCapture(VIDEO)
            video.size(320, 240)
            document.querySelector('video').id = "video_i"
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const map = L.map('map').setView([latitude, longitude], 13)
            L.tileLayer(tileURL, { attribution }).addTo(map)
            L.marker([latitude, longitude]).addTo(map);
            document.getElementById('latitude').textContent = latitude
            document.getElementById('longitude').textContent = longitude
            const btn = document.getElementById('sendloc').addEventListener('click', async () => {
                const name = document.getElementById('name').value
                if (name == "") {
                    return
                }
                else {
                    video.loadPixels()
                    const image64 = video.canvas.toDataURL()
                    const data = { latitude, longitude, name, image64 }
                    console.log(data)
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
        console.log('Not available')
    }
}
