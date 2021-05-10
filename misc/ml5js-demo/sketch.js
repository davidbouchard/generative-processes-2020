const pix2pix = ml5.pix2pix('https://cdn.glitch.com/ce89945e-1460-4148-9e8f-24cb29686624%2Ffacades_BtoA.pict?v=1605724331423', modelLoaded);

let palette = ["#0000FF", //  1: facade
               "#0055FF", //  2: window 
               "#00AAFF", //  3: door
               "#AAFF55", //  4: balcony,
               "#55FFAA", //  6: sill 
               "#AA0000", //  7: shop window               
               "#FF5500", //  8: roof edge
               "#FFFF00", //  9: blinds?
               "#FFAA00"]; // 10: decorations 


let inputImg; 
let outputImg; 

let SIZE = 512;  // 256, 512, 104  
 
let startX; 
let startY; 

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  inputImg = createGraphics(SIZE, SIZE); // 512x512
  inputImg.background("#0000AA");  
  inputImg.noStroke();
  inputImg.fill(palette[0]);
  fill(palette[0]);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Main render loop 
function draw() {  
  background(0); 
  
  // draw both images
  image(inputImg, 0, 0);
  if (outputImg) image(outputImg, SIZE, 0);
  
  
  // draw a rectangle 
  if (mouseIsPressed) rect(startX, startY, mouseX-startX, mouseY-startY);
  else circle(mouseX, mouseY, 15);
}


// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
  generateImage();
}


function generateImage() { 

  // Transfer using a canvas
  pix2pix.transfer(inputImg.canvas, (err, result) => {
    //console.log(result);
    if (result && result.src) { 
      loadImage(result.src, imageLoaded);    
    }    
  });  
}

function imageLoaded(img) {
  outputImg = img; 
}


function mousePressed() {
  startX = mouseX;
  startY = mouseY;  
}

function mouseReleased() {
  inputImg.rect(startX, startY, mouseX-startX, mouseY-startY);  
  
  generateImage();  
}

function keyPressed() {
  
  if (key >= 1 && key <= palette.length+1 ) {
    let index = parseInt(key)-1; 
    inputImg.fill( palette[index] );
    fill(palette[index]);    
  }
  
  
}