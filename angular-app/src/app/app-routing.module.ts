import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ReturnItemComponent } from './components/return-item/return-item.component';
import { InfoComponent } from './components/info/info.component';
import { LoanItemComponent } from './components/loan-item/loan-item.component';
import { ManagementComponent } from './components/management/management.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { CheckAdminComponent } from './components/check-admin/check-admin.component';
import { AddLocationComponent } from './components/add-location/add-location.component';

const routes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'check-admin', component: CheckAdminComponent },
  { path: 'loan-item', component: LoanItemComponent },
  { path: 'return-item', component: ReturnItemComponent },
  { path: 'info', component: InfoComponent },
  { path: 'management', component: ManagementComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'add-location', component: AddLocationComponent },
  { path: 'check-admin', component: CheckAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
