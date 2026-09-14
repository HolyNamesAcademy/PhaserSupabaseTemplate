import Phaser from 'phaser';
import { getDemoMessages } from '../../services/demo';
import { isSupabaseConfigured } from '../../services/supabase';

/**
 * Connectivity demo — the Phaser equivalent of SpringReactTemplate's /api-demo.
 *
 * It only proves: Phaser → service layer → Supabase → Postgres → back.
 * Auth, accounts, scores, and real game saves are left for students to build.
 */
export class DemoScene extends Phaser.Scene {
  private statusText!: Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;

  constructor() {
    super('DemoScene');
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, 48, 'Supabase Connectivity Demo', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 90, 'Replace this scene with your game once setup works.', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '16px',
        color: '#a8b3c5',
      })
      .setOrigin(0.5);

    this.statusText = this.add
      .text(this.scale.width / 2, 150, 'Checking configuration…', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#d7e3f4',
      })
      .setOrigin(0.5);

    this.bodyText = this.add
      .text(this.scale.width / 2, 220, '', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '18px',
        color: '#f4f7fb',
        align: 'center',
        lineSpacing: 8,
        wordWrap: { width: this.scale.width - 80 },
      })
      .setOrigin(0.5, 0);

    this.createButton(this.scale.height - 70, 'Refresh', () => {
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
          '3. Paste your Project URL and anon key',
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
      this.statusText.setText('Connected — demo_messages loaded');

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
        fontSize: '20px',
        color: '#0b1220',
        backgroundColor: '#3d8bfd',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#5a9fff' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#3d8bfd' }));
    button.on('pointerdown', onClick);
  }
}
