let highway = 'https://cdn.glitch.com/71f8c3c2-224e-4834-aa19-f5e55f13de57%2Fhighway.jpg?v=1600793913315';
//let highway = 'https://cdn.glitch.com/b7d9c9c1-f0af-4f54-ab2c-61a2cfb08a36%2Fhighway2.png?v=1616111768024';
//let highway = 'https://cdn.glitch.com/b7d9c9c1-f0af-4f54-ab2c-61a2cfb08a36%2Feast_la.jpg?v=1616113828888';
//let highway = 'https://cdn.glitch.com/b7d9c9c1-f0af-4f54-ab2c-61a2cfb08a36%2Fhighway3.jpg?v=1616113828888';

// trying varying the grid size
let grid = 200;
 
let img; 


// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
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
  imageMode(CENTER);

  let n = frameCount * 0.0001; 
    
  // zoom 
  let z = map(noise(n+200), 0, 1, 0, 200)

  
  let sx = map(noise(n), 0, 1, 0, img.width-(grid+z));
  let sy = map(noise(n+100), 0, 1, 0, img.height-(grid+z));
  
  for (let x=0; x < width; x += grid) {
     for (let y=0; y < height; y += grid) {
       push(); 
       translate(x + grid/2, y + grid/2);
       
       let xscale = 1;
       let yscale = 1;
       
       // flip xscale to -1 every other column 
       // use % --> remainder 
       if (x % (2*grid) == 0) xscale = -1; 
       if (y % (2*grid) == 0) yscale = -1; 
       
       scale(xscale, yscale);
       
       image(img, 0, 0, grid, grid, sx, sy, grid+z, grid+z);
       pop();
     } 
  }
  
  // visualize the image sub-section 
  // select multiple lines then use ctrl-/ to 
  // toggle the comments as a block
  
  // imageMode(CORNER);
  // noFill();
  // scale(0.25, 0.25);
  // image(img, 0, 0);
  // stroke(255);
  // strokeWeight(10);
  // rect(sx, sy, grid+z, grid+z);
  
  
}


