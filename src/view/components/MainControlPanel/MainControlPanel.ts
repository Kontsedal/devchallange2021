import { Component } from "renderer/renderer";
import { getTrackDuration, playTrack } from "music/track";
import { PLAY_STATE } from "../../constants";
import { Button } from "../Button/Button";
import s from "./MainControlPanel.module.scss";
import playIcon from "./assets/play.svg";
import pauseIcon from "./assets/pause.svg";
import stopIcon from "./assets/stop.svg";
import { TrackData } from "../../../music/types";
import { formatTime } from "../../../utils/time";

type Props = {
  tracks: { id: string; trackData: TrackData }[];
  onChangePlayState: (value: PLAY_STATE) => unknown;
  playState: PLAY_STATE;
};
export const MainControlPanel: Component<Props> = (
  { playState, onChangePlayState, tracks },
  { memo, ref, template, child, state }
) => {
  const audioContext = ref<AudioContext | undefined>(undefined);
  const duration = memo(() => {
    return Math.max(
      0,
      ...tracks.map((track) => getTrackDuration(track.trackData))
    );
  }, [tracks]);
  const [currentTime, setCurrentTime] = state(0);
  const timeInterval = ref(0);
  const trackPlayTime = (context: AudioContext) => {
    timeInterval.current = setInterval(() => {
      setCurrentTime(context.currentTime);
      if (context.currentTime >= duration) {
        handleStop();
      }
    }, 300);
  };
  const handlePlay = memo(
    () => () => {
      const canPlay = tracks.some((track) => track.trackData.melody.length);
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
        tracks.forEach((track) => playTrack(track.trackData, context));
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
      clearInterval(timeInterval.current);
      setCurrentTime(0);
      audioContext.current?.close();
      audioContext.current = undefined;
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
      <div class="${s.duration}" >${formatTime(currentTime)} / ${formatTime(
    duration
  )}</div>
</div>`;
};
