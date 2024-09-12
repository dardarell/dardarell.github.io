const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const bird = {
    x: 50,
    y: 150,
    width: 60, // Bigger bird
    height: 60, // Bigger bird
    gravity: 0.6,
    lift: -10, // Smaller jump
    velocity: 0,
    image: new Image()
};
bird.image.src = 'snake_head.jpg'; // Path to your bird image

const pipes = [];
const pipeWidth = 80; // Wider pipes
const pipeGap = 200; // Bigger gap
let frameCount = 0;
let score = 0;

function drawBird() {
    ctx.drawImage(bird.image, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const top = Math.random() * (canvas.height / 2);
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if (pipes.length && pipes[0].x < -pipeWidth) {
        pipes.shift();
        score++;
    }
}

function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)) {
            resetGame();
        }
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frameCount = 0;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    drawPipes();

    updateBird();
    updatePipes();
    checkCollision();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

function jump() {
    bird.velocity = bird.lift;
}

document.addEventListener('keydown', jump);
canvas.addEventListener('touchstart', jump);
document.getElementById('jumpButton').addEventListener('click', jump);

gameLoop();
