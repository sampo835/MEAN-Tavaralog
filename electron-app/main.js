const { app, BrowserWindow } = require("electron");
const { SerialPort } = require("serialport"); // CORRECT WAY IN VERSION 12!!
const { ReadlineParser } = require("@serialport/parser-readline"); // CORRECT WAY IN VERSION 12!!
const path = require("path");
const { spawn } = require("child_process");

// Start the server as a separate process
const serverPath = path.join(__dirname, "../server-app/server.js");
const serverProcess = spawn("node", [serverPath]);

serverProcess.stdout.on("data", (data) => {
  console.log(`Server stdout: ${data}`);
});

serverProcess.stderr.on("data", (data) => {
  console.error(`Server stderr: ${data}`);
});

// Handle server process exit
serverProcess.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    //width: 800,
    //height: 600,
    fullscreen: true, // Fullcreen window, hides bottom bar
    frame: false, // Hides the window frame (title bar)
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load the client
  mainWindow.loadURL(`file://${__dirname}/../dist/browser/index.html`); //THIS IS THE RIGHT WAY TO LOAD CLIENT TO AVOID WHITE SCREEN IN EXE!!

  // Open developer tools
  mainWindow.webContents.openDevTools();

  // Setup RFID reader
  const port = new SerialPort({ path: "COM4", baudRate: 115200 }); // CORRECT WAY IN VERSION 12!!
  const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

  parser.on("data", (data) => {
    // Send RFID data to the renderer process
    console.log(data);
    mainWindow.webContents.send("rfidData", data);
  });

  mainWindow.on("closed", function () {
    port.close(); // Close RFID read
    serverProcess.kill(); // Close server
    mainWindow = null; // Close client
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
