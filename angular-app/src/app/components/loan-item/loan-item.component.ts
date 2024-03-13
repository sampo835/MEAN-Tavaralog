import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { RfidService } from '../../services/rfid/rfid.service';
import { UserService } from '../../services/user/user.service';
import { ItemService } from '../../services/item/item.service';
import { LocationService } from '../../services/location/location.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-item',
  templateUrl: './loan-item.component.html',
  styleUrls: ['./loan-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanItemComponent implements OnInit, OnDestroy {
  enteredUserRfidTag: string = '';
  enteredItemRfidTag: string = '';
  isIdentificationPhase: boolean = true;
  isScanItemPhase: boolean = false;
  isChooseLocationPhase: boolean = false;
  isLoanItemPhase: boolean = false; // Added flag for loan item phase
  isLoanSuccessPhase: boolean = false;
  isLoading: boolean = true;
  displayMessage: string = 'Tunnistaudu';
  private rfidSubscription: Subscription | undefined;
  location: string = '';
  locations: string[] = []; // Array to store locations
  showLocationDropdown: boolean = true;

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private itemService: ItemService,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      if (this.isIdentificationPhase) {
        this.enteredUserRfidTag = data;

        this.userService.checkUser(this.enteredUserRfidTag).subscribe(
          (userResponse) => {
            if (userResponse.userExists) {
              this.isIdentificationPhase = false;
              this.isScanItemPhase = true;
              //this.isLoading = false;
              this.displayMessage = 'Skannaa tavara';
              this.cdr.detectChanges();
            } else {
              this.isIdentificationPhase = false;
              this.isScanItemPhase = false;
              this.isChooseLocationPhase = false;
              this.isLoanSuccessPhase = false;
              this.isLoading = false;
              this.displayMessage = 'Käyttäjää ei löydy';
              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['']);
              }, 2000);
            }
          },
          (userError) => {
            console.error('Error checking user:', userError);

            setTimeout(() => {
              this.router.navigate(['']);
            }, 2000);
          }
        );
      } else if (this.isScanItemPhase) {
        this.enteredItemRfidTag = data;
        //this.isLoading = true;
        this.cdr.detectChanges();

        this.itemService.checkItem(this.enteredItemRfidTag).subscribe(
          (itemResponse) => {
            if (itemResponse.itemExists && !itemResponse.isLoaned) {
              this.isScanItemPhase = false;
              this.isChooseLocationPhase = true;
              this.isLoading = false;
              this.displayMessage = 'Valitse lainapaikka';
              this.cdr.detectChanges();
            } else {
              this.isLoading = false;
              this.isLoanSuccessPhase = false;
              this.displayMessage = 'Tavaraa ei voi lainata';
              this.cdr.detectChanges();

              setTimeout(() => {
                this.router.navigate(['']);
                this.cdr.detectChanges();
              }, 2000);
            }
          },
          (itemError) => {
            console.error('Error checking item:', itemError);

            setTimeout(() => {
              this.router.navigate(['']);
              this.cdr.detectChanges();
            }, 2000);
          }
        );
      } else if (this.isChooseLocationPhase) {
        this.locationService.getLocations().subscribe(
          (locations: any[]) => {
            this.locations = locations.map((location) => location.name);
            this.showLocationDropdown = true;
            // Remove transition to loan item phase here
            this.isLoading = false;
            this.displayMessage = 'Valitse lainattava tavara';
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error retrieving locations:', error);
            this.router.navigate(['']);
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }

  confirmLocation(): void {
    this.isChooseLocationPhase = false;
    this.isLoanItemPhase = true;
    this.cdr.detectChanges();

    this.itemService
      .loanItem(this.enteredItemRfidTag, this.enteredUserRfidTag, this.location)
      .subscribe(
        (loanResponse) => {
          this.isLoading = false;
          this.showLocationDropdown = false;
          this.isLoanSuccessPhase = true;
          this.displayMessage = 'Tavara lainattu!';
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
        },
        (loanError) => {
          console.error('Error loaning item:', loanError);
          this.router.navigate(['']);
        }
      );
  }
}
