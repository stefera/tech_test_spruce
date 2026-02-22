import {
  getWinner,
  isDraw,
  emptyBoard,
  playMove,
  getWinningLines,
} from './utils';
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

  it('creates a 5x5 board of undefined values', () => {
    const board = emptyBoard(5);
    expect(board).toHaveLength(5);
    board.forEach((row) => {
      expect(row).toHaveLength(5);
      row.forEach((cell) => expect(cell).toBeUndefined());
    });
  });

  it('creates a 15x15 board of undefined values', () => {
    const board = emptyBoard(15);
    expect(board).toHaveLength(15);
    board.forEach((row) => {
      expect(row).toHaveLength(15);
      row.forEach((cell) => expect(cell).toBeUndefined());
    });
  });
});

describe('getWinningLines', () => {
  it('generates correct number of lines for size 3', () => {
    const lines = getWinningLines(3);
    // 3 rows + 3 columns + 2 diagonals = 8
    expect(lines).toHaveLength(8);
  });

  it('generates correct number of lines for size 5', () => {
    const lines = getWinningLines(5);
    // 5 rows + 5 columns + 2 diagonals = 12
    expect(lines).toHaveLength(12);
  });

  it('each line has length equal to the board size', () => {
    const size = 4;
    const lines = getWinningLines(size);
    lines.forEach((line) => {
      expect(line).toHaveLength(size);
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

  it('detects a row win on a 5x5 board', () => {
    const board = emptyBoard(5);
    for (let c = 0; c < 5; c++) {
      board[0][c] = 'X';
    }
    expect(getWinner(board)).toBe('X');
  });

  it('detects a diagonal win on a 4x4 board', () => {
    const board = emptyBoard(4);
    for (let i = 0; i < 4; i++) {
      board[i][i] = 'O';
    }
    expect(getWinner(board)).toBe('O');
  });

  it('returns undefined for an incomplete row on a 5x5 board', () => {
    const board = emptyBoard(5);
    for (let c = 0; c < 4; c++) {
      board[0][c] = 'X';
    }
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
