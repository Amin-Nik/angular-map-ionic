import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { mobileView } from './components/mobile-view/mobile-view';
import { SelectCar } from './components/select-car/select-car';
import { Map } from './components/map/map';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: SelectCar,
  },
  {
    path: 'add',
    component: mobileView,
  },
  {
    path: 'map',
    component: Map,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
