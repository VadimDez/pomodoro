'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipc = electron.ipcMain;

let mainWindow;

// set settings
global.settings = require('./defaultSettings.js');

function createWindow () {
  let settingsWindow;
  mainWindow = new BrowserWindow({width: 300, height: 400});

  mainWindow.loadURL('file://' + __dirname + '/main/main.html');

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  ipc.on('show-settings', () => {

    if (settingsWindow) {
      settingsWindow.close();
      settingsWindow = null;
    }

    settingsWindow = new BrowserWindow({
      width: 300,
      height: 140
    });
    settingsWindow.loadURL('file://' + __dirname + '/settings/settings.html');

    ipc.on('update-settings', () => {
      if (settingsWindow) {
        settingsWindow.close();
      }
    });
    settingsWindow.on('closed', () => {
      settingsWindow = null;
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
