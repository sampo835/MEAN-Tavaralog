import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { RfidService } from '../../../services/rfid/rfid.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.scss'],
})
export class StartupComponent implements OnInit {
  addUserForm!: FormGroup;
  showWelcomeMessage = true;
  showForm = false;
  showScanTag = false;
  showSuccessMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private rfidService: RfidService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check for users in the database
    this.userService.getUsers().subscribe(
      (users) => {
        if (users.length === 0) {
          // No users found, display the welcome message and form
          setTimeout(() => {
            this.showWelcomeMessage = false;
            this.showForm = true;
          }, 3000);
        } else {
          setTimeout(() => {
            this.showWelcomeMessage = false;
            this.router.navigate(['/main-menu']);
          }, 3000);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Handle error if necessary
      }
    );
  }

  initForm() {
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  onSubmit() {
    this.showWelcomeMessage = false;
    this.showForm = false;
    this.showScanTag = true;

    const rfidSubscription = this.rfidService.rfidData$.subscribe((rfidTag) => {
      this.onTagScanned(rfidTag);
      rfidSubscription.unsubscribe();
    });
  }

  onTagScanned(rfidTag: string) {
    rfidTag = rfidTag.trim();
    const userData = this.addUserForm.value;
    userData.rfidTag = rfidTag;
    userData.role = 'admin';
    userData.group = 'Opettaja';

    this.userService.addUser(userData).subscribe(
      () => {
        this.showScanTag = false;
        this.showSuccessMessage = true;
      },
      (error) => {
        console.error(error);
        // Handle error if necessary
      }
    );

    setTimeout(() => {
      this.router.navigate(['/main-menu']);
    }, 2000);
  }
}
