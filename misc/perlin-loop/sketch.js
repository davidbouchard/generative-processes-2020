// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let z = 0;
// Main render loop
function draw() {
  // Fill in the background

  background(33);
   
  fill(200);
  noStroke();
  text("move the mouse left to right", 15, 20);
  
  stroke(255, 128);
  noFill();
  translate(width / 2, height / 2);

  
  // mouse the mouse from left to right 
  let noiseMax = mouseX / 100;
 
  z += 0.01;
    
  for (let j = 0; j < 100; j += 4) {
    beginShape();
    for (let i = 0; i < TWO_PI; i += 0.02) {
      
      // polar noise coordinates
      let u = map(cos(i), -1, 1, 0, noiseMax);
      let v = map(sin(i), -1, 1, 0, noiseMax);
      let r = map(noise(u, v, z), 0, 1, 20, 100 + j * 4);
      
      let x = cos(i) * r;
      let y = sin(i) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
