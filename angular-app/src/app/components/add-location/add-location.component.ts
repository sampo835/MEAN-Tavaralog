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
  showErrorMessage = false;
  showFormError = false;
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
    if (this.addLocationForm.invalid) {
      this.showFormError = true;
      //this.errorMessage = 'Anna nimi ensin!';
      return;
    }

    const locationData = this.addLocationForm.value;
    this.locationService.addLocation(locationData).subscribe(
      () => {
        this.showForm = false;
        this.showSuccessMessage = true;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/management']);
        }, 2000);
      },
      (error) => {
        console.error(error);

        if (error.status === 400 && error.error && error.error.message) {
          this.showErrorMessage = true;
          this.showForm = false;

          setTimeout(() => {
            this.router.navigate(['/management']);
          }, 2000);
        } else {
        }
      }
    );
  }
}
