import { INSTRUMENT } from "./instruments";

export type SoundData = {
  frequency: number | undefined;
  duration: {
    value: number;
    prolonged: boolean;
  };
};

export type AdsrParams = {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  sustainTime: number;
};
export type TrackData = {
  bpm: number;
  volume: number;
  melody: SoundData[];
  instrument: INSTRUMENT;
  adsr: AdsrParams;
};
