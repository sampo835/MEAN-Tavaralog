// management.component.ts
/*import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ItemService } from '../../services/item/item.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {
  users: any[] = []; // Assuming your user data is an array
  items: any[] = []; // Assuming your item data is an array

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    // Fetch initial user and item data or update as needed
    this.fetchUsers();
    this.fetchItems();
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      (response: any) => {
        alert(response.message); // Show success message or handle accordingly
        this.fetchUsers(); // Refresh user data after deletion
      },
      (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.'); // Show error message
      }
    );
  }

  deleteItem(itemId: string): void {
    this.itemService.deleteItem(itemId).subscribe(
      (response: any) => {
        alert(response.message); // Show success message or handle accordingly
        this.fetchItems(); // Refresh item data after deletion
      },
      (error) => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.'); // Show error message
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
        // Handle error fetching users, show an error message, etc.
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
        // Handle error fetching items, show an error message, etc.
      }
    );
  }
}*/

// management.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ItemService } from '../../services/item/item.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {
  users: any[] = [];
  items: any[] = [];

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchItems();
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.fetchUsers(); // Refresh user data after deletion
      },
      (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.'); // Show error message
      }
    );
  }

  deleteItem(itemId: string): void {
    this.itemService.deleteItem(itemId).subscribe(
      () => {
        this.fetchItems(); // Refresh item data after deletion
      },
      (error) => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.'); // Show error message
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
        // Handle error fetching users, show an error message, etc.
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
        // Handle error fetching items, show an error message, etc.
      }
    );
  }
}
