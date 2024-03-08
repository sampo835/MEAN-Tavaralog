import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
