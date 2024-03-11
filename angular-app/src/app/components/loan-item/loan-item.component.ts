import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  NgZone,
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
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.rfidService.rfidData$.subscribe((data) => {
      if (this.displayMessage === 'Tunnistaudu') {
        this.enteredUserRfidTag = data;

        // Check if the user with the provided RFID tag exists
        this.userService.checkUser(this.enteredUserRfidTag).subscribe(
          (userResponse) => {
            if (userResponse.userExists) {
              this.zone.run(() => {
                this.displayMessage = 'Skannaa tavara';
                this.isLoading = false; // Hide waiting animation
                this.cdr.detectChanges(); // Trigger change detection
              });
            } else {
              // User does not exist
              this.zone.run(() => {
                this.displayMessage = 'Käyttäjää ei löydy';
                this.isLoading = false; // Hide waiting animation
                this.cdr.detectChanges(); // Trigger change detection after updating displayMessage
              });

              // Add a 2-second delay before redirecting to the root route
              setTimeout(() => {
                this.zone.run(() => {
                  this.router.navigate(['']);
                });
              }, 2000);
            }
          },
          (userError) => {
            console.error('Error checking user:', userError);

            // Add a 2-second delay before redirecting to the root route
            setTimeout(() => {
              this.zone.run(() => {
                this.router.navigate(['']);
              });
            }, 2000);
          }
        );
      } else if (this.displayMessage === 'Skannaa tavara') {
        this.enteredItemRfidTag = data;
        this.isLoading = true; // Show waiting animation before loaning
        this.cdr.detectChanges(); // Trigger change detection after updating isLoading

        // Continue with item loan logic...
        this.itemService.checkItem(this.enteredItemRfidTag).subscribe(
          (itemResponse) => {
            if (itemResponse.itemExists && !itemResponse.isLoaned) {
              // Item exists and is not loaned, proceed with loaning
              this.itemService
                .loanItem(this.enteredItemRfidTag, this.enteredUserRfidTag)
                .subscribe(
                  (loanResponse) => {
                    this.isLoading = false; // Hide waiting animation after loaning
                    this.displayMessage = 'Tavara lainattu onnistuneesti';
                    this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

                    setTimeout(() => {
                      this.router.navigate(['']);
                    }, 3000);
                  },
                  (loanError) => {
                    console.error('Error loaning item:', loanError);

                    // Add a 2-second delay before redirecting to the root route
                    setTimeout(() => {
                      this.router.navigate(['']);
                    }, 2000);
                  },
                  () => {
                    this.cdr.detectChanges(); // Trigger change detection after updating isLoading
                  }
                );
            } else {
              // Item does not exist or is already loaned
              this.isLoading = false; // Hide waiting animation
              this.displayMessage = 'Tavaraa ei voi lainata';
              this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

              // Add a 2-second delay before redirecting to the root route
              setTimeout(() => {
                this.router.navigate(['']);
                this.cdr.detectChanges(); // Trigger change detection after redirect
              }, 2000);
            }
          },
          (itemError) => {
            console.error('Error checking item:', itemError);

            // Add a 2-second delay before redirecting to the root route
            setTimeout(() => {
              this.router.navigate(['']);
              this.cdr.detectChanges(); // Trigger change detection after redirect
            }, 2000);
          }
        );
      }
    });
  }
}
