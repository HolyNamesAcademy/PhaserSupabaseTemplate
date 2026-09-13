import Phaser from 'phaser';
import { getLeaderboard, type LeaderboardEntry } from '../../services/gameData';

/**
 * Shared/public data example: anyone can read the leaderboard (see RLS policies).
 */
export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('LeaderboardScene');
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, 48, 'Leaderboard', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '32px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    const listText = this.add
      .text(this.scale.width / 2, 120, 'Loading…', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#d7e3f4',
        align: 'left',
        lineSpacing: 8,
      })
      .setOrigin(0.5, 0);

    this.createButton(this.scale.height - 60, 'Back to Menu', () => {
      this.scene.start('MenuScene');
    });

    void this.loadScores(listText);
  }

  private async loadScores(listText: Phaser.GameObjects.Text): Promise<void> {
    try {
      const entries = await getLeaderboard(10);
      listText.setText(this.formatEntries(entries));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load leaderboard.';
      listText.setText(message);
    }
  }

  private formatEntries(entries: LeaderboardEntry[]): string {
    if (entries.length === 0) {
      return 'No scores yet. Play a round and save one!';
    }

    return entries
      .map((entry, index) => `${index + 1}. ${entry.username} — ${entry.score}`)
      .join('\n');
  }

  private createButton(y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(this.scale.width / 2, y, label, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#0b1220',
        backgroundColor: '#3d8bfd',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerdown', onClick);
  }
}
