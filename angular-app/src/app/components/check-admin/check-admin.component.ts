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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-check-admin',
  templateUrl: './check-admin.component.html',
  styleUrls: ['./check-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckAdminComponent implements OnInit, OnDestroy {
  enteredUserRfidTag: string = '';
  displayMessage: string = 'Lue lukukortti';
  isLoading: boolean = true; // Show waiting animation initially
  private rfidSubscription: Subscription | undefined;

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to RFID data
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // Check if the display message is "Lue lukukortti"
      if (this.displayMessage === 'Lue lukukortti') {
        // Store the scanned RFID tag
        this.enteredUserRfidTag = data;

        // Check if the user is an admin
        this.userService.checkAdmin(this.enteredUserRfidTag).subscribe(
          (response) => {
            // Loading is complete
            this.isLoading = false;

            // Check if the user is an admin
            if (response.isAdmin) {
              // Update display message
              this.displayMessage = 'Skannaus onnistui';

              // Trigger change detection after updating displayMessage
              this.cdr.detectChanges();

              // Navigate to the "management" route after 2 seconds
              setTimeout(() => {
                this.router.navigate(['/management']);
              }, 2000);
            } else {
              // Update display message if user is not an admin
              this.displayMessage = 'Käyttäjä ei ole opettaja';

              // Trigger change detection after updating displayMessage
              this.cdr.detectChanges();

              // Navigate to the main menu after 2 seconds
              setTimeout(() => {
                this.router.navigate(['']);
              }, 2000);
            }
          },
          (error) => {
            // Loading is complete
            this.isLoading = false;

            // Handle error responses
            if (error.status === 404) {
              // Display message for user not found
              this.displayMessage = 'Käyttäjää ei löytynyt';
            } else {
              // Display message for other errors
              this.displayMessage = 'Jokin meni pieleen';
            }

            // Trigger change detection after updating displayMessage
            this.cdr.detectChanges();

            // Navigate to the main menu after 2 seconds, even if there's an error
            setTimeout(() => {
              this.router.navigate(['']);
            }, 2000);
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
