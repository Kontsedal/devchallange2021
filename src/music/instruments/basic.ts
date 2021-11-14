import { Instrument } from "./instrument";

export const initializeBasicInstrument: Instrument = (
  _audioContext: AudioContext,
  oscillatorNode: OscillatorNode
) => {
  oscillatorNode.type = "sawtooth";
};
