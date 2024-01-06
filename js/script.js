import { TILESIZE } from "./config.js"

function animate(obj, start, end, y, cycle) {
  let currentPosition = start
  const interval = cycle / ((end - start) / TILESIZE)
  let reverse = 1

  return setInterval(() => {
    if (obj && obj.style) {
      obj.style.backgroundPosition = `-${currentPosition}px -${y}px`
    }

    if (currentPosition < end) {
      currentPosition += TILESIZE
    } else {
      currentPosition = start
    }
  }, interval)
}

function stopAnimate(animid) {
  clearInterval(animid)
}

export { animate, stopAnimate }
