import express, { Request, Response } from 'express';
import cors from 'cors';
import { saveGame, getStats, SaveGameParams } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/games', (req: Request, res: Response) => {
  try {
    const { boardSize, status, winner, players } = req.body as SaveGameParams;

    if (!boardSize || !status || !players?.X || !players?.O) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (status !== 'win' && status !== 'draw') {
      res.status(400).json({ error: 'Status must be "win" or "draw"' });
      return;
    }
    if (status === 'win' && !winner) {
      res
        .status(400)
        .json({ error: 'Winner name is required when status is "win"' });
      return;
    }

    const result = saveGame({
      boardSize,
      status,
      winner: winner ?? null,
      players,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving game:', err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    res.json(getStats());
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
