let group = [];  // our particle system 
 
let easing = 0.2; 
let damping = 1;
    
let gravity = new p5.Vector(0, 0.01);

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER); 
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function createAgent(x=0, y=0, vx=0, vy=0) {
  let temp = {
    position: new p5.Vector(x, y),
    velocity: new p5.Vector(vx, vy),
    acceleration: new p5.Vector(),
    lifespan: 300,
  }
  return temp; 
}

// Main render loop 
function draw() {
  // Fill in the background
  background(33);
  noFill();     
  stroke(255);
  
  // create new agents over time 
  if (mouseIsPressed) { 
    let newGuy = createAgent(width/2, height/2, 
                            random(-1, 1), random(-1, 1)); 
    group.push(newGuy);
  }
  
  // iterate of the group array and update/render all the agents
  for (let agent of group) {  
    move(agent); // do this first
    twitch(agent);
    applyForce(agent, gravity);
    render(agent);
  }
  
  // get rid of dead weight
  cleanUp(group);
   
  // display the number of active agents
  fill(255); 
  noStroke();
  
  text(group.length, 20, 20);
}

function render(agent) { 
  push();
  translate(agent.position.x, agent.position.y);
  rotate(agent.velocity.heading());
  //let alpha = map(agent.lifespan, 0, 300, 0, 255);
  //stroke(255, alpha);
  rect(0, 0, 10, 5);  // square
  pop();
}

function move(agent) { 
  agent.velocity.add(agent.acceleration);
  agent.velocity.mult(damping);
  agent.position.add(agent.velocity); 
  agent.acceleration.mult(0); // zero the acceleration 
  agent.lifespan--;
}

function applyForce(agent, force) {
  agent.acceleration.add(force);
}

function twitch(agent) {  
  agent.velocity.rotate(random(-0.02, 0.02));
}

function followMouse(agent) {
  let target = new p5.Vector(mouseX, mouseY);
  let diff = target.sub(agent.position);  // sub -> substraction
  diff.mult(easing);  
  agent.acceleration.add(diff);
}

function cleanUp(group) { 
  for (let i=group.length-1; i >= 0; i--) {
    let agent = group[i];
    // || --> OR 
    if (isAgentInsideBox(agent, -50, -50, width+100, height+100) == false
        || agent.lifespan <= 0) { 
      // get rid of this agent 
      group.splice(i, 1); // remove 1 object starting at index i
    }
  }
}

function isAgentInsideBox(agent, x, y, w, h) {
  let ax = agent.position.x; 
  let ay = agent.position.y;
  // && --> AND 
  if (ax > x && ax < x+w && ay > y && ay < y+h) return true;
  else return false;
}