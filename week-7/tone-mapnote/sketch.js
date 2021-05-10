let ready = false;
let masterVolume = -9; // in decibels (dB);

let scale;

let synth;
let prevNote;

//------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  scale = Tonal.Scale.get("C4 minor").notes;
}

//------------------------------------------------------------
// Place all the Tone.js initialization code here
function initializeAudio() {
  synth = new Tone.Synth();
  synth.toDestination();

  Tone.Master.volume.value = masterVolume;
}

//------------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//------------------------------------------------------------
function draw() {
  background(0);

  if (ready) {
    let noteNumber = floor(map(mouseX, 0, width, -14, 21));
    let note = mapNote(noteNumber, scale);
    
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(100);
    text(note, width / 2, height / 2);

    // play the note
    if (note != prevNote) {
      synth.triggerAttackRelease(note, "8n");
      prevNote = note;
    }
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
  }
}

//------------------------------------------------------------
function mapNote(noteNumber, scale) {
  let numNotes = scale.length;
  let i = modulo(noteNumber, numNotes);
  let note = scale[i];
  // ** fixed!  should now work with scales that don't start 
  // in C :-)
  // thanks to YouTube user Mark Lee for pointing this out!
  let octaveTranspose = floor(noteNumber / numNotes);
  let interval = Tonal.Interval.fromSemitones(octaveTranspose*12);  
  return Tonal.Note.transpose(note, interval);
}

//------------------------------------------------------------
function modulo(n, m) {
  return ((n % m) + m) % m;
}

//------------------------------------------------------------
function mousePressed() {
  if (!ready) {
    // ! means 'not'
    ready = true;
    initializeAudio();
  }
}
