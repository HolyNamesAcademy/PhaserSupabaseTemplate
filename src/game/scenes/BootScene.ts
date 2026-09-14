import Phaser from 'phaser';

// First scene that runs. Starts the demo scene after a short pause.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Projects II Game Template', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '28px',
        color: '#f4f7fb',
      })
      .setOrigin(0.5);

    this.time.delayedCall(400, () => {
      this.scene.start('DemoScene');
    });
  }
}
