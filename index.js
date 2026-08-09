const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const gameOverPanel = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const finalBest = document.getElementById("final-best");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const bird = new Image();

bird.src = "bird.png";

const canvasSize = 400;
const birdSize = 24;
const birdWidth = birdSize * (524 / 374);
const birdX = 50;
const pipeWidth = 24;
const pipeGap = 150;
const interval = 24;

let birdY = 200;
let birdDY = 0;
let pipeX = canvasSize;
let topPipeBottomY = 100;
let score = 0;
let bestScore = 0;
let passedPipe = false;
let isPlaying = false;
let isGameOver = false;

function randomPipeHeight() {
    return 40 + Math.random() * (canvasSize - pipeGap - 80);
}

function resetRound() {
    birdY = 200;
    birdDY = 0;
    pipeX = canvasSize;
    topPipeBottomY = randomPipeHeight();
    score = 0;
    passedPipe = false;
    isGameOver = false;
}

function startGame() {
    resetRound();
    isPlaying = true;
    startScreen.hidden = true;
    gameOverPanel.hidden = true;
}

function flap() {
    if (isPlaying && !isGameOver) {
        birdDY = 9;
    }
}

function endGame() {
    isPlaying = false;
    isGameOver = true;
    bestScore = Math.max(bestScore, score);
    finalScore.textContent = score;
    finalBest.textContent = bestScore;
    gameOverPanel.hidden = false;
    restartButton.focus();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
canvas.addEventListener("pointerdown", flap);
window.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        if (!isPlaying && !isGameOver) {
            startGame();
            return;
        }
        flap();
    }
});

function draw() {
    context.fillStyle = "skyblue";
    context.fillRect(0, 0, canvasSize, canvasSize);

    if (isPlaying || isGameOver) {
        context.fillStyle = "green";
        context.fillRect(pipeX, 0, pipeWidth, topPipeBottomY);
        context.fillRect(
            pipeX,
            topPipeBottomY + pipeGap,
            pipeWidth,
            canvasSize
        );
    }

    context.drawImage(bird, birdX, birdY, birdWidth, birdSize);

    context.fillStyle = "black";
    context.font = "15px Courier New";
    context.fillText(`Score: ${score}`, 9, 25);
    context.fillText(`Best: ${bestScore}`, 9, 50);
}

function update() {
    if (!isPlaying || isGameOver) {
        return;
    }

    birdDY -= 0.5;
    birdY -= birdDY;
    pipeX -= 8;

    if (!passedPipe && pipeX + pipeWidth < birdX) {
        score += 1;
        passedPipe = true;
    }

    if (pipeX < -pipeWidth) {
        pipeX = canvasSize;
        topPipeBottomY = randomPipeHeight();
        passedPipe = false;
    }

    const overlapsPipe =
        birdX + birdWidth > pipeX && birdX < pipeX + pipeWidth;
    const outsidePipeGap =
        birdY < topPipeBottomY ||
        birdY + birdSize > topPipeBottomY + pipeGap;
    const hitEdge = birdY < 0 || birdY + birdSize > canvasSize;

    if ((overlapsPipe && outsidePipeGap) || hitEdge) {
        endGame();
    }
}

startButton.focus();
setInterval(() => {
    update();
    draw();
}, interval);
