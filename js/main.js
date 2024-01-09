import { map, entities, generateMap } from "./maps/map.js"
import { Player } from "./classes/player.js"
import { collisionCheck } from "./helpers/collisionDetection.js"

import { TILESIZE, SPRITES } from "./config.js"
import { animate, stopAnimate } from "./helpers/animate.js"
import { Enemy } from "./classes/enemy.js"
import { bombGlobalArray } from "./classes/bomb.js"
import { menu, startMenu } from "./components/menu.js"
import { instructionsBoard } from "./components/instructions.js"
//gameScreen 680 x 680px
const gameScreen = document.getElementById("gameScreen")
const gameScreenX = map.length * TILESIZE
const gameScreenY = map.length * TILESIZE
const score = document.getElementById("score")
const time = document.getElementById("time")
let timeValue = ""
let seconds = 0
let minutes = 0
let lastTime = Date.now()
const playerLives = document.querySelector('#heart');

gameScreen.style.width = gameScreenX
gameScreen.style.height = gameScreenY
let gameRunning = true
//PLAYER
let player = new Player(TILESIZE, TILESIZE) //COORDINATES TOP LEFTs
//Add player to entities array
entities.push(player)

//ENEMY
let enemy = new Enemy(480, 480, 3)
entities.push(enemy)
// const enemyTestTiles = [[15, 14], [15, 13], [15, 12], [15,11], [14,11], [13,11],[9,11], [9,10]];
let pathToCoordinates = []
let newCoords = []
let i = 0

console.log(enemy)
console.log(player)

let keys = {}
let animations = {}
let rightAnimId, leftAnimId, upAnimId, downAnimId
animations[rightAnimId] = false
animations[leftAnimId] = false
animations[upAnimId] = false
animations[downAnimId] = false

//Runs before game loop --> initializes everything
function initGame() {
  startMenu()
  instructionsBoard()
  generateMap(map)
  player.renderPlayer(gameScreen)
  enemy.renderPlayer(gameScreen)
  console.log(enemy.findPath(map, 2, 3, 1, 9));
  enemy
    .findPath(
      map,
      enemy.getTile().y,
      enemy.getTile().x,
      player.getTile().y,
      player.getTile().x
    )
    .forEach((val) => pathToCoordinates.push([val.col, val.row]))
  // console.log(pathToPlayer);
}

initGame()

const playerModel = document.getElementById("player")
//animation stuff

document.addEventListener("keydown", (e) => {
  if (e.key == "r") {
    console.log("r")
    gameRunning = true
    player.lives = 3
    requestAnimationFrame(main)
  }
  if (!gameRunning) {
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
  if (keys["m"]) {
    console.log(enemy)
  }

  // console.log(`enemy x: ${enemy.getTile().x} enemy y: ${enemy.getTile().y}`)
  if (player.lives == 0) {
    gameRunning = false
  }
  if (!gameRunning) {
    return
  }
  score.innerHTML = player.score
  if(keys['m']){
    console.log(enemy);
  }

  // edit player score
  score.innerHTML = player.score;

  //handle timer
  if (Date.now() - lastTime > 1000) {
    seconds++
    if (seconds == 60) {
      minutes++
      seconds = 0
    }
    lastTime = Date.now()
    if (seconds < 10) {
      timeValue = `0${minutes}:0${seconds}`
    } else {
      if (minutes < 10) {
        timeValue = `0${minutes}:${seconds}`
      } else {
        timeValue = `${minutes}:${seconds}`
      }
    }
    lastTime = Date.now();
    timeValue = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  time.innerHTML = timeValue

  //handle player lives
  playerLives.innerHTML = player.lives;



  //ENEMY MOVEMENT PART
  if (bombGlobalArray.length > 0) {
    if (enemy.state != "defence") {
      enemy.state = "defence"
    }
  } else if (bombGlobalArray.length == 0) {
    if (enemy.state != "attack") {
      enemy.state = "attack"
    }
  }

  if (enemy.currentTarget.length == 0 && !enemy.arrived) {
    if (pathToPlayer[i]) {
      enemy.currentTarget = pathToPlayer[i]
    } else {
      enemy.currentTarget = []
    }
  //Assign path to enemy
  if(enemy.currentTarget.length == 0 && !enemy.arrived){
    console.log(pathToCoordinates, 'i', i);
    enemy.currentTarget = pathToCoordinates[i];

    if (
      enemy.getTile().x == player.getTile().x &&
      enemy.getTile().y == player.getTile().y
    ) {
      enemy.arrived = true
      enemy.isMoving = false
      player.isDead = true
      console.log("player died")
    if (enemy.getTile().x == player.getTile().x && enemy.getTile().y == player.getTile().y){
      enemy.arrived = true;
      enemy.isMoving = false;
      player.isDead = true;
      player.lives = 0;
      gameRunning = false;
      enemy.stopAnimation();
    }
  }
  
  if(enemy.currentTarget.length == 2 && !enemy.isMoving){
    enemy.isMoving = true;
    console.log(enemy.currentTarget);
    enemy.moveToTile(enemy.currentTarget[0], enemy.currentTarget[1]);
    if(enemy.state == 'attack'){
      pathToCoordinates = [];
      let pathToCalc = enemy.findPath(map, enemy.getTile().y, enemy.getTile().x, player.getTile().y, player.getTile().x);
      pathToCalc.forEach((val) => pathToCoordinates.push([val.col, val.row]));
    } else if (enemy.state == "defence") {
      //find suitable coordinates
      if (!enemy.newCoordsAssigned) {
        newCoords = enemy.findCoordinates() //0 - x, 1 - y
        enemy.newCoordsAssigned = true
      }
      pathToCoordinates = []
      let pathToCalc = enemy.findPath(
        map,
        enemy.getTile().y,
        enemy.getTile().x,
        newCoords[1],
        newCoords[0]
      )

      pathToCalc.forEach((val) => pathToCoordinates.push([val.col, val.row]))
      
    }

    i = 0
    if (i + 1 < pathToCoordinates.length) {
      i++
    }
    // enemy.currentTarget = [];
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

  if (keys["p"]) {
    gameRunning = false
  }
  if (keys[" "]) {
    if (player.placeBomb()) {
      enemy.newCoordsAssigned = false
    }
  }
  if (keys['n']){
    console.log(player);
    console.log(`player x: ${player.getTile().x} player y: ${player.getTile().y}`)
  }

  playerModel.style.left = player.x + "px"
  playerModel.style.top = player.y + "px"

  requestAnimationFrame(main)
}

//Start the main loop
requestAnimationFrame(main)
