export class Sound {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode;
  private gain: GainNode;
  private startTime: number;
  private endTime?: number;
  private volume: number;

  constructor({
    audioContext,
    freqValue,
    waveType,
    volume,
    startTime,
    endTime,
  }: {
    audioContext: AudioContext;
    freqValue: number;
    waveType: OscillatorType;
    volume: number;
    startTime: number;
    endTime: number;
  }) {
    this.audioContext = audioContext;
    this.oscillator = this.audioContext.createOscillator();
    this.gain = this.audioContext.createGain();

    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    this.oscillator.type = waveType;
    this.oscillator.frequency.value = freqValue;
    this.startTime = startTime;
    this.endTime = endTime;
    this.volume = volume;
  }

  play() {
    this.gain.gain.setValueAtTime(this.volume, this.startTime);
    this.oscillator.start(this.startTime);
    if (this.endTime) {
      this.stop(this.endTime);
    }
  }

  stop(time: number) {
    this.gain.gain.exponentialRampToValueAtTime(0.001, time);
    this.oscillator.stop(time + 1);
  }
}
