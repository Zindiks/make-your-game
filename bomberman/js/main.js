import { map } from "./maps/map.js";
import { Player } from "./classes/player.js";

//gameScreen 680 x 680px
const gameScreen = document.getElementById("gameScreen");
const gameScreenX = 680;
const gameScreenY = 680;
let keys = {};
let collisionMap = [];

//Global event listeners

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
})

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
})

//PLAYER
let player = new Player(40, 40); //COORDINATES TOP LEFT

function generateMap(map){
    for (let i = 0; i < map.length; i++){
        //Create columns
        let column = document.createElement("div");
        for (let j = 0; j < map[i].length; j++){
            //Create tiles in columns
            let tile = document.createElement("div");
            //Class for styling in css
            tile.className = "tile";
            if (map[i][j] != 0){
                collisionMap.push([i*40, j*40, i*40+40, j*40+40])
            }
            tile.innerHTML = map[i][j];
            column.appendChild(tile);
        }
        gameScreen.appendChild(column);
    }
}


//Runs before game loop --> initializes everything
function initGame(){
    generateMap(map);
    player.renderPlayer(gameScreen);
}

initGame();

const playerModel = document.getElementById("player");

//Main game loop
function main(){
    if (keys['d']){
        if (collisionCheck(player.x + player.speed, player.y)){
            player.x += player.speed;
        }
    } else if (keys['a']){
        if (collisionCheck(player.x - player.speed, player.y)){
            player.x -= player.speed;
        }
    } else if (keys['s']){
        if (collisionCheck(player.x, player.y+player.speed)){
            player.y += player.speed;
        }
    } else if (keys['w']){
        if (collisionCheck(player.x, player.y-player.speed)){
            player.y -= player.speed;
        }
        console.log(`Player box: x1-${player.x}, y1-${player.y}, x2-${player.x+30}, y2-${player.y+30}`)
    }
    if (keys['m']){
        console.log(map);
    }
    if (keys['n']){
        player.placeBomb();
    }

    //collisionCheck(er.x, player.y);
    playerModel.style.left = player.x + "px";
    playerModel.style.top = player.y + "px";

    requestAnimationFrame(main);
}

//Start the main loop
requestAnimationFrame(main);

//Collision checking

function collisionCheck(playerx, playery){
    for (let tile of collisionMap){
        //  X1-tile[0]  Y1-tile[1] X2-tile[2] Y-2tile[3]
        if (playerx < tile[0] +40 &&
            playerx + 25 > tile[0] &&
            playery < tile[1] + 40 &&
            playery + 25 > tile[1]){
                return false;
            }
    }
    return true
}

