export type AdsrParams = {
  attackTime: number;
  decayTime: number;
  sustainLevel: number;
  releaseTime: number;
  sustainTime: number;
};

export class Adsr {
  constructor(private params: AdsrParams) {}
  apply({
    gainNode,
    oscillator,
    volume,
    startTime,
  }: {
    gainNode: GainNode;
    oscillator: OscillatorNode;
    volume: number;
    startTime: number;
  }) {
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(
      volume,
      startTime + this.params.attackTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      this.params.sustainLevel * volume,
      startTime + this.params.attackTime + this.params.decayTime
    );
    gainNode.gain.setValueAtTime(
      this.params.sustainLevel * volume,
      startTime +
        this.params.attackTime +
        this.params.decayTime +
        this.params.sustainTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      startTime +
        this.params.attackTime +
        this.params.decayTime +
        this.params.sustainTime +
        this.params.releaseTime
    );
    oscillator.start(startTime);
    oscillator.stop(
      startTime +
        this.params.attackTime +
        this.params.decayTime +
        this.params.sustainTime +
        this.params.releaseTime +
        0.1
    );
  }
}
