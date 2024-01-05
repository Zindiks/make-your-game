import { TILESIZE } from "./config.js"

function animate(obj, start, end, y, cycle) {
  // cycle is a time expected to make full animation until it will repeated
  let currentPosition = start

  const interval = cycle / ((end - start) / TILESIZE)

  return setInterval(() => {
    if (obj && obj.style) {
      obj.style.backgroundPosition = `-${currentPosition}px -${y}px`
    }

    if (currentPosition < end) {
      console.log("bomb")
      currentPosition += TILESIZE
    } else {
      currentPosition = start
    }
  }, interval)
}

function stopAnimate() {
  clearInterval(animate)
}

export { animate, stopAnimate }
