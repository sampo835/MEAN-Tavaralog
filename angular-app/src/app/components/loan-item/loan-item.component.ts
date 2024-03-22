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
  // Store strings
  enteredUserRfidTag: string = '';
  enteredItemRfidTag: string = '';
  chosenLocation: string = '';
  locations: string[] = [];
  displayMessage: string = '';

  // Loaning phases
  isIdentificationPhase: boolean = true;
  isScanItemPhase: boolean = false;
  isChooseLocationPhase: boolean = false;
  isLoanSuccessPhase: boolean = false;

  // Loading animation
  isLoading: boolean = false;

  // Choose location menu
  showLocationDropdown: boolean = false;

  // Rfid read
  private rfidSubscription: Subscription | undefined;

  constructor(
    private rfidService: RfidService,
    private userService: UserService,
    private itemService: ItemService,
    private locationService: LocationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //this.fetchLocations();
    this.setPhaseMessage();
    this.rfidSubscription = this.rfidService.rfidData$.subscribe((data) => {
      // WHEN TAG IS SCANNED
      this.displayMessage = 'Luku onnistui, tarkistetaan..';
      this.isLoading = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        // USER SCAN PHASE
        if (this.isIdentificationPhase) {
          this.enteredUserRfidTag = data;

          this.userService.checkUser(this.enteredUserRfidTag).subscribe(
            (response) => {
              this.isLoading = false;
              if (response.userExists) {
                this.displayMessage = 'Käyttäjä löytyi';
                setTimeout(() => {
                  this.isIdentificationPhase = false;
                  this.isScanItemPhase = true;
                  this.setPhaseMessage();
                  this.cdr.detectChanges();
                }, 2000);
              } else {
                this.isIdentificationPhase = false;
                this.displayMessage = 'Käyttäjää ei löydy';
                setTimeout(() => {
                  this.router.navigate(['/main-menu']);
                }, 2000);
              }
              this.cdr.detectChanges();
            },
            (error) => {
              this.isLoading = false;
              if (error.status === 404) {
                this.isIdentificationPhase = false;
                this.displayMessage = 'Käyttäjää ei löydy';
              } else {
                console.error('Error checking user:', error);
              }
              this.cdr.detectChanges();
              setTimeout(() => {
                this.router.navigate(['/main-menu']);
              }, 2000);
            }
          );
        }
        // ITEM SCAN PHASE
        else if (this.isScanItemPhase) {
          this.enteredItemRfidTag = data;
          this.isLoading = true;

          this.itemService.checkItem(this.enteredItemRfidTag).subscribe(
            (response) => {
              this.isLoading = false;
              if (response.itemExists && !response.isLoaned) {
                this.isScanItemPhase = false;
                this.isChooseLocationPhase = true;
                this.displayMessage = 'Tavaran voi lainata';
                setTimeout(() => {
                  this.isScanItemPhase = false;
                  this.isChooseLocationPhase = true;
                  this.showLocationDropdown = true;
                  this.setPhaseMessage();
                  this.cdr.detectChanges();
                }, 2000);
              } else {
                this.displayMessage = 'Tavaraa ei voi lainata';
                setTimeout(() => {
                  this.router.navigate(['/main-menu']);
                }, 2000);
              }
              this.cdr.detectChanges();
            },
            (error) => {
              this.isLoading = false;
              if (error.status === 404) {
                this.displayMessage = 'Tavaraa ei löydy';
              } else {
                console.error('Error checking item:', error);
              }
              this.cdr.detectChanges();
              setTimeout(() => {
                this.router.navigate(['/main-menu']);
              }, 2000);
            }
          );
        }
        // CHOOSE LOCATION PHASE
        else if (this.isChooseLocationPhase) {
          this.fetchLocations();
          this.cdr.detectChanges();
        }
      }, 2000);
    });
  }

  // WHEN LEAVING COMPONENT
  ngOnDestroy(): void {
    if (this.rfidSubscription) {
      this.rfidSubscription.unsubscribe();
    }
  }

  // SELECT LOCATION
  selectLocation(location: string): void {
    this.chosenLocation = location;
    this.isChooseLocationPhase = false;
    this.cdr.detectChanges();

    this.itemService
      .loanItem(
        this.enteredItemRfidTag,
        this.enteredUserRfidTag,
        this.chosenLocation
      )
      .subscribe(
        (loanResponse) => {
          this.showLocationDropdown = false;
          this.isLoanSuccessPhase = true;
          this.setPhaseMessage();
          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['main-menu']);
          }, 3000);
        },
        (loanError) => {
          console.error('Error loaning item:', loanError);
          this.router.navigate(['main-menu']);
        }
      );
  }

  // GET LOCATIONS FROM DATABASE
  fetchLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations: any[]) => {
        this.locations = locations.map((location) => location.name);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  // SET MESSAGE
  setPhaseMessage(): void {
    if (this.isIdentificationPhase) {
      this.displayMessage = 'Vaihe 1. Tunnistaudu';
    } else if (this.isScanItemPhase) {
      this.displayMessage = 'Vaihe 2. Skannaa tavara';
    } else if (this.isChooseLocationPhase) {
      this.displayMessage = 'Vaihe 3: Valitse paikka';
    } else if (this.isLoanSuccessPhase) {
      this.displayMessage = 'Tavara lainattu';
    } else {
      // Default message if none of the phases are true
      this.displayMessage = 'Tuntematon vaihe';
    }
  }
}
