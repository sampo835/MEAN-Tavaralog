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
  displayMessage: string = '';
  isReturnItemPhase: boolean = true;
  isLoading: boolean = false;
  private rfidSubscription: Subscription | undefined;

  constructor(
    private rfidService: RfidService,
    private itemService: ItemService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.displayMessage = 'Skannaa tavara';
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // WHEN TAG IS SCANNED
      this.displayMessage = 'Luku onnistui, tarkistetaan..';
      this.isLoading = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        if ((this.isReturnItemPhase = true)) {
          this.enteredItemRfidTag = data;

          this.itemService.returnItem(this.enteredItemRfidTag).subscribe(
            (response) => {
              this.isLoading = false;
              this.displayMessage = 'Tavara palautettu onnistuneesti';

              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['/main-menu']);
              }, 2000);
            },
            (error) => {
              this.isLoading = false;
              if (error.status === 404) {
                this.displayMessage = 'Tavaraa ei löytynyt';
              } else if (error.status === 400) {
                this.displayMessage = 'Tavara on jo palautettu';
              } else {
                this.displayMessage = 'Jokin meni pieleen';
              }
              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['main-menu']);
              }, 2000);
            }
          );
        }
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }
}
