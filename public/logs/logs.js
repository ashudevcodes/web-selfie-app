getData()
async function getData() {
    const response = await fetch('/api')
    const data = await response.json()
    for (item of data) {
        const root = document.createElement('div')
        const name = document.createElement('div').textContent = `Name: ${item.name}\n`
        const geo = document.createElement('div').textContent = `Longitude: ${item.latitude}\n Longitude: ${item.longitude}\n`
        const dateString = new Date(item.timestemp).toLocaleString()
        const date = document.createElement('div').textContent = `Time: ${dateString}`
        const image = document.createElement('img')
        image.src = item.image64
        root.append(name, geo, date, image)
        document.body.append(root)
    }
    console.log(data)
}
