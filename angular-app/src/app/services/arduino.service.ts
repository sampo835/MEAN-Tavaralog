/*import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
const SerialPort = require('serialport');

@Injectable({
  providedIn: 'root',
})
export class ArduinoService {
  private port: any;
  private rfidDataSubject: Subject<string> = new Subject<string>();
  rfidData$ = this.rfidDataSubject.asObservable();

  constructor() {
    this.initialize();
  }

  initialize() {
    this.port = new SerialPort('COM4', { baudRate: 115200 });

    this.port.on('data', (data: Buffer) => {
      const receivedData = data.toString();
      console.log(receivedData); // Handle the received data as needed

      // Emit RFID data to subscribers
      this.rfidDataSubject.next(receivedData);
    });

    this.port.on('error', (err: any) => {
      console.error('Error:', err.message);
    });
  }
}*/
