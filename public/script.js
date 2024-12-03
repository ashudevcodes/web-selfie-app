setup()
function setup() {
    if ('geolocation' in navigator) {
        console.log("geoLocatioan is available")
        navigator.geolocation.getCurrentPosition((position) => {
            noCanvas()
            const video = createCapture(VIDEO)
            video.size(320, 240)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
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
