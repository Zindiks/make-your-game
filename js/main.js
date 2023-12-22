import { map } from "./maps/map.js"
import { Player } from "./classes/player.js"

//gameScreen 680 x 680px
const gameScreen = document.getElementById("gameScreen")

const TILESIZE = 40
const PLAYERSIZE = 16

// const gameScreenX = 680
// const gameScreenY = 680
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
let player = new Player(40, 40) //COORDINATES TOP LEFTs

function generateMap(map) {
  for (let i = 0; i < map.length; i++) {
    //Create columns
    let column = document.createElement("div")
    for (let j = 0; j < map[i].length; j++) {
      //Create tiles in columns
      let tile = document.createElement("div")
      //Class for styling in css
      tile.className = "tile"

      switch (map[j][i]) {
        case 3:
          tile.classList.add("wall")
          break
        case 0:
          tile.classList.add("space")
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
    }
  } else if (keys["a"]) {
    if (collisionCheck(player.x - player.speed, player.y)) {
      player.x -= player.speed
    }
  } else if (keys["s"]) {
    if (collisionCheck(player.x, player.y + player.speed)) {
      player.y += player.speed
    }
  } else if (keys["w"]) {
    if (collisionCheck(player.x, player.y - player.speed)) {
      player.y -= player.speed
    }
    console.log(
      `Player box: x1-${player.x}, y1-${player.y}, x2-${player.x + 30}, y2-${
        player.y + 30
      }`
    )
  }
  if (keys["m"]) {
    console.log(map)
  }
  if (keys["n"]) {
    player.placeBomb()
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
