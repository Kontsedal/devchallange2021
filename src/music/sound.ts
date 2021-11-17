import { Instrument } from "./instruments/instrument";
import { AdsrParams } from "./types";

export const playSound = ({
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
  adsr: AdsrParams;
  instrument: Instrument;
}) => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  instrument(audioContext, oscillator);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.frequency.value = freqValue;

  /**
   * Apply ADSR
   */
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + adsr.attackTime);
  gain.gain.exponentialRampToValueAtTime(
    adsr.sustainLevel * volume,
    startTime + adsr.attackTime + adsr.decayTime
  );
  gain.gain.setValueAtTime(
    adsr.sustainLevel * volume,
    startTime + adsr.attackTime + adsr.decayTime + adsr.sustainTime
  );
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    startTime +
      adsr.attackTime +
      adsr.decayTime +
      adsr.sustainTime +
      adsr.releaseTime
  );
  oscillator.start(startTime);
  oscillator.stop(
    startTime +
      adsr.attackTime +
      adsr.decayTime +
      adsr.sustainTime +
      adsr.releaseTime +
      0.1
  );
};
