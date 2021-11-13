import "./style.css";
import { parseSequence } from "./parser";
import { Track } from "./Track";

const input = `E4/4 E4/4 E4/4 D#4/8. A#4/16 E4/4 D#4/8. A#4/16 E4/2
D5/4 D5/4 D5/4 D#5/8. A#4/16 F#4/4 D#4/8. A#4/16 E4/2`;
const sequence = parseSequence(input);

let track = new Track({
  melody: sequence,
  bpm: 120,
});
let audioContext: AudioContext | undefined;
document.querySelector(".js-play")?.addEventListener("click", () => {
  track.play();
  audioContext = track.getAudioContext();
});

document.querySelector(".js-pause")?.addEventListener("click", () => {
  audioContext?.suspend();
});

document.querySelector(".js-resume")?.addEventListener("click", () => {
  audioContext?.resume();
});
