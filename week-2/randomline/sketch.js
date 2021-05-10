let gui; // graphical user interface

let settings = {
  size: 100,
  res: 0.05
};

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);

  gui = new dat.GUI();
  gui.add(settings, "size", 5, 200);
  gui.add(settings, "res", 0.001, 0.3);
  gui.close(); // start the sketch with the GUI closed 
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Main render loop
function draw() {
  // Fill in the background
  background("black");
  stroke(255);
  strokeWeight(3);
  noFill();

  translate(0, height / 2);

  beginShape();
  for (let x = 0; x < width; x++) {
    let r = noise((frameCount + x) * settings.res);

    let y = map(r, 0, 1, -settings.size, settings.size);
    vertex(x, y);
  }
  endShape();
}
