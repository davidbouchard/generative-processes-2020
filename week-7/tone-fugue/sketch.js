let ready = false;
let masterVolume = -9; // in decibels (dB);

let scale;

// The master sequence
let sequence = [0, 4, 2, 6];

let track;
let track2;
let track3;

//------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  scale = Tonal.Scale.get("C4 minor").notes;
}

//------------------------------------------------------------
// Place all the Tone.js initialization code here
function initializeAudio() {
  track = new Track(); // base sequence
  track2 = new Track(4, "8n", "8n."); // melody
  track3 = new Track(-7, "1n", "1n"); // bass

  Tone.Transport.start();
  Tone.Master.volume.value = masterVolume;
}

//------------------------------------------------------------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//------------------------------------------------------------
function draw() {
  
  if (ready) {
    background(0, 25);
    
    let tSize = min(width,height) / 20;

    textSize(tSize);
    textAlign(CENTER, CENTER);

    translate(width / 2, height / 2);
    // let's draw the whole scale in a circle pattern
    for (let i = 0; i < scale.length; i++) {
      let angle = map(i, 0, scale.length, -PI / 2, TWO_PI - PI / 2);

      let radius = min(width, height) / 3;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      let noteName = Tonal.Note.pitchClass(scale[i]);

      if (noteName == Tonal.Note.pitchClass(track3.currentNote)) {
        stroke(0, 128, 255);
        line(x, y, 0, 0);
        fill(0);
        circle(x, y, tSize * 2.5);
      }

      if (noteName == Tonal.Note.pitchClass(track2.currentNote)) {
        stroke(128, 255, 0);
        line(x, y, 0, 0);
        fill(0);
        circle(x, y, tSize * 2.5);
      }

      if (noteName == Tonal.Note.pitchClass(track.currentNote)) {
        stroke(255);
        line(x, y, 0, 0);
        fill(0);
        circle(x, y, tSize * 2);
      }

      noStroke();
      fill(255);
      text(noteName, x, y);
    }

    //text(track.currentNote, 0, 0);
  } else {
    background(0);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
  }
}

//------------------------------------------------------------
// Maps a note number to a musical note contained in the 'scale' array

// Note 0 -> first note in the scale (ie scale[0])

// A negative note number returns note from the scale but with lower pitch

// A positive note number that exceeds the length of the scale returns
// a note from the scale but with a higher pitch

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
// "Proper" modulo operation.  In Javascript, % actually returns
// the remainder of a division, which means it can give you negative
// values
// This function will only return positive numbers between 0 and m
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
  else {
    // click again to start/stop...     
    if (Tone.Transport.state == 'paused') Tone.Transport.start();
    else if (Tone.Transport.state == 'started') Tone.Transport.pause();    
  }
}

//------------------------------------------------------------
class Track {
  // patternTypes:
  // "up" | "down" | "upDown" | "downUp" |
  // "alternateUp" | "alternateDown" |
  // "random" | "randomOnce" | "randomWalk"

  constructor(
    tranpose = 0,
    noteDuration = "8n",
    tempo = "8n",
    patternType = "up"
  ) {
    this.transpose = tranpose; // this will shift the sequence by a number of notes

    this.noteDuration = noteDuration;

    // the tempo can be entered as relative 'beat' measurements
    // eg: 4n -> quarter notes
    //     8n -> eight notes
    //     etc..
    this.tempo = tempo;

    // Every track gets its own synth
    this.synth = new Tone.Synth();
    this.synth.toDestination();

    // This is our repeating Pattern object
    this.pattern = new Tone.Pattern(
      // this is the 'callback' function, defined here as an anonymous
      // (ie 'on the fly') function
      (time, index) => {
        let note = mapNote(sequence[index] + this.transpose, scale);
        this.synth.triggerAttackRelease(note, this.noteDuration, time);
        this.currentNote = note;
      },
      // This array simply contains [0, 1, 2, 3, ...] etc
      Array.from(sequence.keys()),
      //  See above for different pattern type options
      patternType
    );

    this.pattern.interval = this.tempo;
    this.pattern.start();

    // This variable holds the current note being played. This is useful
    // for visualizatons
    this.currentNote;
  }
}
