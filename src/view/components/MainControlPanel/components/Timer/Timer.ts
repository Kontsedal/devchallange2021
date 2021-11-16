import { Component } from "renderer/renderer";
import { formatTime } from "utils/time";
import s from "./Timer.module.scss";

export const Timer: Component<{
  duration: number;
  audioContext: AudioContext | undefined;
  onStop: () => unknown;
}> = ({ duration, audioContext, onStop }, { effect, state }) => {
  const [currentTime, setCurrentTime] = state(0);
  effect(() => {
    if (!audioContext) {
      return setCurrentTime(0);
    }
    let interval = setInterval(() => {
      if (audioContext.currentTime >= duration) {
        onStop();
        clearInterval(interval);
        return;
      }
      setCurrentTime(audioContext.currentTime);
    }, 300);
    return () => clearInterval(interval);
  }, [audioContext, duration]);
  return `<div class="${s.timer}">${formatTime(currentTime)} / ${formatTime(
    duration
  )}</div>`;
};
