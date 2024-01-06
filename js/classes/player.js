import { TILESIZE, PLAYERSIZE } from "../config.js"
import { Bomb } from "./bomb.js"
import { bombGlobalArray } from "./bomb.js"
import { generateUniqId, removeItemFromArray } from "../helpers/animateExplotion.js"
import { entities } from "../maps/map.js"
export class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.id = generateUniqId(entities);
    this.speed = 1
    this.bombs = []
    this.maxBomb = 2;
    this.direction = 'idle';
    this.bombPlacementDelay = 1000; //In milliseconds
    this.lastBombPlace = Date.now()-this.bombPlacementDelay;
    this.lives = 3;
    this.isVulnerableToDmg = true;
    this.playerModel = document.createElement("div")
    this.playerModelName = "player";
    this.isDead = false;
    this.score = 0;
  }

  renderPlayer(gameScreen) {
    this.playerModel.className = this.playerModelName;
    this.playerModel.id = this.playerModelName;
    this.playerModel.style.width = PLAYERSIZE + "px"
    this.playerModel.style.height = PLAYERSIZE + "px"
    // playerModel.innerHTML = "Player"

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
          return false;
        }
      }
      //check if bomb max is exceeded
      if (this.bombs.length < this.maxBomb) {
        //calculate bomb id
        let bomb_id = generateUniqId(this.bombs);
        //create html element for bomb
        let bomb = document.createElement("div")
        console.log('player', this);
        const bombObj = new Bomb(this.getTile().x, this.getTile().y, bomb_id, bomb, 0, this);
        //add bomb to gamescreen
        gameScreen.appendChild(bomb);
        this.lastBombPlace = Date.now();
        this.bombs.push(bombObj);
        
        // Set a timeout for the bomb to explode after 3 seconds
        //first animate bomb after 3 seconds explode
        let animationId = bombObj.animateBomb();

        bombObj.timeoutId = setTimeout(() => {
          clearInterval(animationId);
          bombObj.explode(this.bombs); // Call the explode function after 3 seconds
          
          // remove the bomb from the array
          removeItemFromArray(this.bombs, bombObj);

          removeItemFromArray(bombGlobalArray, bombObj);

        }, 3000) // 3000 milliseconds = 3 seconds
        //add bombs to global table
        bombGlobalArray.push(bombObj);
        return true;
      }else{
        console.log('Bomb max limit exceeded!');
        return false;
      }
    }else{
      return false;
    }
  }

 

}
