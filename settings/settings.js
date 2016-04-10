/**
 * Created by Vadym Yatsyuk on 30/03/16
 */
(function () {
  "use strict";
  const ipc = require('electron').ipcRenderer;
  let settings = require('remote').getGlobal('settings');
  let $sessionLength = document.getElementById('sessionLength');
  let $restLength = document.getElementById('restLength');
  let $transparencyLevel = document.getElementById('transparencyLevel');

  $sessionLength.value = settings.sessionLength;
  $restLength.value = settings.restLength;

  document.getElementById('save').addEventListener('click', () => {
    settings.sessionLength = $sessionLength.value;
    settings.restLength = $restLength.value;
    ipc.send('update-settings');
  });

  $transparencyLevel.value = settings.transparencyLevel * 10;
  $transparencyLevel.addEventListener('change', (e) => {
    settings.transparencyLevel = e.target.value / 10;
    ipc.send('settings-transparency-level');
  });

}());