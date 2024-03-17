// add-item.component.ts

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
    // Unsubscribe to avoid memory leaks
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

        // Perform change detection before redirection
        this.cdr.detectChanges();

        // Redirect to the management page after a delay
        setTimeout(() => {
          this.router.navigate(['/management']);
        }, 2000); // Adjust the delay as needed
      },
      (error) => {
        console.error(error);
        // Handle error as needed
      }
    );
  }
}
