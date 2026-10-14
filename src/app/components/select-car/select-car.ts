import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Mqtt } from '../../services/mqtt';

interface CarData {
  id: string;
  carName: string;
  carNumber: string;
}

@Component({
  selector: 'app-select-car',
  standalone: false,
  styleUrl: './select-car.css',
  templateUrl: './select-car.html',
})
export class SelectCar {
  carsData = signal<[CarData] | undefined>(undefined);
  router = inject(Router);
  mqtt = inject(Mqtt);

  constructor() {
    addIcons({ add });
  }

  ionViewWillEnter() {
    const local = localStorage.getItem('car-data');
    if (local) {
      const carData: [CarData] = JSON.parse(local);
      this.carsData.set(carData);
    }
  }
  setMqtt(name: string, number: string) {
    this.mqtt.carName = name;
    this.mqtt.carNumber = number;
    this.router.navigate(['/map']);
  }

  navigateToAddPage() {
    this.router.navigate(['/add']);
  }
}
