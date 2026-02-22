import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'tictactoe.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    UNIQUE NOT NULL,
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS games (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    board_size INTEGER NOT NULL,
    status     TEXT    NOT NULL CHECK (status IN ('win', 'draw')),
    winner_id  INTEGER,
    created_at TEXT    DEFAULT (datetime('now')),
    FOREIGN KEY (winner_id) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS game_players (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id   INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    symbol    TEXT    NOT NULL CHECK (symbol IN ('X', 'O')),
    FOREIGN KEY (game_id)   REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    UNIQUE(game_id, symbol)
  );
`);

const upsertPlayer = db.prepare(`
  INSERT INTO players (name) VALUES (?)
  ON CONFLICT(name) DO UPDATE SET name = excluded.name
  RETURNING id
`);

const insertGame = db.prepare(`
  INSERT INTO games (board_size, status, winner_id) VALUES (?, ?, ?)
`);

const insertGamePlayer = db.prepare(`
  INSERT INTO game_players (game_id, player_id, symbol) VALUES (?, ?, ?)
`);

const statsQuery = db.prepare(`
  SELECT
    p.name,
    COALESCE(SUM(CASE WHEN g.status = 'win' AND g.winner_id = p.id THEN 1 ELSE 0 END), 0) AS wins,
    COALESCE(SUM(CASE WHEN g.status = 'win' AND g.winner_id != p.id THEN 1 ELSE 0 END), 0) AS losses,
    COALESCE(SUM(CASE WHEN g.status = 'draw' THEN 1 ELSE 0 END), 0) AS draws
  FROM players p
  JOIN game_players gp ON gp.player_id = p.id
  JOIN games g ON g.id = gp.game_id
  GROUP BY p.id
  ORDER BY wins DESC
`);

export interface SaveGameParams {
  boardSize: number;
  status: 'win' | 'draw';
  winner: string | null; // player name or null for draws
  players: { X: string; O: string };
}

export interface PlayerStats {
  name: string;
  wins: number;
  losses: number;
  draws: number;
}

export const saveGame = db.transaction((params: SaveGameParams) => {
  const { boardSize, status, winner, players } = params;

  const playerXId = (upsertPlayer.get(players.X) as { id: number }).id;
  const playerOId = (upsertPlayer.get(players.O) as { id: number }).id;

  let winnerId: number | null = null;
  if (status === 'win' && winner) {
    winnerId = winner === players.X ? playerXId : playerOId;
  }

  const gameResult = insertGame.run(boardSize, status, winnerId);
  const gameId = gameResult.lastInsertRowid as number;

  insertGamePlayer.run(gameId, playerXId, 'X');
  insertGamePlayer.run(gameId, playerOId, 'O');

  return { gameId };
});

export const getStats = (): PlayerStats[] => {
  return statsQuery.all() as PlayerStats[];
};

export default db;
