import { Component } from "renderer/renderer";
import s from "./TrackControls.module.scss";
import { Track } from "music/Track";
import { Input } from "../Input/Input";
import { parseSequence } from "../../../music/parser";
import { Button } from "../Button/Button";

export const TrackControls: Component<{ track: Track }> = (
  { track },
  { template, child, state, effect }
) => {
  const [trackString, setTrackString] = state("");
  effect(() => {
    if (!trackString) {
      return;
    }
    track.setMelody(parseSequence(trackString));
  }, [trackString]);
  console.log({ trackString });
  return template`<div class="${s.track}">
      ${child(Input, {
        props: {
          value: trackString,
          onChange: (newValue) => setTrackString(() => newValue),
        },
        dependencies: [trackString],
        key: "trackInput",
      })}
      ${child(Button, {
        props: {
          onClick: () => track.play(),
          text: "Play",
        },
        dependencies: [],
        key: "play",
      })}
  </div>`;
};
