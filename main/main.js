/**
 * Created by Vadym Yatsyuk on 27/03/16
 */

(function () {
  "use strict";
  window.$ = window.jQuery = require('jquery');

  let mainInterval;
  let seconds = 0;
  let countdownMinutes;
  let countdownSeconds;
  let totalSeconds;
  let isRest = false;
  let $progress = $('#bar');
  let $countdown = $('.countdown');
  let $body = $('body');
  const REST_CLASS = 'rest';
  const SESSION_CLASS = 'session';
  const MAX_PROGRESS_VALUE = 810;
  const ipc = require('electron').ipcRenderer;
  let settings = require('remote').getGlobal('settings');
  let isRunning = false;
  let isInPause = false;
  const audio = new Audio('../sounds/ding.mp3');

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
    $progress.css('stroke-dashoffset', ((totalSeconds - countdownMinutes * 60 - countdownSeconds) * MAX_PROGRESS_VALUE) / totalSeconds)
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
          audio.play();

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
  
  const updateTransparencyLevel = () => {
    $body.css({
      'background-color': `rgba(255, 61, 78, ${settings.transparencyLevel})`,
      opacity: settings.transparencyLevel
    });
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

  ipc.on('settings-transparency-level', () => {
    updateTransparencyLevel();
  });
}());