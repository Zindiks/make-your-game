import { map } from "./maps/map.js"
import { Player } from "./classes/player.js"

import { TILESIZE, PLAYERSIZE } from "./config.js"

//gameScreen 680 x 680px
const gameScreen = document.getElementById("gameScreen")

const gameScreenX = map.length * TILESIZE
const gameScreenY = map.length * TILESIZE

gameScreen.style.width = gameScreenX
gameScreen.style.height = gameScreenY
let collisionMap = []
let keys = {}

//Global event listeners

document.addEventListener("keydown", (e) => {
  keys[e.key] = true
})

document.addEventListener("keyup", (e) => {
  keys[e.key] = false
})
//PLAYER
let player = new Player(TILESIZE, TILESIZE) //COORDINATES TOP LEFTs

function generateMap(map) {
  for (let i = 0; i < map.length; i++) {
    //Create columns
    let column = document.createElement("div")
    for (let j = 0; j < map[i].length; j++) {
      //Create tiles in columns
      let tile = document.createElement("div")
      //Class for styling in css
      tile.className = "tile"
      tile.style.width = TILESIZE + "px"
      tile.style.height = TILESIZE + "px"

      switch (map[j][i]) {
        case 3:
          tile.classList.add("wall")
          break
        case 0:
          tile.classList.add("space")
          break
        case 2:
          tile.classList.add("breakable-wall")
          break
        default:
          break
      }

      if (map[j][i] !== 0) {
        collisionMap.push([
          i * TILESIZE,
          j * TILESIZE,
          i * TILESIZE + TILESIZE,
          j * TILESIZE + TILESIZE,
        ])
      }
      //   tile.innerHTML = map[i][j]

      column.appendChild(tile)
    }
    gameScreen.appendChild(column)
  }
}

//Runs before game loop --> initializes everything
function initGame() {
  generateMap(map)
  player.renderPlayer(gameScreen)
}

initGame()

const playerModel = document.getElementById("player")

//Main game loop
function main() {
  if (keys["d"]) {
    if (collisionCheck(player.x + player.speed, player.y)) {
      player.x += player.speed
      playerModel.style.backgroundPosition = `0px -${TILESIZE}px`
      //animate
    }else{
      //has to check where to calc to go up or down 

      //and only move if its like 60% already there
      
        //check wheter to go up or down

        //down
        if((player.y - player.getTile().y*TILESIZE) > Math.floor(TILESIZE * 0.6)){
          console.log('down');
          if (collisionCheck(player.x, player.y + player.speed)){
            player.y += player.speed;
          }
          //up
        }else if ((player.y - player.getTile().y*TILESIZE) < Math.round(TILESIZE * 0.4)){
          console.log('up');
          if (collisionCheck(player.x, player.y - player.speed)){
            player.y -= player.speed
          }
        }
    }
  } else if (keys["a"]) {
    if (collisionCheck(player.x - player.speed, player.y)) {
      player.x -= player.speed
      playerModel.style.backgroundPosition = `0px 0px`
    }else{
      //CUT CORNERS MOVEMENT COMMENTED ON THE D LETTER ALREADY
      if((player.y - player.getTile().y*TILESIZE) > Math.floor(TILESIZE * 0.6)){
        console.log('down');
        if (collisionCheck(player.x, player.y + player.speed)){
          player.y += player.speed;
        }
        //up
      }else if ((player.y - player.getTile().y*TILESIZE) < Math.round(TILESIZE * 0.4)){
        console.log('up');
        if (collisionCheck(player.x, player.y - player.speed)){
          player.y -= player.speed
        }
      }

    }
  } else if (keys["s"]) {
    if (collisionCheck(player.x, player.y + player.speed)) {
      player.y += player.speed;
      playerModel.style.backgroundPosition = `-96px 0px`
      //DEBUF INFO
      // console.log(`tile coords x: ${player.getTile().x*TILESIZE}, tile coords y: ${(player.getTile().y+1)*(TILESIZE)} player coords: ${player.y + player.speed}`);
      // console.log(`Player box: x1-${player.x}, y1-${player.y}, x2-${player.x + 30}, y2-${player.y + 30}`)
    }else{

      //HAVE TO FLIP THE LOGIC FROM DOWN TO RIGHT AND UP TO LEFT
      if((player.x - player.getTile().x*TILESIZE) > Math.floor(TILESIZE * 0.6)){
        console.log('right');
        if (collisionCheck(player.x + player.speed, player.y)){
          player.x += player.speed;
        }
        //up
      }else if ((player.y - player.getTile().y*TILESIZE) < Math.round(TILESIZE * 0.4)){
        console.log('left');
        if (collisionCheck(player.x - player.speed, player.y)){
          player.x -= player.speed
        }
      }

    }
  } else if (keys["w"]) {
    if (collisionCheck(player.x, player.y - player.speed)) {
      player.y -= player.speed
      playerModel.style.backgroundPosition = `-96px -32px`
    }else {

      if((player.x - player.getTile().x*TILESIZE) > Math.floor(TILESIZE * 0.6)){
        console.log('right');
        if (collisionCheck(player.x + player.speed, player.y)){
          player.x += player.speed;
        }
        //up
      }else if ((player.y - player.getTile().y*TILESIZE) < Math.round(TILESIZE * 0.4)){
        console.log('left');
        if (collisionCheck(player.x - player.speed, player.y)){
          player.x -= player.speed
        }
      }

    }
    // console.log(
    //   `Player box: x1-${player.x}, y1-${player.y}, x2-${player.x + 30}, y2-${
    //     player.y + 30
    //   }`
    // )
  }
  if (keys["m"]) {
    console.log(map)
  }
  if (keys["n"]) {
    player.placeBomb()
  }
  if(keys['t']){
    console.log(`current tile x: ${player.getTile().x} y: ${player.getTile().y}`)
    console.log(`current tile = ${map[player.getTile().y][player.getTile().x]}`)
  }

  //collisionCheck(er.x, player.y);
  playerModel.style.left = player.x + "px"
  playerModel.style.top = player.y + "px"

  requestAnimationFrame(main)
}

//Start the main loop
requestAnimationFrame(main)

//Collision checking

function collisionCheck(playerx, playery) {
  for (let tile of collisionMap) {
    //  X1-tile[0]  Y1-tile[1] X2-tile[2] Y-2tile[3]
    if (
      playerx < tile[0] + TILESIZE &&
      playerx + PLAYERSIZE > tile[0] &&
      playery < tile[1] + TILESIZE &&
      playery + PLAYERSIZE > tile[1]
    ) {
      return false
    }
  }
  return true
}
