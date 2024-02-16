import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ScanAdminComponent } from './components/scan-admin/scan-admin.component';
import { ScanUserComponent } from './components/scan-user/scan-user.component';
import { LoanItemComponent } from './components/loan-item/loan-item.component';
import { HttpClientModule } from '@angular/common/http';
import { ReturnItemComponent } from './components/return-item/return-item.component';
import { ManagementComponent } from './components/management/management.component';
import { InfoComponent } from './components/info/info.component';
import { FormsModule } from '@angular/forms';
import { AddItemComponent } from './components/add-item/add-item.component';
import { AddUserComponent } from './components/add-user/add-user.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ScanAdminComponent,
    ScanUserComponent,
    LoanItemComponent,
    ReturnItemComponent,
    ManagementComponent,
    InfoComponent,
    AddItemComponent,
    AddUserComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
