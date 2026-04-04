// ====== IMAGE DATA (EDIT THIS) ======
let data = [
  {src: "images/img1.jpg", label: "AI"},
  {src: "images/img2.jpg", label: "Human"},
  {src: "images/img3.jpg", label: "AI"},
  // ADD ALL 50
];

// Shuffle images
data.sort(() => Math.random() - 0.5);

let images = data.map(d => d.src);
let answers = data.map(d => d.label);

// ====== VARIABLES ======
let current = 0;
let score = 0;
let timer;
let timeLeft = 20;
let startTime;

// ====== NAVIGATION ======
function startInstructions() {
  document.getElementById('home').classList.add('hidden');
  document.getElementById('instructions').classList.remove('hidden');
}

function startTest() {
  document.getElementById('instructions').classList.add('hidden');
  document.getElementById('test').classList.remove('hidden');
  startTime = Date.now();
  nextImage();
}

// ====== TEST FLOW ======
function nextImage() {
  if (current >= images.length) {
    endTest();
    return;
  }

  let count = 3;
  let countdownEl = document.getElementById('countdown');
  countdownEl.innerText = count;

  let interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.innerText = count;
    } else {
      clearInterval(interval);
      countdownEl.innerText = "";
      showImage();
    }
  }, 1000);
}

function showImage() {
  document.getElementById('image').src = images[current];
  timeLeft = 20;

  document.getElementById('timer').innerText = "Time: " + timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      current++;
      updateProgress();
      nextImage();
    }
  }, 1000);
}

// ====== ANSWER ======
function answer(choice) {
  clearInterval(timer);

  if (choice === answers[current]) {
    score++;
  }

  current++;
  updateProgress();
  nextImage();
}

// ====== PROGRESS ======
function updateProgress() {
  let percent = (current / images.length) * 100;
  document.getElementById('progress').style.width = percent + "%";
}

// ====== END ======
function endTest() {
  document.getElementById('test').classList.add('hidden');
  document.getElementById('end').classList.remove('hidden');
}

function showResults() {
  let totalTime = Math.round((Date.now() - startTime) / 1000);
  let accuracy = Math.round((score / images.length) * 100);

  document.getElementById('results').innerText =
    "Score: " + score + "/" + images.length +
    " | Accuracy: " + accuracy + "%" +
    " | Time: " + totalTime + "s";

  sendData(accuracy, totalTime);
}

// ====== SEND TO BACKEND ======
function sendData(accuracy, totalTime) {
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      age: document.getElementById("age").value,
      score: score,
      accuracy: accuracy,
      time: totalTime
    })
  });
}
