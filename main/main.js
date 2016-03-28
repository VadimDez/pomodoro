/**
 * Created by Vadym Yatsyuk on 27/03/16
 */

(function () {
  "use strict";
  window.$ = window.jQuery = require('jquery');
  require('jquery-circle-progress');

  let mainInterval;
  let minutes = 0;
  let seconds = 25;
  let restMinutes = 5;
  let countdownMinutes;
  let countdownSeconds;
  let totalSeconds;
  let isRest = false;
  let $progress = $('.progress');
  let $countdown = $('.countdown');

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

  const session = () => {
    isRest = false;
    countdownMinutes = minutes;
    countdownSeconds = seconds;
    totalSeconds = minutes * 60 + seconds;

    $progress.circleProgress({
      fill: {
        color: '#ffffff'
      }
    });
  };

  const rest = () => {
    isRest = true;
    countdownMinutes = restMinutes;
    countdownSeconds = seconds;
    totalSeconds = restMinutes * 60 + seconds;

    $progress.circleProgress({
      fill: {
        color: '#ffffff'
      }
    });
  };

  const onStart = () => {
    session();
    renderTime();

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
    }, 1000)
  };

  const onStop = () => {
    clearInterval(mainInterval);
  };

  $('#start').on('click', onStart);

  $('#stop').on('click', onStop);
}());