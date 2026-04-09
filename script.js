/* Keep your 'data' array and initial variables as they are */

let current = 0;
let score = 0;
let timer;
let timeLeft = 20;
let startTime;

// Run the 3-second countdown ONCE when the page loads
window.onload = function() {
  let count = 3;
  let countdownEl = document.getElementById('countdown');
  countdownEl.innerText = count;

  let startInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.innerText = count;
    } else {
      clearInterval(startInterval);
      countdownEl.innerText = "";
      startTime = Date.now(); // Start the total test timer
      showImage(); // Load the first image
    }
  }, 1000);
};

function showImage() {
  if (current >= images.length) {
    endTest();
    return;
  }

  // Show Choice Buttons, Hide Next Button
  setButtonsDisabled(false);
  document.getElementById('next-btn').classList.add('hidden');
  document.querySelector('div[onclick^="answer"]').parentElement.classList.remove('hidden');

  timeLeft = 20;
  document.getElementById('image').src = images[current];
  document.getElementById('timer').innerText = "Time: " + timeLeft;

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleTimeout();
    }
  }, 1000);
}

function answer(choice) {
  clearInterval(timer);
  if (choice === answers[current]) {
    score++;
  }
  showNextButton();
}

function handleTimeout() {
  // If time runs out, treat as incorrect and force them to move on
  showNextButton();
}

function showNextButton() {
  // Hide AI/Human buttons, Show Next button
  setButtonsDisabled(true); // Disable choice buttons
  document.getElementById('next-btn').classList.remove('hidden');
  // Optional: keep your choice buttons hidden to prevent double-clicking
  // document.querySelector('div[onclick^="answer"]').parentElement.classList.add('hidden');
}

function loadNext() {
  current++;
  updateProgress();
  showImage(); // Go straight to the next image (no countdown)
}

function updateProgress() {
  let percent = (current / images.length) * 100;
  document.getElementById('progress').style.width = percent + "%";
}

/* Keep your endTest, sendData, and setButtonsDisabled functions as they are */
