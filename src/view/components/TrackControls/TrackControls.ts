import { Component } from "renderer/renderer";
import s from "./TrackControls.module.scss";
import { Input } from "../Input/Input";
import { parseSequence } from "../../../music/parser";
import { Select } from "../Select/Select";
import { INSTRUMENT } from "../../../music/instruments";
import { Textarea } from "../Textarea/Textarea";
import { AdsrParams, SoundData, TrackData } from "../../../music/types";
import { Button } from "../Button/Button";
import closeIcon from "./assets/close.svg";
import { classNames as cn } from "../../../renderer/utils";
import { CONFIG } from "../../../config";

type Props = {
  track: TrackData;
  disabled: boolean;
  onTrackChange: (value: TrackData) => unknown;
  onClose: () => unknown;
};
export const TrackControls: Component<Props> = (
  { track, disabled, onTrackChange, onClose },
  { template, child, state, effect }
) => {
  const [trackString, setTrackString] = state("");
  const [trackStringError, setTrackStringError] = state<string | undefined>(
    undefined
  );
  effect(() => {
    if (!trackString) {
      setTrackStringError(undefined);
      onTrackChange({ ...track, melody: [] });
      return;
    }
    try {
      let parsedMelody: SoundData[] = parseSequence(trackString);
      onTrackChange({ ...track, melody: parsedMelody });
    } catch (error: any) {
      setTrackStringError(error.message);
    }
  }, [trackString]);
  const getTrackFieldHandler =
    <T extends keyof TrackData>(
      field: T,
      transform: (value: any) => TrackData[T]
    ) =>
    (value: any) => {
      onTrackChange({ ...track, [field]: transform(value) });
    };
  const getAdsrFieldHandler =
    <T extends keyof AdsrParams>(
      field: T,
      transform: (value: any) => AdsrParams[T]
    ) =>
    (value: any) => {
      onTrackChange({
        ...track,
        adsr: { ...track.adsr, [field]: transform(value) },
      });
    };
  return template`<div class="${s.track}">
      ${child(Button, {
        props: {
          onClick: onClose,
          className: s.close,
          text: `<img alt="close" src="${closeIcon}"/>`,
        },
        key: "close",
      })}
      <div class="${s.side}">
        <div class="${s.bpmInstrument}">
          <div>
            <p class="${s.label}">BPM</p>
            ${child(Input, {
              props: {
                type: "number",
                value: track.bpm,
                min: CONFIG.MIN_BPM,
                max: CONFIG.MAX_BPM,
                disabled,
                step: 1,
                onChange: getTrackFieldHandler("bpm", Number),
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
                value: track.instrument,
                onChange: getTrackFieldHandler(
                  "instrument",
                  String as () => INSTRUMENT
                ),
              },
              key: "instrument",
            })}
          </div>
          <div>
            <p class="${cn(s.label, s.center)}">Volume ${(
    track.volume * 100
  ).toFixed(0)}%</p>
            ${child(Input, {
              props: {
                disabled,
                value: track.volume,
                type: "range",
                min: 0,
                max: 1,
                step: 0.05,
                onChange: getTrackFieldHandler("volume", Number),
              },
              key: "volume",
            })}
          </div>
        </div>
        ${child(Textarea, {
          props: {
            disabled,
            value: trackString,
            onChange: setTrackString,
            hasError: Boolean(track.melody.length === 0 && trackString.length),
            placeholder: "Enter a melody",
            className: s.melodyInput,
          },
          key: "trackInput",
        })}
        <div class="${s.error}">${trackStringError}</div>
      </div>
      <div class="${s.side}">
      <div>
          <p class="${s.label}">Attack time (${String(
    track.adsr.attackTime
  )}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: track.adsr.attackTime,
              min: 0,
              max: CONFIG.MAX_ATTACK_TIME,
              step: 0.05,
              onChange: getAdsrFieldHandler("attackTime", Number),
            },
            key: "adsr.attack",
          })}
        </div>
        <div>
          <p class="${s.label}">Decay time (${String(
    track.adsr.decayTime
  )}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: track.adsr.decayTime,
              min: 0,
              max: CONFIG.MAX_DECAY_TIME,
              step: 0.05,
              onChange: getAdsrFieldHandler("decayTime", Number),
            },
            key: "adsr.decayTime",
          })}
        </div>
        <div class="${s.label}">
          <p>Sustain time (${String(track.adsr.sustainTime)}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: track.adsr.sustainTime,
              min: 0,
              max: CONFIG.MAX_SUSTAIN_TIME,
              step: 0.05,
              onChange: getAdsrFieldHandler("sustainTime", Number),
            },
            key: "adsr.sustainTime",
          })}
        </div>
        <div>
          <p class="${s.label}">Sustain level (${(
    track.adsr.sustainLevel * 100
  ).toFixed(0)}%):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: track.adsr.sustainLevel,
              min: 0,
              max: 1,
              step: 0.05,
              onChange: getAdsrFieldHandler("sustainLevel", Number),
            },
            key: "adsr.sustainLevel",
          })}
        </div>
        <div>
          <p class="${s.label}">Release time (${String(
    track.adsr.releaseTime
  )}s):</p>
          ${child(Input, {
            props: {
              disabled,
              type: "range",
              value: track.adsr.releaseTime,
              min: 0,
              max: 1,
              step: CONFIG.MAX_RELEASE_TIME,
              onChange: getAdsrFieldHandler("releaseTime", Number),
            },
            key: "adsr.releaseTime",
          })}
        </div>
      </div>
  </div>`;
};
