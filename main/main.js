/**
 * Created by Vadym Yatsyuk on 27/03/16
 */

(function () {
  "use strict";

  let mainInterval;
  let seconds = 0;
  let countdownMinutes;
  let countdownSeconds;
  let totalSeconds;
  let isRest = false;
  let $progress = document.getElementById('bar');// $('#bar');
  let $countdown = document.getElementsByClassName('countdown')[0];//$('.countdown');
  let $body = document.getElementsByTagName('body')[0];// $('body');
  const REST_CLASS = 'rest';
  const SESSION_CLASS = 'session';
  const MAX_PROGRESS_VALUE = 810;
  const ipc = require('electron').ipcRenderer;
  const remote = require('remote');
  let settings = remote.getGlobal('settings');
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
    $countdown.innerText = `${doubleDigit(countdownMinutes)}:${doubleDigit(countdownSeconds)}`;
  };

  /**
   * Update progress chart
   */
  const updateProgress = () => {
    $progress.style['stroke-dashoffset'] = ((totalSeconds - countdownMinutes * 60 - countdownSeconds) * MAX_PROGRESS_VALUE) / totalSeconds;
  };

  const clear = () => {
    clearInterval(mainInterval);
  };

  /**
   * Add / Delete class on element
   *
   * @param {Object}  $elem
   * @param {String}  className
   * @param {Boolean} toggle
   */
  const toggleClass = ($elem, className, toggle) => {
    const classPosition = $elem.className.indexOf(className);

    if (toggle) {
      if (classPosition === -1) {
        $elem.className = ` ${className}`;
      }

      return;
    }

    if (classPosition !== -1) {
      $elem.className = $elem.className.substr(0, classPosition)
        .concat($elem.className.substr(classPosition + className.length));
    }
  };

  /**
   * Session
   */
  const session = () => {
    toggleClass($body, REST_CLASS, false);
    toggleClass($body, SESSION_CLASS, true);

    isRest = false;
    countdownMinutes = settings.sessionLength;
    countdownSeconds = seconds;
    totalSeconds = settings.sessionLength * 60 + seconds;
  };

  /**
   * Rest
   */
  const rest = () => {
    toggleClass($body, REST_CLASS, true);
    toggleClass($body, SESSION_CLASS, false);

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
    toggleClass($body, 'running', value);
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
    $body.style['background-color'] = `rgba(255, 61, 78, ${settings.transparencyLevel})`;
    $body.style.opacity = settings.transparencyLevel;
  };

  session();
  renderTime();

  document.getElementById('start').addEventListener('click', onStart);

  document.getElementById('stop').addEventListener('click', onStop);

  document.getElementById('settings').addEventListener('click', () => {
    ipc.send('show-settings');
  });
  
  document.getElementById('close').addEventListener('click', () => {
    remote.getCurrentWindow().close();
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