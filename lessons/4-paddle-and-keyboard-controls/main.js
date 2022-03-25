// Canvas Variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// Ball Variables
var x = canvas.width / 2; // start x-position
var y = canvas.height - 30; // start y-position
var dx = 2; // horizontal displacement
var dy = -2; // vertical displacement
var ballRadius = 10;
var color = getRandomColor();
// Paddle Variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2; // start position
// Keyboard Control Variables
var rightPressed = false;
var leftPressed = false;

// Keyboard Control Logic
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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

// Ball Drawing
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

// Paddle Drawing
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Redraw every interval to update image on canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();

  // Animate ball bouncing off the edges
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    color = getRandomColor();
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
    color = getRandomColor();
  }

  // Update ball position
  x += dx;
  y += dy;

  // Move the paddle & update its position
  if (rightPressed) {
    paddleX += 7;
    // Prevent from leaving canvas right boundary
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    // Prevent from leaving canvas left boundary
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
} // end draw



setInterval(draw, 10);