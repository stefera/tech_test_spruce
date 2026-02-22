import { XorO, Board } from './types';

export const getWinningLines = (size: number): number[][][] => {
  const lines: number[][][] = [];

  for (let r = 0; r < size; r++) {
    const line: number[][] = [];
    for (let c = 0; c < size; c++) {
      line.push([r, c]);
    }
    lines.push(line);
  }

  for (let c = 0; c < size; c++) {
    const line: number[][] = [];
    for (let r = 0; r < size; r++) {
      line.push([r, c]);
    }
    lines.push(line);
  }

  const diag1: number[][] = [];
  for (let i = 0; i < size; i++) {
    diag1.push([i, i]);
  }
  lines.push(diag1);

  const diag2: number[][] = [];
  for (let i = 0; i < size; i++) {
    diag2.push([i, size - 1 - i]);
  }
  lines.push(diag2);

  return lines;
};

export const getWinner = (board: Board): XorO | undefined => {
  const size = board.length;
  const lines = getWinningLines(size);
  return lines
    .map((line) => line.map(([r, c]) => board[r][c]))
    .find((cells) => cells[0] && cells.every((cell) => cell === cells[0]))?.[0];
};

export const isDraw = (board: Board): boolean =>
  !getWinner(board) && board.flat().every(Boolean);

export const emptyBoard = (size: number = 3): Board =>
  Array.from({ length: size }, () => Array(size).fill(undefined));

export const playMove = (
  board: Board,
  row: number,
  col: number,
  player: XorO,
): Board =>
  board.map((r, ri) =>
    r.map((c, ci) => (ri === row && ci === col ? player : c)),
  );
