export class Bot extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bot');

    this.scene.physics.world.enable(this);

    this.play('bot-idle');
    this.setPushable(false);
  }

  hit() {
    this.tintFill = true;

    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.tintFill = false;
      },
    });
  }
}
