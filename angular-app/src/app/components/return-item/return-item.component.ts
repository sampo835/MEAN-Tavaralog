import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { ItemService } from '../../services/item/item.service';

@Component({
  selector: 'app-return-item',
  templateUrl: './return-item.component.html',
  styleUrls: ['./return-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnItemComponent implements OnInit {
  enteredItemRfidTag: string = '';
  displayMessage: string = 'Skannaa tavara'; // Assuming you start with scanning the item

  constructor(
    private rfidService: RfidService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rfidService.rfidData$.subscribe((data) => {
      // console.log('RFID Data Received:', data);

      if (this.displayMessage === 'Skannaa tavara') {
        this.enteredItemRfidTag = data;
        // console.log('Entered Item RFID Tag:', this.enteredItemRfidTag);

        this.itemService.returnItem(this.enteredItemRfidTag).subscribe(
          (response) => {
            // console.log('Item returned successfully:', response);
            this.displayMessage = 'Tavara palautettu onnistuneesti';
            // console.log('Display Message:', this.displayMessage);

            this.cdr.detectChanges(); // Trigger change detection after updating displayMessage

            setTimeout(() => {
              this.router.navigate(['']); // Assuming you want to navigate to the main menu
            }, 2000);
          },
          (error) => {
            if (error.status === 404) {
              this.displayMessage = 'Tavaraa ei löytynyt';
            } else if (error.status === 400) {
              this.displayMessage = 'Tavaraa ei ole lainattu';
            } else {
              this.displayMessage = 'Jokin meni pieleen palautettaessa tavaraa';
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
