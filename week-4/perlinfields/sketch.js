let highway =
  "https://cdn.glitch.com/71f8c3c2-224e-4834-aa19-f5e55f13de57%2Fhighway.jpg?v=1600793913315";

let grid = 20;

let img;

let res = 0.03;
let damping = 0.5;

let group = [];

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
   background(0);
}

function preload() {
  img = loadImage(highway);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
   background(0);
}

// Main render loop
function draw() {
 
  strokeWeight(1);

  // add agents over time
  for (let i=0; i < 100; i++) group.push(createAgent());

  // move and draw the agents
  for (let agent of group) {
    let x = agent.position.x;
    let y = agent.position.y;

    // create a velocity based on perlin noise 
    let v = new p5.Vector();

    v.x = map(noise(x * res, y * res, 1), 0, 1, -1, 1);
    v.y = map(noise(x * res, y * res, 10), 0, 1, -1, 1);
  
    agent.velocity.add(v);
    agent.velocity.mult(damping);
    
    move(agent);

    stroke(agent.color);
    if (agent.lifespan % 1 == 0) point(x, y);
  }
  
  cleanUp(group);
  
  //drawNoiseField();
}

function cleanUp(group) { 
  for (let i=group.length-1; i >= 0; i--) {
    // splice removes objects from an array 
    if (group[i].lifespan <= 0) group.splice(i, 1);  
  } 
}


function createAgent() {
  let temp = {
    position: new p5.Vector(random(width), random(height)),
    velocity: new p5.Vector(),
    lifespan: 512, 
    color: 0,
  };

  
  // try this to create a black border where
  // particles won't appear. There are other
  // ways to imagine seeding starting coordinates:
  // in a line, in a circle, etc.. 
  //temp.position = new p5.Vector(random(200, width-200), random(200, height-200)),
  
  let sx = map(temp.position.x, 0, width, 0, img.width);
  let sy = map(temp.position.y, 0, height, 0, img.height); 
  
  // overwrite the default color by "picking"
  // from the source image at the agent's x and y
  // coordinate
  temp.color = color(img.get(sx, sy)); 
  temp.color.setAlpha(25);
  
  return temp;
}

function move(agent) {
  agent.position.add(agent.velocity);
  agent.lifespan--; 
}

function drawNoiseField() {
  strokeWeight(1);
  rectMode(CENTER);
  for (let x = 0; x < width; x += grid) {
    for (let y = 0; y < height; y += grid) {
      push();
      translate(x + grid / 2, y + grid / 2);

      let v = new p5.Vector();

      v.x = map(noise(x * res, y * res, 1), 0, 1, -1, 1);
      v.y = map(noise(x * res, y * res, 10), 0, 1, -1, 1);

      v.mult(grid * 2);

      stroke(255);
      line(0, 0, v.x, v.y);

      pop();
    }
  }
}
