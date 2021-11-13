import { NOTE_FREQUENCY } from "./constants";

export const parseSequence = (input: string) => {
  let normalizedInput = input.trim().replace(/\s+/gim, " ");
  let entries = normalizedInput.split(" ");
  return entries.map((entry) => {
    let [note, duration] = entry.split("/");
    return {
      frequency: NOTE_FREQUENCY[note as keyof typeof NOTE_FREQUENCY],
      duration: {
        value: Number(duration.replace(".", "")),
        prolonged: /^\d+\.$/.test(duration),
      },
    };
  });
};
