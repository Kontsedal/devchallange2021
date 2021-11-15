import { INSTRUMENT } from "./music/instruments";

export const CONFIG = {
  DEFAULT_BPM: 120,
  DEFAULT_INSTRUMENT: INSTRUMENT.ORGAN,
  DEFAULT_ADSR: {
    attackTime: 0.2,
    decayTime: 0.1,
    sustainTime: 0.5,
    sustainLevel: 0.4,
    releaseTime: 0.2,
  },
};
