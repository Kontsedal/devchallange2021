const addLeadingZero = (value: string | number): string => {
  if (Number(value) < 10) {
    return `0${value}`;
  }
  return String(value);
};

const parseSeconds = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return { minutes, seconds };
};

export const formatTime = (seconds: number) => {
  let parsed = parseSeconds(seconds);

  return `${addLeadingZero(parsed.minutes)}:${addLeadingZero(parsed.seconds)}`;
};
