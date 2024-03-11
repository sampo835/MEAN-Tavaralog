import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-check-admin',
  templateUrl: './check-admin.component.html',
  styleUrls: ['./check-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckAdminComponent implements OnInit {
  enteredUserRfidTag: string = '';
  displayMessage: string = 'Lue lukukortti';
  isLoading: boolean = true; // Show waiting animation initially

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rfidService.rfidData$.subscribe((data) => {
      if (this.displayMessage === 'Lue lukukortti') {
        this.enteredUserRfidTag = data;

        this.userService.checkAdmin(this.enteredUserRfidTag).subscribe(
          (response) => {
            this.isLoading = false;
            if (response.isAdmin) {
              this.displayMessage = 'Skannaus onnistui';

              this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

              setTimeout(() => {
                this.router.navigate(['/management']); // Navigate to the "management" route
              }, 2000);
            } else {
              this.displayMessage = 'Käyttäjä ei ole opettaja';

              this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

              setTimeout(() => {
                this.router.navigate(['']); // Navigate to the main menu
              }, 2000);
            }
          },
          (error) => {
            this.isLoading = false;
            if (error.status === 404) {
              this.displayMessage = 'Käyttäjää ei löytynyt';
            } else {
              this.displayMessage =
                'Jokin meni pieleen tarkistaessa admin-oikeuksia';
            }

            this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

            setTimeout(() => {
              this.router.navigate(['']); // Navigate to the main menu even if there's an error
            }, 2000);
          }
        );
      }
    });
  }
}
