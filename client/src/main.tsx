import React, { useState } from 'react';
import { XorO } from './types';
import { getWinner, isDraw, emptyBoard, playMove } from './utils';

const CELL_SIZES: [number, string][] = [
  [5, 'w-14 h-14 text-2xl'],
  [8, 'w-10 h-10 text-xl'],
  [11, 'w-8 h-8 text-base'],
];

const getCellSize = (size: number) =>
  CELL_SIZES.find(([max]) => size <= max)?.[1] ?? 'w-6 h-6 text-sm';

const getStatusMessage = (
  winner: XorO | undefined,
  draw: boolean,
  player: XorO,
) => (winner ? `${winner} wins!` : draw ? "It's a draw!" : `${player}'s turn`);

export const Main = () => {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [board, setBoard] = useState<(XorO | undefined)[][]>(emptyBoard(3));
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X');
  const winner = getWinner(board);
  const draw = isDraw(board);

  const resetGame = (size = boardSize) => {
    setBoardSize(size);
    setBoard(emptyBoard(size));
    setCurrentPlayer('X');
  };

  const play = (row: number, col: number) => {
    if (board[row][col] || winner) return;
    setBoard(playMove(board, row, col, currentPlayer));
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  return (
    <div className="flex flex-col mt-10 items-center gap-6">
      <div className="font-bold text-2xl">Tic Tac Toe</div>
      <div className="flex flex-col items-center gap-2">
        <label htmlFor="board-size" className="text-sm font-semibold">
          Board Size: {boardSize} × {boardSize}
        </label>
        <input
          id="board-size"
          type="range"
          min={3}
          max={15}
          value={boardSize}
          onChange={(e) => resetGame(Number(e.target.value))}
          className="w-48 cursor-pointer"
        />
      </div>
      <div className="text-lg font-semibold">
        {getStatusMessage(winner, draw, currentPlayer)}
      </div>
      <div className="flex flex-col gap-1">
        {board.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((cell, ci) => (
              <div
                key={ci}
                onClick={() => play(ri, ci)}
                className={`border-2 border-gray-900 cursor-pointer items-center justify-center font-bold flex hover:bg-gray-100 ${getCellSize(boardSize)}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {(winner || draw) && (
        <button
          onClick={() => resetGame()}
          className="px-4 py-2 bg-gray-900 text-white rounded font-semibold hover:bg-gray-700"
        >
          New Game
        </button>
      )}
    </div>
  );
};
