/**
 * Created by Vadym Yatsyuk on 30/03/16
 */
(function () {
  "use strict";
  window.$ = window.jQuery = require('jquery');
  const ipc = require('electron').ipcRenderer;
  let settings = require('remote').getGlobal('settings');

  $('#sessionLength').val(settings.sessionLength);
  $('#restLength').val(settings.restLength);

  $('#save').on('click', () => {
    settings.sessionLength = $('#sessionLength').val();
    settings.restLength = $('#restLength').val();
    ipc.send('update-settings');
  });


}());