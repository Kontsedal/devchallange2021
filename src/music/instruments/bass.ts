import { Instrument } from "./instrument";

export const initializeBassInstrument: Instrument = (
  audioContext: AudioContext,
  oscillatorNode: OscillatorNode
) => {
  oscillatorNode.setPeriodicWave(
    audioContext.createPeriodicWave(
      Float32Array.from([
        0, 1, 0.8144329896907216, 0.20618556701030927, 0.020618556701030927,
      ]),
      Float32Array.from([0, 0, 0, 0, 0])
    )
  );
};
