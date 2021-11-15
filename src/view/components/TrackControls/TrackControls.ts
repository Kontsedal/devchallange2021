import { Component } from "renderer/renderer";
import s from "./TrackControls.module.scss";
import { SoundData, Track } from "music/Track";
import { Input } from "../Input/Input";
import { parseSequence } from "../../../music/parser";
import { Select } from "../Select/Select";
import { INSTRUMENT } from "../../../music/instruments";

export const TrackControls: Component<{ track: Track }> = (
  { track },
  { template, child, state, effect }
) => {
  const [trackString, setTrackString] = state("");
  const [melody, setMelody] = state(track.getMelody());
  const [adsr, setAdsr] = state(track.getAdsr());
  const [bpm, setBpm] = state(track.getBpm());
  const [instrument, setInstrument] = state(track.getInstrument());
  effect(() => {
    track.setAdsr(adsr);
  }, [adsr]);
  effect(() => {
    track.setBpm(bpm);
  }, [bpm]);
  effect(() => {
    track.setInstrument(instrument);
  }, [instrument]);
  effect(() => {
    if (!trackString) {
      return;
    }
    try {
      let parsedMelody: SoundData[] = parseSequence(trackString);
      track.setMelody(parsedMelody);
      setMelody(() => parsedMelody);
    } catch (error) {
      alert("Failed to parse melody");
    }
  }, [trackString]);
  return template`<div class="${s.track}">
      ${child(Input, {
        props: {
          value: trackString,
          onChange: (newValue) => setTrackString(() => newValue),
          hasError: melody.length === 0,
          placeholder: "Enter a melody",
        },
        dependencies: [trackString, melody.length === 0],
        key: "trackInput",
      })}
      <div>
        <div>
          <p>Attack time (${String(adsr.attackTime)}s):</p>
          ${child(Input, {
            props: {
              type: "range",
              value: adsr.attackTime,
              min: 0,
              max: 3,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({ ...prev, attackTime: Number(newValue) })),
            },
            dependencies: [adsr.attackTime],
            key: "adsr.attack",
          })}
        </div>
        <div>
          <p>Decay time (${String(adsr.decayTime)}s):</p>
          ${child(Input, {
            props: {
              type: "range",
              value: adsr.decayTime,
              min: 0,
              max: 3,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({ ...prev, decayTime: Number(newValue) })),
            },
            dependencies: [adsr.decayTime],
            key: "adsr.decayTime",
          })}
        </div>
        <div>
          <p>Sustain time (${String(adsr.sustainTime)}s):</p>
          ${child(Input, {
            props: {
              type: "range",
              value: adsr.sustainTime,
              min: 0,
              max: 3,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({ ...prev, sustainTime: Number(newValue) })),
            },
            dependencies: [adsr.sustainTime],
            key: "adsr.sustainTime",
          })}
        </div>
        <div>
          <p>Sustain level (${String(adsr.sustainLevel * 100)}%):</p>
          ${child(Input, {
            props: {
              type: "range",
              value: adsr.sustainLevel,
              min: 0,
              max: 1,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({
                  ...prev,
                  sustainLevel: Number(newValue),
                })),
            },
            dependencies: [adsr.sustainLevel],
            key: "adsr.sustainLevel",
          })}
        </div>
        <div>
          <p>Release time (${String(adsr.releaseTime)}s):</p>
          ${child(Input, {
            props: {
              type: "range",
              value: adsr.releaseTime,
              min: 0,
              max: 1,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({
                  ...prev,
                  releaseTime: Number(newValue),
                })),
            },
            dependencies: [adsr.releaseTime],
            key: "adsr.releaseTime",
          })}
        </div>
        <div>
          <p>BPM</p>
          ${child(Input, {
            props: {
              type: "number",
              value: bpm,
              min: 1,
              max: 1000,
              step: 1,
              onChange: (newValue) => setBpm(() => Number(newValue)),
            },
            dependencies: [bpm],
            key: "bpm",
          })}
        </div>
        <div>
          <p>Instrument</p>
          ${child(Select, {
            props: {
              options: [
                { value: INSTRUMENT.BASIC, title: "Basic" },
                { value: INSTRUMENT.ORGAN, title: "Organ" },
                { value: INSTRUMENT.BASS, title: "Bass" },
              ],
              value: instrument,
              onChange: (newValue: string) =>
                setInstrument(newValue as INSTRUMENT),
            },
            key: "instrument",
            dependencies: [instrument],
          })}
        </div>
      </div>
  </div>`;
};
