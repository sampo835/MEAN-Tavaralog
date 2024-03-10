MEAN TavaraLog  
This project is item loaning system made for sedu's talotekniikka unit.

PROGRAM IS UNDER DEVELOPMENT!!

How to run the program:

- Download files, open root folder in visual studio code, install mongoDB.
- Install dependencies by running "npm install" through terminal for root folder and angular-app folder.
- Build angular-app by running "ng build" in angular-app folder (this creates dist folder on root with built client).
- Go to dist/browser/index.html and add "." to base ref like this "/" => "./" and save.
- Add arduino with rfid reader to COM4 port and install rfidread program to it from arduino folder.
- In root folder run "npm run electron" to launch the application. (You need arduino with RFID reader that's on port COM4).
