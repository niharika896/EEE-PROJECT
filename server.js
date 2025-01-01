const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/soildata", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Define MongoDB schema and models
const idealMoistureSchema = new mongoose.Schema({
    hour: Number,
    realMoisture: Number,
});
const idealMoistureModel = mongoose.model("IdealMoisture", idealMoistureSchema, "idealMoisture");

const realMoistureSchema = new mongoose.Schema({
    hour: Number,
    realMoisture: Number,
});
const realMoistureModel = mongoose.model("RealMoisture", realMoistureSchema, "realMoisture");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files directly from the root directory
app.use(express.static(path.join(__dirname)));

// API endpoint to fetch data from both collections
app.get("/getData", (req, res) => {
    Promise.all([
        idealMoistureModel.find({}), // Ideal moisture data
        realMoistureModel.find({}), // Real-time moisture data
    ])
        .then(([idealMoisture, realMoisture]) => {
            const idealData = idealMoisture.map(item => [item.hour, item.realMoisture]);
            const realTimeData = realMoisture.map(item => [item.hour, item.realMoisture]);
            return res.json({ idealData, realTimeData });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        });
});

// API endpoint to receive data from the script
app.post("/postData", (req, res) => {
    const currentHour = new Date().getHours();
    const moisture = req.body.moisture;

    const newData = new realMoistureModel({ hour: currentHour, realMoisture: moisture });
    newData.save()
        .then(() => {
            io.emit('moistureUpdate', { moisture }); // Emit real-time updates
            res.status(200).send('Data saved');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error saving data');
        });
});

// Serve index.html for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
