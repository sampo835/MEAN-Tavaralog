// scan-admin.component.ts
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-scan-admin',
  templateUrl: './scan-admin.component.html',
  styleUrls: ['./scan-admin.component.scss'],
})
export class ScanAdminComponent {
  scannedData: { rfidTag: string } = { rfidTag: '' };

  constructor(private userService: UserService, private router: Router) {}

  checkAdmin() {
    this.userService.checkAdmin(this.scannedData.rfidTag).subscribe(
      (isAdmin) => {
        if (isAdmin) {
          // Redirect to the management component upon successful scan
          this.router.navigate(['/management']); // Replace '/management' with your actual route
        } else {
          // Handle the case where the user is not an admin
          console.log('User is not an admin');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
