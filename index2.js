import Player from "_______";
import _______ from "_______";
import TreeController from "./TreeController.js";
import _______ from "_______";

const _______ = document.getElementById("game");
const ctx = _______.getContext("2d"); // Contexte du dessin = Canvas 2d

const GAME_SPEED_START = 1; 
const GAME_SPEED_INCREMENT = 0.00001;
const GAME_WIDTH = 800; 
const _______ = 200; // Hauteur du jeu
const _______ = 88 / 1.5; // Largeur du joueur
const PLAYER_HEIGHT = 94 / 1.5; 
const MAX________ = GAME_HEIGHT-20; // Hauteur de saut maximum
const _______ = 150; // Hauteur de saut minimum
const _______ = 2400; // Largeur du sol
const _______ = 24; // Hauteur du sol
const GROUND_AND_TREES_SPEED = 0.5; 

const TREES_CONFIG = [
  { width: 48 / 1.25, height: 100 / 1.25, image: "images/sapin1.png" },
  { width: 98 / 1.25, height: 100 / 1.25, image: "images/sapin2.png" },
  { width: 68 / 1.25, height: 70 / 1.25, image: "images/sapin3.png" },  
];

// Game Objects
let player = _______;
let ground = _______;
let treeController = _______; 
let score = _______;

let scaleRatio = _______;
let previousTime = _______;
let gameSpeed = GAME_SPEED_START;
let gameOver = _______;
let hasAddedEventListenersForRestart = _______;
let waitingToStart = _______;

function createSprites() {
  const playerWidthInGame = _______ * _______;
  const playerHeightInGame = _______ * _______;
  const minJumpHeightInGame = _______ * _______;
  const maxJumpHeightInGame = _______ * _______;

  const groundWidthInGame = _______ * _______;
  const groundHeightInGame = _______ * _______;

  _______ = new Player(
    ctx,
    playerWidthInGame,
    _______,
    minJumpHeightInGame,
    _______,
    scaleRatio
  );

  ground = new _______(
    ctx,
    _______,
    _______,
    GROUND_AND_TREES_SPEED,
    scaleRatio
  );

  const treesImages = TREES_CONFIG.map((trees) => {
    const image = new Image();
    image.src = trees.image;
    return {
      image: image,
      width: trees.width * scaleRatio,
      height: trees.height * scaleRatio,
    };
  });

  treeController = new TreeController(
    ctx,
    treesImages,
    scaleRatio,
    GROUND_AND_TREES_SPEED
  );

  score = new Score(ctx, scaleRatio);
}

function getScaleRatio() {
  const screenHeight = Math.min(
    window.innerHeight,
    document.documentElement.clientHeight
  );

  const screenWidth = Math.min(
    window.innerWidth,
    document.documentElement.clientWidth
  );

  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
window.addEventListener("resize", () => setTimeout(setScreen, 500));

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener("keyup", reset, { once: true });
    }, 1000);
  }
}

function reset() {
  hasAddedEventListenersForRestart = false;
  gameOver = false;
  waitingToStart = false;
  ground.reset();
  treeController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
}

function showStartGameText() {
  const fontSize = 45 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("Press Space To Start", x, y);
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}

function updateGameSpeed(frameTimeDelta) {
  gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameOver && !waitingToStart) {

    ground.update(gameSpeed, frameTimeDelta);
    treeController.update(gameSpeed, frameTimeDelta);
    player.update(gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
    updateGameSpeed(frameTimeDelta);
  }

  if (!gameOver && treeController.collideWith(player)) {
    gameOver = true;
    setupGameReset();
    score.setHighScore();
  }


  ground.draw();
  treeController.draw();
  player.draw(gameOver);
  score.draw();

  if (gameOver) {
    showGameOver();
  }

  if (waitingToStart) {
    showStartGameText();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
