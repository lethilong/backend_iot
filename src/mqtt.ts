const mqtt = require('mqtt');
const broker = 'broker.hivemq.com';
const port = 1883;
const topic = 'iot/group8';
const url = `mqtt://${broker}:${port}`;
const options = {
    clientId: 'iot_group8',
    connectTimeout: 5000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
}

const connectMQTT = () => {
    try {
        const client = mqtt.connect(url, options)
        console.log('MQTT connected!');
        client.on('connect', () => {
            client.subscribe(topic);
        })
        client.on('message', (tp, msg) => {
            var data = JSON.parse(msg)
            console.log('Received MQTT msg:', data);
        })
    } catch (err) {
        console.log(err);
    }
}
module.exports = { connectMQTT }