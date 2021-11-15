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
  { memo, ref, template, child, state }
) => {
  const audioContext = ref<AudioContext | undefined>(undefined);
  const [duration, setDuration] = state(0);
  const [currentTime, setCurrentTime] = state(0);
  const timeInterval = ref(0);
  const trackPlayTime = (context: AudioContext) => {
    let duration = Math.max(
      ...tracks.map((track) => track.instance.getDuration())
    );
    setDuration(duration);
    timeInterval.current = setInterval(() => {
      setCurrentTime(context.currentTime);
      if (context.currentTime >= duration) {
        handleStop();
        clearInterval(timeInterval.current);
      }
    }, 300);
  };
  const handlePlay = memo(
    () => () => {
      const canPlay = tracks.some((track) => track.instance.getMelody().length);
      if (!canPlay) {
        return alert("There is nothing to play");
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
        trackPlayTime(context);
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

  return template`<div>

  <div class="${s.controls}">
        ${
          playState === PLAY_STATE.IDLE || playState === PLAY_STATE.PAUSED
            ? child(Button, {
                props: {
                  text: `<img alt="play" src="${playIcon}"/>`,
                  onClick: handlePlay,
                  className: s.playButton,
                },
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
                key: "stop",
              })
            : ""
        }
      </div>
      <div style="visibility: ${
        playState === PLAY_STATE.IDLE ? "hidden" : "visible"
      }">${currentTime.toFixed(0)}/${duration.toFixed(0)}</div>
</div>`;
};
