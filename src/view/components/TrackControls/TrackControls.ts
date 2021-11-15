import { Component } from "renderer/renderer";
import s from "./TrackControls.module.scss";
import { SoundData, Track } from "music/Track";
import { Input } from "../Input/Input";
import { parseSequence } from "../../../music/parser";
import { Select } from "../Select/Select";
import { INSTRUMENT } from "../../../music/instruments";
import { Textarea } from "../Textarea/Textarea";

export const TrackControls: Component<{ track: Track; disabled: boolean }> = (
  { track, disabled },
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
      <div class="${s.side}">
        <div class="${s.bpmInstrument}">
          <div>
            <p class="${s.label}">BPM</p>
            ${child(Input, {
              props: {
                type: "number",
                value: bpm,
                min: 1,
                max: 1000,
                disabled,
                step: 1,
                onChange: (newValue) => setBpm(() => Number(newValue)),
              },
              key: "bpm",
            })}
          </div>
          <div>
            <p class="${s.label}">Instrument</p>
            ${child(Select, {
              props: {
                disabled,
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
            })}
          </div>
        </div>
        ${child(Textarea, {
          props: {
            disabled,
            value: trackString,
            onChange: (newValue) => setTrackString(() => newValue),
            hasError: Boolean(melody.length === 0 && trackString.length),
            placeholder: "Enter a melody",
            className: s.melodyInput,
          },
          key: "trackInput",
        })}
        
      </div>
      <div class="${s.side}">
      <div>
          <p class="${s.label}">Attack time (${String(adsr.attackTime)}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: adsr.attackTime,
              min: 0,
              max: 3,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({ ...prev, attackTime: Number(newValue) })),
            },
            key: "adsr.attack",
          })}
        </div>
        <div>
          <p class="${s.label}">Decay time (${String(adsr.decayTime)}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: adsr.decayTime,
              min: 0,
              max: 3,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({ ...prev, decayTime: Number(newValue) })),
            },
            key: "adsr.decayTime",
          })}
        </div>
        <div class="${s.label}">
          <p>Sustain time (${String(adsr.sustainTime)}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: adsr.sustainTime,
              min: 0,
              max: 3,
              step: 0.05,
              onChange: (newValue) =>
                setAdsr((prev) => ({ ...prev, sustainTime: Number(newValue) })),
            },
            key: "adsr.sustainTime",
          })}
        </div>
        <div>
          <p class="${s.label}">Sustain level (${String(
    adsr.sustainLevel * 100
  )}%):</p>
          ${child(Input, {
            props: {
              disabled,
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
            key: "adsr.sustainLevel",
          })}
        </div>
        <div>
          <p class="${s.label}">Release time (${String(adsr.releaseTime)}s):</p>
          ${child(Input, {
            props: {
              disabled,
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
            key: "adsr.releaseTime",
          })}
        </div>
      </div>
  </div>`;
};
