import { map } from "../maps/map.js"
import { Player } from "./player.js"
import { TILESIZE } from "../config.js"
import { collisionCheck } from "../helpers/collisionDetection.js"
import { animate, stopAnimate } from "../helpers/animate.js"
import { SPRITES } from "../config.js"
import { bombGlobalArray } from "./bomb.js"

export class Enemy extends Player {
  constructor(x, y) {
    super(x, y)
    this.lives = 2
    this.speed = 1
    this.playerModelName = "enemy"
    this.playerModel = document.createElement("div")
    this.currentTarget = []
    this.isMoving = false
    this.arrived = false // arrived to its destination
    this.state = "attack" //attack means it follows players and places bombs whenever its near him //// defence means its trying to avoid bombs;
    this.newCoordsAssigned = false
    //Animation stuff
    this.animations = {}
    this.rightAnimId = undefined
    this.leftAnimId = undefined
    this.upAnimId = undefined
    this.downAnimId = undefined
    this.animations[this.rightAnimId] = false
    this.animations[this.leftAnimId] = false
    this.animations[this.upAnimId] = false
    this.animations[this.downAnimId] = false
  }

  moveUp() {
    this.y -= 1 * this.speed
    this.playerModel.style.top = this.y + "px"
  }

  moveDown() {
    this.y += 1 * this.speed
    this.playerModel.style.top = this.y + "px"
  }

  moveLeft() {
    this.x -= 1 * this.speed
    this.playerModel.style.left = this.x + "px"
  }

  moveRight() {
    this.x += 1 * this.speed
    this.playerModel.style.left = this.x + "px"
  }

  findCoordinates() {
    let allAvailableCoordinates = []
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] == 0) {
          allAvailableCoordinates.push([j, i])

                    //x == j
                    //y == i
                }
            }
        }
        let testingCase = 0;
        while(true){
            let randomTile = Math.floor(Math.random() * allAvailableCoordinates.length);
            let counterForBombs = 0;
            for(let bomb of bombGlobalArray){
                let counterForTiles = 0;
                let [breakArray, explosionArray] = bomb.calcBombExplosionArray();
                for(let tile of explosionArray){
                    console.log(tile);
                    if(allAvailableCoordinates[randomTile][0] != tile.x || allAvailableCoordinates[randomTile][1] != tile.y){
                        counterForTiles++;
                    }
                }
                if(counterForTiles == explosionArray.length){
                    counterForBombs++;
                }

            }
            if(counterForBombs == bombGlobalArray.length){
                return allAvailableCoordinates[randomTile];
            }else{
                if(testingCase >= 10){
                    console.log('returning');
                    return false;
                }
                testingCase++;
            }
        }

    }

  moveToTile(x, y) {
    x *= TILESIZE
    y *= TILESIZE

        let test = setInterval(() => {
            if(this.isDead){
                return
            }else if(this.x < x){
                this.moveRight();
                if(this.direction != 'right'){
                    this.stopAnimation();
                }
                this.direction = 'right';
                if(!this.animations[this.rightAnimId]){
                    this.rightAnimId = animate(
                        this.playerModel,
                        SPRITES.player.right.startPosX,
                        SPRITES.player.right.endPosX,
                        SPRITES.player.right.Y,
                        200
                      )
                    this.animations[this.rightAnimId] = true;
                }

            }else if (this.x > x){
                if(this.direction != 'left'){
                    this.stopAnimation();
                }
                this.direction = 'left';
                this.moveLeft();
                if(!this.animations[this.leftAnimId]){
                    this.leftAnimId = animate(
                        this.playerModel,
                        SPRITES.player.left.startPosX,
                        SPRITES.player.left.endPosX,
                        SPRITES.player.left.Y,
                        200
                      )
                    this.animations[this.leftAnimId] = true;
                }
            }else if (this.y < y){
                this.moveDown();
                if(this.direction != 'down'){
                    this.stopAnimation();
                }
                this.direction = 'down';
                if(!this.animations[this.downAnimId]){
                    this.downAnimId = animate(
                        this.playerModel,
                        SPRITES.player.down.startPosX,
                        SPRITES.player.down.endPosX,
                        SPRITES.player.down.Y,
                        200
                      )
                    this.animations[this.downAnimId] = true;
                }
                
            }else if (this.y > y){
                if(this.direction != 'up'){
                    this.stopAnimation();
                }
                this.direction = 'up'
                this.moveUp();
                if(!this.animations[this.upAnimId]){
                    this.upAnimId = animate(
                        this.playerModel,
                        SPRITES.player.up.startPosX,
                        SPRITES.player.up.endPosX,
                        SPRITES.player.up.Y,
                        200
                      )
                    this.animations[this.upAnimId] = true;
                }
            }else if (this.x == x && this.y == y){
                this.isMoving = false;
                this.currentTarget = [];
                clearInterval(test);
            }else {
                clearInterval(test);
            }
        }, 15)
        // console.log(test);
        // console.log(distance);
    }

  stopAnimation() {
    for (let item of Object.keys(this.animations)) {
      if (item != "undefined") {
        delete this.animations[item]
        stopAnimate(item)
      }
    }
  }

  findPath(grid, start_i, start_j, end_i, end_j) {
    const rows = grid.length
    const cols = grid[0].length
    const visited = new Array(rows)
      .fill(false)
      .map(() => new Array(cols).fill(false))
    const parent = new Array(rows)
      .fill(null)
      .map(() => new Array(cols).fill(null))

    const dr = [0, 0, 1, -1]
    const dc = [1, -1, 0, 0]

    const queue = []

    queue.push(new Cell(start_i, start_j, null))
    visited[start_i][start_j] = true

    while (queue.length > 0) {
      const currentCell = queue.shift()
      const i = currentCell.row
      const j = currentCell.col

      if (i === end_i && j === end_j) {
        // Found the destination, reconstruct the path
        const path = []
        let current = currentCell
        while (current !== null) {
          path.unshift({ row: current.row, col: current.col })
          current = current.parent
        }
        return path
      }

      for (let k = 0; k < 4; k++) {
        const ni = i + dr[k]
        const nj = j + dc[k]

        if (
          ni >= 0 &&
          ni < rows &&
          nj >= 0 &&
          nj < cols &&
          !visited[ni][nj] &&
          grid[ni][nj] === 0
        ) {
          queue.push(new Cell(ni, nj, currentCell))
          visited[ni][nj] = true
          parent[ni][nj] = currentCell
        }
      }
    }

    // No path found
    return null
  }
  //BFS path finding for 2d matrix
}

class Cell {
  constructor(row, col, parent) {
    this.row = row
    this.col = col
    this.parent = parent
  }
}

