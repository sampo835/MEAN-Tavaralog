import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-check-admin',
  templateUrl: './check-admin.component.html',
  styleUrls: ['./check-admin.component.scss'],
})
export class CheckAdminComponent implements OnInit {
  enteredRfidTag: string = '';

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rfidService.rfidData$.subscribe((data) => {
      this.enteredRfidTag = data;

      // Check if the scanned RFID tag is an admin's tag
      this.userService.checkAdmin(this.enteredRfidTag).subscribe(
        (response) => {
          if (response.isAdmin) {
            // Redirect to the management component if the user is an admin
            this.router.navigate(['/management']);
          }
        },
        (error) => {
          console.error('Error checking admin status:', error);
        }
      );
    });
  }
}
