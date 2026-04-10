if (!localStorage.getItem("user_id")) {
  localStorage.setItem("user_id", crypto.randomUUID());
}
let data = [
  {src: "images/img1.png", label: "AI"},
  {src: "images/img2.png", label: "AI"},
  {src: "images/img3.png", label: "AI"},
  {src: "images/img4.png", label: "AI"},
  {src: "images/img5.png", label: "AI"},
  {src: "images/img6.png", label: "AI"},
  {src: "images/img7.png", label: "AI"},
  {src: "images/img8.png", label: "AI"},
  {src: "images/img9.png", label: "AI"},
  {src: "images/img10.png", label: "AI"},
  {src: "images/img11.png", label: "AI"},
  {src: "images/img12.png", label: "AI"},
  {src: "images/img13.png", label: "AI"},
  {src: "images/img14.png", label: "AI"},
  {src: "images/img15.png", label: "AI"},
  {src: "images/img16.png", label: "AI"},
  {src: "images/img17.png", label: "AI"},
  {src: "images/img18.png", label: "AI"},
  {src: "images/img19.png", label: "AI"},
  {src: "images/img20.png", label: "AI"},
  {src: "images/img21.png", label: "AI"},
  {src: "images/img22.png", label: "AI"},
  {src: "images/img23.png", label: "AI"},
  {src: "images/img24.png", label: "AI"},
  {src: "images/img25.png", label: "AI"},
  {src: "images/img26.png", label: "Human"},
  {src: "images/img27.png", label: "Human"},
  {src: "images/img28.png", label: "Human"},
  {src: "images/img29.png", label: "Human"},
  {src: "images/img30.png", label: "Human"},
  {src: "images/img31.png", label: "Human"},
  {src: "images/img32.png", label: "Human"},
  {src: "images/img33.png", label: "Human"},
  {src: "images/img34.png", label: "Human"},
  {src: "images/img35.png", label: "Human"},
  {src: "images/img36.png", label: "Human"},
  {src: "images/img37.png", label: "Human"},
  {src: "images/img38.png", label: "Human"},
  {src: "images/img39.png", label: "Human"},
  {src: "images/img40.png", label: "Human"},
  {src: "images/img41.png", label: "Human"},
  {src: "images/img42.png", label: "Human"},
  {src: "images/img43.png", label: "Human"},
  {src: "images/img44.png", label: "Human"},
  {src: "images/img45.png", label: "Human"},
  {src: "images/img46.png", label: "Human"},
  {src: "images/img47.png", label: "Human"},
  {src: "images/img48.png", label: "Human"},
  {src: "images/img49.png", label: "Human"},
  {src: "images/img50.png", label: "Human"}
];

data.sort(() => Math.random() - 0.5);

let images = data.map(d => d.src);
let answers = data.map(d => d.label);

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

  setButtonsDisabled(false);
  document.getElementById('next-btn').classList.add('hidden');
  document.getElementById('choice-area').classList.remove('hidden'); // Use ID here

  timeLeft = 20;
  document.getElementById('image').src = images[current];
  document.getElementById('timer').innerText = "Time: " + timeLeft;

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showNextButton();
    }
  }, 1000);
}

function showNextButton() {
  setButtonsDisabled(true);
  document.getElementById('next-btn').classList.remove('hidden');
  document.getElementById('choice-area').classList.add('hidden'); // Use ID here
}

function answer(choice) {
  clearInterval(timer);
  if (choice === answers[current]) {
    score++;
  }
  showNextButton();
}

function handleTimeout() {
  showNextButton();
}

function loadNext() {
  current++;
  updateProgress();
  showImage();
}

function updateProgress() {
  let percent = (current / images.length) * 100;
  document.getElementById('progress').style.width = percent + "%";
}

function setButtonsDisabled(status) {
  const buttons = document.querySelectorAll('#choice-area button');
  buttons.forEach(btn => btn.disabled = status);
}

function endTest() {
  let totalTime = Math.round((Date.now() - startTime) / 1000);
  
  let accuracy = Math.round((score / data.length) * 100);

  localStorage.setItem("score", score);
  localStorage.setItem("accuracy", accuracy);
  localStorage.setItem("time", totalTime);
  localStorage.setItem("testCompleted", "true"); // Prevent re-taking

  sendData(accuracy, totalTime);

  window.location.href = "results.html";
}

function sendData(accuracy, totalTime) {
  const payload = {
    user_id: localStorage.getItem("user_id"),
    name: localStorage.getItem("name") || "Anonymous",
    age: localStorage.getItem("age") || "Unknown",
    score: score,
    accuracy: accuracy,
    time: totalTime
  };

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      console.error("Server submission failed:", response.statusText);
    }
  })
  .catch(error => console.error("Error sending data:", error));
}