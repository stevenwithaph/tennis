import { Player } from '../game-objects/player';
import { Ball } from '../game-objects/ball';
import { Bot } from '../game-objects/bot';

export class GameScene extends Phaser.Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;

  player: Player;

  movement: Phaser.Math.Vector2;

  bounds: Phaser.Physics.Arcade.StaticBody[];

  balls: Phaser.Physics.Arcade.Group;

  bots: Phaser.Physics.Arcade.Group;

  racketHitSfx: Phaser.Sound.BaseSound;
  wallHitSfx: Phaser.Sound.BaseSound;
  entityHitSfx: Phaser.Sound.BaseSound;
  swingSfx: Phaser.Sound.BaseSound;

  constructor() {
    super('game');
  }

  init() {
    this.cameras.main.fadeIn(500);
  }

  create() {
    this.movement = new Phaser.Math.Vector2(0, 0);

    this.racketHitSfx = this.sound.add('racket-hit', {
      volume: 2,
    });
    this.wallHitSfx = this.sound.add('wall-hit', {
      volume: 2,
    });
    this.entityHitSfx = this.sound.add('entity-hit', {
      volume: 2,
    });

    this.swingSfx = this.sound.add('swing', {
      volume: 0.3,
    });

    this.add.image(0, 0, 'court').setOrigin(0).setScale(2);

    this.bots = this.physics.add.group();
    this.createBot(720, 300);
    this.createBot(640, 200);

    this.balls = this.physics.add.group({
      bounceX: 1,
      bounceY: 1,
    });

    this.player = new Player(this);
    this.add.existing(this.player);

    this.createBounds();

    this.createCollisions();

    const ball = new Ball(this, 200, 200);
    this.add.existing(ball);
    this.balls.add(ball);

    this.initializeInput();
  }

  createCollisions() {
    this.physics.add.collider(
      this.balls,
      //@ts-ignore
      this.bounds,
      //@ts-ignore
      this.onBallBoundsCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.player,
      this.balls,
      //@ts-ignore
      this.onPlayerBallCollision,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player.slash,
      this.balls,
      //@ts-ignore
      this.onSlashBallCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.bots,
      this.balls,
      //@ts-ignore
      this.onBotBallCollision,
      undefined,
      this
    );
  }

  createBounds() {
    const top = this.physics.add.staticBody(0, -8, this.sys.canvas.width, 8);
    const left = this.physics.add.staticBody(-8, 0, 8, this.sys.canvas.height);

    const right = this.physics.add.staticBody(
      this.sys.canvas.width,
      0,
      8,
      this.sys.canvas.height
    );
    const bottom = this.physics.add.staticBody(
      0,
      this.sys.canvas.height,
      this.sys.canvas.width,
      8
    );

    this.bounds = new Array(top, right, bottom, left);
  }

  createBot(x: number, y: number) {
    const bot = new Bot(this, x, y);

    this.bots.add(bot);
    this.add.existing(bot);
  }

  initializeInput() {
    if (!this.input.keyboard) return;

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as Phaser.Types.Input.Keyboard.CursorKeys;

    this.input.on(
      Phaser.Input.Events.POINTER_DOWN,
      (pointer: Phaser.Input.Pointer) => {
        if (!pointer.leftButtonDown()) return;

        this.swingSfx.play();
        this.player.attack();
      }
    );
  }

  onBallBoundsCollision(_: Phaser.Physics.Arcade.StaticBody, ball: Ball) {
    ball.bounce();

    this.wallHitSfx.play();
  }

  onPlayerBallCollision(player: Player, ball: Ball) {
    player.hit();
    this.cameras.main.shake(100, 0.001);

    ball.bounce();

    this.entityHitSfx.play();
  }

  onBotBallCollision(bot: Bot, ball: Ball) {
    bot.hit();
    ball.bounce();

    this.entityHitSfx.play();
  }

  onSlashBallCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    ball: Ball
  ) {
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.mousePointer.worldX,
      this.input.mousePointer.worldY
    );
    const velocity = this.physics.velocityFromAngle(
      Phaser.Math.RadToDeg(angle),
      400
    );
    ball.setVelocity(velocity.x, velocity.y);

    ball.bounce();

    this.racketHitSfx.play();
  }

  update(): void {
    this.movement.x = 0;
    this.movement.y = 0;

    if (this.keys.left.isDown) {
      this.movement.x -= 1;
    }

    if (this.keys.right.isDown) {
      this.movement.x += 1;
    }

    if (this.keys.up.isDown) {
      this.movement.y -= 1;
    }

    if (this.keys.down.isDown) {
      this.movement.y += 1;
    }

    this.movement.normalize();

    this.player.move(this.movement);

    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      this.input.mousePointer.worldX,
      this.input.mousePointer.worldY
    );

    this.player.anchor.setRotation(angle);

    this.player.sprite.flipX = angle <= -Math.PI / 2 || angle >= Math.PI / 2;
  }
}
