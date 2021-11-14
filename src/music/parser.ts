import { NOTE_FREQUENCY } from "./constants";

export const parseSequence = (input: string) => {
  let normalizedInput = input.trim().replace(/\s+/gim, " ");
  let entries = normalizedInput.split(" ");
  const PAUSE = "_";
  const knownValues = [...Object.keys(NOTE_FREQUENCY), PAUSE];
  return entries.map((entry) => {
    let [note, duration] = entry.split("/");
    if (!note || !knownValues.includes(note) || !/^\d+\.?$/.test(duration)) {
      throw new Error("Invalid input");
    }
    const frequency =
      note === PAUSE
        ? undefined
        : NOTE_FREQUENCY[note as keyof typeof NOTE_FREQUENCY];
    return {
      frequency: frequency,
      duration: {
        value: Number(duration.replace(".", "")),
        prolonged: /^\d+\.$/.test(duration),
      },
    };
  });
};
