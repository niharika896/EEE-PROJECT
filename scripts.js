// Declare a variable to hold the chart instance
let lineChartInstance = null;
let pieChartInstance = null;

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
function createPieChart(wetPercentage, dryPercentage) {
    const pieCtx = document.getElementById('pieChart').getContext('2d');

    // If the pie chart exists, destroy it before creating a new one
    if (pieChartInstance !== null) {
        pieChartInstance.destroy();
    }

    // Create the new Pie chart for Wet and Dry
    pieChartInstance = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Wet', 'Dry'], // Labels for the pie chart
            datasets: [{
                data: [wetPercentage, dryPercentage], // Wet and Dry percentages
                backgroundColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'], // Blue for Wet, Pink for Dry
                hoverBackgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'], // Slightly darker on hover
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%'; // Display percentage in tooltip
                        }
                    }
                }
            }
        }
    });
}

// Function to update dummy values for temperature, humidity, and distance
function updateDummyValues() {
    const temperature = 27.2;  // Dummy temperature value
    const humidity = 95.00;     // Dummy humidity value
    const distance = 17;     // Dummy distance value
    const wetness = 54;     // Dummy distance value

    // Display these values on the page
    document.getElementById('temperature').innerText = temperature;
    document.getElementById('humidity').innerText = humidity;
    document.getElementById('distance').innerText = distance;

    // Update pie chart with dummy data for wet/dry
    const wetPercentage = wetness;  // Using humidity as a proxy for wetness
    const dryPercentage = 100 - wetPercentage;

    // Create or update the pie chart with wet and dry percentages
    createPieChart(wetPercentage, dryPercentage);
}

// Fetch data from the server to update the line chart
fetch('http://localhost:3000/getData')
    .then(response => response.json())
    .then(data => {
        // Extract hours, ideal moisture, and real moisture data from the response
        const hours = data.idealData.map(item => item[0]); // Extract hours from idealData
        const idealMoisture = data.idealData.map(item => item[1]); // Extract ideal moisture values
        const realMoisture = data.realTimeData.map(item => item[1]); // Extract real moisture values

        // Call the function to create or update the line chart
        createOrUpdateLineChart({
            hours: hours,
            idealMoisture: idealMoisture,
            realMoisture: realMoisture
        });
    })
    .catch(error => console.error('Error fetching data:', error));

// Initialize the pie chart and dummy values when the page loads
window.onload = function () {
    updateDummyValues(); // Set the dummy values for temp, humidity, and distance
};
