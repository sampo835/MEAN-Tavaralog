import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { UserService } from '../../services/user/user.service';
import { ItemService } from '../../services/item/item.service';

@Component({
  selector: 'app-loan-item',
  templateUrl: './loan-item.component.html',
  styleUrls: ['./loan-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanItemComponent implements OnInit {
  enteredUserRfidTag: string = '';
  enteredItemRfidTag: string = '';
  displayMessage: string = 'Tunnistaudu';
  isLoading: boolean = true; // Show waiting animation initially

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rfidService.rfidData$.subscribe((data) => {
      if (this.displayMessage === 'Tunnistaudu') {
        this.enteredUserRfidTag = data;
        setTimeout(() => {
          this.displayMessage = 'Skannaa tavara';
          this.cdr.detectChanges();
        }, 500);
      } else if (this.displayMessage === 'Skannaa tavara') {
        this.enteredItemRfidTag = data;
        this.isLoading = true; // Show waiting animation before loaning
        this.cdr.detectChanges(); // Trigger change detection after updating isLoading

        this.itemService
          .loanItem(this.enteredItemRfidTag, this.enteredUserRfidTag)
          .subscribe(
            (response) => {
              this.displayMessage = 'Tavara lainattu onnistuneesti';
              this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

              setTimeout(() => {
                this.router.navigate(['']);
              }, 3000);
            },
            (error) => {
              console.error('Error loaning item:', error);
            },
            () => {
              this.isLoading = false; // Hide waiting animation after loaning
              this.cdr.detectChanges(); // Trigger change detection after updating isLoading
            }
          );
      }
    });
  }
}
