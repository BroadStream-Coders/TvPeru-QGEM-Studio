export type BoardSize = "4x3" | "5x4" | "6x5";

export interface BoardData {
  id: string;
  size: BoardSize;
  logoPositions: number[];
}
