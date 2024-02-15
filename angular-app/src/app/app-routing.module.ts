import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ScanAdminComponent } from './components/scan-admin/scan-admin.component';
import { ScanUserComponent } from './components/scan-user/scan-user.component';
import { ReturnItemComponent } from './components/return-item/return-item.component';
import { InfoComponent } from './components/info/info.component';
import { LoanItemComponent } from './components/loan-item/loan-item.component';
import { ManagementComponent } from './components/management/management.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'scan-admin', component: ScanAdminComponent },
  { path: 'loan-item', component: LoanItemComponent },
  { path: 'scan-user', component: ScanUserComponent },
  { path: 'return-item', component: ReturnItemComponent },
  { path: 'info', component: InfoComponent },
  { path: 'management', component: ManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
