import { TILESIZE, BOMBSPEED, SPRITES } from "../config.js"
import { map, entities } from "../maps/map.js"
import { collisionMapRefresh } from "../helpers/collisionDetection.js"
import { animate, stopAnimate } from "../script.js"
import { explodeAnimation, removeItemFromArray } from "../helpers/animateExplotion.js"

export const bombGlobalArray = [];

const gameScreen = document.getElementById('gameScreen');
export class Bomb {
  constructor(x, y, id, htmlElem, position) {
    this.x = x
    this.y = y
    this.id = id
    this.htmlElem = htmlElem
    this.position = position
    this.power = 10
    //Place bomb to the field
    htmlElem.style.left = x * TILESIZE + "px"
    htmlElem.style.top = y * TILESIZE + "px"
    //assign classname
    htmlElem.className = "bomb"
  }

  animateBomb() {
    return setInterval(() => {
      this.htmlElem.style.backgroundPosition = `-${this.position}px -96px`
      // 32 is a position of bomb image in Sprites
      if (this.position < 62) {
        this.position += TILESIZE
      } else {
        this.position = 0
      }
    }, BOMBSPEED)
  }
  //TEST
  explode(bombs) {
    //remove bomb sprite
    this.htmlElem.className = "space"

    //calculates bomb directions and how far the bomb explodes
    let [breakArray, explosionArray] = this.calcBombExplosionArray(); 

    //Check which block is which vertical/horisontal/end piece
    let directionCount = {}
    for (let item of explosionArray) {
      if (!item.rotation) {
        if (
          !Reflect.ownKeys(directionCount).includes(item.piece) &&
          item.piece != "center"
        ) {
          const pieceCountWithEnd = explosionArray.reduce(
            (count, obj) => count + (obj.piece === item.piece ? 1 : 0),
            0
          )
          const pieceCountWithOutEnd = explosionArray.reduce(
            (count, obj) =>
              count +
              (obj.piece === item.piece && obj.isLast === undefined ? 1 : 0),
            0
          )
          if (pieceCountWithEnd == pieceCountWithOutEnd) {
            directionCount[item.piece] = pieceCountWithOutEnd
          }
        }
        if (item.exPower == directionCount[item.piece]) {
          item["isLast"] = true
        } else if (item.isLast === undefined) {
          item["isLast"] = false
        }
      }
    }

    //explosion animation
    for (let item of explosionArray) {
      let tile = document.getElementsByClassName(`${item.y}-${item.x}`)
      //check if there is another bomb in the way
      for(let bomb of bombGlobalArray){
        if(bomb.x === item.x && bomb.y === item.y && bomb.id !== item.bomb_id){
          //clear the animation
          clearTimeout(bomb.timeoutId);
          //remove bombs from both arrays
          removeItemFromArray(bombGlobalArray, bomb);
          removeItemFromArray(bombs, bomb);
          //explosion animation
          bomb.explode(bombs);
        }
      }
      //animate bomb
      item["obj"] = tile[0]
      explodeAnimation(item)
      //check for player / enemy collision with bomb
      for (let entity of entities) {
        if (
          entity.getTile().x == item.x &&
          entity.getTile().y == item.y &&
          entity.isVulnerableToDmg
        ) {
          console.log(`${entity} got hit!`)
          if (entity.lives == 1) {
            entity.lives = 0
            console.log("gameover")
            //animate death, death screen etc
            if(entity.playerModelName == 'enemy'){
              console.log('enemy died');
              console.log(entity);
              entity.isDead = true;
              entity.stopAnimation();
            }
            let deadAnimationId = animate(entity.playerModel, SPRITES.player.dead.startPosX, SPRITES.player.dead.endPosX, SPRITES.player.dead.Y, 1000, false);
            setTimeout(() => {
              stopAnimate(deadAnimationId)
              //if enemy then remove from gamescreen
              if(entity.playerModelName == "enemy"){
                entity.playerModel.style.backgroundPosition = "";
                removeItemFromArray(entities, entity);
                gameScreen.removeChild(entity.playerModel); 
              }
            }, 1200)
          } else {
            entity.lives--
            console.log(entity.lives)
            entity.isVulnerableToDmg = false
            //animation wheter character takes damage or no, just opcaity controller
            let opacityController = 0.2
            let plusOrMinus = 1
            let playerDeadAnim = setInterval(() => {
              entity.playerModel.style.opacity = 1 - opacityController
              opacityController += 0.2 * plusOrMinus
              if (opacityController <= 0.4) {
                plusOrMinus *= -1
              }
            }, 100)

            //Player takes damage again, and remove the animation which shows that player does not take damage
            setTimeout(() => {
              clearInterval(playerDeadAnim)
              entity.isVulnerableToDmg = true
              entity.playerModel.style.opacity = 1
            }, 3000)
          }
        }
      }
    }
    //block breaking logic
    for (let item of breakArray) {
      let tile = document.getElementsByClassName(`${item.y}-${item.x}`)
      //animate breaking block
      let breakBlockAnimationId = animate(
        tile[0],
        SPRITES.breakableWall.startPosX,
        SPRITES.breakableWall.endPosX,
        SPRITES.breakableWall.Y,
        400
      )
      map[item.y][item.x] = 0
      setTimeout(() => {
        stopAnimate(breakBlockAnimationId)
        tile[0].className = `tile space ${item.y}-${item.x}`
        tile[0].style.backgroundPosition = ""
      }, 400)
    }

    collisionMapRefresh(map)

  }

  calcBombExplosionArray(){
    let down,
    right,
    up,
    left = false
    let explosionArray = [
      { x: this.x, y: this.y, exPower: 0, piece: "center", isLast: false , bomb_id: this.id},
    ]
    let breakArray = []
    for (let i = 1; i <= this.power; i++) {
      //check if index goes out of range

      if (this.y + i < map.length && map[this.y + i][this.x] == 0 && !down) {
        if (i == this.power) {
          explosionArray.push({
            x: this.x,
            y: this.y + i,
            exPower: i,
            piece: "down",
            isLast: true,
            bomb_id: this.id,
          })
        } else {
          explosionArray.push({
            x: this.x,
            y: this.y + i,
            exPower: i,
            piece: "down",
            bomb_id: this.id,
          })
        }
        //breaking logic
      } else if (
        this.y + i < map.length &&
        map[this.y + i][this.x] == 2 &&
        !down
      ) {
        breakArray.push({ x: this.x, y: this.y + i })
        down = true
      } else {
        down = true
      }
      if (
        this.x + i < map[0].length &&
        map[this.y][this.x + i] == 0 &&
        !right
      ) {
        if (i == this.power) {
          explosionArray.push({
            x: this.x + i,
            y: this.y,
            exPower: i,
            piece: "right",
            isLast: true,
            bomb_id: this.id,
          })
        } else {
          explosionArray.push({
            x: this.x + i,
            y: this.y,
            exPower: i,
            piece: "right",
            bomb_id: this.id,
          })
        }
      } else if (
        this.x + i < map[0].length &&
        map[this.y][this.x + i] == 2 &&
        !right
      ) {
        breakArray.push({ x: this.x + i, y: this.y })
        right = true
      } else {
        right = true
      }
      if (this.y - i >= 0 && map[this.y - i][this.x] == 0 && !up) {
        if (i == this.power) {
          explosionArray.push({
            x: this.x,
            y: this.y - i,
            exPower: i,
            piece: "up",
            isLast: true,
            bomb_id: this.id,
          })
        } else {
          explosionArray.push({
            x: this.x,
            y: this.y - i,
            exPower: i,
            piece: "up",
            bomb_id: this.id,
          })
        }
      } else if (this.y - i >= 0 && map[this.y - i][this.x] == 2 && !up) {
        breakArray.push({ x: this.x, y: this.y - i })
        up = true
      } else {
        up = true
      }
      if (this.x - i >= 0 && map[this.y][this.x - i] == 0 && !left) {
        if (i == this.power) {
          explosionArray.push({
            x: this.x - i,
            y: this.y,
            exPower: i,
            piece: "left",
            isLast: true,
            bomb_id: this.id,
          })
        } else {
          explosionArray.push({
            x: this.x - i,
            y: this.y,
            exPower: i,
            piece: "left",
            bomb_id: this.id,
          })
        }
      } else if (this.x - i >= 0 && map[this.y][this.x - i] == 2 && !left) {
        breakArray.push({ x: this.x - i, y: this.y })
        left = true
      } else {
        left = true
      }
    }

    return [breakArray, explosionArray];
  }
}
