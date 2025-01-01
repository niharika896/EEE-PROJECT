const { SerialPort } = require('serialport');  // Correct import for v10.x and above
const mqtt = require('mqtt');
const axios = require('axios');
// MQTT connection options
const mqttOptions = {
    clientId: 'sensor123',
    username: 'admin',
    password: '12345',
    clean: true,
    connectTimeout: 4000,
};

const broker = 'mqtt://192.168.1.38'; // Your MQTT broker IP
const topic = 'home/sensors';

const mqttClient = mqtt.connect(broker, mqttOptions);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Replace 'COM8' with the correct serial port
const port = new SerialPort({
    path: 'COM8',      // Correct port path
    baudRate: 9600     // Baud rate
});

port.on('open', () => {
    console.log('Serial port opened');
});

port.on('data', (data) => {
    const [moisture, temperature, humidity] = data
        .toString()
        .trim()
        .split(',')
        .map(Number);

    console.log(`Moisture: ${moisture}%, Temperature: ${temperature}°C, Humidity: ${humidity}%`);

    // Publish to MQTT
    mqttClient.publish(topic, JSON.stringify({ moisture, temperature, humidity }));

    // Send to server
    axios
        .post('http://localhost:3000/postData', { moisture, temperature, humidity })
        .then(() => console.log('Data sent to server'))
        .catch((err) => console.error('Error sending data:', err));
});

mqttClient.on('error', (err) => {
    console.error('MQTT error:', err);
});

port.on('error', (err) => {
    console.error('Serial port error:', err);
});
