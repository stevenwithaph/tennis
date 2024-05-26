import './style.css';

import Phaser from 'phaser';
import { GameScene } from './scenes/game-scene';
import { MenuScene } from './scenes/menu-scene';

new Phaser.Game({
  pixelArt: true,
  scale: {
    width: 758,
    height: 406,
    max: {
      width: 1137,
      height: 609,
    },
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    autoRound: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      //debug: true,
    },
  },
  scene: [MenuScene, GameScene],
});
