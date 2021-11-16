import { Instrument } from "./instrument";

const real = new Float32Array([0, 0, -1, 0, -1]);
const imag = new Float32Array(real.length);

export const initializeSmoothInstrument: Instrument = (
  audioContext: AudioContext,
  oscillatorNode: OscillatorNode
) => {
  oscillatorNode.setPeriodicWave(
    audioContext.createPeriodicWave(
      Float32Array.from(real),
      Float32Array.from(imag)
    )
  );
};
