export class Ball extends Phaser.Physics.Arcade.Image {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'ball');

    this.scene.physics.world.enable(this);
  }

  bounce() {
    this.scene.tweens.add({
      targets: this,
      scaleX: {
        from: 0.5,
        to: 1.25,
      },
      scaleY: {
        from: 1,
        to: 0.75,
      },
      duration: 100,
    });

    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.tintFill = false;
      },
    });

    this.tintFill = true;
    this.setRotation(this.body.velocity.angle());
  }
}
