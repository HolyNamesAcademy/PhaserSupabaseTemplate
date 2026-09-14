import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { DemoScene } from './scenes/DemoScene';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
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
