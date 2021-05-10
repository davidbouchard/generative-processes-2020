// Inspired by
// Memo Atken's Simple Harmonic Motion series

let masterVolume = -9; // in decibel.
let ready = false;

let pendulums = [];

let scale;

let mixer;

//------------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
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
    for (let p of pendulums) {
      p.run();
      translate(0, height / (pendulums.length+1));
    }
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
  }
}

//------------------------------------------------------------
function mousePressed() {
  if (!ready) {
    initializeAudio();
    ready = true;
  }
}

//------------------------------------------------------------
function initializeAudio() {
  Tone.Master.volume.value = masterVolume;

  mixer = new Tone.Gain();

  let reverb = new Tone.Reverb({
    wet: 0.5, // half dry, half wet mix
    decay: 30 // decay time in seconds
  });

  // setup the audio chain:
  // mixer -> reverb -> Tone.Master
  // note that the synth object inside each pendulum get
  // connected to the mixer, so our final chain will look like:
  // synth(s) -> mixer -> reverb -> Tone.Master
  mixer.connect(reverb);
  reverb.toDestination();

  // quick way to get more notes: just glue 3 scales together
  // other 'flavours' to try:
  // major
  // minor
  // major pentatonic
  // the modes (eg: dorian, phrygian, etc..)
  // look at Tonal.ScaleType.names() to see a list of all supported
  // names

  let flavour = "minor pentatonic";
  scale = Tonal.Scale.get("C3 " + flavour).notes;
  scale = scale.concat(Tonal.Scale.get("C4 " + flavour).notes);
  scale = scale.concat(Tonal.Scale.get("C5 " + flavour).notes);

  // optional but fun: shuffle the scale array to mixup the notes
  //Tonal.Collection.shuffle(scale);

  // create as many pendulums as we have notes in the scale[] array
  for (let i = 0; i < scale.length; i++) {
    pendulums[i] = new Pendulum(0.85 + i * (1 / 60), scale[i]);
  }
}

//------------------------------------------------------------
class Pendulum {
  // runs when we call "= new Pendulum()"
  constructor(freq, note) {
    this.freq = freq * 0.2;
    this.note = note;

    this.lfo = new Tone.LFO(this.freq);
    this.lfo.start(1); // creating a delayed start time by 1
    this.meter = new Tone.Meter();
    this.meter.normalRange = true; // 0-1
    this.lfo.connect(this.meter);

    this.synth = new Tone.Synth();
    this.synth.connect(mixer);

    this.prevPos = 0;
  }

  // Arbitrary name here. We could have called this function 'update'
  // or 'swing' or whatever.
  run() {
    let pos = 0.5 - this.meter.getValue(0); // -> -0.5 ~ 0.5
    
    let border = max(100, (width-300)/2);
    console.log(border); 
    let x = map(pos, -0.5, 0.5, border, width - border);

    let left = pos > 0 && this.prevPos < 0; // && --> AND
    let right = pos < 0 && this.prevPos > 0;
    if (left || right) {
      // || ---> OR
      // trigger a note
      this.synth.triggerAttackRelease(this.note, "8n");
    }
    this.prevPos = pos;

    // drawing code --> this could go in a separate function if we
    // wanted to, but I didn't bother in this case.
    fill(255);
    stroke(255);
    line(x, 50, width / 2, 0);
    ellipse(x, 50, 25, 25);
  }
}
