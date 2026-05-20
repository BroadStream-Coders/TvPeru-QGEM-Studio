export type BoardSize = "4x3" | "5x4" | "6x5";

export const VALID_BOARD_SIZES: BoardSize[] = ["4x3", "5x4", "6x5"];

export function isValidBoardSize(size: unknown): size is BoardSize {
  return VALID_BOARD_SIZES.includes(size as BoardSize);
}

export interface BoardData {
  id: string;
  size: BoardSize;
  logoPositions: number[];
}
