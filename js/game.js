document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const scoreDisplay = document.getElementById("score-display");
  const timerDisplay = document.getElementById("timer-display");
  const message = document.getElementById("message");
  const nodes = document.querySelectorAll(".node-btn");

  let score = 0;
  let activeNodeIndex = null;
  let timeLeft = 6.0;
  let timerInterval = null;
  let isPlaying = false;

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
    message.textContent = `Breach Terminated! Final Score: ${score}`;
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
        
        timeLeft = Math.max(timeLeft - 1.2, 0);
        timerDisplay.textContent = `${timeLeft.toFixed(1)}s`;
        if (timeLeft === 0) endGame();
      }
    });
  });

  startBtn.addEventListener("click", startGame);
});