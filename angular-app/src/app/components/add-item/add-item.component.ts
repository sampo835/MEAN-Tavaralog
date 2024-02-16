import { Component } from '@angular/core';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent {
  newItem = {
    itemname: '',
    rfidTag: '',
  };

  constructor(private itemService: ItemService) {}

  addItem() {
    this.itemService.addItem(this.newItem).subscribe(
      (response) => {
        console.log('Item added successfully', response);
        this.newItem = { itemname: '', rfidTag: '' };
      },
      (error) => {
        console.error('Error adding item', error.error);
      }
    );
  }
}
