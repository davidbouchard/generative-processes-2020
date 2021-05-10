let highway =
  "https://cdn.glitch.com/71f8c3c2-224e-4834-aa19-f5e55f13de57%2Fhighway.jpg?v=1600793913315";

let img;

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function preload() {
  img = loadImage(highway);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

// Main render loop
function draw() {
  background(0);
  stroke(255);
  imageMode(CENTER);

  // tweak to change the pattern size
  let slices = 64;

  // set the radius of our circle to be the smallest
  // value between either width or height
  let radius = min(width, height) / 2;
  //let radius = height*1.5;

  // use the image as a texture
  texture(img);

  let angle1 = TWO_PI / slices / 2;
  let angle2 = -angle1;

  // coordinates of one the slice
  // represents a horizon triangle like so:
  //
  //            /| x2, y2
  //           / |
  // x0, y0   /  |
  //          \  |
  //           \ |
  //            \| x1, y1
  //
  let x0 = 0;
  let y0 = 0;
  let x1 = cos(angle1) * radius;
  let y1 = sin(angle1) * radius;
  let x2 = cos(angle2) * radius;
  let y2 = sin(angle2) * radius;

  // calculates the outer edge of the triangle
  let edge = y1 - y2;

  // use the mouse to move a texture offset with the
  // source image
  let xOffset = map(mouseX, 0, width, 0, img.width - x1);
  let yOffset = map(mouseY, 0, height, 0, img.height - edge);

  // draw the triangle slices
  for (let i = 0; i < slices; i++) {
    push();
    rotate(map(i, 0, slices, 0, TWO_PI));
     
    // mirror every other slice
    if (i % 2 == 0) scale(1, -1);
    //else scale(1, 1);

    beginShape(TRIANGLES);

    // vertex(x, y, u, v) -> where u and v are texture coordinates

    vertex(x0, y0, x0 + xOffset, y0 + yOffset + edge / 2);
    vertex(x1, y1, x1 + xOffset, y1 + yOffset + edge / 2);
    vertex(x2, y2, x2 + xOffset, y2 + yOffset + edge / 2);

    endShape();
    pop();
  }
}
