import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item/item.service';
import { RfidService } from '../../services/rfid/rfid.service';

@Component({
  selector: 'app-return-item',
  templateUrl: './return-item.component.html',
  styleUrls: ['./return-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnItemComponent implements OnInit {
  itemRfidTag: string = '';
  displayMessage: string = 'Skannaa palautettava tavara';

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private rfidService: RfidService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.itemRfidTag = params['rfidTag'];
    });

    this.rfidService.rfidData$.subscribe((data) => {
      console.log('RFID Data Received:', data);

      if (this.displayMessage === 'Skannaa palautettava tavara') {
        console.log('Expected RFID Tag:', this.itemRfidTag);
        console.log('Received RFID Tag:', data);

        // Trim and convert to lowercase for case-insensitive comparison
        if (
          data.trim().toLowerCase() === this.itemRfidTag.trim().toLowerCase()
        ) {
          console.log('Matching RFID Tag');

          this.itemService.returnItem(this.itemRfidTag).subscribe(
            (response) => {
              console.log('Item returned successfully:', response);
              this.displayMessage = 'Item Returned Successfully';
              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['/main-menu']);
              }, 3000);
            },
            (error) => {
              console.error('Error returning item:', error);
              this.cdr.detectChanges();
            }
          );
        } else {
          console.warn('Invalid RFID tag for returning the item');
        }
      }
    });
  }
}
