document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const scoreDisplay = document.getElementById("score-display");
  const timerDisplay = document.getElementById("timer-display");
  const comboDisplay = document.getElementById("combo-display");
  const highscoreDisplay = document.getElementById("highscore-display");
  const timeProgress = document.getElementById("time-progress");
  const message = document.getElementById("message");
  const nodes = document.querySelectorAll(".node-btn");
  const gameWrapper = document.querySelector(".game-wrapper");

  let score = 0;
  let streak = 0;
  let activeNodeIndex = null;
  const maxTime = 6.0;
  let timeLeft = maxTime;
  let timerInterval = null;
  let isPlaying = false;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playTone(freq, type = "sine", duration = 0.08) {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  let highScore = parseInt(localStorage.getItem("cyberPulseHighScore"), 10) || 0;
  highscoreDisplay.textContent = highScore;

  function updateProgressBar() {
    const percentage = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
    timeProgress.style.width = `${percentage}%`;
    if (timeLeft <= 2.0) {
      timeProgress.classList.add("danger");
    } else {
      timeProgress.classList.remove("danger");
    }
  }

  function activateRandomNode() {
    nodes.forEach(node => node.classList.remove("active"));
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * nodes.length);
    } while (nextIndex === activeNodeIndex && nodes.length > 1);

    activeNodeIndex = nextIndex;
    nodes[activeNodeIndex].classList.add("active");
  }

  function startGame() {
    score = 0;
    streak = 0;
    timeLeft = maxTime;
    isPlaying = true;
    scoreDisplay.textContent = score;
    comboDisplay.textContent = `${streak}x`;
    timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
    updateProgressBar();
    message.textContent = "HACK IN PROGRESS! Fast reflexes required.";
    startBtn.disabled = true;

    playTone(520, "triangle", 0.15);
    activateRandomNode();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;

      if (timeLeft <= 0) {
        timeLeft = 0;
        timerDisplay.textContent = "0.0s";
        updateProgressBar();
        endGame();
      } else {
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
        updateProgressBar();
      }
    }, 100);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    nodes.forEach(node => node.classList.remove("active"));
    startBtn.disabled = false;
    playTone(180, "sawtooth", 0.35);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("cyberPulseHighScore", highScore);
      highscoreDisplay.textContent = highScore;
      message.textContent = `New Record! Final Score: ${score}`;
    } else {
      message.textContent = `Breach Terminated! Final Score: ${score}`;
    }
  }

  nodes.forEach(node => {
    node.addEventListener("click", () => {
      if (!isPlaying) return;

      const clickedIndex = parseInt(node.getAttribute("data-index"), 10);

      if (clickedIndex === activeNodeIndex) {
        streak += 1;
        const multiplier = streak >= 5 ? 2 : 1;
        score += 1 * multiplier;

        scoreDisplay.textContent = score;
        comboDisplay.textContent = `${streak}x`;

        playTone(400 + Math.min(streak * 25, 400), "sine", 0.08);

        const bonusTime = Math.max(0.35, 0.85 - score * 0.012);
        timeLeft = Math.min(timeLeft + bonusTime, maxTime);
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
        updateProgressBar();

        activateRandomNode();
      } else {
        streak = 0;
        comboDisplay.textContent = `${streak}x`;
        playTone(150, "square", 0.15);

        gameWrapper.classList.remove("shake");
        void gameWrapper.offsetWidth;
        gameWrapper.classList.add("shake");

        timeLeft = Math.max(timeLeft - 1.2, 0);
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
        updateProgressBar();
        if (timeLeft === 0) endGame();
      }
    });
  });

  startBtn.addEventListener("click", startGame);
});