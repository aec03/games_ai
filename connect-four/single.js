// selectors
const cellElements = document.querySelectorAll("[data-cell]");
const winningText = document.querySelector("[data-winning-message-text]");
const winningElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const startingElement = document.getElementById("starting-message");
const startButton = document.getElementById("startButton");
const turnBar = document.getElementById("turn-bar");
const pointers = document.querySelectorAll(".pointer-cell");

// variables
const RED = "#e91e63";
const YELLOW = "#ffeb3b";
const WHITE = "#ecf0f1";
let isRedTurn;
let spaces = [35, 36, 37, 38, 39, 40, 41];

// event handlers
const handleCellMouseOver = (e) => {
  const cell = e.target;
  const column = cell.dataset.col;
  pointers[column].classList.add(isRedTurn ? "red" : "yellow");
};

const handleCellMouseOut = (e) => {
  const cell = e.target;
  const column = cell.dataset.col;
  pointers[column].classList.remove("red");
  pointers[column].classList.remove("yellow");
};

const insertMove = (e) => {
  const cell = e.target;
  const column = Number(cell.dataset.col);

  if (spaces[column] >= 0) {
    const nextCell = cellElements[spaces[column]];
    spaces[column] -= 7;
    nextCell.classList.add(isRedTurn ? "red" : "yellow");
    nextCell.dataset.peice = isRedTurn ? "red" : "yellow";
  }

  if (checkWin()) {
    winningText.style.color = isRedTurn ? RED : YELLOW;
    winningText.innerHTML = `${isRedTurn ? "Red" : "Yellow"} wins!`;
    winningElement.classList.add("show");
  }

  if (isFull()) {
    winningText.style.color = WHITE;
    winningText.innerHTML = "Draw";
    winningElement.classList.add("show");
  }

  swapMoves();
  turnBar.style["background"] = isRedTurn ? RED : YELLOW;
};

// add event listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

cellElements.forEach((cell) => {
  cell.addEventListener("mouseover", handleCellMouseOver);
  cell.addEventListener("mouseout", handleCellMouseOut);
  cell.addEventListener("click", insertMove);
});

// functions
function startGame() {
  cellElements.forEach((cell) => resetCells(cell));
  startingElement.classList.remove("show");
  winningElement.classList.remove("show");

  spaces = [35, 36, 37, 38, 39, 40, 41];
  isRedTurn = randomPlayer;
}

// computer move
function computerMove() {
  return true;
}

// resets cells
function resetCells(cell) {
  cell.dataset.peice = " ";
  cell.classList.remove("red", "yellow");
}

// chooses random player to start
function randomPlayer() {
  let choice = Math.floor(Math.random() * 2);
  if (choice == 0) {
    isRedTurn = true;
  } else {
    isRedTurn = false;
  }
}

// changes the player
function swapMoves() {
  isRedTurn = !isRedTurn;
}

// checks if four cells are equal and not empty
function colorMatch(one, two, three, four) {
  return (
    one == two &&
    one == three &&
    one == four &&
    one == `${isRedTurn ? "red" : "yellow"}`
  );
}

// checks for win
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
          cellElements[spot + 3].dataset.peice
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
        cellElements[i + 21].dataset.peice
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
          cellElements[spot + 24].dataset.peice
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
          cellElements[spot + 18].dataset.peice
        )
      ) {
        return true;
      }
    }
  }
}

function isFull() {
  return false;
}
