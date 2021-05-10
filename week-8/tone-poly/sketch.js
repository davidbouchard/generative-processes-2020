let ready = false;

let scaleNotes = Tonal.Scale.get("E4 phrygian").notes;

let chords = [];
let currentChord = 0;
let nextChord = 0;

let poly;

let FFT; // Fast Fourier Transform.

//-------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);

  // generate all the chords in our scale
  // (harmonizing the scale)
  for (let i = 0; i < scaleNotes.length; i++) {
    let chord = [];

    chord[0] = getMidiNote(i, scaleNotes);
    chord[1] = getMidiNote(i + 2, scaleNotes);
    chord[2] = getMidiNote(i + 4, scaleNotes);
    chord[3] = getMidiNote(i + 6, scaleNotes);

    //console.log(chord);
    chords.push(chord);
  }
}

//-------------------------------------------------------
function initializeAudio() {
  Tone.Master.volume.value = -9; // turn it down a bit

  poly = new Tone.PolySynth(Tone.AMSynth, {
    envelope: {
      attack: 1,
      release: 2
    }
  });
  poly.toDestination(); // Tone.Master

  FFT = new Tone.FFT(1024); // number of frequency bin: has to be a power of 2
  Tone.Master.connect(FFT);

  Tone.Transport.schedule(changeChord, "1");
  Tone.Transport.start();
}

//-------------------------------------------------------
function changeChord(time) {
  currentChord = nextChord;
  let duration = floor(random(1, 4)) + "m";
  poly.triggerAttackRelease(chords[currentChord], duration, time);
  nextChord = floor(random(chords.length));
  Tone.Transport.schedule(changeChord, "+" + duration);
}

//-------------------------------------------------------
function getMidiNote(noteNumber, notes) {
  let numNotes = notes.length;
  let i = modulo(noteNumber, numNotes);
  let note = notes[i];
  // ** fixed!  should now work with scales that don't start
  // in C :-)
  // thanks to YouTube user Mark Lee for pointing this out!
  let octaveTranspose = floor(noteNumber / numNotes);
  let interval = Tonal.Interval.fromSemitones(octaveTranspose * 12);
  return Tonal.Note.transpose(note, interval);
}

//-------------------------------------------------------
function modulo(n, m) {
  return ((n % m) + m) % m;
}

//-------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//-------------------------------------------------------
// Main render loop
function draw() {
  if (!ready) {
    background(0);
    fill(255);
    textAlign(CENTER);
    text("CLICK TO START", width / 2, height / 2);
  } else {
    background(0, 25);
    stroke(255);
    // visualize the FFT
    let radius = min(width, height) / 2;

    translate(width / 2, height / 2);

    let buffer = FFT.getValue(0);
    for (let i = 0; i < buffer.length; i++) {
      push();
      let angle = map(i, 0, buffer.length, 0, TWO_PI);
      rotate(angle);

      let db = buffer[i]; // -100 to 0
      let y = map(db, -100, 0, 0, radius);

      point(0, y);

      pop();
    }
  }
}

//-------------------------------------------------------
function mousePressed() {
  if (!ready) {
    initializeAudio();
    ready = true;
  } else {
    // click again to start/stop...
    if (Tone.Transport.state == "paused") Tone.Transport.start();
    else if (Tone.Transport.state == "started") Tone.Transport.pause();
  }
}
