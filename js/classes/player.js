import { TILESIZE, PLAYERSIZE } from "../config.js"

export class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = 1
    this.bombs = []
    this.maxBomb = 4
  }

  renderPlayer(gameScreen) {
    let playerModel = document.createElement("div")
    playerModel.className = "player"
    playerModel.id = "player"
    playerModel.style.width = PLAYERSIZE + "px"
    playerModel.style.height = PLAYERSIZE + "px"
    // playerModel.innerHTML = "Player"

    //render player on specific coordinates
    playerModel.style.left = this.x + "px"
    playerModel.style.top = this.y + "px"

    gameScreen.appendChild(playerModel)
  }

  getTile() {
    return {
      x: Math.floor(this.x / TILESIZE),
      y: Math.floor(this.y / TILESIZE),
    }
  }

  placeBomb() {
    if (this.bombs.length < this.maxBomb) {
      let bomb = document.createElement("div")
      bomb.className = "bomb"
      //This Boogabooga is needed in order to shift the bomb to the right place,
      // since the character is not 40x40 px
      bomb.style.left = Math.floor(this.x / TILESIZE) * TILESIZE + "px"
      bomb.style.top = Math.floor(this.y / TILESIZE) * TILESIZE + "px"

      gameScreen.appendChild(bomb)
      this.bombs.push(bomb)
    }
  }
}
