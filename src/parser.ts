export const parseSequence = (input: string) => {
  let normalizedInput = input.trim().replace(/\s+/gim, " ");
  let entries = normalizedInput.split(" ");
  return entries.map((entry) => {
    let [note, duration] = entry.split("/");
    return {
      note: note,
      duration: {
        value: Number(duration.replace(".", "")),
        prolonged: /^\d+\.$/.test(duration),
      },
    };
  });
};
