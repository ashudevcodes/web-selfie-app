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
        navigator.geolocation.getCurrentPosition(async (position) => {

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
                if (!(name && longitude && latitude)) {
                    alert('Add Video and Location to Make data Public')
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
                        response = await fetch("http://localhost:3000/postlocdata", requestOptions);
                    } else {
                        response = await fetch('https://web-selfie-app.vercel.app/postlocdata', requestOptions);
                    }
                    const responseData = await response.json()

                    if (responseData.errors && responseData.errors.length > 0) {
                        const emailError = responseData.errors.find(error => error.path === 'email');

                        if (emailError) {
                            alert(emailError.msg || 'Invalid email address');
                        } else {
                            const errorMessages = responseData.errors.map(error => error.msg).join(', ');
                            alert(errorMessages);
                        }
                    } else {
                        alert('Location Added successfully');
                    }

                }
            })


        }, (error) => {
            console.warn(`ERROR(${error.code}): ${error.message}`);
        }, options)






    }
    else {
        console.log('geolocation not available')
    }
}
setup()
