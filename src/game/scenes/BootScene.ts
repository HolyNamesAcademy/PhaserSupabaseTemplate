import Phaser from 'phaser';

// Starts the demo scene right away.
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    this.scene.start('DemoScene');
  }
}
