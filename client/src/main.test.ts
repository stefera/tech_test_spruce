import { getWinner, isDraw, emptyBoard, playMove } from './utils';
import { Board } from './types';

describe('emptyBoard', () => {
  it('creates a 3x3 board of undefined values', () => {
    const board = emptyBoard();
    expect(board).toHaveLength(3);
    board.forEach((row) => {
      expect(row).toHaveLength(3);
      row.forEach((cell) => expect(cell).toBeUndefined());
    });
  });
});

describe('playMove', () => {
  it('places a mark at the given position', () => {
    const board = emptyBoard();
    const result = playMove(board, 1, 2, 'X');
    expect(result[1][2]).toBe('X');
  });

  it('does not mutate the original board', () => {
    const board = emptyBoard();
    playMove(board, 0, 0, 'O');
    expect(board[0][0]).toBeUndefined();
  });
});

describe('getWinner', () => {
  it('returns undefined for an empty board', () => {
    expect(getWinner(emptyBoard())).toBeUndefined();
  });

  it('detects a row win', () => {
    const board: Board = [
      ['X', 'X', 'X'],
      [undefined, 'O', undefined],
      [undefined, undefined, 'O'],
    ];
    expect(getWinner(board)).toBe('X');
  });

  it('detects a column win', () => {
    const board: Board = [
      ['O', 'X', undefined],
      ['O', 'X', undefined],
      ['O', undefined, undefined],
    ];
    expect(getWinner(board)).toBe('O');
  });

  it('detects a diagonal win (top-left to bottom-right)', () => {
    const board: Board = [
      ['X', 'O', undefined],
      [undefined, 'X', 'O'],
      [undefined, undefined, 'X'],
    ];
    expect(getWinner(board)).toBe('X');
  });

  it('detects a diagonal win (top-right to bottom-left)', () => {
    const board: Board = [
      [undefined, undefined, 'O'],
      ['X', 'O', undefined],
      ['O', 'X', undefined],
    ];
    expect(getWinner(board)).toBe('O');
  });

  it('returns undefined when no winner yet', () => {
    const board: Board = [
      ['X', 'O', undefined],
      [undefined, 'X', undefined],
      [undefined, undefined, undefined],
    ];
    expect(getWinner(board)).toBeUndefined();
  });
});

describe('isDraw', () => {
  it('returns false for an empty board', () => {
    expect(isDraw(emptyBoard())).toBe(false);
  });

  it('returns false when there is a winner', () => {
    const board: Board = [
      ['X', 'X', 'X'],
      ['O', 'O', undefined],
      [undefined, undefined, undefined],
    ];
    expect(isDraw(board)).toBe(false);
  });

  it('returns true when the board is full with no winner', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    expect(isDraw(board)).toBe(true);
  });

  it('returns false when the board is not full and no winner', () => {
    const board: Board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', undefined],
    ];
    expect(isDraw(board)).toBe(false);
  });
});
