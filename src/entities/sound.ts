import { InstrumentInitializer } from "../instruments/instrument";

export type Adsr = {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  sustainTime: number;
};

export const imag = [0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1];
export const real = imag.map(() => 0);

export class Sound {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private gain: GainNode;
  private startTime: number;
  private volume: number;
  private adsr: Adsr;

  constructor({
    audioContext,
    freqValue,
    volume,
    startTime,
    adsr,
    instrument,
  }: {
    audioContext: AudioContext;
    freqValue: number;
    volume: number;
    startTime: number;
    adsr: Adsr;
    instrument: InstrumentInitializer;
  }) {
    this.audioContext = audioContext;
    this.oscillator = this.audioContext.createOscillator();
    instrument(this.audioContext, this.oscillator);
    this.gain = this.audioContext.createGain();

    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);

    this.oscillator.frequency.value = freqValue;
    this.startTime = startTime;
    this.volume = volume;
    this.adsr = adsr;
  }

  play() {
    this.gain.gain.setValueAtTime(0.001, this.startTime);
    this.gain.gain.exponentialRampToValueAtTime(
      this.volume,
      this.startTime + this.adsr.attackTime
    );
    this.gain.gain.exponentialRampToValueAtTime(
      this.adsr.sustainLevel * this.volume,
      this.startTime + this.adsr.attackTime + this.adsr.decayTime
    );
    this.gain.gain.setValueAtTime(
      this.adsr.sustainLevel * this.volume,
      this.startTime +
        this.adsr.attackTime +
        this.adsr.decayTime +
        this.adsr.sustainTime
    );
    this.gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.startTime +
        this.adsr.attackTime +
        this.adsr.decayTime +
        this.adsr.sustainTime +
        this.adsr.releaseTime
    );
    this.oscillator.start(this.startTime);
    this.oscillator.stop(
      this.startTime +
        this.adsr.attackTime +
        this.adsr.decayTime +
        this.adsr.sustainTime +
        this.adsr.releaseTime +
        0.1
    );
  }

  stop() {
    this.gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime
    );
    this.oscillator.stop(this.audioContext.currentTime + 1);
  }
}
