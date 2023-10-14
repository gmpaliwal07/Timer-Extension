document.addEventListener('DOMContentLoaded', function () {
    const timerElement = document.getElementById('timer');
    const startPauseButton = document.getElementById('startPause');
    const resetButton = document.getElementById('reset');
    let timerInterval;
    let timerValue = 0;
    let isRunning = false;
  
    // Load the timer state from storage
    chrome.storage.local.get({ timerValue: 0 }, function (data) {
      timerValue = data.timerValue;
      updateTimerDisplay();
    });
  
    function updateTimerDisplay() {
      const hours = Math.floor(timerValue / 3600);
      const minutes = Math.floor((timerValue % 3600) / 60);
      const seconds = timerValue % 60;
      const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
      timerElement.textContent = formattedTime;
    }
  
    function pad(number) {
      return number.toString().padStart(2, '0');
    }
  
    function startPauseTimer() {
      if (isRunning) {
        clearInterval(timerInterval);
      } else {
        timerInterval = setInterval(function () {
          timerValue++;
          updateTimerDisplay();
          // Save the timer state to storage
          chrome.storage.local.set({ timerValue: timerValue });
        }, 1000);
      }
      isRunning = !isRunning;
      updateStartPauseButton();
    }
  
    function updateStartPauseButton() {
      if (isRunning) {
        startPauseButton.textContent = 'Pause';
        startPauseButton.classList.add('paused');
      } else {
        startPauseButton.textContent = 'Start';
        startPauseButton.classList.remove('paused');
      }
    }
  
    function resetTimer() {
      clearInterval(timerInterval);
      timerValue = 0;
      // Save the timer state to storage
      chrome.storage.local.set({ timerValue: timerValue });
      updateTimerDisplay();
      updateStartPauseButton();
    }
  
    // Add event listeners to buttons
    startPauseButton.addEventListener('click', startPauseTimer);
    resetButton.addEventListener('click', resetTimer);
  
    // Initialize button state
    updateStartPauseButton();
  });
  