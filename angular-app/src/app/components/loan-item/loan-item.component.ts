import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { UserService } from '../../services/user/user.service';
import { ItemService } from '../../services/item/item.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-item',
  templateUrl: './loan-item.component.html',
  styleUrls: ['./loan-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanItemComponent implements OnInit, OnDestroy {
  enteredUserRfidTag: string = '';
  enteredItemRfidTag: string = '';
  isIdentificationPhase: boolean = true;
  isScanItemPhase: boolean = false;
  isChooseLocationPhase: boolean = false; // Added flag for choose location step
  isLoanSuccessPhase: boolean = false;
  isLoading: boolean = true; // Show waiting animation initially
  displayMessage: string = 'Tunnistaudu';
  private rfidSubscription: Subscription | undefined;
  location: string = ''; // Property to store the chosen location

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to RFID data
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      if (this.isIdentificationPhase) {
        this.enteredUserRfidTag = data;

        // Check if the user with the provided RFID tag exists
        this.userService.checkUser(this.enteredUserRfidTag).subscribe(
          (userResponse) => {
            if (userResponse.userExists) {
              this.isIdentificationPhase = false;
              this.isScanItemPhase = true;
              this.isLoading = false; // Hide waiting animation
              this.displayMessage = 'Skannaa tavara';
              this.cdr.detectChanges(); // Trigger change detection
            } else {
              // User does not exist
              this.isIdentificationPhase = false;
              this.isScanItemPhase = false;
              this.isChooseLocationPhase = false;
              this.isLoanSuccessPhase = false;
              this.isLoading = false; // Hide waiting animation
              this.displayMessage = 'Käyttäjää ei löydy';
              this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

              // Add a 2-second delay before redirecting to the root route
              setTimeout(() => {
                this.router.navigate(['']);
              }, 2000);
            }
          },
          (userError) => {
            console.error('Error checking user:', userError);

            // Add a 2-second delay before redirecting to the root route
            setTimeout(() => {
              this.router.navigate(['']);
            }, 2000);
          }
        );
      } else if (this.isScanItemPhase) {
        this.enteredItemRfidTag = data;
        this.isLoading = true; // Show waiting animation before loaning
        this.cdr.detectChanges(); // Trigger change detection after updating isLoading

        // Continue with item loan logic...
        this.itemService.checkItem(this.enteredItemRfidTag).subscribe(
          (itemResponse) => {
            if (itemResponse.itemExists && !itemResponse.isLoaned) {
              // Item exists and is not loaned, move to choose location phase
              this.isScanItemPhase = false;
              this.isChooseLocationPhase = true;
              this.isLoading = false; // Hide waiting animation
              this.displayMessage = 'Valitse lainapaikka';
              this.cdr.detectChanges(); // Trigger change detection

              // You may update the template to display location options and capture the user's choice.
            } else {
              // Item does not exist or is already loaned
              this.isLoading = false; // Hide waiting animation
              this.isLoanSuccessPhase = false;
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
      } else if (this.isChooseLocationPhase) {
        // Handle choose location logic
        this.location = data; // Assuming data is the chosen location
        this.isChooseLocationPhase = false; // Reset the phase
        this.isLoading = true; // Show waiting animation before loaning
        this.cdr.detectChanges(); // Trigger change detection after updating isLoading

        // Continue with item loan logic...
        this.itemService
          .loanItem(
            this.enteredItemRfidTag,
            this.enteredUserRfidTag,
            this.location
          )
          .subscribe(
            (loanResponse) => {
              this.isLoading = false; // Hide waiting animation after loaning
              this.isLoanSuccessPhase = true;
              this.displayMessage = 'Tavara lainattu!';
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
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the RFID data subscription to prevent memory leaks
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }
}
