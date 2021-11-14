import { Component } from "../renderer/renderer";
import s from "./App.module.scss";
import { Button } from "./components/Button/Button";
import { TrackControls } from "./components/TrackControls/TrackControls";
import { Track } from "../music/Track";
import { getId } from "../utils/id";

export const App: Component<{}> = (_, { template, child, state, memo }) => {
  const [tracks, setTracks] = state<{ id: string; instance: Track }[]>([]);
  const addTrack = memo(
    () => () => {
      setTracks((tracks) => [
        ...tracks,
        { id: getId(), instance: new Track({}) },
      ]);
    },
    []
  );
  return template`<div class="${s.root}">
    
    <div class="${s.container}">
      <div class="${s.tracks}">
        ${tracks.map((track) =>
          child(TrackControls, {
            dependencies: [],
            key: track.id,
            props: { track: track.instance },
          })
        )}
      </div>
      ${child(Button, {
        props: { onClick: addTrack, text: "Add a new track" },
        key: "add-track",
        dependencies: [],
      })}
    </div>
  </div>`;
};
