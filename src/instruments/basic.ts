import { InstrumentInitializer } from "./instrument";

export const initializeBasicInstrument: InstrumentInitializer = (
  _audioContext: AudioContext,
  oscillatorNode: OscillatorNode
) => {
  oscillatorNode.type = "sawtooth";
};
