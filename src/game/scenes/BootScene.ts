import Phaser from 'phaser';
import { isSupabaseConfigured } from '../../services/supabase';
import { getCurrentUser } from '../../services/auth';

/**
 * BootScene prepares the game and routes to Auth or Menu.
 * Keep this tiny — students replace the demo scenes with their own game.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // No external assets required for the starter demo.
    // Teams should load sprites/audio here (or in a dedicated Preloader scene).
  }

  async create(): Promise<void> {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 20, 'Projects II Game Template', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    const status = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 24, 'Loading…', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '16px',
        color: '#a8b3c5',
      })
      .setOrigin(0.5);

    if (!isSupabaseConfigured()) {
      status.setText('Supabase not configured — see README (.env setup)');
      this.time.delayedCall(1200, () => {
        this.scene.start('AuthScene');
      });
      return;
    }

    try {
      const user = await getCurrentUser();
      this.scene.start(user ? 'MenuScene' : 'AuthScene');
    } catch {
      status.setText('Could not check session. Opening sign-in…');
      this.time.delayedCall(800, () => {
        this.scene.start('AuthScene');
      });
    }
  }
}
