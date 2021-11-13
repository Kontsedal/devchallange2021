import { initializeBasicInstrument } from "./basic";
import { initializeBassInstrument } from "./bass";
import { initializeOrganInstrument } from "./organ";

export enum INSTRUMENT {
  BASIC = "basic",
  BASS = "bass",
  ORGAN = "organ",
}

export const getInstrument = (instrumentName: INSTRUMENT) => {
  switch (instrumentName) {
    case INSTRUMENT.BASIC:
      return initializeBasicInstrument;
    case INSTRUMENT.BASS:
      return initializeBassInstrument;
    case INSTRUMENT.ORGAN:
      return initializeOrganInstrument;
    default:
      throw new Error("Unsupported instrument");
  }
};
