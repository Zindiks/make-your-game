import { TILESIZE, PLAYERSIZE, SPRITES } from "../config.js"
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
    //Check if bomb exists in that tile
    for(let bomb of this.bombs){
      if(bomb.x == this.getTile().x && bomb.y == this.getTile().y){
        return;
      }
    }
    //check if bomb max is exceeded
    if (this.bombs.length < this.maxBomb) {
      //calculate bomb id
      let bomb_id = Math.floor(Math.random() * 100);
      while(true){
        if(!this.bombs.includes(bomb_id)){
          break
        } else {
          bomb_id = Math.floor(Math.random() * 100)
        }
      }
      //create html element for bomb
      let bomb = document.createElement("div")
      const bombObj = new Bomb(this.getTile().x, this.getTile().y, bomb_id, bomb, 0);
      this.bombs.push(bombObj);
      //add bomb to gamescreen
      gameScreen.appendChild(bomb);

      // Set a timeout for the bomb to explode after 3 seconds
      //first animate bomb after 3 seconds explode
      let animationId = bombObj.animateBomb();
      setTimeout(() => {
        clearInterval(animationId);
        bombObj.explode(); // Call the explode function after 3 seconds
        // for(let bomb of this.bombs){
        //   if 
        // }
      }, 3000) // 3000 milliseconds = 3 seconds

    }else{
      console.log('Bomb max limit exceeded!');
    }
  }

}
