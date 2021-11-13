export type Adsr = {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  sustainTime: number;
};
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
    waveType,
    volume,
    startTime,
    adsr,
  }: {
    audioContext: AudioContext;
    freqValue: number;
    waveType: OscillatorType;
    volume: number;
    startTime: number;
    adsr: Adsr;
  }) {
    this.audioContext = audioContext;
    this.oscillator = this.audioContext.createOscillator();
    this.gain = this.audioContext.createGain();

    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    this.oscillator.type = waveType;
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
