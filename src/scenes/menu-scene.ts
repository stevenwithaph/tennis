export class MenuScene extends Phaser.Scene {
  title: Phaser.GameObjects.Sprite;

  music: Phaser.Sound.BaseSound;
  select: Phaser.Sound.BaseSound;

  constructor() {
    super('menu');
  }

  preload() {
    this.load.image('court', 'sprites/court.png');
    this.load.image('ball', 'sprites/ball.png');
    this.load.image('racket', 'sprites/racket.png');

    this.load.audio('music', 'bgm/music.mp3');

    this.load.audio('entity-hit', 'sfx/entity-hit.mp3');
    this.load.audio('racket-hit', 'sfx/racket-hit.mp3');
    this.load.audio('wall-hit', 'sfx/wall-hit.mp3');

    this.load.audio('swing', 'sfx/swing.mp3');

    this.load.audio('select', 'sfx/select.mp3');

    this.load.spritesheet('titlecard', 'sprites/titlecard.png', {
      frameWidth: 384,
      frameHeight: 219,
    });

    this.load.spritesheet('player', 'sprites/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('slash', 'sprites/slash.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('tank', 'sprites/tank.png', {
      frameWidth: 250,
      frameHeight: 500,
    });

    this.load.spritesheet('bot', 'sprites/bot.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
  }

  create() {
    this.createAnimations();

    this.music = this.sound.add('music', {
      loop: true,
      volume: 0.3,
    });
    this.music.play();

    this.select = this.sound.add('select', {
      volume: 2,
    });

    this.title = this.add
      .sprite(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2 + 12,
        'titlecard'
      )
      .setScale(2)
      .play('titlecard');

    this.input.once(Phaser.Input.Events.POINTER_UP, this.onStart, this);
  }

  createAnimations() {
    this.anims.create({
      key: 'titlecard',
      frames: this.anims.generateFrameNumbers('titlecard', {
        start: 0,
        end: 1,
      }),
      repeat: -1,
      duration: 1000,
    });

    this.anims.create({
      key: 'slash',
      frames: this.anims.generateFrameNumbers('slash', { start: 0, end: 4 }),
      duration: 250,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 13 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNumbers('player', { start: 15, end: 15 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'tank-idle',
      frames: this.anims.generateFrameNumbers('tank', { start: 0, end: 1 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'tank-shoot',
      frames: this.anims.generateFrameNumbers('tank', { start: 0, end: 20 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'bot-idle',
      frames: this.anims.generateFrameNumbers('bot', { start: 0, end: 4 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'bot-walk',
      frames: this.anims.generateFrameNumbers('bot', { start: 8, end: 15 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'bot-shoot-start',
      frames: this.anims.generateFrameNumbers('bot', { start: 17, end: 29 }),
      //repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'bot-idle-b',
      frames: this.anims.generateFrameNumbers('bot', { start: 31, end: 35 }),
      repeat: -1,
      frameRate: 12,
    });

    this.anims.create({
      key: 'bot-shoot',
      frames: this.anims.generateFrameNumbers('bot', { start: 37, end: 60 }),
      frameRate: 12,
    });

    this.anims.create({
      key: 'bot-shoot-end',
      frames: this.anims.generateFrameNumbers('bot', { start: 62, end: 73 }),
      frameRate: 12,
    });
  }

  onStart() {
    this.title.anims.timeScale = 8;
    this.cameras.main.fadeOut(1000);

    this.select.play();

    this.time.addEvent({
      delay: 1000,
      callback: this.onTimerComplete,
      callbackScope: this,
    });
  }

  onTimerComplete() {
    this.scene.start('game');
  }
}
