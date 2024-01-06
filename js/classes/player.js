import { TILESIZE, PLAYERSIZE } from "../config.js"
import { Bomb } from "./bomb.js"

export class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = 1
    this.bombs = []
    this.maxBomb = 4
    this.direction = 'idle';
    this.bombPlacementDelay = 1000; //In milliseconds
    this.lastBombPlace = Date.now()-this.bombPlacementDelay;
    this.lives = 3;
    this.isVulnerableToDmg = true;
    this.playerModel = document.createElement("div")
  }

  renderPlayer(gameScreen) {
    this.playerModel.className = "player"
    this.playerModel.id = "player"
    this.playerModel.style.width = PLAYERSIZE + "px"
    this.playerModel.style.height = PLAYERSIZE + "px"

    //render player on specific coordinates
    this.playerModel.style.left = this.x + "px"
    this.playerModel.style.top = this.y + "px"

    gameScreen.appendChild(this.playerModel)
  }

  getTile() {
    return {
      x: Math.floor(this.x / TILESIZE),
      y: Math.floor(this.y / TILESIZE),
    }
  }

  placeBomb() {
    //add delay between placing multiple bombs
    if(Date.now() - this.lastBombPlace > this.bombPlacementDelay){
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
        this.lastBombPlace = Date.now();
  
        // Set a timeout for the bomb to explode after 3 seconds
        //first animate bomb after 3 seconds explode
        let animationId = bombObj.animateBomb();
  
        setTimeout(() => {
          clearInterval(animationId);
          bombObj.explode(); // Call the explode function after 3 seconds
  
          //remove the bomb from the array
          for(let i = 0; i < this.bombs.length; i++){
            if (this.bombs[i].id == bombObj.id){
              this.bombs.splice(this.bombs.indexOf(bombObj), 1)
            }
          }
        }, 3000) // 3000 milliseconds = 3 seconds
  
      }else{
        console.log('Bomb max limit exceeded!');
      }
    }
  }

}
