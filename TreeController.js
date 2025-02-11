import Sapin from "./Sapin.js";

export default class SapinController {
  SAPIN_INTERVAL_MIN = 500;
  SAPIN_INTERVAL_MAX = 2000;

  nextSapinInterval = null;
  sapins = [];

  constructor(ctx, cactiImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.cactiImages = cactiImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextSapinTime();
  }

  setNextSapinTime() {
    const num = this.getRandomNumber(
      this.SAPIN_INTERVAL_MIN,
      this.SAPIN_INTERVAL_MAX
    );

    this.nextSapinInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createSapin() {
    const index = this.getRandomNumber(0, this.cactiImages.length - 1);
    const sapinImage = this.cactiImages[index];
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
    if (this.nextSapinInterval <= 0) {
      this.createSapin();
      this.setNextSapinTime();
    }
    this.nextSapinInterval -= frameTimeDelta;

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
