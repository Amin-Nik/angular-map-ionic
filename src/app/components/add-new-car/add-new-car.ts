import { Component, inject, signal } from '@angular/core';
import { Mqtt } from '../../services/mqtt';
import { Router } from '@angular/router';

interface CarData {
  id: string;
  carName: string;
  carNumber: string;
}

@Component({
  selector: 'app-add-new-car',
  standalone: false,
  styleUrl: './add-new-car.css',
  templateUrl: './add-new-car.html',
})
export class addNewCar {
  mqtt = inject(Mqtt);
  router = inject(Router);

  formError = signal({
    hasNameError: false,
    hasNumberError: false,
    nameErrorMessage: '',
    numberErrorMessage: '',
  });

  carName = '';
  carNumber = '';
  nameTouched = false;
  numberTouched = false;

  onClick() {
    if (this.carName.trim() === '') {
      this.formError.update((v) => ({
        hasNameError: true,
        hasNumberError: v.hasNumberError,
        nameErrorMessage: 'لطفا نام را وارد نمایید',
        numberErrorMessage: v.numberErrorMessage,
      }));
    } else {
      this.formError.update((v) => ({
        hasNameError: false,
        hasNumberError: v.hasNumberError,
        nameErrorMessage: '',
        numberErrorMessage: v.numberErrorMessage,
      }));
    }

    if (!this.carNumber) {
      this.formError.update((v) => ({
        hasNameError: v.hasNameError,
        hasNumberError: true,
        numberErrorMessage: 'لطفا شماره را وارد نمایید',
        nameErrorMessage: v.nameErrorMessage,
      }));
    } else {
      if (this.carNumber.toString().length !== 15) {
        this.formError.update((v) => ({
          hasNameError: v.hasNameError,
          hasNumberError: true,
          numberErrorMessage: 'شماره خودرو باید 15 رقم باشد',
          nameErrorMessage: v.nameErrorMessage,
        }));
      } else {
        this.formError.update((v) => ({
          hasNameError: v.hasNameError,
          hasNumberError: false,
          numberErrorMessage: '',
          nameErrorMessage: v.nameErrorMessage,
        }));
      }
    }

    if (!this.formError().hasNameError && !this.formError().hasNumberError) {
      const local = localStorage.getItem('car-data');
      if (local) {
        const carData: [CarData] = JSON.parse(local);
        carData.push({
          id: crypto.randomUUID(),
          carName: this.carName,
          carNumber: this.carNumber.toString(),
        });
        const stringData = JSON.stringify(carData);
        localStorage.setItem('car-data', stringData);
      } else {
        const carData: [CarData] = [
          {
            id: crypto.randomUUID(),
            carName: this.carName,
            carNumber: this.carNumber.toString(),
          },
        ];
        const stringData = JSON.stringify(carData);
        localStorage.setItem('car-data', stringData);
      }
      this.router.navigate(['/home']);
    }
  }
}
