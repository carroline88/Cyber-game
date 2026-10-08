document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const scoreDisplay = document.getElementById("score-display");
  const timerDisplay = document.getElementById("timer-display");
  const highscoreDisplay = document.getElementById("highscore-display");
  const message = document.getElementById("message");
  const nodes = document.querySelectorAll(".node-btn");
  const gameWrapper = document.querySelector(".game-wrapper");

  let score = 0;
  let activeNodeIndex = null;
  let timeLeft = 6.0;
  let timerInterval = null;
  let isPlaying = false;

  
  let highScore = parseInt(localStorage.getItem("cyberPulseHighScore"), 10) || 0;
  highscoreDisplay.textContent = highScore;

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
    timeLeft = 6.0;
    isPlaying = true;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
    message.textContent = "HACK IN PROGRESS! Fast reflexes required.";
    startBtn.disabled = true;

    activateRandomNode();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;

      if (timeLeft <= 0) {
        timeLeft = 0;
        timerDisplay.textContent = "0.0s";
        endGame();
      } else {
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
      }
    }, 100);
  }

  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    nodes.forEach(node => node.classList.remove("active"));
    startBtn.disabled = false;

    
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
        score += 1;
        scoreDisplay.textContent = score;

        const bonusTime = Math.max(0.4, 0.9 - score * 0.015);
        timeLeft = Math.min(timeLeft + bonusTime, 6.0);
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;

        activateRandomNode();
      } else {
        
        gameWrapper.classList.remove("shake");
        void gameWrapper.offsetWidth; // Trigga om CSS-animationen
        gameWrapper.classList.add("shake");

        timeLeft = Math.max(timeLeft - 1.2, 0);
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
        if (timeLeft === 0) endGame();
      }
    });
  });

  startBtn.addEventListener("click", startGame);
});