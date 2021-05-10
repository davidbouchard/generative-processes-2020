let assets = [
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%201-8.png?v=1601581492169",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%203-8.png?v=1601581502135",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%204-8.png?v=1601581512081",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%205-8.png?v=1601581516638",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%206-8.png?v=1601581521405",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%207-8.png?v=1601581525498",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%208-8.png?v=1601581529234",
  "https://cdn.glitch.com/cb29c8bb-ed93-437f-bad2-e43dc4151779%2FAsset%209-8.png?v=1601581533974"
];

let sprites = []; // contain the actual image objects

let group = [];

let palette = ["#8ecae6", "#219ebc", "#023047", "#ffb703", "#fb8500"];

let settings = {
  redraw_bg: false,
  damping: 1,
  seek: 0,
  twitch: 0,
  separate: 1.5,
  cohesion: 1,
  align: 1
};

let gui;

let paused = false;

//----------------------------------------------
function preload() {
  for (let asset of assets) {
    let img = loadImage(asset);
    sprites.push(img);
  }
}

//----------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);

  gui = new dat.GUI();
  gui.add(settings, "redraw_bg");
  gui.add(settings, "damping", 0.8, 1);
  gui.add(settings, "seek", 0, 2, 0.1);
  gui.add(settings, "twitch", 0, 2);
  gui.add(settings, "separate", 0, 2);
  gui.add(settings, "cohesion", 0, 2);
  gui.add(settings, "align", 0, 2);

  gui.close();

  background(255);
}

//----------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//----------------------------------------------
function keyPressed() {
  if (key == " ") {
    if (paused == false) {
      noLoop();
      paused = true;
    } else {
      loop();
      paused = false;
    }
  }

  if (key == "s") {
    save("drawing.jpg");
  }
}

//----------------------------------------------
// Main render loop
function draw() {
  // Fill in the background
  if (settings.redraw_bg) background(255);

  if (group.length < 25) {
    let agent = createAgent();
    group.push(agent);
  }

  let mouse = new p5.Vector(mouseX, mouseY);

  for (let agent of group) {
    // behaviours
    seek(agent, mouse, settings.seek);

    twitch(agent, settings.twitch);

    separate(agent, group, settings.separate);
    align(agent, group, settings.align);
    cohesion(agent, group, settings.cohesion);

    move(agent);
    wrap(agent); // teleport the agent back to the other side
    render(agent);
  }
}

//----------------------------------------------
function createAgent() {
  let newAgent = {
    pos: new p5.Vector(random(width), random(height)), // pos -> position
    vel: new p5.Vector(random(-1, 1), random(-1, 1)), // vel -> velocity
    acc: new p5.Vector(),
    maxspeed: random(2, 6),
    maxforce: random(0.05, 0.2),
    color: random(palette),
    sprite: random(sprites),
    id: frameCount
  };
  return newAgent;
}

//----------------------------------------------
function render(agent) {
  rectMode(CENTER);
  imageMode(CENTER);
  
  stroke(agent.color);

  //let n = noise((agent.id+frameCount)*0.01);
  //let n = random(1);
  let n = sin((agent.id + frameCount) * 0.01);
  let s = map(n, -1, 1, 1, 10);
  strokeWeight(s);

  push();
  translate(agent.pos.x, agent.pos.y);
  rotate(agent.vel.heading());
  //rect(0, 0, 30, 15);
  //point(0, 0);
  //line(-20, 0, 20, 0);
  
  tint(agent.color);
  image(agent.sprite, 0, 0);
  pop();
}

//----------------------------------------------
function move(agent) {
  agent.vel.add(agent.acc); // vel = vel + acc
  agent.vel.mult(settings.damping);
  agent.pos.add(agent.vel); // pos = pos + vel
  agent.acc.mult(0); // acc = acc * 0 --> resets
}

//----------------------------------------------
function wrap(agent) {
  if (agent.pos.x < -100) agent.pos.x = width + 100;
  if (agent.pos.y < -100) agent.pos.y = height + 100;
  if (agent.pos.x > width + 100) agent.pos.x = -100;
  if (agent.pos.y > height + 100) agent.pos.y = -100;
}

//----------------------------------------------
function applyForce(agent, force, strength = 1) {
  force.mult(strength);
  agent.acc.add(force); // add the force to the agent's acceleration
}

//----------------------------------------------
function seek(agent, target, strength = 1) {
  let targetDirection = p5.Vector.sub(target, agent.pos); // targetDirection = target - agent.pos
  targetDirection.normalize(); //
  targetDirection.mult(agent.maxspeed);

  steer(agent, targetDirection, strength);
}

//----------------------------------------------
function steer(agent, targetDirection, strength = 1) {
  let steer = p5.Vector.sub(targetDirection, agent.vel);
  steer.limit(agent.maxforce);
  applyForce(agent, steer, strength);
}

//----------------------------------------------
function separate(agent, group, strength = 1) {
  let separation = 40; // radius

  let sum = new p5.Vector();
  let count = 0;

  for (let other of group) {
    let d = agent.pos.dist(other.pos);
    if (d > 0 && d < separation) {
      let diff = p5.Vector.sub(agent.pos, other.pos);
      diff.normalize(); // weight in favor of the closer objects
      diff.div(d);
      sum.add(diff);
      count++; // keep track of how many we've added to sum
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
function align(agent, group, strength = 1) {
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
function cohesion(agent, group, strength = 1) {
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
    // seek the averaged position
    seek(agent, sum, strength);
  }
}

//----------------------------------------------
function twitch(agent, strength = 1, twitchRadius = PI / 2, twitchRate = 0.01) {
  let twitchDirection = agent.vel.copy();
  let n = noise((agent.pos.x + frameCount) * twitchRate);
  let twitchAngle = map(n, 0, 1, -twitchRadius, twitchRadius);
  twitchDirection.rotate(twitchAngle);
  steer(agent, twitchDirection, strength);
}
