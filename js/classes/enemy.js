import { map } from "../maps/map.js";
import { Player } from "./player.js";
import { TILESIZE } from "../config.js";
import { collisionCheck } from "../helpers/collisionDetection.js";

export class Enemy extends Player{
    constructor(x, y){
        super(x, y);
        this.lives = 2;
        this.speed = 1;
        this.playerModelName = "enemy";
        this.playerModel = document.createElement('div');
        this.currentTarget = [];
        this.isMoving = false;
        this.arrived = false;
    }

    moveUp(){
        this.y -= 1 * this.speed;
        this.playerModel.style.top = this.y + "px"
    }

    moveDown(){
        this.y += 1 * this.speed;
        this.playerModel.style.top = this.y + "px"
    }

    moveLeft(){
        this.x -= 1 * this.speed;
        this.playerModel.style.left = this.x + "px"
    }

    moveRight(){
        this.x += 1 * this.speed;
        this.playerModel.style.left = this.x + "px"
    }

    moveToTile(x, y){
        x *= TILESIZE;
        y *= TILESIZE;

        let test = setInterval(() => {
            if(this.x < x && collisionCheck(this.x+1, this.y)){
                this.moveRight();
            }else if (this.x > x && collisionCheck(this.x-1, this.y)){
                this.moveLeft();
                
            }else if (this.y < y && collisionCheck(this.x, this.y+1)){
                this.moveDown();
                
            }else if (this.y > y && collisionCheck(this.x, this.y-1)){
                this.moveUp();
                
            }
            if (this.x == x && this.y == y){
                console.log(`Im on that tile x: ${this.getTile().x}, y: ${this.getTile().y}`);
                // enemy.findPath(map, enemy.getTile().y, enemy.getTile().x, player.getTile().y, player.getTile().x).forEach((val) => pathToPlayer.push([val.col, val.row]));

                // this.placeBomb();
                this.isMoving = false;
                clearInterval(test);
            }
        }, 15)
        
        // console.log(distance);
    }


    findPath(grid, start_i, start_j, end_i, end_j){
        const rows = grid.length;
        const cols = grid[0].length;
        const visited = new Array(rows).fill(false).map(() => new Array(cols).fill(false));
        const parent = new Array(rows).fill(null).map(() => new Array(cols).fill(null));
    
        const dr = [0, 0, 1, -1];
        const dc = [1, -1, 0, 0];
    
        const queue = [];
    
        queue.push(new Cell(start_i, start_j, null));
        visited[start_i][start_j] = true;
    
        while (queue.length > 0) {
            const currentCell = queue.shift();
            const i = currentCell.row;
            const j = currentCell.col;
    
            if (i === end_i && j === end_j) {
                // Found the destination, reconstruct the path
                const path = [];
                let current = currentCell;
                while (current !== null) {
                    path.unshift({ row: current.row, col: current.col });
                    current = current.parent;
                }
                return path;
            }
    
            for (let k = 0; k < 4; k++) {
                const ni = i + dr[k];
                const nj = j + dc[k];
    
                if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && !visited[ni][nj] && grid[ni][nj] === 0) {
                    queue.push(new Cell(ni, nj, currentCell));
                    visited[ni][nj] = true;
                    parent[ni][nj] = currentCell;
                }
            }
        }
    
        // No path found
        return null;
    }
//BFS path finding for 2d matrix
}

class Cell {
    constructor(row, col, parent) {
        this.row = row;
        this.col = col;
        this.parent = parent;
    }
}


// const start_i = 15;
// const start_j = 15;
// const end_i = 1;
// const end_j = 1;

// const path = BFS_2D_Array(map, start_i, start_j, end_i, end_j);
// const test = [];
// path.forEach((val) => test.push([val.col, val.row]));
// console.log(test);
// if (path !== null) {
//     console.log(`Path from (${start_i}, ${start_j}) to (${end_i}, ${end_j}):`, path);
// } else {
//     console.log(`No path found from (${start_i}, ${start_j}) to (${end_i}, ${end_j}).`);
// }


