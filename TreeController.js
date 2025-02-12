import Sapin from "./Sapin.js";

export default class SapinController {
  CACTUS_INTERVAL_MIN = 500;
  CACTUS_INTERVAL_MAX = 2000;

  nextCactusInterval = null;
  sapins = [];

  constructor(ctx, sapinsImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.sapinsImages = sapinsImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextCactusTime();
  }

  setNextCactusTime() {
    const num = this.getRandomNumber(
      this.CACTUS_INTERVAL_MIN,
      this.CACTUS_INTERVAL_MAX
    );

    this.nextCactusInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createCactus() {
    const index = this.getRandomNumber(0, this.sapinsImages.length - 1);
    const sapinImage = this.sapinsImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - sapinImage.height;
    const sapin = new Sapin(
      this.ctx,
      x,
      y,
      sapinImage.width,
      sapinImage.height,
      sapinImage.image
    );

    this.sapins.push(sapin);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextCactusInterval <= 0) {
      this.createCactus();
      this.setNextCactusTime();
    }
    this.nextCactusInterval -= frameTimeDelta;

    this.sapins.forEach((sapin) => {
      sapin.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.sapins = this.sapins.filter((sapin) => sapin.x > -sapin.width);
  }

  draw() {
    this.sapins.forEach((sapin) => sapin.draw());
  }

  collideWith(sprite) {
    return this.sapins.some((sapin) => sapin.collideWith(sprite));
  }

  reset() {
    this.sapins = [];
  }
}
