import { Component, inject, signal } from '@angular/core';
import { Mqtt } from './services/mqtt';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  standalone: false,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  mqtt = inject(Mqtt);
  router = inject(Router);

  headerTitle = signal<string>('انتخاب خودرو');
  footerTitle = signal<string>('');
  hasData = this.mqtt.hasData();

  constructor() {
    addIcons({ chevronBackOutline });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;

        if (url === '/home') {
          this.headerTitle.set('انتخاب خودرو');
          this.footerTitle.set('');
        } else if (url === '/map') {
          if (!this.mqtt.carName && !this.mqtt.carNumber) {
            this.router.navigate(['/home']);
          }
          console.log(this.mqtt.carName, this.mqtt.carNumber);
          this.headerTitle.set(this.mqtt.carName);
          this.footerTitle.set(this.mqtt.carNumber);
        }
      });
  }
}
