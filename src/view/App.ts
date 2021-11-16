import { Component } from "../renderer/renderer";
import s from "./App.module.scss";
import { Button } from "./components/Button/Button";
import { TrackControls } from "./components/TrackControls/TrackControls";
import { getId } from "../utils/id";
import { PLAY_STATE } from "./constants";
import { MainControlPanel } from "./components/MainControlPanel/MainControlPanel";
import { TrackData } from "../music/types";
import { createTrackData } from "../music/track";

export const App: Component<{}> = (_, { template, child, state, memo }) => {
  const [playState, setPlayState] = state(PLAY_STATE.IDLE);
  const [tracks, setTracks] = state<{ id: string; trackData: TrackData }[]>([]);
  const addTrack = memo(
    () => () => {
      setTracks((tracks) => [
        ...tracks,
        { id: getId(), trackData: createTrackData() },
      ]);
    },
    []
  );
  const disableControls = playState !== PLAY_STATE.IDLE;
  return template`<div class="${s.root}">
     ${child(MainControlPanel, {
       props: {
         tracks,
         onChangePlayState: setPlayState,
         playState,
       },
       key: "controls",
     })}
    <div class="${s.container}">
      <div class="${s.tracks}">
          ${tracks.map((track) => {
            return child(TrackControls, {
              key: "track-" + track.id,
              props: {
                track: track.trackData,
                disabled: disableControls,
                onClose: () => {
                  setTracks(tracks.filter((item) => item.id !== track.id));
                },
                onTrackChange: (newTrack: TrackData) =>
                  setTracks((tracks) =>
                    tracks.map((oldTrack) => {
                      if (oldTrack.id === track.id) {
                        return { id: track.id, trackData: newTrack };
                      }
                      return oldTrack;
                    })
                  ),
              },
            });
          })}
        </div>
       ${child(Button, {
         props: {
           onClick: addTrack,
           text: "Add a new track",
           className: s.addButton,
           disabled: disableControls,
         },
         key: "add-track",
       })}
    </div>
</div>`;
};
