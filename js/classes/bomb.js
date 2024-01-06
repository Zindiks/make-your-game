import { TILESIZE, BOMBSPEED, SPRITES } from "../config.js"
import { map, entities } from "../maps/map.js"
import { collisionMapRefresh } from "../helpers/collisionDetection.js"
import { animate, stopAnimate } from "../script.js";

export class Bomb {
  constructor(x, y, id, htmlElem, position) {
    this.x = x
    this.y = y
    this.id = id
    this.htmlElem = htmlElem
    this.position = position
    this.power = 2
    //Place bomb to the field
    htmlElem.style.left = x * TILESIZE + "px"
    htmlElem.style.top = y * TILESIZE + "px"
    //assign classname
    htmlElem.className = "bomb"
  }

  animateBomb() {
    return setInterval(() => {
      this.htmlElem.style.backgroundPosition = `-${this.position}px -96px`
      // console.log(this.position);
      // 32 is a position of bomb image in Sprites
      if (this.position < 62) {
        this.position += TILESIZE
      } else {
        this.position = 0
      }
    }, BOMBSPEED)
  }

  //TODO: hardcoded solution

      //TEST
    explode() {
        this.htmlElem.className = "space"

        // setTimeout(() => {
        //     this.htmlElem.style.backgroundPosition = "-64px -352px"
        // }, 100)

        // setTimeout(() => {
        //     this.htmlElem.style.backgroundPosition = "-224px -192px"
        // }, 200)

        // setTimeout(() => {
        //     this.htmlElem.style.backgroundPosition = "-224px -352px"
        // }, 300)

        // setTimeout(() => {
        //     this.htmlElem.className = "space"
        // }, 400)
        
        let explosionArray = [{x: this.x, y: this.y, exPower: 0, piece: 'center', isLast: false}];
        let breakArray = [];
        let down, right, up, left = false;
        //calculates bomb directions and how far the bomb explodes
        for(let i = 1; i <= this.power; i++){
          //check if index goes out of range

          if(this.y + i < map.length && map[this.y+i][this.x] == 0 && !down){
            if(i == this.power){
              explosionArray.push({x: this.x, y: this.y+i, exPower: i, piece: 'down', isLast: true})
            }else{
              explosionArray.push({x: this.x, y: this.y+i, exPower: i, piece: 'down'})
            }
            //breaking logic
          }else if (this.y + i < map.length && map[this.y+i][this.x] == 2 && !down){
            breakArray.push({x: this.x, y: this.y+i})
            down = true;
          }else {
            down = true;
          }
          if(this.x + i < map[0].length && map[this.y][this.x+i] == 0 && !right){
            if(i == this.power){
              explosionArray.push({x: this.x+i, y: this.y, exPower: i, piece: 'right', isLast: true})
            }else{
              explosionArray.push({x: this.x+i, y: this.y, exPower: i, piece: 'right'})

            }
          }else if (this.x + i < map[0].length && map[this.y][this.x+i] == 2 && !right){
            breakArray.push({x: this.x+i, y: this.y})
            right = true;
          }else {
            right = true;
          }
          if(this.y - i >= 0 && map[this.y-i][this.x] == 0 && !up){
            if(i == this.power){
              explosionArray.push({x: this.x, y: this.y-i, exPower: i, piece: 'up', isLast: true})
            }else{
              explosionArray.push({x: this.x, y: this.y-i, exPower: i, piece: 'up'})

            }
          }else if (this.y - i >= 0 && map[this.y-i][this.x] == 2 && !up){
            breakArray.push({x: this.x, y: this.y-i})
            up = true;
          }else {
            up = true;
          }
          if(this.x - i >= 0 && map[this.y][this.x-i] == 0 && !left){
            if(i == this.power){
              explosionArray.push({x: this.x-i, y: this.y, exPower: i, piece: 'left', isLast: true})

            }else{
              explosionArray.push({x: this.x-i, y: this.y, exPower: i, piece: 'left'})

            }
          }else if (this.x - i >= 0 && map[this.y][this.x-i] == 2 && !left){
            breakArray.push({x: this.x-i, y: this.y})
            left = true;
          }else {
            left = true;
          }
        }
        console.log(explosionArray);

        //Check which block is which vertical/horisontal/end piece
        let directionCount = {};
        for(let item of explosionArray){
          if(!item.rotation){
            if(!Reflect.ownKeys(directionCount).includes(item.piece) && item.piece != 'center'){
              const pieceCountWithEnd = explosionArray.reduce((count, obj) => count + (obj.piece === item.piece ? 1 : 0), 0);
              const pieceCountWithOutEnd = explosionArray.reduce((count, obj) => count + (obj.piece === item.piece && obj.isLast === undefined ? 1 : 0), 0);
              if (pieceCountWithEnd == pieceCountWithOutEnd){
                directionCount[item.piece] = pieceCountWithOutEnd
              }
            }
            if(item.exPower == directionCount[item.piece]){
              item['isLast'] = true;
            }else if(item.isLast === undefined){
              item['isLast'] = false;
            }
          }
        }
        console.log(directionCount);


        //explosion animation
        for(let item of explosionArray){
          let tile = document.getElementsByClassName(`${item.y}-${item.x}`);
          //animate bomb
          let bombExplosionId = animate(tile[0])
          tile[0].style.backgroundPosition = "-64px -352px";
          //check for player / enemy collision with bomb
          for(let entity of entities){
            if (entity.getTile().x == item.x && entity.getTile().y == item.y){
              console.log(`${entity} got hit!`);
            }
          }
        }
        //block breaking logic
        for(let item of breakArray){
          let tile = document.getElementsByClassName(`${item.y}-${item.x}`);
          //animate breaking block
          let breakBlockAnimationId = animate(tile[0], SPRITES.breakableWall.startPosX, SPRITES.breakableWall.endPosX, SPRITES.breakableWall.Y, 400);
          map[item.y][item.x] = 0;
          setTimeout(() => {
            stopAnimate(breakBlockAnimationId);
            tile[0].className = `tile space ${item.y}-${item.x}`
            tile[0].style.backgroundPosition = ''
          }, 400);
        }
        collisionMapRefresh(map);
  }


}
