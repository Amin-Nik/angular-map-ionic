import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map } from '../../components/map/map';
import { RouterModule, Routes } from '@angular/router';

const route: Routes = [
  {
    path: '',
    component: Map,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
