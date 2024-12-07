async function getData() {
    try {
        const currentUrl = window.location.href;
        let response
        if (currentUrl == "http://localhost:8000/logs/index.html") {
            response = await fetch('http://localhost:3000/getlocdata')
        }
        else {
            response = await fetch('https://web-selfie-app.vercel.app/getlocdata')
        }
        const data = await response.json()

        const container = document.createElement('div')
        container.id = 'data-container'
        container.style.display = 'flex'
        container.style.flexWrap = 'wrap'
        container.style.justifyContent = 'center'
        container.style.gap = '20px'
        container.style.padding = '20px'
        container.style.clear = 'both'

        const existingNavigation = document.getElementById('atags')
        const h1Element = document.querySelector('h1')

        document.body.innerHTML = ''

        if (h1Element) document.body.appendChild(h1Element)
        if (existingNavigation) document.body.appendChild(existingNavigation)

        document.body.appendChild(document.createElement('br'))

        for (const item of data) {
            const root = document.createElement('div')
            root.style.background = 'rgba(255, 255, 255, 0.2)'
            root.style.backdropFilter = 'blur(8px)'
            root.style.border = '1px solid rgba(255, 255, 255, 0.125)'
            root.style.borderRadius = '15px'
            root.style.padding = '20px'
            root.style.maxWidth = '300px'
            root.style.width = '100%'
            root.style.color = 'white'
            root.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
            root.style.marginBottom = '20px'
            root.style.position = 'relative'
            const nameEl = document.createElement('p')
            nameEl.textContent = `Name: ${item.name}`
            nameEl.style.margin = '0 0 10px 0'

            const geoEl = document.createElement('p')
            geoEl.textContent = `Latitude: ${item.latitude}\nLongitude: ${item.longitude}`
            geoEl.style.margin = '0 0 10px 0'

            const temperatureEl = document.createElement('p')
            temperatureEl.textContent = `Temperature: ${item.temperature}°C`
            temperatureEl.id = 'temperature'
            temperatureEl.style.margin = '0 0 10px 0'

            const dateEl = document.createElement('p')
            const dateString = new Date(item.timestamp).toLocaleString()
            dateEl.textContent = `Time: ${dateString}`
            dateEl.style.margin = '0 0 10px 0'

            const imageEl = document.createElement('img')
            imageEl.src = item.image_path || item.image64 || ''
            imageEl.alt = `Image of ${item.name}`
            imageEl.id = 'photo'
            imageEl.style.maxWidth = '100%'
            imageEl.style.height = 'auto'
            imageEl.style.borderRadius = '15px'
            imageEl.style.filter = 'blur(3px)'
            imageEl.style.transition = 'filter 0.3s ease'

            imageEl.addEventListener('mouseenter', () => {
                imageEl.style.filter = 'none'
            })
            imageEl.addEventListener('mouseleave', () => {
                imageEl.style.filter = 'blur(3px)'
            })

            const deleteBtn = document.createElement('button')
            deleteBtn.textContent = '🗑️'
            deleteBtn.style.position = 'absolute'
            deleteBtn.style.top = '10px'
            deleteBtn.style.right = '10px'
            deleteBtn.style.border = 'none'
            deleteBtn.style.borderRadius = '50%'
            deleteBtn.style.width = '40px'
            deleteBtn.style.height = '40px'
            deleteBtn.style.cursor = 'pointer'
            deleteBtn.style.display = 'flex'
            deleteBtn.style.justifyContent = 'center'
            deleteBtn.style.alignItems = 'center'
            deleteBtn.style.fontSize = '20px'

            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.background = 'rgba(255, 0, 0, 0.7)'
            })
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.background = 'rgba(255, 0, 0, 0.5)'
            })

            deleteBtn.addEventListener('click', async () => {
                console.log(item)
                try {
                    const currentUrl = window.location.href;
                    const apiUrl = currentUrl.includes('localhost')
                        ? 'http://localhost:3000/postdel'
                        : 'https://web-selfie-app.vercel.app/postdel';

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id: item._id })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        root.remove();
                        alert('Location deleted successfully');
                    } else {
                        alert('Failed to delete location: ' + result.message);
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    alert('An error occurred while deleting the location');
                }
            });

            root.append(nameEl, geoEl, temperatureEl, dateEl, imageEl, deleteBtn)

            container.append(root)
        }

        document.body.appendChild(container)
        if (window.innerWidth <= 720) {
            container.style.flexDirection = 'column'
            container.style.alignItems = 'center'

            const items = container.querySelectorAll('div')
            items.forEach(item => {
                item.style.width = '90%'
                item.style.maxWidth = 'none'
            })
        }

    } catch (error) {
        console.error('Error fetching data:', error)

        const errorEl = document.createElement('div')
        errorEl.textContent = 'Failed to load data. Please try again later.'
        errorEl.style.color = 'red'
        errorEl.style.textAlign = 'center'
        errorEl.style.fontFamily = '"Doto", sans-serif'
        document.body.append(errorEl)
    }
}

getData()
