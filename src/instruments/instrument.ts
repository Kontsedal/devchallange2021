export type InstrumentInitializer = (
  audioContext: AudioContext,
  oscillatorNode: OscillatorNode
) => unknown;
