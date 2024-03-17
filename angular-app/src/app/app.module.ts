import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoanItemComponent } from './components/loan-item/loan-item.component';
import { HttpClientModule } from '@angular/common/http';
import { ReturnItemComponent } from './components/return-item/return-item.component';
import { ManagementComponent } from './components/management/management.component';
import { InfoComponent } from './components/info/info.component';
import { FormsModule } from '@angular/forms';
import { AddItemComponent } from './components/add-item/add-item.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { CheckAdminComponent } from './components/check-admin/check-admin.component';
import { HeaderComponent } from './components/header/header.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { AddFirstUserComponent } from './components/add-first-user/add-first-user/add-first-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoanItemComponent,
    ReturnItemComponent,
    ManagementComponent,
    InfoComponent,
    AddItemComponent,
    AddUserComponent,
    MainMenuComponent,
    CheckAdminComponent,
    HeaderComponent,
    AddLocationComponent,
    AddFirstUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
