import { initializeBassInstrument } from "./bass";
import { initializeOrganInstrument } from "./organ";
import { initializeSmoothInstrument } from "./smooth";

export enum INSTRUMENT {
  BASS = "bass",
  ORGAN = "organ",
  SMOOTH = "smooth",
}

export const getInstrument = (instrumentName: INSTRUMENT) => {
  switch (instrumentName) {
    case INSTRUMENT.BASS:
      return initializeBassInstrument;
    case INSTRUMENT.ORGAN:
      return initializeOrganInstrument;
    case INSTRUMENT.SMOOTH:
      return initializeSmoothInstrument;
    default:
      throw new Error("Unsupported instrument");
  }
};
