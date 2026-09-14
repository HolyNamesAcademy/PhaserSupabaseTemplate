import Phaser from 'phaser';
import { getDemoMessages } from '../../services/demo';
import { isSupabaseConfigured } from '../../services/supabase';

// Simple screen that loads a row from Supabase to confirm setup works.
export class DemoScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;

  constructor() {
    super('DemoScene');
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, 64, 'Supabase Connectivity Demo', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '36px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 118, 'Replace this scene with your game once setup works.', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '20px',
        color: '#a8b3c5',
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(this.scale.width / 2, 200, 'Checking configuration…', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#d7e3f4',
      })
      .setOrigin(0.5);

    this.bodyText = this.add
      .text(this.scale.width / 2, 280, '', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '22px',
        color: '#f4f7fb',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: this.scale.width - 120 },
      })
      .setOrigin(0.5, 0);

    this.createButton(this.scale.height - 80, 'Refresh', () => {
      void this.loadMessages();
    });

    void this.loadMessages();
  }

  private async loadMessages(): Promise<void> {
    if (!isSupabaseConfigured()) {
      this.statusText.setColor('#ffb4b4');
      this.statusText.setText('Supabase is not configured');
      this.bodyText.setText(
        [
          '1. Create a Supabase project',
          '2. Copy .env.example → .env',
          '3. Paste your Project URL and publishable key',
          '4. Run supabase/migrations/001_initial.sql',
          '5. Restart npm run dev',
        ].join('\n'),
      );
      return;
    }

    this.statusText.setColor('#d7e3f4');
    this.statusText.setText('Calling Supabase…');
    this.bodyText.setText('');

    try {
      const rows = await getDemoMessages();
      this.statusText.setColor('#7dcea0');
      this.statusText.setText('Connected: demo_messages loaded');

      if (rows.length === 0) {
        this.bodyText.setText('Table is empty. Re-run 001_initial.sql (it seeds one hello row).');
        return;
      }

      this.bodyText.setText(rows.map((row) => `#${row.id}  ${row.message}`).join('\n'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.statusText.setColor('#ffb4b4');
      this.statusText.setText('Request failed');
      this.bodyText.setText(
        [
          message,
          '',
          'Check that:',
          '• .env values match your Supabase project',
          '• you ran the SQL migration',
          '• the demo_messages table exists',
        ].join('\n'),
      );
    }
  }

  private createButton(y: number, label: string, onClick: () => void): void {
    const button = this.add
      .text(this.scale.width / 2, y, label, {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '24px',
        color: '#0b1220',
        backgroundColor: '#3d8bfd',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#5a9fff' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#3d8bfd' }));
    button.on('pointerdown', onClick);
  }
}
