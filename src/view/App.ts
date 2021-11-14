import { Component } from "../renderer/renderer";
import s from "./App.module.scss";
import { Button } from "./components/Button/Button";
import { TrackControls } from "./components/TrackControls/TrackControls";
import { Track } from "../music/Track";
import { getId } from "../utils/id";

enum PLAY_STATES {
  IDLE = "idle",
  PLAYING = "playing",
  PAUSED = "paused",
}
export const App: Component<{}> = (
  _,
  { template, child, state, memo, ref }
) => {
  const [playState, setPlayState] = state(PLAY_STATES.IDLE);
  const [tracks, setTracks] = state<{ id: string; instance: Track }[]>([]);
  const audioContext = ref<AudioContext | undefined>(undefined);
  const handlePlay = memo(
    () => () => {
      if (playState === PLAY_STATES.PAUSED) {
        audioContext.current?.resume();
      }
      if (playState === PLAY_STATES.IDLE) {
        const context = new AudioContext();
        context.onstatechange = function () {
          if (context.state == "running") {
            setPlayState(() => PLAY_STATES.PLAYING);
          }
          if (context.state == "suspended") {
            setPlayState(() => PLAY_STATES.PAUSED);
          }
        };
        audioContext.current = context;
        tracks.forEach((track) => track.instance.play(context));
      }
    },
    [tracks, playState]
  );
  const handlePause = memo(
    () => () => {
      setPlayState(() => PLAY_STATES.PAUSED);
      audioContext.current?.suspend();
    },
    []
  );
  const handleStop = memo(
    () => () => {
      setPlayState(() => PLAY_STATES.IDLE);
      audioContext.current?.close();
      audioContext.current = undefined;
    },
    []
  );
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
      <div class="${s.controls}">
        ${
          playState === PLAY_STATES.IDLE || playState === PLAY_STATES.PAUSED
            ? child(Button, {
                props: { text: "Play", onClick: handlePlay },
                dependencies: [handlePlay],
                key: "play",
              })
            : ""
        }
        ${
          playState === PLAY_STATES.PLAYING
            ? child(Button, {
                props: { text: "Pause", onClick: handlePause },
                dependencies: [],
                key: "pause",
              })
            : ""
        }
        ${
          playState === PLAY_STATES.PLAYING || playState === PLAY_STATES.PAUSED
            ? child(Button, {
                props: { text: "Stop", onClick: handleStop },
                dependencies: [],
                key: "stop",
              })
            : ""
        }
      </div>
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
    <div>E4/4 E4/4 E4/4 D#4/8. A#4/16 E4/4 D#4/8. A#4/16 E4/2
D5/4 D5/4 D5/4 D#5/8. A#4/16 F#4/4 D#4/8. A#4/16 E4/2</div> 

<div>D3/8 D3/8 A#3/8. A3/16 G3/8 G3/4.
A#3/8 A#3/8 C4/8 A#3/8 A3/4. A3/8
A3/8 A3/8 A3/8 A3/8 D4/8 C4/8 A#3/8 A3/8
A#3/4 A#3/8. A#3/16 D4/8 A#3/8</div>
  </div>`;
};
