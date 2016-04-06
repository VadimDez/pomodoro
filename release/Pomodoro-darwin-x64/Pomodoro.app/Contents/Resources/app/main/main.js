/**
 * Created by Vadym Yatsyuk on 27/03/16
 */

(function () {
  "use strict";
  window.$ = window.jQuery = require('jquery');
  require('jquery-circle-progress');

  let mainInterval;
  let seconds = 0;
  let countdownMinutes;
  let countdownSeconds;
  let totalSeconds;
  let isRest = false;
  let $progress = $('.progress');
  let $countdown = $('.countdown');
  let $body = $('body');
  const REST_CLASS = 'rest';
  const SESSION_CLASS = 'session';
  const ipc = require('electron').ipcRenderer;
  let settings = require('remote').getGlobal('settings');
  let isRunning = false;
  let isInPause = false;

  $progress.circleProgress({
    value: 0,
    size: 300,
    animation: false
  });

  /**
   * Adjust value to have always two digits
   * @param value
   * @returns {string}
   */
  const doubleDigit = (value) => {
    return '0'.concat(value).slice(-2);
  };

  /**
   * Render time
   */
  const renderTime = () => {
    $countdown.text(`${doubleDigit(countdownMinutes)}:${doubleDigit(countdownSeconds)}`);
  };

  /**
   * Update progress chart
   */
  const updateProgress = () => {
    $progress.circleProgress('value', (totalSeconds - countdownMinutes * 60 - countdownSeconds) / totalSeconds);
  };

  const clear = () => {
    clearInterval(mainInterval);
  };

  /**
   * Session
   */
  const session = () => {
    $body
      .removeClass(REST_CLASS)
      .addClass(SESSION_CLASS);

    isRest = false;
    countdownMinutes = settings.sessionLength;
    countdownSeconds = seconds;
    totalSeconds = settings.sessionLength * 60 + seconds;

    $progress.circleProgress({
      fill: {
        color: '#ffffff'
      }
    });
  };

  /**
   * Rest
   */
  const rest = () => {
    $body
      .addClass(REST_CLASS)
      .removeClass(SESSION_CLASS);

    isRest = true;
    countdownMinutes = settings.restLength;
    countdownSeconds = seconds;
    totalSeconds = settings.restLength * 60 + seconds;

    $progress.circleProgress({
      fill: {
        color: '#ffffff'
      }
    });
  };

  /**
   * Toggle running countdown
   *
   * @param value
   */
  const setRunning = (value) => {
    isRunning = value;
    $body.toggleClass('running', value);
  };

  /**
   * Main tick loop
   */
  const tickProcess = () => {
    mainInterval = setInterval(() => {
      countdownSeconds--;
      if (countdownSeconds < 0) {
        countdownSeconds = 59;
        countdownMinutes--;

        if (countdownMinutes < 0) {
          if (isRest) {
            session();
          } else {
            rest();
          }
        }
      }
      renderTime();
      updateProgress();
    }, 1000);
  };

  const onStart = () => {
    setRunning(true);
    isInPause = false;
    tickProcess();
  };

  const onStop = () => {
    setRunning(false);
    isInPause = true;
    clearInterval(mainInterval);
  };

  /**
   * Update time settings
   */
  const updateSettings = () => {
    if (isRest) {
      rest();
    } else {
      session();
    }
    renderTime();
  };

  session();
  renderTime();

  $('#start').on('click', onStart);

  $('#stop').on('click', onStop);

  $('#settings').on('click', () => {
    ipc.send('show-settings');
  });

  ipc.on('settings-updated', () => {
    if (!isRunning && !isInPause) {
      updateSettings();
    }
  });
}());