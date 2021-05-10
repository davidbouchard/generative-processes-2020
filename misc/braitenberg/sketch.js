// toxiclibs 2d physics library
// http://haptic-data.com/toxiclibsjs
var Vec2D = toxi.geom.Vec2D;
var Rect = toxi.geom.Rect;
var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
var VerletParticle2D = toxi.physics2d.VerletParticle2D;
var VerletSpring2D = toxi.physics2d.VerletSpring2D;

let physics;

let vehicle;

// for visual representaton only; doesn't affect light falloff
let lightDiameter = 125;
let lightX;
let lightY;

// other vehicle dimensions will be derived from this number
// this defines the spacing between the back wheels
let vehicleSize = 40;

// default vehicle type
let DEFAULT_TYPE = 1;

//------------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Helvetica");

  // grab the type parameter from the URL
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);

  // or use the default if none provided
  type = urlParams.get("type");
  if (!type) type = DEFAULT_TYPE;

  physics = new VerletPhysics2D();
  physics.setDrag(0.522);
  physics.setTimeStep(0.5);

  vehicle = new Vehicle(type);

  lightX = width / 2;
  lightY = height / 2;
}

//------------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//------------------------------------------------------------
function keyPressed() {
  // change the vehicle type
  switch (key) {
    case "1":
      vehicle.setType(1);
      break;
    case "2":
      vehicle.setType(2);
      break;
    case "3":
      vehicle.setType(3);
      break;
    case "4":
      vehicle.setType(4);
      break;
  }
}

//------------------------------------------------------------
function mouseDragged() {
  lightX = mouseX;
  lightY = mouseY;
}

//------------------------------------------------------------
// Main render loop
function draw() {
  background(0);
  stroke(255);

  vehicle.move();
  vehicle.draw();

  // show the light source
  noFill();
  stroke(255);
  circle(lightX, lightY, lightDiameter);

  physics.update();

  fill(255);
  noStroke();
  textSize(30);
  text("TYPE " + vehicle.type, 30, 40);
  textSize(14);
  text("press 1, 2, 3, or 4 to change", 30, 60);
  
}

//------------------------------------------------------------
function calcLight(x, y) {
  let d = new Vec2D(lightX - x, lightY - y);
  let light = width - d.magnitude();
  if (light < 0) light = 0;
  return 20 * pow(light / width, 3);
}

//------------------------------------------------------------
function calcLight2(x, y) {
  let d = dist(x, y, lightX, lightY);

  let s = width;
  if (d > 0) {
    return s * (1 / d);
  } else {
    return s * 1;
  }
}

//------------------------------------------------------------
class Vehicle {
  constructor(type = 1) {
    this.pos = new Vec2D(random(width), random(height));

    this.lwheel = new VerletParticle2D(this.pos.x, this.pos.y);
    this.rwheel = new VerletParticle2D(this.pos.x + 10, this.pos.y);

    physics.addParticle(this.lwheel);
    physics.addParticle(this.rwheel);

    // (a, b, len, str)
    let axel = new VerletSpring2D(this.lwheel, this.rwheel, vehicleSize, 1.0);

    physics.addSpring(axel);

    this.direction = new Vec2D();

    this.lsensor = new Vec2D();
    this.rsensor = new Vec2D();

    this.setType(type);
  }

  setType(type) {
    this.type = type;
    // make the connections between wheels and sensors, depdending on the type of vehicule we
    // want
    if (type == 1) {
      this.lSensorWheel = this.rwheel;
      this.rSensorWheel = this.lwheel;
      this.lpolarity = 1;
      this.rpolarity = 1;
    } else if (type == 2) {
      this.lSensorWheel = this.lwheel;
      this.rSensorWheel = this.rwheel;
      this.lpolarity = 1;
      this.rpolarity = 1;
    } else if (type == 3) {
      this.lSensorWheel = this.rwheel;
      this.rSensorWheel = this.lwheel;
      this.lpolarity = -1;
      this.rpolarity = -1;
    } else if (type == 4) {
      this.lSensorWheel = this.lwheel;
      this.rSensorWheel = this.rwheel;
      this.lpolarity = -1;
      this.rpolarity = -1;
    }
  }

  draw() {
    // dimensions
    let a = vehicleSize / 2;
    let b = vehicleSize * 1.66;
    let c = vehicleSize;
    let d = vehicleSize * 2;
    let e = vehicleSize * 0.66;

    push();

    translate(this.rwheel.x, this.rwheel.y);
    rotate(this.direction.heading());

    noFill();
    stroke(255);
    rect(0, 0, b, c);

    stroke(255);
    fill(0);
    ellipse(0, 0, e, e); // left wheel
    ellipse(0, c, e, e); // right wheel

    strokeWeight(2);

    // show the sensor/wheel connections
    noFill();
    if (this.lpolarity == 1) stroke(0, 255, 0);
    else stroke(255, 100, 0);
    if (this.lSensorWheel == this.lwheel) bezier(0, 0, 0, a, 0, a, b, 0);
    else bezier(0, 0, 0, a, 0, a, b, c);

    if (this.rpolarity == 1) stroke(0, 255, 0);
    else stroke(255, 100, 0);
    if (this.rSensorWheel == this.rwheel) bezier(0, c, 0, a, 0, a, b, c);
    else bezier(0, c, 0, a, 0, a, b, 0);

    // draw the sensors
    stroke(255);
    arc(d, 0, a, a, PI / 2, PI / 2 + PI);
    arc(d, c, a, a, PI / 2, PI / 2 + PI);

    pop();   
  }

  move() {
    // calculate the direction we're headed to and normalize it
    this.direction = this.lwheel.sub(this.rwheel);
    this.direction.rotate(-PI / 2);
    this.direction.normalize();

    // calculate the position of the "sensors" on screen
    // by scaling the normalized direction vector, and adding
    // the position of the wheels to it
    this.lsensor = new Vec2D(this.direction.scale(vehicleSize * 2));
    this.lsensor.addSelf(this.lwheel);
    this.rsensor = new Vec2D(this.direction.scale(vehicleSize * 2));
    this.rsensor.addSelf(this.rwheel);

    // given the sensor's position, calculate the ammount of "light"
    // shining on them (non-linear distance from the mouse)
    let light_left = calcLight(this.lsensor.x, this.lsensor.y);
    let light_right = calcLight(this.rsensor.x, this.rsensor.y);

    let magicN = 19.454;
    if (this.lpolarity == -1) light_left = magicN - light_left;
    if (this.rpolarity == -1) light_right = magicN - light_right;

    // DEBUG
    // noStroke();
    // fill(255);
    // textSize(14);
    // text("L: " + light_left, 30, 80);
    // text("R: " + light_right, 30, 100);

    //println(light_left + "\t\t" + light_right);
    if (light_left < 1) light_left = 0;
    if (light_right < 1) light_right = 0;

    // use the ammount of light received to control the speed of each
    // wheel

    // note that we're using the direction vector to make
    // the wheels move --> that simulates wheels spinning
    // only "straight ahead"

    let speed_left = this.direction.scale(light_left);
    let speed_right = this.direction.scale(light_right);
    
    this.lSensorWheel.addVelocity(speed_left);
    this.rSensorWheel.addVelocity(speed_right);
    
    this.restrain(this.lwheel);
    //this.restrain(this.rwheel);
  }

  // force a Particle to remain within screen boundaries
  restrain(p) {
    let x = p.x;
    let y = p.y;
    if (x < 100) x = 100;
    if (x > width - 100) x = width - 100;
    if (y < 100) y = 100;
    if (y > height - 100) y = height - 100;
    p.x = x;
    p.y = y;
  }
}
