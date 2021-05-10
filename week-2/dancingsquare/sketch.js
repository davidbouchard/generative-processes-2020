let settings = {
  res: 0.01,  
  alpha: 128,
  nFrames: 50,
}

let gui;

let recorder = []; 

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  gui = new dat.GUI(); 
  gui.add(settings, 'res', 0.001, 0.02);
  gui.add(settings, 'alpha', 5, 255);
  gui.add(settings, 'nFrames', 5, 500); 
  
  gui.remember(settings); 
  gui.close(); // start the GUI with the controls hidden 
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);

}

// Main render loop 
function draw() {
  // Fill in the background
  background(0);
  noFill();
  stroke(255, settings.alpha);
  strokeWeight(1);
  
  let x1 = noise(frameCount * settings.res) * width;
  let y1 = noise(100 + frameCount * settings.res) * height;
  let x2 = noise(200 + frameCount * settings.res) * width;
  let y2 = noise(300 + frameCount * settings.res) * height;
  
  let frame = { 
    x1: x1, 
    y1: y1, 
    x2: x2, 
    y2: y2,
  };
  
  recorder.push(frame);
  while (recorder.length > settings.nFrames) recorder.shift(); 
  
  playback(); 
}

function playback() {
  
  rectMode(CENTER);
  
  for (frame of recorder) {
    push(); 
    
    // find the mid point 
    let midX = lerp(frame.x1, frame.x2, 0.5);
    let midY = lerp(frame.y1, frame.y2, 0.5); 
    translate(midX, midY);
    
    // find the distance between the points
    let len = dist(frame.x1, frame.y1, frame.x2, frame.y2);
    
    // calculate the angle between two points 
    let angle = atan2(frame.y1-frame.y2, frame.x1-frame.x2);
    
    rotate(angle);
    rect(0, 0, len);
    pop();
  }    
  
}
