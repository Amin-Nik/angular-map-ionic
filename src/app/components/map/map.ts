import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  output,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-rotatedmarker';
import { Mqtt } from '../../services/mqtt';

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

const directionIcon = L.divIcon({
  className: 'direction-marker',
  html: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
    >
      <path
        d="M18 2 L31 32 L18 25 L5 32 Z"
        fill="#1976d2"
        stroke="white"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

@Component({
  selector: 'app-map',
  standalone: false,
  styleUrl: './map.css',
  templateUrl: './map.html',
})
export class Map implements AfterViewInit, OnDestroy {
  mqtt = inject(Mqtt);

  @ViewChild('mapContainer')
  mapContainer!: ElementRef<HTMLDivElement>;

  readonly locationSelected = output<MapCoordinates>();

  private map?: L.Map;
  private marker?: L.Marker;
  private resizeObserver?: ResizeObserver;
  private animationFrameId?: number;
  private markerAnimationFrameId?: number;

  latLong = computed<[number, number]>(() => [
    this.mqtt.data().Latitude,
    this.mqtt.data().Longitude,
  ]);

  constructor() {
    effect(() => {
      const [lat, lng] = this.latLong();

      if (
        !this.map ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return;
      }

      const position: L.LatLngExpression = [lat, lng];

      if (this.marker) {
        // this.marker.setLatLng(position);
        this.animateMarkerTo(lat, lng, 1000);
        this.marker.setRotationAngle(this.mqtt.data().Angle + 180);
        console.log(this.mqtt.data().Angle);
        this.map.panTo(position, {
          animate: true,
          duration: 0.5,
        });
      } else {
        this.marker = L.marker(position, {
          icon: directionIcon,
          rotationAngle: 0,
          rotationOrigin: 'center center',
        }).addTo(this.map);
        this.map.panTo(position);
      }

      this.locationSelected.emit({
        latitude: lat,
        longitude: lng,
      });
    });
  }

  ngAfterViewInit(): void {
    console.log('map ngAfterViewInit');
    this.map = L.map(this.mapContainer.nativeElement).setView(this.latLong(), 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 19,
    }).addTo(this.map);

    // Recalculate the map size after Ionic finishes its layout.
    this.animationFrameId = requestAnimationFrame(() => {
      this.map?.invalidateSize({ pan: false });
    });

    // Keep the map dimensions synchronized with its container.
    this.resizeObserver = new ResizeObserver(() => {
      this.map?.invalidateSize({ pan: false });
    });

    this.resizeObserver.observe(this.mapContainer.nativeElement);

    this.mqtt.connectToBroker();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
      this.markerAnimationFrameId = undefined;
    }

    this.resizeObserver?.disconnect();
    this.mqtt.stopListening();

    this.map?.remove();

    this.map = undefined;
    this.marker = undefined;
  }

  private animateMarkerTo(targetLat: number, targetLng: number, duration = 1000): void {
    if (!this.marker) return;

    // انیمیشن قبلی را متوقف کن
    if (this.markerAnimationFrameId !== undefined) {
      cancelAnimationFrame(this.markerAnimationFrameId);
    }

    // موقعیت فعلی مارکر
    const start = this.marker.getLatLng();

    const startLat = start.lat;
    const startLng = start.lng;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      if (!this.marker) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // حرکت نرم با ease-in-out
      const easedProgress =
        progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const lat = startLat + (targetLat - startLat) * easedProgress;

      const lng = startLng + (targetLng - startLng) * easedProgress;

      this.marker.setLatLng([lat, lng]);

      if (progress < 1) {
        this.markerAnimationFrameId = requestAnimationFrame(animate);
      } else {
        this.markerAnimationFrameId = undefined;
      }
    };

    this.markerAnimationFrameId = requestAnimationFrame(animate);
  }
}
