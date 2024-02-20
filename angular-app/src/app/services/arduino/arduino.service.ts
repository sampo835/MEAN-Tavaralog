import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArduinoService {
  //private apiUrl = 'http://127.0.0.1:3000/arduino';

  constructor(private http: HttpClient) {}

  getRfidData(): Observable<{ tag: string; message: string }> {
    const url = 'http://127.0.0.1:3000/arduino/rfid'; // Check this line
    return this.http.get<{ tag: string; message: string }>(url);
  }
}
