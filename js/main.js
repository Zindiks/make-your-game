import { map, entities, generateMap } from "./maps/map.js"
import { Player } from "./classes/player.js"
import { collisionCheck } from "./helpers/collisionDetection.js"

import { TILESIZE, SPRITES } from "./config.js"
import { animate, stopAnimate } from "./script.js"
import { Enemy } from "./classes/enemy.js"
import { bombGlobalArray } from "./classes/bomb.js"
//gameScreen 680 x 680px
const gameScreen = document.getElementById("gameScreen")
const gameScreenX = map.length * TILESIZE
const gameScreenY = map.length * TILESIZE
const score = document.getElementById('score');

gameScreen.style.width = gameScreenX
gameScreen.style.height = gameScreenY
let gameRunning = true
//PLAYER
let player = new Player(TILESIZE, TILESIZE) //COORDINATES TOP LEFTs
//Add player to entities array
entities.push(player);

//ENEMY
let enemy = new Enemy(480, 480, 3);
entities.push(enemy);
// const enemyTestTiles = [[15, 14], [15, 13], [15, 12], [15,11], [14,11], [13,11],[9,11], [9,10]];
let pathToPlayer = [];
let newCoords = [];
let i = 0;

console.log(enemy);
console.log(player);

let keys = {}
let animations = {}
let rightAnimId, leftAnimId, upAnimId, downAnimId
animations[rightAnimId] = false
animations[leftAnimId] = false
animations[upAnimId] = false
animations[downAnimId] = false

//Runs before game loop --> initializes everything
function initGame() {
  generateMap(map)
  player.renderPlayer(gameScreen);
  enemy.renderPlayer(gameScreen);
  enemy.findPath(map, enemy.getTile().x, enemy.getTile().y, player.getTile().x, player.getTile().y).forEach((val) => pathToPlayer.push([val.col, val.row]));
  // console.log(pathToPlayer);
}

initGame()

const playerModel = document.getElementById("player")
//animation stuff

document.addEventListener("keydown", (e) => {
  if(e.key == 'r'){
    console.log('r');
    gameRunning = true;
    player.lives = 3;
    requestAnimationFrame(main);
  }
  if (!gameRunning){
    return
  }
  keys[e.key] = true
  if (e.key == "d" && !animations[rightAnimId]) {
    rightAnimId = animate(
      playerModel,
      SPRITES.player.right.startPosX,
      SPRITES.player.right.endPosX,
      SPRITES.player.right.Y,
      200
    )
    animations[rightAnimId] = true
  } else if (e.key === "a" && !animations[leftAnimId]) {
    leftAnimId = animate(
      playerModel,
      SPRITES.player.left.startPosX,
      SPRITES.player.left.endPosX,
      SPRITES.player.left.Y,
      200
    )
    animations[leftAnimId] = true
  } else if (e.key === "w" && !animations[upAnimId]) {
    upAnimId = animate(
      playerModel,
      SPRITES.player.up.startPosX,
      SPRITES.player.up.endPosX,
      SPRITES.player.up.Y,
      200
    )
    animations[upAnimId] = true
  } else if (e.key === "s" && !animations[downAnimId]) {
    downAnimId = animate(
      playerModel,
      SPRITES.player.down.startPosX,
      SPRITES.player.down.endPosX,
      SPRITES.player.down.Y,
      200
    )
    animations[downAnimId] = true
  }
})

document.addEventListener("keyup", (e) => {
  if (!gameRunning) {
    return
  }
  keys[e.key] = false
  //check for idle status
  if (e.key == "d") {
    stopAnimate(rightAnimId)
    animations[rightAnimId] = false
  } else if (e.key == "a") {
    stopAnimate(leftAnimId)
    animations[leftAnimId] = false
  } else if (e.key == "w") {
    stopAnimate(upAnimId)
    animations[upAnimId] = false
  } else if (e.key == "s") {
    stopAnimate(downAnimId)
    animations[downAnimId] = false
  }
  for (let item of Reflect.ownKeys(keys)) {
    if (!keys[item]) {
      player.direction = "idle"
    }
  }
})

//Main game loop
function main() {
  // edit player score
  score.innerHTML = player.score;
  // console.log(`enemy x: ${enemy.getTile().x} enemy y: ${enemy.getTile().y}`)
  if(player.lives == 0){
    gameRunning = false;
  }
  if (!gameRunning) {
    return
  }
  //ENEMY MOVEMENT PART
  if(bombGlobalArray.length > 0){
    // console.log('test');
    if(enemy.state != 'defence'){
      enemy.state = 'defence';
      // console.log(enemy.findCoordinates());
    }
  }else if (bombGlobalArray.length == 0){
    if(enemy.state != 'attack'){
      enemy.state = 'attack';
      // enemy.newCoordsAssigned = false;
    }
  }

  if(enemy.currentTarget.length == 0 && !enemy.arrived){

    enemy.currentTarget = pathToPlayer[i];

    if (enemy.getTile().x == player.getTile().x && enemy.getTile().y == player.getTile().y){
      enemy.arrived = true;
      enemy.isMoving = false;
      player.isDead = true;
    }
  }
  console.log('enemy.currenttarget', enemy.currentTarget.length);
  if(enemy.currentTarget.length > 0 && !enemy.isMoving){
    enemy.isMoving = true;
    enemy.moveToTile(enemy.currentTarget[0], enemy.currentTarget[1]);
    // console.log(enemy.state);
    if(enemy.state == 'attack'){
      pathToPlayer = [];
      let pathToCalc = enemy.findPath(map, enemy.getTile().y, enemy.getTile().x, player.getTile().y, player.getTile().x);
      if(pathToCalc != null){
        pathToCalc.forEach((val) => pathToPlayer.push([val.col, val.row]));
      }
    }else if (enemy.state == 'defence'){
      //find suitable coordinates
      if(!enemy.newCoordsAssigned){
        newCoords = enemy.findCoordinates(); //0 - x, 1 - y
        enemy.newCoordsAssigned = true;
      }
      pathToPlayer = [];
      let pathToCalc = enemy.findPath(map, enemy.getTile().y, enemy.getTile().x, newCoords[0], newCoords[1])
      if(pathToCalc != null){
        pathToCalc.forEach((val) => pathToPlayer.push([val.col, val.row]))
      }
      console.log(newCoords);
    }
    i=0;
    if (i+1 < pathToPlayer.length){
      i++;
    }
    // console.log(pathToPlayer);
    enemy.currentTarget = [];
  }
  if(enemy.arrived){
    //if enemy finds player then it starts to search again in 1 second
    setTimeout(() => {
      enemy.arrived = false;
    }, 1000);
  }

  //ENEMYT DEBUGGING
  if(keys['i']){
    console.log(player);
  }

  //PLAYER MOVEMENT
  if (keys["d"]) {
    if (collisionCheck(player.x + player.speed, player.y)) {
      player.x += player.speed
      //playerModel.style.backgroundPosition = `0px -${TILESIZE}px`
      player.direction = "right"
      //animate
    } else {
      //has to check where to calc to go up or down
      //and only move if its like 60% already there and there is no full block in front of the character

      //down
      if (
        player.y - player.getTile().y * TILESIZE >
        Math.floor(TILESIZE * 0.6)
      ) {
        if (
          collisionCheck(player.x, player.y + player.speed) &&
          map[player.getTile().y + 1][player.getTile().x + 1] == 0
        ) {
          player.y += player.speed
        }
        //up
      } else if (
        player.y - player.getTile().y * TILESIZE <
        Math.round(TILESIZE * 0.4)
      ) {
        if (
          collisionCheck(player.x, player.y - player.speed) &&
          map[player.getTile().y][player.getTile().x + 1] == 0
        ) {
          player.y -= player.speed
        }
      }
    }
  } else if (keys["a"]) {
    if (collisionCheck(player.x - player.speed, player.y)) {
      player.x -= player.speed
      //playerModel.style.backgroundPosition = `0px 0px`
      player.direction = "left"
    } else {
      //CUT CORNERS MOVEMENT COMMENTED ON THE D LETTER ALREADY
      //down
      if (
        player.y - player.getTile().y * TILESIZE >
        Math.floor(TILESIZE * 0.6)
      ) {
        if (
          collisionCheck(player.x, player.y + player.speed) &&
          map[player.getTile().y - 1][player.getTile().x - 1] == 0
        ) {
          player.y += player.speed
        }
        //up
      } else if (
        player.y - player.getTile().y * TILESIZE <
        Math.round(TILESIZE * 0.4)
      ) {
        if (
          collisionCheck(player.x, player.y - player.speed) &&
          map[player.getTile().y][player.getTile().x - 1] == 0
        ) {
          player.y -= player.speed
        }
      }
    }
  } else if (keys["s"]) {
    if (collisionCheck(player.x, player.y + player.speed)) {
      player.y += player.speed
      //playerModel.style.backgroundPosition = `-96px 0px`
      player.direction = "down"
    } else {
      //HAVE TO FLIP THE LOGIC FROM DOWN TO RIGHT AND UP TO LEFT
      //right
      if (
        player.x - player.getTile().x * TILESIZE >
        Math.floor(TILESIZE * 0.6)
      ) {
        if (
          collisionCheck(player.x + player.speed, player.y) &&
          map[player.getTile().y + 1][player.getTile().x + 1] == 0
        ) {
          player.x += player.speed
        }
        //left
      } else if (
        player.y - player.getTile().y * TILESIZE <
        Math.round(TILESIZE * 0.4)
      ) {
        if (
          collisionCheck(player.x - player.speed, player.y) &&
          map[player.getTile().y + 1][player.getTile().x] == 0
        ) {
          player.x -= player.speed
        }
      }
    }
  } else if (keys["w"]) {
    if (collisionCheck(player.x, player.y - player.speed)) {
      player.y -= player.speed
      //playerModel.style.backgroundPosition = `-96px -32px`
      player.direction = "up"
    } else {
      //right
      if (
        player.x - player.getTile().x * TILESIZE >
        Math.floor(TILESIZE * 0.6)
      ) {
        if (
          collisionCheck(player.x + player.speed, player.y) &&
          map[player.getTile().y - 1][player.getTile().x + 1] == 0
        ) {
          player.x += player.speed
        }
        //left
      } else if (
        player.y - player.getTile().y * TILESIZE <
        Math.round(TILESIZE * 0.4)
      ) {
        if (
          collisionCheck(player.x - player.speed, player.y) &&
          map[player.getTile().y - 1][player.getTile().x] == 0
        ) {
          player.x -= player.speed
        }
      }
    }
  }
  if (keys["m"]) {
    // enemy.moveToTile(10, 5);
    // bombGlobalArray.forEach((val) => console.log(val));
  }
  if(keys['p']){
    console.log(enemy);
  }
  if (keys[" "]) {
      if(player.placeBomb()){
        enemy.newCoordsAssigned = false;
      }
  }
  if (keys["t"]) {
    console.log(
      `current tile x: ${player.getTile().x} y: ${player.getTile().y}`
    )
    console.log(`current tile = ${map[player.getTile().y][player.getTile().x]}`)
  }

  playerModel.style.left = player.x + "px"
  playerModel.style.top = player.y + "px"

  requestAnimationFrame(main)
}

//Start the main loop
requestAnimationFrame(main)
