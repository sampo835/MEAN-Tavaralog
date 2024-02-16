import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  newUser = {
    username: '',
    role: '',
    group: '',
    rfidTag: '',
  };

  constructor(private userService: UserService) {}

  addUser() {
    this.userService.addUser(this.newUser).subscribe(
      (response) => {
        console.log('User added successfully', response);
        this.newUser = { username: '', role: '', group: '', rfidTag: '' };
      },
      (error) => {
        console.error('Error adding user', error.error);
      }
    );
  }
}
