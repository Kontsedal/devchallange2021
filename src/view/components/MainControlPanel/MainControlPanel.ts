import { Component } from "renderer/renderer";
import { getTrackDuration, playTrack } from "music/track";
import { PLAY_STATE } from "../../constants";
import { Button } from "../Button/Button";
import s from "./MainControlPanel.module.scss";
import playIcon from "./assets/play.svg";
import pauseIcon from "./assets/pause.svg";
import stopIcon from "./assets/stop.svg";
import { TrackData } from "music/types";
import { Timer } from "./components/Timer/Timer";

type Props = {
  tracks: { id: string; trackData: TrackData }[];
  onChangePlayState: (value: PLAY_STATE) => unknown;
  playState: PLAY_STATE;
};
export const MainControlPanel: Component<Props> = (
  { playState, onChangePlayState, tracks },
  { memo, ref, template, child, state }
) => {
  const [audioContext, setAudioContext] = state<AudioContext | undefined>(
    undefined
  );
  const duration = memo(() => {
    return Math.max(
      0,
      ...tracks.map((track) => getTrackDuration(track.trackData))
    );
  }, [tracks]);
  const timeInterval = ref(0);
  const handleStop = memo(
    () => () => {
      onChangePlayState(PLAY_STATE.IDLE);
      clearInterval(timeInterval.current);
      audioContext?.close();
      setAudioContext(undefined);
    },
    []
  );
  const handlePlay = memo(
    () => () => {
      const canPlay = tracks.some((track) => track.trackData.melody.length);
      if (!canPlay) {
        return;
      }
      if (playState === PLAY_STATE.PAUSED) {
        audioContext?.resume();
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
        setAudioContext(context);
        tracks.forEach((track) => playTrack(track.trackData, context));
      }
    },
    [tracks, playState]
  );
  const handlePause = memo(
    () => () => {
      onChangePlayState(PLAY_STATE.PAUSED);
      audioContext?.suspend();
    },
    []
  );

  return template`<div class="${s.panel}">

  <div class="${s.controls}">
        ${
          playState === PLAY_STATE.IDLE || playState === PLAY_STATE.PAUSED
            ? child(Button, {
                props: {
                  text: `<img alt="play" src="${playIcon}"/>`,
                  onClick: handlePlay,
                  disabled: duration === 0,
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
      ${child(Timer, {
        props: { duration, audioContext, onStop: handleStop },
        key: "timer",
      })}
     </div>
</div>`;
};
