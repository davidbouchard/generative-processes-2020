let damping = 1;

let group = [];


//----------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
}

//----------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//----------------------------------------------
// Main render loop 
function draw() {
  // Fill in the background
  background(255);  
  
  if (group.length < 25) {
    let agent = createAgent(); 
    group.push(agent);
  }
  
  let mouse = new p5.Vector(mouseX, mouseY);
  
  
  for (let agent of group) { 
    // behaviours
    seek(agent, mouse);
  
    render(agent);
    move(agent);
  }
}

//----------------------------------------------
function createAgent() {
  let newAgent = { 
    pos: new p5.Vector(random(width), random(height)),  // pos -> position   
    vel: new p5.Vector(random(-1, 1), random(-1, 1)),   // vel -> velocity 
    acc: new p5.Vector(),  
    maxspeed: random(2, 6), 
    maxforce: random(0.05, 0.2), 
  };  
  return newAgent; 
}

//----------------------------------------------
function render(agent) { 
  rectMode(CENTER);
  push(); 
  translate(agent.pos.x, agent.pos.y);
  rotate(agent.vel.heading());  
  rect(0, 0, 30, 15);  
  pop();
}

//----------------------------------------------
function move(agent) {  
  agent.vel.add(agent.acc);       // vel = vel + acc   
  agent.vel.mult(damping);
  agent.pos.add(agent.vel);       // pos = pos + vel    
  agent.acc.mult(0);              // acc = acc * 0 --> resets
}

//----------------------------------------------
function applyForce(agent, force) {
  agent.acc.add(force);           // add the force to the agent's acceleration 
}

//----------------------------------------------
function seek(agent, target) {
  let targetDirection = p5.Vector.sub(target, agent.pos); // targetDirection = target - agent.pos 
  targetDirection.normalize();  // 
  targetDirection.mult(agent.maxspeed);
  
  let steer = p5.Vector.sub(targetDirection, agent.vel); 
  steer.limit(agent.maxforce);
  applyForce(agent, steer);
}