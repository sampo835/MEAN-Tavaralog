MEAN TAVARALOG  
This project is tool loaning system made for sedu's talotekniikka unit.

PROGRAM IS UNDER DEVELOPMENT!!

[x] Planning  
[x] Development  
[x] Testing  
[x] Fixing  
[ ] Launch

KNOWN PROBLEMS:

- Some pages look like crap.
  ( make global styles and update class names. )  
  ( make everything look nice. )

- Teacher must add group when adding himself to system.
  ( hide group choice if teacher is chosen or something. )

- Correct error cases.

- Theres no support for different screen sizes yet.
  ( make mobile.scss file and import it to global styles. )

HOW TO RUN THE PROGRAM:

- Install MongoDb.
- Download files, open root folder in visual studio code.
- Install dependencies by running "npm install" through terminal for root folder and angular-app folder using bash terminal.
- Navigate to angular-app folder and build angular-app by running "ng build" through terminal (creates dist folder on root with built client).
- Add arduino uno R3 with rfid reader PN532 to COM4 port and install rfidread.ino program to it from arduino folder.
- In root folder run "npm run electron" to launch the application or run "npm run build" to make application executable (creates desktop folder).
