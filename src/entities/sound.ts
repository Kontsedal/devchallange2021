import { Instrument } from "../music/instruments/instrument";
import { Adsr } from "./adsr";

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
    instrument: Instrument;
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
    this.adsr.apply({
      gainNode: this.gain,
      volume: this.volume,
      startTime: this.startTime,
      oscillator: this.oscillator,
    });
  }
}
