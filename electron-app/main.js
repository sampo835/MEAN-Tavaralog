const { app, BrowserWindow } = require("electron");
const { SerialPort } = require("serialport"); // CORRECT WAY IN VERSION 12!!
const { ReadlineParser } = require("@serialport/parser-readline"); // CORRECT WAY IN VERSION 12!!
const { startServer } = require("../server-app/server.js");
const path = require("path");
const serverPort = 3000;

// Start the server
startServer(serverPort);

// Variable to store the SerialPort instance
let arduinoPort;

// Create main window for the app
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the client to the window
  mainWindow.loadURL(`file://${__dirname}/../dist/browser/index.html`); //THIS IS THE RIGHT WAY TO LOAD CLIENT TO AVOID WHITE SCREEN IN EXE!!

  // Open developer tools
  mainWindow.webContents.openDevTools();

  // Setup RFID reader
  const port = new SerialPort({ path: "COM4", baudRate: 115200 }); // CORRECT WAY IN VERSION 12!!
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  // Send RFID data to the renderer process
  parser.on("data", (data) => {
    mainWindow.webContents.send("rfidData", data);
  });

  // Window closing
  mainWindow.on("closed", function () {
    port.close(); // Close RFID reading
    mainWindow = null; // Close window
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
