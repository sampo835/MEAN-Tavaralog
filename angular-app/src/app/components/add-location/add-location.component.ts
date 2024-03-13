import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../services/location/location.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
  addLocationForm!: FormGroup;
  showForm = true;
  showSuccessMessage = false;
  showError = false;
  errorMessage = '';

  private rfidSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }

  initForm() {
    this.addLocationForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    const locationData = this.addLocationForm.value;

    this.locationService.addLocation(locationData).subscribe(
      () => {
        this.showForm = false;
        this.showSuccessMessage = true;

        // Perform change detection before redirection
        this.cdr.detectChanges();

        // Redirect to the management page after a delay
        setTimeout(() => {
          this.router.navigate(['/management']);
        }, 2000); // Adjust the delay as needed
      },
      (error) => {
        console.error(error);

        if (error.status === 400 && error.error && error.error.message) {
          // Handle the specific case where the location already exists
          this.showError = true;
          this.errorMessage = error.error.message;
        } else {
          // Handle other errors as needed
        }
      }
    );
  }
}
