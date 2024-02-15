import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ScanAdminComponent } from './components/scan-admin/scan-admin.component';
import { ScanItemComponent } from './components/scan-item/scan-item.component';
import { ScanUserComponent } from './components/scan-user/scan-user.component';
import { ReturnItemComponent } from './components/return-item/return-item.component';
import { InfoComponent } from './components/info/info.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: ScanAdminComponent },
  { path: 'scan-item', component: ScanItemComponent},
  { path: 'scan-user', component: ScanUserComponent},
  { path: 'return-item', component: ReturnItemComponent},
  { path: 'info', component: InfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
