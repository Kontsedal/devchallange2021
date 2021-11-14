import { INSTRUMENT } from "./instruments";
import { initializeOrganInstrument } from "./instruments/organ";
import { Sound } from "../entities/sound";
import { Adsr, AdsrParams } from "../entities/adsr";

export type SoundData = {
  frequency: number | undefined;
  duration: {
    value: number;
    prolonged: boolean;
  };
};

export type TrackParams = {
  bpm?: number;
  melody?: SoundData[];
  instrument?: INSTRUMENT;
  adsr?: AdsrParams;
};

export class Track {
  private params: {
    bpm: number;
    melody: SoundData[];
    instrument: INSTRUMENT;
    adsr: AdsrParams;
  };

  constructor(params: TrackParams) {
    const {
      bpm = 120,
      melody = [],
      instrument = INSTRUMENT.BASIC,
      adsr = {
        attackTime: 0.2,
        decayTime: 0.1,
        sustainTime: 0.5,
        sustainLevel: 0.4,
        releaseTime: 0.2,
      },
    } = params;
    this.params = { bpm, melody, instrument, adsr };
  }

  play(audioContext: AudioContext) {
    if (!audioContext || !this.params.melody.length) {
      return;
    }
    let lastEnd = audioContext.currentTime;
    for (let i = 0; i < this.params.melody.length; i++) {
      let soundDataItem = this.params.melody[i];
      let duration = 240 / soundDataItem.duration.value;
      if (soundDataItem.duration.prolonged) {
        duration *= 1.5;
      }
      duration = duration / this.params.bpm;
      if (soundDataItem.frequency) {
        let sound = new Sound({
          audioContext: audioContext,
          freqValue: soundDataItem.frequency,
          volume: 0.6,
          startTime: lastEnd,
          instrument: initializeOrganInstrument,
          adsr: new Adsr(this.params.adsr),
        });
        sound.play();
      }
      lastEnd = lastEnd + duration;
    }
  }

  setMelody(melody: SoundData[]) {
    this.params.melody = melody;
  }
  getMelody() {
    return this.params.melody;
  }
  getAdsr() {
    return this.params.adsr;
  }
  setAdsr(value: AdsrParams) {
    this.params.adsr = value;
  }
  getBpm() {
    return this.params.bpm;
  }
  setBpm(value: number) {
    this.params.bpm = value;
  }
}
