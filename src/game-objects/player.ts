export class Player extends Phaser.GameObjects.Container {
  declare body: Phaser.Physics.Arcade.Body;

  sprite: Phaser.GameObjects.Sprite;

  anchor: Phaser.GameObjects.Container;
  slashAnchor: Phaser.GameObjects.Container;
  racketAnchor: Phaser.GameObjects.Container;

  slash: Phaser.Physics.Arcade.Sprite;
  racket: Phaser.GameObjects.Image;

  #alternate: boolean = false;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.setSize(32, 32);

    this.scene.physics.world.enable(this);
    this.body.pushable = false;
    this.body.setCollideWorldBounds(true);

    this.anchor = new Phaser.GameObjects.Container(this.scene);

    this.createSprite();
    this.createSlash();
    this.createRacket();

    this.add(this.anchor);
  }

  private createSlash() {
    this.slash = new Phaser.Physics.Arcade.Sprite(this.scene, 0, 0, 'slash');
    this.scene.physics.world.enable(this.slash);
    this.slash.setPushable(false);
    this.slash.disableBody(true, true);

    this.slashAnchor = new Phaser.GameObjects.Container(this.scene);
    this.slashAnchor.add(this.slash);

    this.anchor.add(this.slashAnchor);
  }

  private createRacket() {
    this.racket = new Phaser.GameObjects.Sprite(this.scene, 0, -18, 'racket');
    this.racket.setAngle(-90);

    this.racketAnchor = new Phaser.GameObjects.Container(this.scene);
    this.racketAnchor.add(this.racket);

    this.anchor.add(this.racketAnchor);
  }

  private createSprite() {
    this.sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'player');
    this.sprite.play('idle');
    this.add(this.sprite);
  }

  attack() {
    this.slash.play('slash');

    this.slash.setScale(1, this.#alternate ? -1 : 1);

    this.scene.tweens.add({
      targets: this.racketAnchor,
      angle: this.#alternate ? 0 : 180 - Phaser.Math.EPSILON,
      duration: 100,
    });

    this.slash.enableBody(true, 15, 0, true, true);
    this.slash.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.slash.disableBody(true, true);
    });

    this.#alternate = !this.#alternate;
  }

  hit() {
    this.sprite.tintFill = true;

    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.sprite.tintFill = false;
      },
    });
  }

  startInvulnerability() {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 100,
      repeat: 5,
      yoyo: true,
      onComplete: this.endInvulnerability,
      onCompleteHandler: this,
    });
  }

  endInvulnerability() {}

  move(movement: Phaser.Math.Vector2) {
    movement.scale(200);
    this.body.setVelocity(movement.x, movement.y);
  }
}
