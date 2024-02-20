import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArduinoService {
  private apiUrl = 'http://localhost:3000/api/rfid';

  constructor(private http: HttpClient) {}

  getRfidData(): Observable<{ tag: string; message: string }> {
    return this.http.get<{ tag: string; message: string }>(this.apiUrl);
  }
}
