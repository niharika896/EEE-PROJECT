// Declare a variable to hold the chart instance
let lineChartInstance = null;

// Function to create or update the line chart
function createOrUpdateLineChart(data) {
    const hours = data.hours;
    const idealMoisture = data.idealMoisture;
    const realMoisture = data.realMoisture;

    // Get the canvas context for the line chart
    const lineCtx = document.getElementById('lineChart').getContext('2d');

    // Destroy the previous chart if it exists
    if (lineChartInstance !== null) {
        lineChartInstance.destroy();
    }

    // Create a new chart with the updated data
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: hours, // Use hours for the x-axis labels
            datasets: [
                {
                    label: 'Ideal Moisture',
                    data: idealMoisture,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                },
                {
                    label: 'Real Moisture',
                    data: realMoisture,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { 
                    title: { display: true, text: 'Hour' } 
                },
                y: {
                    title: { display: true, text: 'Moisture (%)' },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Function to create or update the pie chart (Dummy data for now)
function createPieChart() {
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Temperature', 'Humidity', 'Distance'],
            datasets: [{
                data: [22, 60, 20], // Dummy values for temp, humidity, and distance
                backgroundColor: ['#FF5733', '#33FF57', '#3357FF']
            }]
        }
    });
}

// Function to update dummy values for temperature, humidity, and distance
function updateDummyValues() {
    document.getElementById('temperature').innerText = '22';  // Dummy temperature value
    document.getElementById('humidity').innerText = '60';     // Dummy humidity value
    document.getElementById('distance').innerText = '20';     // Dummy distance value
}

// Fetch data from the server to update the chart
fetch('http://localhost:3000/getData')
    .then(response => response.json())
    .then(data => {
        // Extract hours, ideal moisture, and real moisture data from the response
        const hours = data.idealData.map(item => item[0]); // Extract hours from idealData
        const idealMoisture = data.idealData.map(item => item[1]); // Extract ideal moisture values
        const realMoisture = data.realTimeData.map(item => item[1]); // Extract real moisture values

        // Call the function to create or update the chart
        createOrUpdateLineChart({
            hours: hours,
            idealMoisture: idealMoisture,
            realMoisture: realMoisture
        });
    })
    .catch(error => console.error('Error fetching data:', error));

// Initialize the pie chart and dummy values when the page loads
window.onload = function () {
    createPieChart();   // Create pie chart with dummy data
    updateDummyValues(); // Set the dummy values for temp, humidity, and distance
};
