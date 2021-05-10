let ready = false;
let masterVolume = -9; // in decibels (dB);

let scale;

let sequence = [0, 4, 2, 6];

let track; 

//------------------------------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);

  scale = Tonal.Scale.get("C4 major").notes;
}

//------------------------------------------------------------
// Place all the Tone.js initialization code here
function initializeAudio() {

  track = new Track(-7, "4n", "4n", "upDown");
  
  Tone.Transport.start();
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
    noStroke();
    fill(255);
    textSize(100);
    textAlign(CENTER, CENTER);
    text(track.currentNote, width / 2, height / 2);
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
  }
}

function keyPressed() {
  sequence = [0, 1, 2, 3];
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
  
  constructor(tranpose=0, noteDuration='8n', tempo='8n', patternType='up') {
    
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
        let note = mapNote(sequence[index] + this.transpose , scale);
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
