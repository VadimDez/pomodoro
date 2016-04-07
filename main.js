'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipc = electron.ipcMain;

let mainWindow;
const mainWindowSizes = {
  width: 300,
  height: 315
};

// set settings
global.settings = require('./defaultSettings.js');

function createWindow () {
  let settingsWindow;
  mainWindow = new BrowserWindow({
    width: mainWindowSizes.width,
    height: mainWindowSizes.height,
    // minWidth: mainWindowSizes.width,
    // minHeight: mainWindowSizes.height,
    // maxWidth: mainWindowSizes.width,
    // maxHeight: mainWindowSizes.height,
    // resizable: false,
    titleBarStyle: 'hidden',
    frame: false,
    transparent: true
  });

  mainWindow.loadURL('file://' + __dirname + '/main/main.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  ipc.on('show-settings', () => {

    if (settingsWindow) {
      settingsWindow.close();
      settingsWindow = null;
    }

    settingsWindow = new BrowserWindow({
      width: 300,
      height: 170,
      resizable: false,
      titleBarStyle: 'hidden'
    });
    settingsWindow.loadURL('file://' + __dirname + '/settings/settings.html');

    ipc.on('settings-transparency-level', () => {
      mainWindow.webContents.send('settings-transparency-level');
    });
    
    ipc.on('update-settings', () => {
      if (settingsWindow) {
        settingsWindow.close();
      }
      
      mainWindow.webContents.send('settings-updated');
    });
    
    settingsWindow.on('closed', () => {
      settingsWindow = null;
    });
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
