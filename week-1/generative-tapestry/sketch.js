let grid = 20; // in pixels

let choices = [pattern1, pattern2];

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Main render loop
function draw() {
  // Fill in the background
  background("black");
  stroke(255);
  strokeWeight(2);
  noFill();

  for (let x = 0; x < width; x += grid) {
    for (let y = 0; y < height; y += grid) {
      push();
      translate(x, y);
      drawRandomPattern(); 
      pop();
    }
  }
  
  noLoop(); // stops draw() 
}

function drawRandomPattern() { 
  let chosenPattern = random(choices);
  chosenPattern();
}

function pattern1() { 
  line(0, grid, grid, 0);
}

function pattern2() { 
  line(0, 0, grid, grid);
}