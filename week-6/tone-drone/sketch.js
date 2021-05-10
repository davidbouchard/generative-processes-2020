let masterVolume = -9; // in decibel.

let ready = false;

let osc; // these two will be our audio oscillators
let osc2;
let lfo; // low frequency oscillator

let wave; // this object allows us to draw waveforms

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);

  // 4 differents types: sine (default), square, triangle and sawtooth
  osc = new Tone.Oscillator({
    type: "sine",
    frequency: 220,
    volume: -3
  });
  osc.toDestination(); // --> shorthand for "connect(Tone.Master)"

  osc2 = new Tone.Oscillator({
    type: "triangle",
    frequency: 220,
    volume: -3
  });
  osc2.frequency.value = 220; // 220hz -> A3
  osc2.toDestination(); // --> shorthand for "connect(Tone.Master)"

  lfo = new Tone.LFO("0.1hz", 210, 230);
  lfo.connect(osc.frequency);

  wave = new Tone.Waveform();
  Tone.Master.connect(wave);

  Tone.Master.volume.value = masterVolume;
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Main render loop
function draw() {
  background(0);

  if (ready) {
    // do the audio stuff
    osc.frequency.value = map(mouseX, 0, width, 110, 880);

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
      let x1 = map(i - 1, start, end, 0, width);
      let y1 = map(buffer[i - 1], -1, 1, 0, height);
      let x2 = map(i, start, end, 0, width);
      let y2 = map(buffer[i], -1, 1, 0, height);
      line(x1, y1, x2, y2);
    }
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
  }
}

function mousePressed() {
  if (!ready) {
    // ! --> not
    // start our audio objects here

    osc.start();
    osc2.start();
    lfo.start();

    ready = true;
  }
  else {
    ready = false;
    osc.stop();
    osc2.stop();
    lfo.stop();
  }
}
