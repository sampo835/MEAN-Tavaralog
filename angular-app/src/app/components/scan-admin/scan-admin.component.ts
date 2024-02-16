import { Component, OnInit } from '@angular/core';
//import { ArduinoService } from '../../services/arduino.service';

@Component({
  selector: 'app-scan-admin',
  templateUrl: './scan-admin.component.html',
  styleUrls: ['./scan-admin.component.scss'],
})
export class ScanAdminComponent /*implements OnInit*/ {
  /*rfidData: string = '';

  constructor(private arduinoService: ArduinoService) {}

  ngOnInit(): void {
    this.arduinoService.rfidData$.subscribe((data: string) => {
      this.rfidData = data;
    });

    // The Arduino service is initialized in the constructor, so you can directly use it here
    this.arduinoService.initialize();
  }*/
}
