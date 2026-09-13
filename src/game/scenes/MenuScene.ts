import Phaser from 'phaser';
import { getCurrentUser, getDisplayName, signOut } from '../../services/auth';
import { getHighScore, loadGame } from '../../services/gameData';

/**
 * Main menu after authentication.
 * Shows the player's high score / saved progress and routes to Play or Leaderboard.
 */
export class MenuScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, 70, 'Coin Catcher Demo', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '36px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 120, 'A tiny example — replace these scenes with your game.', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '16px',
        color: '#a8b3c5',
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(this.scale.width / 2, 180, 'Loading your data…', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#d7e3f4',
        align: 'center',
      })
      .setOrigin(0.5);

    this.createButton(280, 'Play', () => this.scene.start('GameScene'));
    this.createButton(350, 'Leaderboard', () => this.scene.start('LeaderboardScene'));
    this.createButton(420, 'Sign Out', () => {
      void this.handleSignOut();
    });

    void this.loadPlayerSummary();
  }

  private async loadPlayerSummary(): Promise<void> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        this.scene.start('AuthScene');
        return;
      }

      const [highScore, save] = await Promise.all([getHighScore(user.id), loadGame(user.id)]);
      const name = getDisplayName(user);
      const coins = save?.coinsCollected ?? 0;

      this.statusText.setText(
        [
          `Signed in as ${name}`,
          `Best score: ${highScore}`,
          `Lifetime coins collected: ${coins}`,
        ].join('\n'),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load profile data.';
      this.statusText.setText(message);
    }
  }

  private async handleSignOut(): Promise<void> {
    await signOut();
    this.scene.start('AuthScene');
  }

  private createButton(y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(this.scale.width / 2, y, label, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '22px',
        color: '#0b1220',
        backgroundColor: '#3d8bfd',
        padding: { x: 24, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#5a9fff' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#3d8bfd' }));
    button.on('pointerdown', onClick);
  }
}
