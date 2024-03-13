MEAN TavaraLog  
This project is item loaning system made for sedu's talotekniikka unit.

PROGRAM IS UNDER DEVELOPMENT!!

Overall progress: 80%

Problems:

- When loaning item the choose location doesnt work properly.
- Some pages look like crap.
- Error cases needs to be tested.

How to run the program:

- Download files, open root folder in visual studio code, install mongoDB.
- Install dependencies by running "npm install" through terminal for root folder and angular-app folder using bash terminal.
- Navigate to angular-app folder and build angular-app by running "ng build" through terminal (this creates dist folder on root with built client).
- Add arduino uno R3 with rfid reader PN532 to COM4 port and install rfidread.ino program to it from arduino folder.
- In root folder run "npm run electron" to launch the application or run "npm run build" to make application executable(creates desktop folder).
