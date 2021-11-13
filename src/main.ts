import "./style.css";
import { Adsr, Sound } from "./entities/sound";
import { NOTE_FREQUENCY } from "./constants";
import { parseSequence } from "./parser";

const bpm = 100;

const input = `E4/4 E4/4 E4/4 D#4/8. A#4/16 E4/4 D#4/8. A#4/16 E4/2
D5/4 D5/4 D5/4 D#5/8. A#4/16 F#4/4 D#4/8. A#4/16 E4/2`;
const sequence = parseSequence(input);

console.log(sequence);

document.querySelector(".js-play")?.addEventListener("click", () => {
  const audioContext = new AudioContext();
  // const compressor = audioContext.createDynamicsCompressor();
  // compressor.threshold.value = -50;
  // compressor.knee.value = 40;
  // compressor.ratio.value = 12;
  // compressor.attack.value = 0;
  // compressor.release.value = 0.01;
  // compressor.connect(audioContext.destination);
  const adsr: Adsr = {
    attackTime: 0.2,
    decayTime: 0.1,
    sustainTime: 0.5,
    sustainLevel: 0.4,
    releaseTime: 0.2,
  };
  let lastEnd = audioContext.currentTime;
  for (let i = 0; i < sequence.length; i++) {
    let entity = sequence[i];
    let duration = 240 / entity.duration.value;
    if (entity.duration.prolonged) {
      duration *= 1.5;
    }
    duration = duration / bpm;
    let sound = new Sound({
      audioContext,
      // @ts-ignore
      freqValue: NOTE_FREQUENCY[entity.note] as number,
      volume: 0.6,
      waveType: "sine",
      startTime: lastEnd,
      adsr,
    });
    lastEnd = lastEnd + duration;
    sound.play();
  }
});
