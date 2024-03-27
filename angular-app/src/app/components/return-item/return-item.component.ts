import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { ItemService } from '../../services/item/item.service';
import { LoanService } from '../../services/loan/loan.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-return-item',
  templateUrl: './return-item.component.html',
  styleUrls: ['./return-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnItemComponent implements OnInit, OnDestroy {
  enteredItemRfidTag: string = '';
  displayMessage: string = '';
  itemName: string = '';
  isReturnItemPhase: boolean = true;
  isLoading: boolean = false;
  private rfidSubscription: Subscription | undefined;

  constructor(
    private rfidService: RfidService,
    private itemService: ItemService,
    private loanService: LoanService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  /*ngOnInit(): void {
    this.displayMessage = 'Skannaa tavara';
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // WHEN TAG IS SCANNED
      this.displayMessage = 'Luku onnistui, tarkistetaan..';
      this.isLoading = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        if ((this.isReturnItemPhase = true)) {
          this.enteredItemRfidTag = data;

          this.itemService.returnItem(this.enteredItemRfidTag).subscribe(
            (response) => {
              this.isLoading = false;
              this.displayMessage = 'Tavara palautettu onnistuneesti';

              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['/main-menu']);
              }, 2000);
            },
            (error) => {
              this.isLoading = false;
              if (error.status === 404) {
                this.displayMessage = 'Tavaraa ei löytynyt';
              } else if (error.status === 400) {
                this.displayMessage = 'Tavara on jo palautettu';
              } else {
                this.displayMessage = 'Jokin meni pieleen';
              }
              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['main-menu']);
              }, 2000);
            }
          );
        }
      }, 2000);
    });
  }*/

  ngOnInit(): void {
    this.displayMessage = 'Skannaa tavara';
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // WHEN TAG IS SCANNED
      this.displayMessage = 'Luku onnistui, tarkistetaan..';
      this.isLoading = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        if (this.isReturnItemPhase) {
          // Use comparison operator '===' instead of assignment '='
          this.enteredItemRfidTag = data;

          // Call the itemService to get the item name
          this.itemService.getItem(this.enteredItemRfidTag.trim()).subscribe(
            (item) => {
              this.itemName = item.itemname;
              const currentTime = new Date();

              // Update loan with return time using LoanService
              this.loanService
                .updateLoanWithReturnTime(this.itemName, currentTime)
                .subscribe(
                  () => {
                    this.itemService
                      .returnItem(this.enteredItemRfidTag)
                      .subscribe(
                        () => {
                          this.isLoading = false;
                          this.displayMessage =
                            'Tavara palautettu onnistuneesti';
                          this.cdr.detectChanges();
                          setTimeout(() => {
                            this.router.navigate(['/main-menu']);
                          }, 2000);
                        },
                        (error) => {
                          this.isLoading = false;
                          console.error('Error returning item:', error);
                          this.displayMessage = 'Jokin meni pieleen';
                          this.cdr.detectChanges();
                          setTimeout(() => {
                            this.router.navigate(['/main-menu']);
                          }, 2000);
                        }
                      );
                  },
                  (error) => {
                    this.isLoading = false;
                    console.error('Error updating loan:', error);
                    this.displayMessage = 'Jokin meni pieleen';
                    this.cdr.detectChanges();
                    setTimeout(() => {
                      this.router.navigate(['/main-menu']);
                    }, 2000);
                  }
                );
            },
            (itemError) => {
              console.error('Error getting item:', itemError);
              this.router.navigate(['/main-menu']);
            }
          );
        }
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }
}
