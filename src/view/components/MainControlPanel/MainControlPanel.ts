import { Component } from "renderer/renderer";
import { Track } from "music/Track";
import { PLAY_STATE } from "../../constants";
import { Button } from "../Button/Button";
import s from "./MainControlPanel.module.scss";
import playIcon from "./assets/play.svg";
import pauseIcon from "./assets/pause.svg";
import stopIcon from "./assets/stop.svg";

type Props = {
  tracks: { id: string; instance: Track }[];
  onChangePlayState: (value: PLAY_STATE) => unknown;
  playState: PLAY_STATE;
};
export const MainControlPanel: Component<Props> = (
  { playState, onChangePlayState, tracks },
  { memo, ref, template, child }
) => {
  const audioContext = ref<AudioContext | undefined>(undefined);
  const handlePlay = memo(
    () => () => {
      const canPlay = tracks.some((track) => track.instance.getMelody().length);
      if (!canPlay) {
        return;
      }
      if (playState === PLAY_STATE.PAUSED) {
        audioContext.current?.resume();
      }
      if (playState === PLAY_STATE.IDLE) {
        const context = new AudioContext();
        context.onstatechange = function () {
          if (context.state == "running") {
            onChangePlayState(PLAY_STATE.PLAYING);
          }
          if (context.state == "suspended") {
            onChangePlayState(PLAY_STATE.PAUSED);
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
      onChangePlayState(PLAY_STATE.PAUSED);
      audioContext.current?.suspend();
    },
    []
  );
  const handleStop = memo(
    () => () => {
      onChangePlayState(PLAY_STATE.IDLE);
      audioContext.current?.close();
      audioContext.current = undefined;
    },
    []
  );

  return template`<div class="${s.controls}">
        ${
          playState === PLAY_STATE.IDLE || playState === PLAY_STATE.PAUSED
            ? child(Button, {
                props: {
                  text: `<img alt="play" src="${playIcon}"/>`,
                  onClick: handlePlay,
                  className: s.playButton,
                },
                dependencies: [handlePlay],
                key: "play",
              })
            : ""
        }
        ${
          playState === PLAY_STATE.PLAYING
            ? child(Button, {
                props: {
                  text: `<img alt="pause" src="${pauseIcon}"/>`,
                  onClick: handlePause,
                  className: s.playButton,
                },
                dependencies: [],
                key: "pause",
              })
            : ""
        }
        ${
          playState === PLAY_STATE.PLAYING || playState === PLAY_STATE.PAUSED
            ? child(Button, {
                props: {
                  className: s.stopButton,
                  text: `<img alt="stop" src="${stopIcon}"/>`,
                  onClick: handleStop,
                },
                dependencies: [],
                key: "stop",
              })
            : ""
        }
      </div>`;
};
