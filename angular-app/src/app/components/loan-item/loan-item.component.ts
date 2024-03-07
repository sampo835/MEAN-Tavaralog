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
  displayMessage: string = 'Skannaa lainaaja';

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rfidService.rfidData$.subscribe((data) => {
      //console.log('RFID Data Received:', data);

      if (this.displayMessage === 'Skannaa lainaaja') {
        this.enteredUserRfidTag = data;
        //console.log('Entered User RFID Tag:', this.enteredUserRfidTag);

        setTimeout(() => {
          this.displayMessage = 'Skannaa tavara';
          //console.log('Display Message:', this.displayMessage);
          this.cdr.detectChanges();
        }, 500);
      } else if (this.displayMessage === 'Skannaa tavara') {
        this.enteredItemRfidTag = data;
        //console.log('Entered Item RFID Tag:', this.enteredItemRfidTag);

        this.itemService
          .loanItem(this.enteredItemRfidTag, this.enteredUserRfidTag)
          .subscribe(
            (response) => {
              //console.log('Item loaned successfully:', response);
              this.displayMessage = 'Tavara lainattu onnistuneesti';
              //console.log('Display Message:', this.displayMessage);

              this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

              setTimeout(() => {
                this.router.navigate(['']);
              }, 3000);
            },
            (error) => {
              console.error('Error loaning item:', error);
            }
          );
      }
    });
  }
}
