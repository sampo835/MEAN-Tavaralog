import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../services/item/item.service';
import { RfidService } from '../../services/rfid/rfid.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit {
  addItemForm!: FormGroup;
  showForm = true;
  showScanTag = false;
  showSuccessMessage = false;
  showFormError = false;
  showErrorMessage = false;
  errorMessage = '';

  private rfidSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private rfidService: RfidService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenForRfidData();
  }

  ngOnDestroy(): void {
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }

  initForm() {
    this.addItemForm = this.formBuilder.group({
      itemname: ['', Validators.required],
      isLoaned: [false],
    });
  }

  onSubmit() {
    if (this.addItemForm.invalid) {
      this.showFormError = true;
      // this.errorMessage = 'Anna nimi ensin!';
      return;
    }

    this.showForm = false;
    this.showScanTag = true;
  }

  listenForRfidData() {
    this.rfidSubscription = this.rfidService.rfidData$.subscribe(
      (scannedRfidTag) => {
        this.onTagScanned(scannedRfidTag);
      }
    );
  }

  onTagScanned(rfidTag: string) {
    rfidTag = rfidTag.trim();
    const itemData = this.addItemForm.value;
    itemData.rfidTag = rfidTag;

    this.itemService.addItem(itemData).subscribe(
      () => {
        this.showScanTag = false;
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
          // Handle other errors if needed
        }
      }
    );
  }
}
