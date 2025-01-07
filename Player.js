export default class Player{
    constructor(ctx,width,height,minJumpHeight,maxJumpHeight,scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight * scaleRatio;
        this.maxJumpHeight = maxJumpHeight * scaleRatio;
        this.scaleRatio = scaleRatio;
    }
}