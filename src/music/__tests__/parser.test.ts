import { parseSequence } from "../parser";

describe("Music string parser", () => {
  it("should parse sequence properly", () => {
    let sequence = `D3/8 D3/8 A#3/8. A3/16 G3/8 G3/4.
                    A#3/8 A#3/8 C4/8 A#3/8 A3/4. A3/8
                    A3/8 A3/8 A3/8 A3/8 D4/8 C4/8 A#3/8 A3/8
                    A#3/4 A#3/8. A#3/16 D4/8 A#3/8`;
    const parsed = parseSequence(sequence);
    expect(parsed).toMatchObject([
      { frequency: 146.83, duration: { value: 8, prolonged: false } },
      { frequency: 146.83, duration: { value: 8, prolonged: false } },
      { frequency: 233.08, duration: { value: 8, prolonged: true } },
      { frequency: 220, duration: { value: 16, prolonged: false } },
      { frequency: 196, duration: { value: 8, prolonged: false } },
      { frequency: 196, duration: { value: 4, prolonged: true } },
      { frequency: 233.08, duration: { value: 8, prolonged: false } },
      { frequency: 233.08, duration: { value: 8, prolonged: false } },
      { frequency: 261.63, duration: { value: 8, prolonged: false } },
      { frequency: 233.08, duration: { value: 8, prolonged: false } },
      { frequency: 220, duration: { value: 4, prolonged: true } },
      { frequency: 220, duration: { value: 8, prolonged: false } },
      { frequency: 220, duration: { value: 8, prolonged: false } },
      { frequency: 220, duration: { value: 8, prolonged: false } },
      { frequency: 220, duration: { value: 8, prolonged: false } },
      { frequency: 220, duration: { value: 8, prolonged: false } },
      { frequency: 293.66, duration: { value: 8, prolonged: false } },
      { frequency: 261.63, duration: { value: 8, prolonged: false } },
      { frequency: 233.08, duration: { value: 8, prolonged: false } },
      { frequency: 220, duration: { value: 8, prolonged: false } },
      { frequency: 233.08, duration: { value: 4, prolonged: false } },
      { frequency: 233.08, duration: { value: 8, prolonged: true } },
      { frequency: 233.08, duration: { value: 16, prolonged: false } },
      { frequency: 293.66, duration: { value: 8, prolonged: false } },
      { frequency: 233.08, duration: { value: 8, prolonged: false } },
    ]);
  });

  it("should support pauses", () => {
    let sequence = `D3/8 _/2`;
    const parsed = parseSequence(sequence);
    expect(parsed).toMatchObject([
      { frequency: 146.83, duration: { value: 8, prolonged: false } },
      { frequency: undefined, duration: { value: 2, prolonged: false } },
    ]);
  });

  it("should fail on invalid input", () => {
    let sequence = `D3/8 (.)_(.)`;
    expect(() => parseSequence(sequence)).toThrowError();
  });
});
