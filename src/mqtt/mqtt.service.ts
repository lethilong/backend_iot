import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
    private mqttClient;
    onModuleInit() {
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

        this.mqttClient = connect(url, options);
        this.mqttClient.on('Connect', () => {
            console.log("Connected to MQTT");
        });
        this.mqttClient.on('Error', () => {
            console.log("Error in connecting to MQTT")
        });

    };

    publish(topic: string, payload) {
        this.mqttClient.publish(topic, payload);
    };

    subscribe(topic: string) {
        this.mqttClient.subscribe(topic);
        this.mqttClient.on('message', (tp, msg) => {
            console.log(JSON.parse(msg));
        });
    }
}
