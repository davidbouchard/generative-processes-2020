let masterVolume = -9; // in decibel.

let ready = false;

let wave; // this object allows us to draw waveforms

let synth;
let loop;

//let scale = ['C4', 'D4','E4', 'F4', 'G4', 'A4', 'B4']; // C major
let scale;

let prevNote;

//------------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Look at Tonal.ScaleType.names() for a full list of 
  // supported scales
  scale = Tonal.Scale.get("C4 minor pentatonic").notes;  
}

//------------------------------------------------------------
function initalizeAudio() {
  // Create the Synth
  synth = new Tone.Synth();
  synth.toDestination(); // synth.connect(Tone.Master);
   
  // note that the first parameter to Loop() is an anonymous function,
  // ie a function defined "on the fly"
  loop = new Tone.Loop( (time) => {    
    let n = noise(frameCount * 0.1);
    let i = floor(map(n, 0, 1, 0, scale.length)); // floor rounds down
    let note = scale[i];
    if (prevNote != note) {
      // (freq, noteDuration, time)
      synth.triggerAttackRelease(note, "8n", time);
    }
    prevNote = note;
  }, "16n");  // '16n' here sets the speed of our loop -- every 16th note
  // Start the loop
  loop.start();

  wave = new Tone.Waveform();
  Tone.Master.connect(wave);

  Tone.Master.volume.value = masterVolume;
  Tone.Transport.start();
}

//------------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//------------------------------------------------------------
// Main render loop
function draw() {
  background(0);

  if (ready) {
    drawWaveform(wave);
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
  }
}

//------------------------------------------------------------
function drawWaveform(wave, w = width, h = height) {
  stroke(255);
  let buffer = wave.getValue(0);

  // look a trigger point where the samples are going from
  // negative to positive
  let start = 0;
  for (let i = 1; i < buffer.length; i++) {
    if (buffer[i - 1] < 0 && buffer[i] >= 0) {
      start = i;
      break; // interrupts a for loop
    }
  }

  // calculate a new end point such that we always
  // draw the same number of samples in each frame
  let end = start + buffer.length / 2;

  // drawing the waveform
  for (let i = start; i < end; i++) {
    let x1 = map(i - 1, start, end, 0, w);
    let y1 = map(buffer[i - 1], -1, 1, 0, h);
    let x2 = map(i, start, end, 0, w);
    let y2 = map(buffer[i], -1, 1, 0, h);
    line(x1, y1, x2, y2);
  }
}

//------------------------------------------------------------
function mousePressed() {
  if (!ready) {
    ready = true;  
    initalizeAudio();
  }
  else {
    ready = false;
    Tone.Transport.stop();
  }
}
