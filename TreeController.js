import Sapin from "./Sapin.js";

export default class TreeController {
  TREE_INTERVAL_MIN = 500;
  TREE_INTERVAL_MAX = 2000;

  nextTreeInterval = null;
  trees = [];

  constructor(ctx, treesImages, scaleRatio, speed) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.treesImages = treesImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;

    this.setNextTreeTime();
  }

  setNextTreeTime() {
    const num = this.getRandomNumber(
      this.TREE_INTERVAL_MIN,
      this.TREE_INTERVAL_MAX
    );

    this.nextTreeInterval = num;
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createTree() {
    const index = this.getRandomNumber(0, this.treesImages.length - 1);
    const treeImage = this.treesImages[index];
    const x = this.canvas.width * 1.5;
    const y = this.canvas.height - treeImage.height;
    const tree = new Sapin(
      this.ctx,
      x,
      y,
      treeImage.width,
      treeImage.height,
      treeImage.image
    );

    this.trees.push(tree);
  }

  update(gameSpeed, frameTimeDelta) {
    if (this.nextTreeInterval <= 0) {
      this.createTree();
      this.setNextTreeTime();
    }
    this.nextTreeInterval -= frameTimeDelta;

    this.trees.forEach((tree) => {
      tree.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
    });

    this.trees = this.trees.filter((tree) => tree.x > -tree.width);
  }

  draw() {
    this.trees.forEach((tree) => tree.draw());
  }

  collideWith(sprite) {
    return this.trees.some((tree) => tree.collideWith(sprite));
  }

  reset() {
    this.trees = [];
  }
}
