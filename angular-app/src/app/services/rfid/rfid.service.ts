import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

declare global {
  interface Window {
    ipcRenderer: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (...args: any[]) => void) => void;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class RfidService {
  private rfidDataSubject: Subject<string> = new Subject<string>();
  public rfidData$: Observable<string> = this.rfidDataSubject.asObservable();

  constructor() {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('rfidData', (data) => {
        this.rfidDataSubject.next(data);
      });
    } else {
      console.warn(
        'window.ipcRenderer is not defined. Running in a web browser?'
      );
    }
  }
}
