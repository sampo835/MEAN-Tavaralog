import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = 'http://127.0.0.1:3000/loans';

  constructor(private http: HttpClient) {}

  createLoan(
    itemName: string,
    userName: string,
    location: string,
    loanTime: Date
  ): Observable<any> {
    const loanData = {
      itemName: itemName,
      userName: userName,
      location: location,
      loanTime: loanTime,
    };
    return this.http.post<any>(`${this.apiUrl}/add-loan`, loanData);
  }

  getLoanHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/loan-history`);
  }

  updateLoanWithReturnTime(
    itemName: string,
    returnTime: Date
  ): Observable<any> {
    const body = { itemName, returnTime };
    return this.http.put(`${this.apiUrl}/update-loan-with-return-time`, body);
  }
}
