import { XorO, Board } from './types';

export const WINNING_LINES = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

export const getWinner = (board: Board): XorO | undefined =>
  WINNING_LINES.map((line) => line.map(([r, c]) => board[r][c])).find(
    ([a, b, c]) => a && a === b && a === c,
  )?.[0];

export const isDraw = (board: Board): boolean =>
  !getWinner(board) && board.flat().every(Boolean);

export const emptyBoard = (): Board =>
  Array.from({ length: 3 }, () => Array(3).fill(undefined));

export const playMove = (
  board: Board,
  row: number,
  col: number,
  player: XorO,
): Board =>
  board.map((r, ri) =>
    r.map((c, ci) => (ri === row && ci === col ? player : c)),
  );
