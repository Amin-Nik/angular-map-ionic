import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map } from '../../components/map/map';
import { MapRoutingModule } from './map-routing-module';

@NgModule({
  declarations: [Map],
  imports: [CommonModule, MapRoutingModule],
})
export class MapModule {}
