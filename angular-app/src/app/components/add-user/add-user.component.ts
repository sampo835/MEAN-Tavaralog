import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { RfidService } from '../../services/rfid/rfid.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  addUserForm!: FormGroup;
  showForm = true;
  showScanTag = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  showFormError = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private rfidService: RfidService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      role: ['', Validators.required],
      group: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.addUserForm.invalid) {
      this.showFormError = true;
      // this.errorMessage = 'Fill in the required fields!';
      return;
    }

    this.showForm = false; // Hide the form
    this.showScanTag = true; // Show the "Scan user tag" message

    // Subscribe to RFID data for tag scanning
    const rfidSubscription = this.rfidService.rfidData$.subscribe((rfidTag) => {
      this.onTagScanned(rfidTag);
      rfidSubscription.unsubscribe(); // Unsubscribe after receiving the RFID tag
    });
  }

  onTagScanned(rfidTag: string) {
    rfidTag = rfidTag.trim();
    const userData = this.addUserForm.value;
    userData.rfidTag = rfidTag; // Associate the scanned RFID tag with the new user

    this.userService.addUser(userData).subscribe(
      () => {
        this.showScanTag = false;
        this.showSuccessMessage = true;

        // Trigger change detection after updating properties
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/management']); // Update the route as needed
        }, 2000);
      },
      (error) => {
        console.error(error);

        if (error.status === 400) {
          this.showErrorMessage = true;
          this.showScanTag = false;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/management']);
          }, 2000);
        } else {
          this.showErrorMessage = true;
          this.showScanTag = false;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/management']);
          }, 2000);
        }
      }
    );
  }
}
