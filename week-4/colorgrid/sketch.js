let highway = 'https://cdn.glitch.com/71f8c3c2-224e-4834-aa19-f5e55f13de57%2Fhighway.jpg?v=1600793913315';

let grid = 40;

let palette = [];

let img; 


// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  img.resize(10, 10);
  img.loadPixels(); // unless we do this, img.pixels is empty
    
  // steps of 4 because r, g, b and a
  for (let i=0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i]; 
    let g = img.pixels[i+1]; 
    let b = img.pixels[i+2]; 
    let c = color(r, g, b);
    palette.push(c);
  }
}

function preload() {
  img = loadImage(highway);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Main render loop 
function draw() {
  background(0); 
  
  rectMode(CENTER);
  for (let x=0; x < width; x += grid) {
     for (let y=0; y < height; y += grid) {
       push(); 
       translate(x + grid/2, y + grid/2);
       
       let c1 = random(palette);
       let c2 = random(palette); 
       
       // while(something is true) repeat; 
       while ( (c2 = random(palette)) == c1 );
     
       noStroke();
       
       fill(c1);
       rect(0, 0, grid);
       
       fill(c2);
       rect(0, 0, grid/2);
       pop();
     } 
  }
  noLoop();
}


