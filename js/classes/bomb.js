import { TILESIZE, PLAYERSIZE, BOMBSPEED } from "../config.js"

export class Bomb{
    constructor(x, y, id, htmlElem, position) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.htmlElem = htmlElem;
        this.position = position;
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
    explode() {
        this.htmlElem.className = "explode"

        setTimeout(() => {
            this.htmlElem.style.backgroundPosition = "-64px -352px"
        }, 200)

        setTimeout(() => {
            this.htmlElem.style.backgroundPosition = "-224px -192px"
        }, 200)

        setTimeout(() => {
            this.htmlElem.style.backgroundPosition = "-224px -352px"
        }, 400)

        setTimeout(() => {
            this.htmlElem.className = "space"
        }, 1000)
  }
}