/**
 * Created by Vadym Yatsyuk on 27/03/16
 */

(function () {
  "use strict";
  window.$ = window.jQuery = require('jquery');
  require('jquery-circle-progress');

  let mainInterval;
  let minutes = 25;
  let seconds = 0;
  let countdownMinutes;
  let countdownSeconds;
  let $progress = $('.progress');
  let $countdown = $('.countdown');

  $progress.circleProgress({
    value: 0,
    size: 100,
    animation: false,
    fill: {
      gradient: ["red", "orange"]
    }
  });

  const render = () => {
    $countdown.text(`${countdownMinutes}:${countdownSeconds}`);
  };

  const updateProgress = () => {
    const totalSeconds = minutes * 60 + seconds;
    const percentage = (totalSeconds - countdownMinutes * 60 - countdownSeconds) / totalSeconds;
    $progress.circleProgress('value', percentage);
  };

  const clear = () => {
    clearInterval(mainInterval);
  };

  const onStart = () => {
    countdownMinutes = minutes;
    countdownSeconds = seconds;

    render();

    mainInterval = setInterval(() => {
      countdownSeconds--;
      if (countdownSeconds < 0) {
        countdownSeconds = 59;
        countdownMinutes--;

        if (countdownMinutes < 0) {
          clear();
          return;
        }
      }
      render();
      updateProgress();
    }, 1000)
  };

  const onStop = () => {
    clearInterval(mainInterval);
  };

  $('#start').on('click', onStart);

  $('#stop').on('click', onStop);
}());