export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.bombs = [];
        this.maxBomb = 4;
    }

    renderPlayer(gameScreen) {
        let playerModel = document.createElement("div");
        playerModel.className = "player";
        playerModel.id = "player";
        playerModel.innerHTML = "Player";

        //render player on specific coordinates
        playerModel.style.left = this.x+"px";
        playerModel.style.top = this.y+"px";

        gameScreen.appendChild(playerModel);
    }

    getTile(){
        return {x: Math.floor(this.x / 40), 
                y: Math.floor(this.y / 40),
            }
    }

    placeBomb(){
        if(this.bombs.length < this.maxBomb){

            let bomb = document.createElement("div");
            bomb.className = "bomb";
        
            //This oogabooga is needed in order to shift the bomb to the right place,
            // since the character is not 40x40 px 
            bomb.style.left = Math.floor(this.x / 40)*40+"px";
            bomb.style.top = Math.floor(this.y / 40)*40+"px";
        
            gameScreen.appendChild(bomb);
            this.bombs.push(bomb);
        }
    }
} 