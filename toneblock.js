import Tone from 'tone';

const synth = new Tone.Synth().toMaster();

// note:ドレミなどの音階を指定
// dur:「4n」->「♩」(四分音符)、「8n」->「♪」(八分音符)
// nullだと休符
const data = [
  { note: "E4", dur: "8n" },
  { note: "F4", dur: "4n" },
  [{ note: "G4", dur: "8n" }, { note: "G4", dur: "8n" }],
  { note: "G4", dur: "4n" },

  { note: "E4", dur: "8n" },
  [{ note: "G4", dur: "8n" }, { note: "C5", dur: "8n" }],
  { note: "C5", dur: "8n" },
  [{ note: "C5", dur: "8n" }, { note: "D5", dur: "2n" }],

  null,
  { note: "E5", dur: "8n" },
  { note: "E5", dur: "8n" },
  { note: "D5", dur: "2n" },

  null,
  [{ note: "C5", dur: "8n" },{ note: "A4", dur: "8n" }],
  [{ note: "C5", dur: "2n" },{ note: "C5", dur: "2n" }],
];

const seq = new Tone.Sequence((time, { note, dur }) => {
    synth.triggerAttackRelease(note, dur, time);
}, data, "4n").start(0);
seq.loop = false;
Tone.Transport.bpm.value = 150; // テンポ

document.querySelector("[type=button]").addEventListener("click", (e) => {
    Tone.Transport.start();
});

var ToneBlock = function(instrument, note, velocity, duration) {
    this.instrument = instrument;
    this.note = note;
    this.velocity = velocity;
    this.duration = duration;
};
