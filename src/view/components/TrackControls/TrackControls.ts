import { Component } from "renderer/renderer";
import s from "./TrackControls.module.scss";
import { SoundData, Track } from "music/Track";
import { Input } from "../Input/Input";
import { parseSequence } from "../../../music/parser";

export const TrackControls: Component<{ track: Track }> = (
  { track },
  { template, child, state, effect }
) => {
  const [trackString, setTrackString] = state("");
  const [melody, setMelody] = state(track.getMelody());
  const [adsr, setAdsr] = state(track.getAdsr());
  const [bpm, setBpm] = state(track.getBpm());
  effect(() => {
    track.setAdsr(adsr);
  }, [adsr]);
  effect(() => {
    track.setBpm(bpm);
  }, [bpm]);

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
          <p>Attack time (${adsr.attackTime}s):</p>
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
          <p>Decay time (${adsr.decayTime}s):</p>
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
          <p>Sustain time (${adsr.sustainTime}s):</p>
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
          <p>Sustain level (${adsr.sustainLevel * 100}%):</p>
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
          <p>Release time (${adsr.releaseTime}s):</p>
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
          <p>Release time (${adsr.releaseTime}s):</p>
          ${child(Input, {
            props: {
              type: "number",
              value: adsr.releaseTime,
              min: 1,
              max: 240,
              step: 1,
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
              max: 240,
              step: 1,
              onChange: (newValue) => setBpm(() => Number(newValue)),
            },
            dependencies: [bpm],
            key: "bpm",
          })}
        </div>
      </div>
  </div>`;
};
