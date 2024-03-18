import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { ItemService } from '../../services/item/item.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-return-item',
  templateUrl: './return-item.component.html',
  styleUrls: ['./return-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnItemComponent implements OnInit, OnDestroy {
  enteredItemRfidTag: string = '';
  displayMessage: string = 'Skannaa tavara'; // Assuming you start with scanning the item
  isLoading: boolean = true; // Show waiting animation initially
  private rfidSubscription: Subscription | undefined;

  constructor(
    private rfidService: RfidService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to RFID data
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // Check if the display message is 'Skannaa tavara'
      if (this.displayMessage === 'Skannaa tavara') {
        this.enteredItemRfidTag = data;
        this.isLoading = true; // Show waiting animation before returning

        // Trigger change detection after updating isLoading
        this.cdr.detectChanges();

        // Return the item using the itemService
        this.itemService.returnItem(this.enteredItemRfidTag).subscribe(
          (response) => {
            // Item returned successfully
            this.isLoading = false; // Hide waiting animation after returning
            this.displayMessage = 'Tavara palautettu onnistuneesti';

            // Trigger change detection after updating displayMessage
            this.cdr.detectChanges();

            // Navigate to the main menu after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/main-menu']);
            }, 2000);
          },
          (error) => {
            // Handle different error statuses
            if (error.status === 404) {
              this.displayMessage = 'Tavaraa ei löytynyt';
            } else if (error.status === 400) {
              this.displayMessage = 'Tavaraa ei ole lainattu';
            } else {
              this.displayMessage = 'Jokin meni pieleen palautettaessa tavaraa';
            }

            // Hide waiting animation after handling the error
            this.isLoading = false;

            // Trigger change detection after updating displayMessage
            this.cdr.detectChanges();

            // Navigate to the main menu after 2 seconds, even if there's an error
            setTimeout(() => {
              this.router.navigate(['main-menu']);
            }, 2000);
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the RFID data subscription to prevent memory leaks
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }
}
