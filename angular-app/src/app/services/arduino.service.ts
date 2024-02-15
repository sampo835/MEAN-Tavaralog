import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArduinoService {
  private apiUrl = 'http://127.0.0.1:3000/users/check-admin'; // Adjust the URL based on your server setup

  constructor(private http: HttpClient) {}

  getRfidData(): Observable<any> {
    // Make an HTTP request to the Node.js server to check RFID data
    return this.http.get<any>(this.apiUrl);
  }
}
