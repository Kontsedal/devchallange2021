import { INSTRUMENT } from "./music/instruments";

export const CONFIG = {
  DEFAULT_BPM: 120,
  DEFAULT_INSTRUMENT: INSTRUMENT.ORGAN,
  DEFAULT_VOLUME: 0.7,
  DEFAULT_ADSR: {
    attackTime: 0.2,
    decayTime: 0.1,
    sustainTime: 0.5,
    sustainLevel: 0.4,
    releaseTime: 0.2,
  },
  MIN_BPM: 1,
  MAX_BPM: 1000,
  MAX_ATTACK_TIME: 10,
  MAX_DECAY_TIME: 10,
  MAX_SUSTAIN_TIME: 10,
  MAX_RELEASE_TIME: 10,
};
