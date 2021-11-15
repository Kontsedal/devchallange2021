import { getInstrument } from "./instruments";
import { CONFIG } from "../config";
import { TrackData } from "./types";
import { playSound } from "./sound";

export const createTrackData = (params: Partial<TrackData> = {}): TrackData => {
  return {
    bpm: CONFIG.DEFAULT_BPM,
    melody: [],
    instrument: CONFIG.DEFAULT_INSTRUMENT,
    adsr: CONFIG.DEFAULT_ADSR,
    volume: CONFIG.DEFAULT_VOLUME,
    ...params,
  };
};

export const playTrack = (track: TrackData, audioContext: AudioContext) => {
  if (!audioContext || !track.melody.length) {
    return;
  }
  let lastEnd = audioContext.currentTime;
  for (let i = 0; i < track.melody.length; i++) {
    let soundDataItem = track.melody[i];
    let duration = 240 / soundDataItem.duration.value;
    if (soundDataItem.duration.prolonged) {
      duration *= 1.5;
    }
    duration = duration / track.bpm;
    if (soundDataItem.frequency) {
      playSound({
        audioContext: audioContext,
        freqValue: soundDataItem.frequency,
        volume: track.volume,
        startTime: lastEnd,
        instrument: getInstrument(track.instrument),
        adsr: track.adsr,
      });
    }
    lastEnd = lastEnd + duration;
  }
};

export const getTrackDuration = (track: TrackData) => {
  return track.melody.reduce((result, soundDataItem, index) => {
    let isLast = index === track.melody.length - 1;
    if (isLast) {
      return (
        result +
        track.adsr.attackTime +
        track.adsr.decayTime +
        track.adsr.sustainTime +
        track.adsr.releaseTime
      );
    }
    let duration = 240 / soundDataItem.duration.value;
    if (soundDataItem.duration.prolonged) {
      duration *= 1.5;
    }
    return result + duration / track.bpm;
  }, 0);
};
