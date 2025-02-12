export default class Player {
  SLIDE_ANIMATION_TIMER = 200;
  slideAnimationTimer = this.SLIDE_ANIMATION_TIMER;
  SkieurSlideImages = [];

  jumpPressed = false;
  jumpInProgress = false;
  falling = false;
  JUMP_SPEED = 0.6;
  GRAVITY = 0.4;

  constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = width;
    this.height = height;
    this.minJumpHeight = minJumpHeight;
    this.maxJumpHeight = maxJumpHeight;
    this.scaleRatio = scaleRatio;

    this.x = 10 * scaleRatio;
    this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
    this.yStandingPosition = this.y;

    this.standingStillImage = new Image();
    this.standingStillImage.src = "images/ski2.png";
    this.image = this.standingStillImage;

    const SkieurSlideImage1 = new Image();
    SkieurSlideImage1.src = "images/ski1.png";

    const SkieurSlideImage2 = new Image();
    SkieurSlideImage2.src = "images/ski2.png";

    this.SkieurSlideImages.push(SkieurSlideImage1);
    this.SkieurSlideImages.push(SkieurSlideImage2);

    // Image pour le Game Over
    this.gameOverImage = new Image();
    this.gameOverImage.src = "images/SkiFall.png"; // Chemin vers l'image de Game Over

    // Keyboard events

    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  keydown = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = true;
    }
  };

  keyup = (event) => {
    if (event.code === "Space") {
      this.jumpPressed = false;
    }
  };

  update(gameSpeed, frameTimeDelta) {
    this.run(gameSpeed, frameTimeDelta);

    if (this.jumpInProgress) {
      this.image = this.standingStillImage;
    }

    this.jump(frameTimeDelta);
  }

  jump(frameTimeDelta) {
    if (this.jumpPressed) {
      this.jumpInProgress = true;
    }

    if (this.jumpInProgress && !this.falling) {
      if (
        this.y > this.canvas.height - this.minJumpHeight ||
        (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)
      ) {
        this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.yStandingPosition) {
        this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
        if (this.y + this.height > this.canvas.height) {
          this.y = this.yStandingPosition;
        }
      } else {
        this.falling = false;
        this.jumpInProgress = false;
      }
    }
  }

  run(gameSpeed, frameTimeDelta) {
    if (this.slideAnimationTimer <= 0) {
      if (this.image === this.SkieurSlideImages[0]) {
        this.image = this.SkieurSlideImages[1];
      } else {
        this.image = this.SkieurSlideImages[0];
      }
      this.slideAnimationTimer = this.SLIDE_ANIMATION_TIMER;
    }
    this.slideAnimationTimer -= frameTimeDelta * gameSpeed;
  }

  resetPosition() {
    this.y = this.yStandingPosition; // Repositionne le joueur au niveau du sol
  }

  draw(isGameOver = false) {
    if (isGameOver) {
      this.resetPosition(); // Réinitialise la position avant de dessiner
      this.ctx.drawImage(this.gameOverImage, this.x, this.y, this.width, this.height);
    } else {
      this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }
}
