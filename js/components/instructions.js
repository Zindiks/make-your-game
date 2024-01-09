const instructions = document.querySelector(".instructions")

function instructionsBoard() {
  const div1 = document.createElement("div")
  const div2 = document.createElement("div")

  const img1 = document.createElement("img")
  const img2 = document.createElement("img")

  const p1 = document.createElement("p")
  p1.innerText = "move"
  const p2 = document.createElement("p")
  p2.innerText = "bomb"

  img1.src = "./assets/wasd.png"
  img1.alt = "wasd"
  img2.src = "./assets/space.png"
  img2.alt = "space"

  div1.appendChild(img1)
  div1.appendChild(p1)

  div2.appendChild(img2)
  div2.appendChild(p2)

  instructions.appendChild(div1)
  instructions.appendChild(div2)
}

export { instructionsBoard }
