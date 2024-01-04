const SPRITES = {
  player: {
    left: {
      startPosX: 0,
      endPosX: 32,
      Y: 0,
    },
    right: {
      startPosX: 0,
      endPosX: 32,
      Y: 16,
    },
    down: {
      startPosX: 48,
      endPosX: 80,
      Y: 0,
    },
    up: {
      startPosX: 48,
      endPosX: 80,
      Y: 16,
    },
    dead: {
      startPosX: 0,
      endPosX: 96,
      Y: 32,
    },
  },
  bomb: {
    startPosX: 0,
    endPosX: 32,
    Y: 48,
  },
}

//TODO: build a function Animate which will animate our game. I want build it as flexible as possible
//TODO: parameters (start,end,y,time)

function Animate(start, end, y, time, obj) {}
