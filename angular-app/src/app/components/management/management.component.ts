import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ItemService } from '../../services/item/item.service';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {
  users: any[] = [];
  items: any[] = [];
  locations: any[] = [];

  constructor(
    private userService: UserService,
    private itemService: ItemService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchItems();
    this.fetchLocations();
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.fetchUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    );
  }

  deleteItem(itemId: string): void {
    this.itemService.deleteItem(itemId).subscribe(
      () => {
        this.fetchItems();
      },
      (error) => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    );
  }

  deleteLocation(locationId: string): void {
    this.locationService.deleteLocation(locationId).subscribe(
      () => {
        this.fetchLocations();
      },
      (error) => {
        console.error('Error deleting location:', error);
        alert('Failed to delete location. Please try again.');
      }
    );
  }

  private fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  private fetchItems(): void {
    this.itemService.getItems().subscribe(
      (items: any[]) => {
        this.items = items;
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
  }

  private fetchLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations: any[]) => {
        this.locations = locations;
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }
}
