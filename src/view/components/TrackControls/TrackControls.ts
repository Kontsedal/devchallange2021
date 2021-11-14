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
  const [melody, setMelody] = state<SoundData[]>(track.getMelody());
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
  </div>`;
};
