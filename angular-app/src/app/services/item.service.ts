import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://127.0.0.1:3000/items'; // Update with your actual API endpoi

  constructor(private http: HttpClient) {}

  addItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-item`, item);
  }

  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-item/${itemId}`);
  }

  getItems(): Observable<any[]> {
    // Implement this method based on your backend API
    // This method should return an observable with the user data
    // Make sure to handle error cases appropriately
    return this.http.get<any[]>(`${this.apiUrl}/get-items`);
  }
}
