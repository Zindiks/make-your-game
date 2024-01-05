import { TILESIZE, PLAYERSIZE, BOMBSPEED } from "../config.js"
import { map } from "../maps/map.js";
import { collisionMapRefresh } from "../helpers/collisionDetection.js";

export class Bomb{
    constructor(x, y, id, htmlElem, position) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.htmlElem = htmlElem;
        this.position = position;
        this.power = 3;
        //Place bomb to the field
        htmlElem.style.left = x * TILESIZE + "px";
        htmlElem.style.top = y * TILESIZE + "px";
        //assign classname
        htmlElem.className = "bomb";
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
      }, BOMBSPEED)}

      //TODO: hardcoded solution

      //TEST
    explode() {
        this.htmlElem.className = "explode"

        setTimeout(() => {
            this.htmlElem.style.backgroundPosition = "-64px -352px"
        }, 200)

        setTimeout(() => {
            this.htmlElem.style.backgroundPosition = "-224px -192px"
        }, 400)

        setTimeout(() => {
            this.htmlElem.style.backgroundPosition = "-224px -352px"
        }, 800)

        setTimeout(() => {
            this.htmlElem.className = "space"
        }, 1000)
        
        let explosionArray = [{x: this.x, y: this.y}];
        let breakArray = [];
        let down, right, up, left = false;
        for(let i = 1; i <= this.power; i++){
          //check if index goes out of range

          if(this.y + i < map.length && map[this.y+i][this.x] == 0 && !down){
            console.log('down');
            explosionArray.push({x: this.x, y: this.y+i})
          }else if (this.y + i < map.length && map[this.y+i][this.x] == 2 && !down){
            console.log('break');
            breakArray.push({x: this.x, y: this.y+i})
            down = true;
          }else {
            down = true;
          }
          if(this.x + i < map[0].length && map[this.y][this.x+i] == 0 && !right){
            console.log('right');
            explosionArray.push({x: this.x+i, y: this.y})
          }else if (this.x + i < map[0].length && map[this.y][this.x+i] == 2 && !right){
            console.log('break');
            breakArray.push({x: this.x+i, y: this.y})
            right = true;
          }else {
            right = true;
          }
          if(this.y - i >= 0 && map[this.y-i][this.x] == 0 && !up){
            console.log('up');
            explosionArray.push({x: this.x, y: this.y-i})
          }else if (this.y - i >= 0 && map[this.y-i][this.x] == 2 && !up){
            console.log('break');
            breakArray.push({x: this.x, y: this.y-i})
            up = true;
          }else {
            up = true;
          }
          if(this.x - i >= 0 && map[this.y][this.x-i] == 0 && !left){
            console.log('left');
            explosionArray.push({x: this.x-i, y: this.y})
          }else if (this.x - i >= 0 && map[this.y][this.x-i] == 2 && !left){
            console.log('break');
            breakArray.push({x: this.x-i, y: this.y})
            left = true;
          }else {
            left = true;
          }
        }


        //explosion animation
        for(let item of explosionArray){
          let tile = document.getElementsByClassName(`${item.y}-${item.x}`);
          tile[0].style.backgroundPosition = "-64px -352px";
        }
        //block breaking logic
        for(let item of breakArray){
          let tile = document.getElementsByClassName(`${item.y}-${item.x}`);
          tile[0].className = `tile space ${item.y}-${item.x}`
          map[item.y][item.x] = 0;
        }
        collisionMapRefresh(map);
  }
}