import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { ScanAdminComponent } from './components/scan-admin/scan-admin.component';
import { ScanUserComponent } from './components/scan-user/scan-user.component';
import { ScanItemComponent } from './components/scan-item/scan-item.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ScanAdminComponent,
    ScanUserComponent,
    ScanItemComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
