import { Component } from "renderer/renderer";
import { TrackData } from "music/types";
import s from "./AdsrChart.module.scss";
import { getId } from "utils/id";
import { classNames as cn } from "renderer/utils";

export const AdsrChart: Component<{ track: TrackData }> = (
  { track },
  { effect, state, ref }
) => {
  const [width, setWidth] = state(100);
  const chartId = ref("js-chart" + getId());
  const height = 150;
  const totalTime =
    track.adsr.attackTime +
    track.adsr.decayTime +
    track.adsr.sustainTime +
    track.adsr.releaseTime;
  const getX = (value: number) => (value / totalTime) * width;
  const getY = (value: number) => height - height * value;
  effect(() => {
    function calculateWidth() {
      const element = document.querySelector(
        "." + chartId.current
      ) as HTMLDivElement;
      let width = element?.getBoundingClientRect().width;
      if (width) {
        setWidth(width);
      }
    }
    window.addEventListener("resize", calculateWidth);
    calculateWidth();
    return () => window.removeEventListener("resize", calculateWidth);
  }, []);
  const chartData = [
    [getX(track.adsr.attackTime), getY(track.volume)],
    [
      getX(track.adsr.attackTime + track.adsr.decayTime),
      getY(track.adsr.sustainLevel * track.volume),
    ],
    [
      getX(
        track.adsr.attackTime + track.adsr.decayTime + track.adsr.sustainTime
      ),
      getY(track.adsr.sustainLevel * track.volume),
    ],
    [
      getX(
        track.adsr.attackTime +
          track.adsr.decayTime +
          track.adsr.sustainTime +
          track.adsr.releaseTime
      ),
      getY(0),
    ],
  ];
  const pathString = chartData.reduce((result, [x, y]) => {
    return result + ` L${x} ${y}`;
  }, `M${getX(0)} ${getY(0)}`);
  return `<div class="${s.wrapper}">
    <p class="${s.time}">Time</p>
    <p class="${s.volume}">Volume</p>
    <p class="${s.timeValue}">${totalTime.toFixed(0)}s</p>
    <svg height="${height}" class="${cn(s.svg, chartId.current)}">
      <path d="${pathString}"/>
    </svg>
  </div>`;
};
