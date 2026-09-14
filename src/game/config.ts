import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { DemoScene } from './scenes/DemoScene';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  // Sharper canvas on Retina / high-DPI displays
  resolution: Math.min(window.devicePixelRatio || 1, 2),
  parent: 'game-container',
  backgroundColor: '#0b1220',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
  },
  render: {
    antialias: true,
    roundPixels: true,
  },
  scene: [BootScene, DemoScene],
};
