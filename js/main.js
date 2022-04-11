// Canvas Variables
canvas = document.getElementById("myCanvas");
resizeCanvas();
setCanvasStyles();
var ctx = canvas.getContext("2d");
// Ball Variables
var x = canvas.width / 2; // start x-position
var y = canvas.height / 2; // start y-position
var dx = (2 / 480) * canvas.width; // horizontal displacement
var dy = (2 / 320) * canvas.height; // vertical displacement
var ballRadius = (10 / 480) * canvas.width;
var color = getRandomColor();
// Paddle Variables
var paddleHeight = (10 / 320) * canvas.height;
var paddleWidth = (75 / 480) * canvas.width;
var paddleX = (canvas.width - paddleWidth) / 2; // start position
// Keyboard Control Variables
var rightPressed = false;
var leftPressed = false;
// Bricks Variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = (75 / 480) * canvas.width;
var brickHeight = (20 / 320) * canvas.height;
var brickPadding = (10 / 480) * canvas.width;
var brickOffsetTop = (30 / 320) * canvas.height;
var brickOffsetLeft = (30 / 480) * canvas.width;
// Score & Lives Variables
var score = 0;
var lives = 3;
// Divider Position
var dividerOffsetTop = (25 / 320) * canvas.height
// Bricks Positions
var bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // 1: active, 0: inactive
  }
}

// Keyboard & Mouse Control Logic
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft; // mouse positioning in viewport
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2; // move relative to middle of paddle
  }
}

// Ball & Brick Collision Detection Logic
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r]; // The brick object
      if (b.status == 1) {
        // Change ball direction after collision
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          color = getRandomColor();
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert(`YOU WIN! \nFinal Score: ${score}`);
            document.location.reload();
          }
        }
      }
    }
  }
}

// Score Drawing Logic
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("Score: " + score, 8, 20); // score, x-coordinate, y-coordinate
}

// Lives Drawing Logic
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20); // lives, x-coordinate, y-coordinate
}

// Divider
function drawDivider() {
  ctx.beginPath();
  ctx.moveTo(0, dividerOffsetTop);
  ctx.lineTo(canvas.width, dividerOffsetTop);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

// Brick Drawing Logic
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) { // Draw active bricks only
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Ball Drawing Logic
function getRandomColor() {
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Paddle Drawing Logic
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Animation: Update image on canvas by redrawing everything each interval
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawDivider();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Ball bouncing off the edges
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy - dividerOffsetTop < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) { // detect paddle
      dy = -dy * 1.15; // speed up after each hit
      color = getRandomColor();
    } else {
      lives--;
      if (!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        // reset ball & paddle position for each attempt
        x = canvas.width / 2;
        y = canvas.height - 30;
        // dx = 2;
        // dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Update ball position
  x += dx;
  y += dy;

  // Move the paddle & update its position
  if (rightPressed) {
    paddleX += (7 / 480) * canvas.width;
    // Prevent travel beyond canvas right boundary
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= (7 / 480) * canvas.width;
    // Prevent travel beyond canvas left boundary
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  requestAnimationFrame(draw); // defer rate to browser
} // end draw
draw();

// Message to start play.
window.onload = function() {
  alert("Ready to play BREAKOUT? Press the right & left arrow keys or use your mouse to move the paddle to hit the ball before it hits the ground.");
}

// Window & Canvas Resizing Logic
window.onresize = function() {
  resizeCanvas();
  draw();
}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.90;
  canvas.height = window.innerHeight * 0.90;
}

function setCanvasStyles() {
  document.body.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
  `;
}