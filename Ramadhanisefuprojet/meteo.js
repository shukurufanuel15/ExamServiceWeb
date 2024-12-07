const apiKey = '320d41cf7bb981b2405d3930b8ec0adb';
const button = document.getElementById('getWeather');

button.addEventListener('click', () => {
    console.log("Bouton cliqué"); // Debug
    const city = document.getElementById('city').value;
    fetchWeather(city);
});

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Ville non trouvée');
        }

        const data = await response.json();

        const weatherResult = `
            <h2>Météo à ${data.name}, ${data.sys.country}</h2>
            <p>Température : ${data.main.temp} °C</p>
            <p>Conditions : ${data.weather[0].description}</p>
        `;
        document.getElementById('weatherResult').innerHTML = weatherResult;

    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}