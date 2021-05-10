let agent; 

let easing = 0.2; 
let damping = 0.9;
    
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  agent = createAgent();
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createAgent() {
  let temp = {
    position: new p5.Vector(),
    velocity: new p5.Vector(),
    acceleration: new p5.Vector(),
    // we could add more attributes of an agent here 
  }
  return temp; 
}


// Main render loop 
function draw() {
  // Fill in the background
  background(33);
  noFill();     
  stroke(255);
  
  move(agent); // do this first 
  followMouse(agent);
  render(agent);
}

function render(agent) { 
  push();
  translate(agent.position.x, agent.position.y);
  rotate(agent.velocity.heading());
  rect(0, 0, 50);  // square
  pop();
}

function move(agent) { 
  agent.velocity.add(agent.acceleration);
  agent.velocity.mult(damping);
  agent.position.add(agent.velocity); 
  agent.acceleration.mult(0); // zero the acceleration 
}

function followMouse(agent) {
  let target = new p5.Vector(mouseX, mouseY);
  let diff = target.sub(agent.position);  // sub -> substraction
  diff.mult(easing);  
  agent.acceleration.add(diff);
}