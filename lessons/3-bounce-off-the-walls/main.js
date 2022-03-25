var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2; // x-position step size
var dy = -2; // y-position step size
var ballRadius = 10;
var color = getRandomColor();

function getRandomColor() {
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Update drawing of ball each interval
function draw() {
  // Clear and redraw the ball each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  // Animate bouncing off the edges
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    color = getRandomColor();
  }

  if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
    dy = -dy;
    color = getRandomColor();
  }

  x += dx;
  y += dy;
}

setInterval(draw, 10);