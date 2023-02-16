import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HomeModule } from './home/home.module';
import { RoomModule } from './room/room.module';
import { DeviceModule } from './device/device.module';
import { MqttModule } from './mqtt/mqtt.module';
import { join } from 'path';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    // ClientsModule.register([
    //   {
    //     name: 'MQTT_SERVICE',
    //     transport: Transport.MQTT,
    //     options: {
    //       clientId: 'iot_group8',
    //       url: 'mqtt://broker.hivemq.com:1883',
    //       username: process.env.MQTT_USERNAME,
    //       password: process.env.MQTT_PASSWORD,
    //     }
    //   }
    // ]),
    UserModule,
    AuthModule,
    HomeModule,
    RoomModule,
    DeviceModule,
    MqttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
