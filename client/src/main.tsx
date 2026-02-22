import React, { useState, useEffect } from 'react';
import { PlayerStats, XorO } from './types';
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

const PLAYER_NAMES: Record<XorO, string> = { X: 'Player X', O: 'Player O' };

const fetchStats = async (): Promise<PlayerStats[]> => {
  try {
    const res = await fetch('/api/stats');
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return [];
  }
};

export const Main = () => {
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState(emptyBoard(3));
  const [currentPlayer, setCurrentPlayer] = useState<XorO>('X');
  const [stats, setStats] = useState<PlayerStats[]>([]);

  const winner = getWinner(board);
  const draw = isDraw(board);
  const gameOver = !!winner || draw;

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  const saveGame = async (result: { winner: XorO | null }) => {
    try {
      await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardSize,
          status: result.winner ? 'win' : 'draw',
          winner: result.winner ? PLAYER_NAMES[result.winner] : null,
          players: { X: PLAYER_NAMES.X, O: PLAYER_NAMES.O },
        }),
      });
      fetchStats().then(setStats);
    } catch (err) {
      console.error('Failed to save game:', err);
    }
  };

  const resetGame = (size = boardSize) => {
    setBoardSize(size);
    setBoard(emptyBoard(size));
    setCurrentPlayer('X');
  };

  const play = (row: number, col: number) => {
    if (board[row][col] || winner) return;
    const newBoard = playMove(board, row, col, currentPlayer);
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    const newWinner = getWinner(newBoard);
    if (newWinner || isDraw(newBoard)) {
      saveGame({ winner: newWinner ?? null });
    }
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
      {gameOver && (
        <button
          onClick={() => resetGame()}
          className="px-4 py-2 bg-gray-900 text-white rounded font-semibold hover:bg-gray-700"
        >
          New Game
        </button>
      )}

      {stats.length > 0 && (
        <div className="mt-4 w-80">
          <h2 className="text-lg font-bold text-center mb-3">Player Stats</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="text-left p-2">Player</th>
                <th className="stat-cell">Wins</th>
                <th className="stat-cell">Losses</th>
                <th className="stat-cell">Draws</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((player) => (
                <tr key={player.name} className="border-b border-gray-300">
                  <td className="p-2 font-medium">{player.name}</td>
                  <td className="stat-cell text-green-600">{player.wins}</td>
                  <td className="stat-cell text-red-600">{player.losses}</td>
                  <td className="stat-cell text-gray-500">{player.draws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
