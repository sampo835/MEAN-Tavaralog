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
  displayMessage: string = '';
  isLoading: boolean = false;
  isScanAdminPhase: boolean = true;
  isScanSuccesPhase: boolean = false;
  private rfidSubscription: Subscription | undefined;

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.displayMessage = 'Tunnistaudu';
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // WHEN TAG IS SCANNED
      this.displayMessage = 'Luku onnistui, tarkistetaan..';
      this.isLoading = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        // ADMIN SEARCH
        if ((this.isScanAdminPhase = true)) {
          this.enteredUserRfidTag = data;

          this.userService.checkAdmin(this.enteredUserRfidTag).subscribe(
            (response) => {
              this.isLoading = false;

              // Check if the user is an admin
              if (response.isAdmin) {
                this.displayMessage = 'Tervetuloa';
                this.cdr.detectChanges();

                setTimeout(() => {
                  this.router.navigate(['/management']);
                }, 2000);
              } else {
                this.displayMessage = 'Käyttäjä ei ole opettaja';
                this.cdr.detectChanges();
                setTimeout(() => {
                  this.router.navigate(['/main-menu']);
                }, 2000);
              }
            },
            (error) => {
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
                this.router.navigate(['main-menu']);
              }, 2000);
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
