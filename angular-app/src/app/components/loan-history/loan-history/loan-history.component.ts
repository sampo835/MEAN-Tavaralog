import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../../services/loan/loan.service';

@Component({
  selector: 'app-loan-history',
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.scss'],
})
export class LoanHistoryComponent implements OnInit {
  loanHistory: any[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.fetchLoanHistory();
  }

  fetchLoanHistory(): void {
    this.loanService.getLoanHistory().subscribe(
      (history: any[]) => {
        this.loanHistory = history;
      },
      (error) => {
        console.error('Error fetching loan history:', error);
        // Handle error
      }
    );
  }
}
