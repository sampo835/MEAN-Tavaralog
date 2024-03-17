import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { RfidService } from '../../../services/rfid/rfid.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-first-user',
  templateUrl: './add-first-user.component.html',
  styleUrls: ['./add-first-user.component.scss'],
})
export class AddFirstUserComponent implements OnInit {
  addUserForm!: FormGroup;
  showWelcomeMessage = true; // Add variable to control welcome message
  showForm = false; // Initialize form as hidden
  showScanTag = false;
  showSuccessMessage = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private rfidService: RfidService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Display welcome message for 3 seconds before showing form
    setTimeout(() => {
      this.showWelcomeMessage = false;
      this.showForm = true;
      this.cdr.detectChanges(); // Trigger change detection after updating properties
    }, 3000);
  }

  initForm() {
    this.addUserForm = this.formBuilder.group({
      username: ['', Validators.required],
    });
  }

  onSubmit() {
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
    userData.role = 'admin'; // Set role to admin
    userData.group = 'Opettaja';

    this.userService.addUser(userData).subscribe(
      () => {
        this.showScanTag = false;
        this.showSuccessMessage = true;

        // Trigger change detection after updating properties
        this.cdr.detectChanges();
      },
      (error) => {
        console.error(error);
        // Handle error as needed
      }
    );

    setTimeout(() => {
      this.router.navigate(['/management']); // Update the route as needed
    }, 2000);
  }
}
