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
  
  if (group.length < 150) {
    let agent = createAgent(); 
    group.push(agent);
  }
  
  let mouse = new p5.Vector(mouseX, mouseY);
    
  for (let agent of group) { 
    // behaviours
    seek(agent, mouse, 1);
  
    separate(agent, group, 1.5);
    align(agent, group);
    cohesion(agent, group);
     
    move(agent);
    wrap(agent);  // teleport the agent back to the other side
    render(agent);
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
function wrap(agent) {
  if (agent.pos.x < -100) agent.pos.x = width+100; 
  if (agent.pos.y < -100) agent.pos.y = height+100; 
  if (agent.pos.x > width+100) agent.pos.x = -100; 
  if (agent.pos.y > height+100) agent.pos.y = -100;   
}


//----------------------------------------------
function applyForce(agent, force, strength=1) {
  force.mult(strength);
  agent.acc.add(force);           // add the force to the agent's acceleration 
}

//----------------------------------------------
function seek(agent, target, strength=1) {
  let targetDirection = p5.Vector.sub(target, agent.pos); // targetDirection = target - agent.pos 
  targetDirection.normalize();  // 
  targetDirection.mult(agent.maxspeed);
  
  steer(agent, targetDirection, strength);
}

//----------------------------------------------
function steer(agent, targetDirection, strength=1) { 
  let steer = p5.Vector.sub(targetDirection, agent.vel); 
  steer.limit(agent.maxforce);
  applyForce(agent, steer, strength);
}

//----------------------------------------------
function separate(agent, group, strength=1) {
  
  let separation = 40;  // radius
  
  let sum = new p5.Vector(); 
  let count = 0;
  
  for (let other of group) {
    let d = agent.pos.dist(other.pos);    
    if (d > 0 && d < separation) { 
      let diff = p5.Vector.sub(agent.pos, other.pos); 
      diff.normalize();  // weight in favor of the closer objects
      diff.div(d);       
      sum.add(diff);
      count++;  // keep track of how many we've added to sum 
    }    
  }
   
  if (count > 0) {
    sum.div(count);
    sum.setMag(agent.maxspeed);
    // steer towards the averaged sum 
    steer(agent, sum, strength);  
  }
}

//----------------------------------------------
function align(agent, group, strength=1) {
   
  let neighborhood = 50; 
  
  let sum = new p5.Vector(); 
  let count = 0;
  
  for (let other of group) {
    let d = agent.pos.dist(other.pos);    
    if (d > 0 && d < neighborhood) { 
      sum.add(other.vel); // velocity -> heading 
      count++;
    }
  }
  
  if (count > 0) {
    sum.div(count);    
    sum.normalize(); 
    sum.mult(agent.maxspeed);
    // steer towards the averaged sum 
    steer(agent, sum, strength);  
  }
}


//----------------------------------------------
function cohesion(agent, group, strength=1) {
   
  let neighborhood = 50; 
  
  let sum = new p5.Vector(); 
  let count = 0;
  
  for (let other of group) {
    let d = agent.pos.dist(other.pos);    
    if (d > 0 && d < neighborhood) { 
      sum.add(other.pos); // velocity -> heading 
      count++;
    }
  }
  
  if (count > 0) {
    sum.div(count);
    // steer towards the averaged sum 
    steer(agent, sum, strength);  
  }
}