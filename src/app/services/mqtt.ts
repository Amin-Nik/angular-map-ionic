import { inject, Service, signal } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { map, Subscription } from 'rxjs';

interface DataType {
  Accuracy: number;
  Altitude: number;
  Angle: number;
  GPS: number;
  Latitude: number;
  Longitude: number;
  SatelliteSeen: number;
  SatelliteUsed: number;
  Speed: number;
  Status: string;
}

interface CarData {
  id: string;
  carName: string;
  carNumber: string;
}

@Service()
export class Mqtt {
  private mqtt = inject(MqttService);
  private gpsSubscription?: Subscription;

  localStorageCarId = '';
  carName = '';
  carNumber = '';

  data = signal<DataType>({
    Accuracy: 0,
    Altitude: 0,
    Angle: 0,
    GPS: 0,
    Latitude: 0,
    Longitude: 0,
    SatelliteSeen: 0,
    SatelliteUsed: 0,
    Speed: 0,
    Status: '',
  });
  status = this.mqtt.connectionState;

  constructor() {
    this.mqtt.onConnect.subscribe(() => {
      console.log('MQTT CONNECTED');
    });

    this.mqtt.onClose.subscribe(() => {
      console.log('MQTT CLOSED');
    });

    this.mqtt.onError.subscribe((error) => {
      console.error('MQTT ERROR:', error);
    });
  }

  connectToBroker(): void {
    console.log('Connecting to GPS topic...');

    console.log('MQTT connection state:', this.mqtt.connectionState());

    if (this.gpsSubscription && !this.gpsSubscription.closed) {
      console.log('GPS subscription already exists');
      return;
    }

    const topic = `MammutConnect/V1/${this.carNumber}/GPS`;

    console.log('Subscribing to:', topic);

    this.gpsSubscription = this.mqtt
      .observe(topic)
      .pipe(map((msg) => JSON.parse(new TextDecoder().decode(msg.payload))))
      .subscribe({
        next: (payload) => {
          console.log('GPS MESSAGE RECEIVED:', payload);
          this.data.set(payload);
        },
        error: (error) => {
          console.error('GPS STREAM ERROR:', error);
        },
      });
  }
  resetData(): void {
    this.data.set({
      Accuracy: 0,
      Altitude: 0,
      Angle: 0,
      GPS: 0,
      Latitude: 0,
      Longitude: 0,
      SatelliteSeen: 0,
      SatelliteUsed: 0,
      Speed: 0,
      Status: '',
    });
  }
  stopListening(): void {
    this.gpsSubscription?.unsubscribe();
    this.gpsSubscription = undefined;
    this.resetData();
    console.log('GPS subscription stopped');
  }
}
