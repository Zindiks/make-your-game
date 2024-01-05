import { TILESIZE, PLAYERSIZE } from "../config.js"
import { Bomb } from "./bomb.js"

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
    //firstly check wheter maximum bomb placement is exceeded or is there already bomb in that tile
    //If there is bomb on that tile
    for(let bomb of this.bombs){
      if(bomb.x == this.getTile().x && bomb.y == this.getTile().y){
        console.log('Already bomb');
        return;
      }
    }

    if (this.bombs.length < this.maxBomb) {
      console.log(this.bombs.length)
      //calculate bomb id
      let bomb_id = Math.floor(Math.random() * 100);
      while(true){
        if(!this.bombs.includes(bomb_id)){
          //console.log(bomb_id);
          break
        }else{
          bomb_id = Math.floor(Math.random() * 100);
        }
      }
      
      let position = 0
      let bomb = document.createElement("div")
      bomb.className = "bomb"
      //shift the bomb to the right place,
      // since the character is not 40x40 px
      bomb.style.left = this.getTile().x * TILESIZE + "px"
      bomb.style.top = this.getTile().y * TILESIZE + "px"

      gameScreen.appendChild(bomb);

      const bombObj = new Bomb(this.getTile().x, this.getTile().y, bomb_id);
      this.bombs.push(bombObj);

      let animateBomb = setInterval(() => {
        //console.log(position)
        bomb.style.backgroundPosition = `-${position}px -96px`

        // 32 is a position of bomb image in Sprites
        if (position < 62) {
          position += TILESIZE
        } else {
          position = 0
        }
      }, 200)

      // Set a timeout for the bomb to explode after 3 seconds
      setTimeout(() => {
        clearInterval(animateBomb)
        this.explode(bomb) // Call the explode function after 3 seconds
      }, 3000) // 3000 milliseconds = 3 seconds
    }
  }

  //TODO: hardcoded solution
  explode(bomb) {
    //
    bomb.className = "explode"

    setTimeout(() => {
      bomb.style.backgroundPosition = "-64px -352px"
    }, 200)

    setTimeout(() => {
      bomb.style.backgroundPosition = "-224px -192px"
    }, 200)

    setTimeout(() => {
      bomb.style.backgroundPosition = "-224px -352px"
    }, 400)

    setTimeout(() => {
      bomb.className = "space"
    }, 1000)

    //reset bombs
    this.bombs = [];
  }
}
