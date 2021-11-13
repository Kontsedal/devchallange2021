import "./style.css";
import { Sound } from "./entities/sound";
import { NOTE_FREQUENCY } from "./constants";
import { parseSequence } from "./parser";

const bpm = 60;

const input = `D3/8 D3/8 A#3/8. A3/16 G3/8 G3/4.
A#3/8 A#3/8 C4/8 A#3/8 A3/4. A3/8
A3/8 A3/8 A3/8 A3/8 D4/8 C4/8 A#3/8 A3/8
A#3/4 A#3/8. A#3/16 D4/8 A#3/8`;
const sequence = parseSequence(input);

console.log(sequence);

document.querySelector(".js-play")?.addEventListener("click", () => {
  const audioContext = new AudioContext();

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
      volume: 1,
      waveType: "sine",
      startTime: lastEnd,
      endTime: lastEnd + duration,
    });
    console.log({
      // @ts-ignore
      freqValue: NOTE_FREQUENCY[entity.note] as number,
      volume: 0.5,
      waveType: "sine",
      startTime: lastEnd,
      endTime: lastEnd + duration,
    });
    lastEnd = lastEnd + duration;
    sound.play();
  }
});
