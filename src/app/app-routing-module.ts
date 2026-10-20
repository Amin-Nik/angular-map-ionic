import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { addNewCar } from './components/add-new-car/add-new-car';
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
    component: addNewCar,
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
