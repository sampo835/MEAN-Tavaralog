import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
//import { ItemService } from '../../services/item/item.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  loanedItems: any[] = [];

  constructor(
    private userService: UserService,
    //private itemService: ItemService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    //this.loadLoanedItems();
  }

  /*loadLoanedItems() {
    this.itemService.getLoanedItems().subscribe(
      (data) => {
        this.zone.run(() => {
          this.loanedItems = data || [];
          console.log('Loaned Items:', this.loanedItems);
          this.cdr.detectChanges();
        });
      },
      (error) => {
        console.error('Error fetching loaned items:', error);
      }
    );
  }*/
}
