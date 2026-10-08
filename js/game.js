document.addEventListener("DOMContentLoaded", () => {
  
  const startBtn = document.getElementById("start-btn");
  const scoreDisplay = document.getElementById("score-display");
  const timerDisplay = document.getElementById("timer-display");
  const message = document.getElementById("message");
  const nodes = document.querySelectorAll(".node-btn");

  
  let score = 0;
  let activeNodeIndex = null;
  let timeLeft = 10;
  let timerInterval = null;
  let isPlaying = false;

  
  function activateRandomNode() {
    
    nodes.forEach(node => node.classList.remove("active"));

    
    const randomIndex = Math.floor(Math.random() * nodes.length);
    activeNodeIndex = randomIndex;
    nodes[randomIndex].classList.add("active");
  }

  
  function startGame() {
    score = 0;
    timeLeft = 10;
    isPlaying = true;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = `${timeLeft}s`;
    message.textContent = "Quick, hit the glowing node!";
    startBtn.disabled = true;

    activateRandomNode();

    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 1;
      timerDisplay.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  
  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    nodes.forEach(node => node.classList.remove("active"));
    startBtn.disabled = false;
    message.textContent = `Game Over! Final Score: ${score}`;
  }

  
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      if (!isPlaying) return;

      const clickedIndex = parseInt(node.getAttribute("data-index"), 10);

      if (clickedIndex === activeNodeIndex) {
        score += 1;
        scoreDisplay.textContent = score;
        
        timeLeft = Math.min(timeLeft + 1, 10);
        timerDisplay.textContent = `${timeLeft}s`;
        activateRandomNode();
      } else {
        
        timeLeft = Math.max(timeLeft - 2, 0);
        timerDisplay.textContent = `${timeLeft}s`;
      }
    });
  });

  startBtn.addEventListener("click", startGame);
});