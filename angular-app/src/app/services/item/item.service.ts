import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = 'http://127.0.0.1:3000/items';

  constructor(private http: HttpClient) {}

  addItem(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-item`, item);
  }

  deleteItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-item/${itemId}`);
  }

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-items`);
  }

  getLoanedItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-loaned-items`);
  }

  loanItem(itemRfidTag: string, userRfidTag: string): Observable<any> {
    // Remove leading and trailing whitespace characters
    const trimmedItemRfidTag = itemRfidTag.trim();
    const trimmedUserRfidTag = userRfidTag.trim();

    const body = {
      itemRfidTag: trimmedItemRfidTag,
      userRfidTag: trimmedUserRfidTag,
    };

    return this.http.put(`${this.apiUrl}/loan-item`, body);
  }

  /*returnItem(rfidTag: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/return/${rfidTag}`, null);
  }*/

  returnItem(rfidTag: string): Observable<any> {
    // Remove leading and trailing whitespace characters
    const trimmedRfidTag = rfidTag.trim();
    console.log('Trimmed RFID Tag in Service:', trimmedRfidTag);

    return this.http.put(`${this.apiUrl}/return/${trimmedRfidTag}`, null);
  }
}
