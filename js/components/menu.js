const menu = document.querySelector("#menu")
const header = document.createElement("h1")
const tileEditor = document.createElement("button")
const continueButton = document.createElement("button")
const restartButton = document.createElement("button")
const startButton = document.createElement("button")


startButton.onclick = hide
startButton.innerText = "Start Game"
tileEditor.innerText = "Tile Editor"
continueButton.innerText = "Continue"
restartButton.innerText = "Restart"

function hide() {
  console.log(123)
  menu.style.display = "none"
}

function renderMenu() {
  const img = document.createElement("img")
  img.src =
    "https://ssb.wiki.gallery/images/thumb/f/f4/Bomberman_logo.png/1200px-Bomberman_logo.png"
  img.alt = "logo"
  img.classList.add("logo")

  menu.appendChild(img)
}

function startMenu() {
  renderMenu()
  menu.style.display = "flex"

  header.innerText = "Welcome"
  menu.appendChild(header)
  menu.appendChild(startButton)
  menu.appendChild(tileEditor)
}

function pauseMenu() {
  renderMenu()
  menu.style.display = "flex"

  header.innerText = "Pause"
  menu.appendChild(header)
  menu.appendChild(continueButton)
  menu.appendChild(renderMenu)
}

export { menu, startMenu, pauseMenu }
