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

function nextImage() {
  if (current >= images.length) {
    endTest();
    return;
  }

  // DISABLE buttons at the start of countdown
  setButtonsDisabled(true); 

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
  setButtonsDisabled(false); 
  
  timeLeft = 20; 

  document.getElementById('image').src = images[current];
  document.getElementById('timer').innerText = "Time: " + timeLeft;

  if (timer) clearInterval(timer);

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

function answer(choice) {
  clearInterval(timer);

  if (choice === answers[current]) {
    score++;
  }

  current++;
  updateProgress();
  nextImage();
}

function updateProgress() {
  let percent = (current / images.length) * 100;
  document.getElementById('progress').style.width = percent + "%";
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

function setButtonsDisabled(status) {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = status);
}

function endTest() {
  let totalTime = Math.round((Date.now() - startTime) / 1000);
  let accuracy = Math.round((score / images.length) * 100);

  localStorage.setItem("score", score);
  localStorage.setItem("accuracy", accuracy);
  localStorage.setItem("time", totalTime);

  sendData(accuracy, totalTime);
  window.location.href = "results.html";
}

if (localStorage.getItem("testCompleted") === "true") {
    alert("You have already completed this test.");
    window.location.href = "results.html"; 
}

nextImage();