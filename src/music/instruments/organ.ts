import { Instrument } from "./instrument";

export const initializeOrganInstrument: Instrument = (
  audioContext: AudioContext,
  oscillatorNode: OscillatorNode
) => {
  oscillatorNode.setPeriodicWave(
    audioContext.createPeriodicWave(
      Float32Array.from([0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1]),
      Float32Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    )
  );
};
