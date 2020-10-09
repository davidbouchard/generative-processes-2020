let grid = 20; // in pixels

// an Array of Arrays 
let choices = [
  [pattern1, 10], 
  [pattern2, 1], 
  [pattern3, 5],
  [pattern4, 5]
];

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
  background("deepskyblue");
  stroke(255);
  strokeWeight( grid/3 );
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
  
  let raffle = []; 
  
  for (item of choices) {
    // item -> [pattern, #]  
    let numberOfEntries = item[1]; 
    for (let j=0; j < numberOfEntries; j++) { 
      raffle.push( item[0] );
    }
  }
  
  let chosenPattern = random(raffle);
  chosenPattern();
}

function pattern1() { 
  line(0, grid, grid, 0);
}

function pattern2() { 
  line(0, 0, grid, grid);
}

function pattern3() { 
  line(0, 0, grid/2, grid/2);
}

function pattern4() { 
  line(0, grid, grid/2, grid/2);
}
