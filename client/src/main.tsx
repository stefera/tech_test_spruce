import React, { useState } from 'react';
import { XorO } from './types';
import { getWinner, isDraw, emptyBoard, playMove } from './utils';

export const Main = () => {
  const [board, setBoard] = useState<(XorO | undefined)[][]>(emptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X');
  const winner = getWinner(board);
  const draw = isDraw(board);

  const play = (row: number, col: number) => {
    if (board[row][col] || winner) return;
    setBoard(playMove(board, row, col, currentPlayer));
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(emptyBoard());
    setCurrentPlayer('X');
  };

  return (
    <div className="flex flex-col mt-10 items-center gap-6">
      <div className="font-bold text-2xl">Tic Tac Toe</div>
      <div className="text-lg font-semibold">
        {winner
          ? `${winner} wins!`
          : draw
            ? "It's a draw!"
            : `${currentPlayer}'s turn`}
      </div>
      <div className="flex flex-col gap-1">
        {board.map((row, ri) => (
          <div key={ri} className="flex gap-1">
            {row.map((cell, ci) => (
              <div
                key={ci}
                onClick={() => play(ri, ci)}
                className="border-2 border-gray-900 w-14 h-14 cursor-pointer items-center justify-center text-2xl font-bold flex hover:bg-gray-100"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {(winner || draw) && (
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-900 text-white rounded font-semibold hover:bg-gray-700"
        >
          New Game
        </button>
      )}
    </div>
  );
};
