import { map, entities, generateMap } from "./maps/map.js"
import { Player } from "./classes/player.js"
import { collisionCheck, collisionMapRefresh } from "./helpers/collisionDetection.js"

import { TILESIZE, PLAYERSIZE, SPRITES } from "./config.js"
import { animate, stopAnimate } from "./script.js"

//gameScreen 680 x 680px
const gameScreen = document.getElementById("gameScreen")
const gameScreenX = map.length * TILESIZE
const gameScreenY = map.length * TILESIZE

gameScreen.style.width = gameScreenX
gameScreen.style.height = gameScreenY

//PLAYER
let player = new Player(TILESIZE, TILESIZE) //COORDINATES TOP LEFTs
//Add player to entities array
entities.push(player);

let keys = {}

//Runs before game loop --> initializes everything
function initGame() {
  generateMap(map)
  player.renderPlayer(gameScreen)
}

initGame()

const playerModel = document.getElementById("player")
//animation stuff

document.addEventListener("keypress", (e) => {
  keys[e.key] = true
//   let animid;
//   if (e.key == "d") {
//     animid = animate(
//       playerModel,
//       SPRITES.player.right.startPosX,
//       SPRITES.player.right.endPosX,
//       SPRITES.player.right.Y,
//       1000
//     )
//   } else if (e.key === "a") {
//     animid = animate(
//       playerModel,
//       SPRITES.player.left.startPosX,
//       SPRITES.player.left.endPosX,
//       SPRITES.player.left.Y,
//       1000
//     )
//   } else if (e.key === "w") {
//     animid = animate(
//       playerModel,
//       SPRITES.player.up.startPosX,
//       SPRITES.player.up.endPosX,
//       SPRITES.player.up.Y,
//       1000
//     )
//   } else if (e.key === "s") {
//     animid = animate(
//       playerModel,
//       SPRITES.player.down.startPosX,
//       SPRITES.player.down.endPosX,
//       SPRITES.player.down.Y,
//       1000
//     )
//   } else {
//     stopAnimate(animid)
//     animid = null;
//   }
})

document.addEventListener("keyup", (e) => {
  keys[e.key] = false
  //check for idle status
  for(let item of Reflect.ownKeys(keys)){
    if(!keys[item]){
      player.direction = 'idle';
    }
  }
  
})

//Main game loop
function main() {
  // console.log(player.direction);
  if (keys["d"]) {
    if (collisionCheck(player.x + player.speed, player.y)) {
      player.x += player.speed
      playerModel.style.backgroundPosition = `0px -${TILESIZE}px`
      player.direction = 'right';
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
      playerModel.style.backgroundPosition = `0px 0px`
      player.direction = 'left';
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
      playerModel.style.backgroundPosition = `-96px 0px`
      player.direction = 'down';
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
      playerModel.style.backgroundPosition = `-96px -32px`
      player.direction = 'up';
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
    console.log(Date.now())
  }
  if (keys[" "]) {
    player.placeBomb()
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