// selectors
const cellElements = document.querySelectorAll("[data-col]");
const winningText = document.querySelector("[data-winning-message-text]");
const winningElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const startingElement = document.getElementById("starting-message")
const startButton = document.getElementById("startButton");
const turnBar = document.getElementById("turn-bar");
const players = ["Red", "Yellow"];
let currentPlayer = "Yellow";
const spaces = [35, 36, 37, 38, 39, 40, 41];

startButton.addEventListener('click', startGame)
restartButton.addEventListener("click", startGame);

function startGame() {
  currentPlayer = randomPlayer();
  if (currentPlayer == "Red") {
    turnBar.style.background = "#e91e63";
  } else {
    turnBar.style.background = "#ffeb3b";
  }
  winningElement.classList.remove("show");
  startingElement.classList.remove("show");
  cellElements.forEach((cell) => {
    cell.classList.remove("active");
    cell.classList.remove("empty");
    cell.classList.remove("red");
    cell.classList.remove("yellow");
    cell.dataset.peice = " ";
    if (cell.dataset.cell >= 35 && cell.dataset.cell < 42) {
      cell.addEventListener("click", insertMove, { once: true });
      cell.classList.add("active");
    } else {
      cell.removeEventListener("click", insertMove);
      cell.classList.add("empty");
    }
  });
}

function randomPlayer() {
  return players[Math.floor(Math.random() * players.length)];
}

function insertMove(e) {
  e.target.dataset.peice = currentPlayer;
  let column = e.target.dataset.col;
  spaces[column] = Number(e.target.dataset.cell) - 7;

  if (spaces[column] >= 0) {
    let next_cell = cellElements[spaces[column]];
    next_cell.addEventListener("click", insertMove, { once: true });
    next_cell.classList.add("active");
    next_cell.classList.remove("empty");
  }

  if (checkWin()) {
    winningText.innerHTML = `${currentPlayer} wins`;
    if (currentPlayer == "Red") {
      winningText.style["color"] = "#e91e63";
    } else {
      winningText.style["color"] = "#ffeb3b";
    }
    winningElement.classList.add("show");
  }

  if (fullCheck()) {
    winningText.innerHTML = "Draw";
    winningElement.classList.add("show");
  }

  swapMoves(e);
}

function swapMoves(e) {
  if (currentPlayer == "Red") {
    e.target.classList.add("red");
    turnBar.style["background"] = "#ffeb3b";
    currentPlayer = "Yellow";
  } else {
    e.target.classList.add("yellow");
    turnBar.style["background"] = "#e91e63";
    currentPlayer = "Red";
  }
}

function colorMatch(one, two, three, four, player) {
  return one == two && one == three && one == four && one == player;
}

function checkWin() {
  return horizontalCheck() || verticalCheck() || diagonalCheck();
}

function horizontalCheck() {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      let spot = i * 7 + j;
      if (
        colorMatch(
          cellElements[spot].dataset.peice,
          cellElements[spot + 1].dataset.peice,
          cellElements[spot + 2].dataset.peice,
          cellElements[spot + 3].dataset.peice,
          currentPlayer
        )
      ) {
        return true;
      }
    }
  }
}

function verticalCheck() {
  for (let i = 0; i < 21; i++) {
    if (
      colorMatch(
        cellElements[i].dataset.peice,
        cellElements[i + 7].dataset.peice,
        cellElements[i + 14].dataset.peice,
        cellElements[i + 21].dataset.peice,
        currentPlayer
      )
    ) {
      return true;
    }
  }
}

function diagonalCheck() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let spot = i * 7 + j;
      if (
        colorMatch(
          cellElements[spot].dataset.peice,
          cellElements[spot + 8].dataset.peice,
          cellElements[spot + 16].dataset.peice,
          cellElements[spot + 24].dataset.peice,
          currentPlayer
        )
      ) {
        return true;
      }
    }
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 7; j++) {
      let spot = i * 7 + j;
      if (
        colorMatch(
          cellElements[spot].dataset.peice,
          cellElements[spot + 6].dataset.peice,
          cellElements[spot + 12].dataset.peice,
          cellElements[spot + 18].dataset.peice,
          currentPlayer
        )
      ) {
        return true;
      }
    }
  }
}

function fullCheck() {
  for (let i = 0; i < 7; i++) {
    if (spaces[i] > 0) {
      return false;
    }
  }
  return true;
}
