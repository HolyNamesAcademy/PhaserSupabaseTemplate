import Phaser from 'phaser';
import { getCurrentUser } from '../../services/auth';
import { getHighScore, loadGame, saveGame, saveScore } from '../../services/gameData';

const ROUND_SECONDS = 20;

/**
 * Tiny playable demo:
 * - Click moving coins to score
 * - After the timer, persist score + cumulative save data
 * - Students should delete/replace this scene for their real game
 */
export class GameScene extends Phaser.Scene {
  private score = 0;
  private timeLeft = ROUND_SECONDS;
  private userId: string | null = null;
  private previousBest = 0;
  private lifetimeCoins = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private coin!: Phaser.GameObjects.Arc;
  private roundActive = false;
  private timerEvent?: Phaser.Time.TimerEvent;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.score = 0;
    this.timeLeft = ROUND_SECONDS;
    this.roundActive = false;

    this.add
      .text(this.scale.width / 2, 36, 'Click the coin!', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    this.scoreText = this.add.text(24, 24, 'Score: 0', {
      fontFamily: 'Segoe UI, sans-serif',
      fontSize: '20px',
      color: '#f4f7fb',
    });

    this.timerText = this.add
      .text(this.scale.width - 24, 24, `Time: ${this.timeLeft}`, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#f4f7fb',
      })
      .setOrigin(1, 0);

    this.messageText = this.add
      .text(this.scale.width / 2, this.scale.height - 40, 'Loading…', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '16px',
        color: '#a8b3c5',
      })
      .setOrigin(0.5);

    this.coin = this.add.circle(400, 300, 28, 0xffd166).setStrokeStyle(3, 0xf4a261);
    this.coin.setInteractive({ useHandCursor: true });
    this.coin.on('pointerdown', () => this.collectCoin());

    void this.beginRound();
  }

  private async beginRound(): Promise<void> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        this.scene.start('AuthScene');
        return;
      }

      this.userId = user.id;
      this.previousBest = await getHighScore(user.id);
      const save = await loadGame(user.id);
      this.lifetimeCoins = save?.coinsCollected ?? 0;

      this.messageText.setText(
        `Best so far: ${this.previousBest}  ·  Lifetime coins: ${this.lifetimeCoins}`,
      );
      this.roundActive = true;

      this.timerEvent = this.time.addEvent({
        delay: 1000,
        repeat: ROUND_SECONDS - 1,
        callback: () => {
          this.timeLeft -= 1;
          this.timerText.setText(`Time: ${this.timeLeft}`);
          if (this.timeLeft <= 0) {
            void this.endRound();
          }
        },
      });

      this.moveCoin();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start round.';
      this.messageText.setText(message);
    }
  }

  private collectCoin(): void {
    if (!this.roundActive) {
      return;
    }

    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
    this.moveCoin();
  }

  private moveCoin(): void {
    const padding = 60;
    const x = Phaser.Math.Between(padding, this.scale.width - padding);
    const y = Phaser.Math.Between(padding + 40, this.scale.height - padding - 40);
    this.coin.setPosition(x, y);
  }

  private async endRound(): Promise<void> {
    if (!this.roundActive) {
      return;
    }

    this.roundActive = false;
    this.timerEvent?.remove(false);
    this.coin.disableInteractive();
    this.messageText.setText('Saving…');

    if (!this.userId) {
      this.messageText.setText('Not signed in — score not saved.');
      this.showEndButtons();
      return;
    }

    try {
      await saveScore(this.userId, this.score);
      const newLifetime = this.lifetimeCoins + this.score;
      await saveGame(this.userId, {
        coinsCollected: newLifetime,
        bestRunScore: Math.max(this.previousBest, this.score),
      });

      const bestNote =
        this.score > this.previousBest
          ? `New personal best: ${this.score}!`
          : `Saved. Best remains ${Math.max(this.previousBest, this.score)}.`;

      this.messageText.setText(`${bestNote} Lifetime coins: ${newLifetime}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Save failed.';
      this.messageText.setText(message);
    }

    this.showEndButtons();
  }

  private showEndButtons(): void {
    this.createButton(this.scale.height / 2 + 40, 'Play Again', () => {
      this.scene.restart();
    });
    this.createButton(this.scale.height / 2 + 100, 'Main Menu', () => {
      this.scene.start('MenuScene');
    });
    this.createButton(this.scale.height / 2 + 160, 'Leaderboard', () => {
      this.scene.start('LeaderboardScene');
    });
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
