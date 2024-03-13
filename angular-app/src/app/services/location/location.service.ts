import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://127.0.0.1:3000/locations';

  constructor(private http: HttpClient) {}

  // Add a new location
  addLocation(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-location`, name);
  }

  // Delete location
  deleteLocation(locationId: string): Observable<any> {
    const url = `${this.apiUrl}/delete-location/${locationId}`;
    return this.http.delete(url);
  }

  // Get all locations
  getLocations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-locations`);
  }
}
