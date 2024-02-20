// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:3000/users'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  addUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-user`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-user/${userId}`);
  }

  getUsers(): Observable<any[]> {
    // Implement this method based on your backend API
    // This method should return an observable with the user data
    // Make sure to handle error cases appropriately
    return this.http.get<any[]>(`${this.apiUrl}/get-users`);
  }

  checkAdmin(rfidTag: string): Observable<{ isAdmin: boolean }> {
    const url = `${this.apiUrl}/check-admin/${rfidTag}`;
    return this.http.get<{ isAdmin: boolean }>(url);
  }
}
