import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Map } from './components/map/map';
import { provideMqtt } from 'ngx-mqtt';
import {
  IonApp,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonRouterOutlet,
  IonText,
  IonTitle,
  IonToolbar,
  provideIonicAngular,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular';
import { mobileView } from './components/mobile-view/mobile-view';
import { FormsModule } from '@angular/forms';
import { SelectCar } from './components/select-car/select-car';

@NgModule({
  declarations: [App, mobileView, Map, SelectCar],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    IonRouterOutlet,
    IonApp,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonList,
    IonItem,
    IonInput,
    IonFooter,
    IonText,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideMqtt({
      hostname: 'ws.dev.d2l.ir',
      port: 443,
      path: '/mqtt',
      protocol: 'wss',
    }),
    provideIonicAngular({}),
  ],
  bootstrap: [App],
})
export class AppModule {}
