import { Component, OnDestroy, OnInit } from '@angular/core';
import { ArduinoService } from '../../services/arduino/arduino.service';
import { UserService } from '../../services/user/user.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-scan-admin',
  template: `
    <div>
      <input [(ngModel)]="rfidTag" placeholder="Enter RFID Tag" />
      <button (click)="checkAdmin()">Check Admin</button>
      <div *ngIf="isAdmin === true; else notAdmin">
        Redirecting to /management...
      </div>
      <ng-template #notAdmin>
        <div>Not admin tag</div>
      </ng-template>
    </div>
  `,
})
export class ScanAdminComponent implements OnInit, OnDestroy {
  rfidTag = '';
  isAdmin: boolean | null = null;
  private subscription: Subscription | undefined;

  constructor(
    private arduinoService: ArduinoService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Start listening for RFID data continuously
    this.subscription = interval(1000).subscribe(() => {
      this.getRfidData();
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getRfidData() {
    this.arduinoService.getRfidData().subscribe(
      (response) => {
        // Process RFID data as needed
        console.log(response);
        // Optionally, you can also check if it's an admin immediately
        this.checkAdmin();
      },
      (error) => {
        console.error(error);
        // Handle error as needed
      }
    );
  }

  checkAdmin() {
    this.userService.checkAdmin(this.rfidTag).subscribe(
      (response) => {
        this.isAdmin = response.isAdmin;
        if (this.isAdmin) {
          // Redirect logic here (e.g., navigate to /management)
        }
      },
      (error) => {
        console.error(error);
        // Handle error as needed
      }
    );
  }
}
