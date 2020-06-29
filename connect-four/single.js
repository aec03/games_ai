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
const PLAYER = "red";
const COMPUTER = "yellow";
let isHumanTurn;
let spaces = [35, 36, 37, 38, 39, 40, 41];

// event handlers
const handleCellMouseOver = (e) => {
  const cell = e.target;
  const column = cell.dataset.col;
  pointers[column].classList.add(isHumanTurn ? PLAYER : COMPUTER);
};

const handleCellMouseOut = (e) => {
  const cell = e.target;
  const column = cell.dataset.col;
  pointers[column].classList.remove(PLAYER);
  pointers[column].classList.remove(COMPUTER);
};

const insertMove = (e) => {
  const cell = e.target;
  const column = Number(cell.dataset.col);

  if (spaces[column] >= 0) {
    const nextCell = cellElements[spaces[column]];
    nextCell.classList.add(isHumanTurn ? PLAYER : COMPUTER);
    nextCell.dataset.peice = isHumanTurn ? PLAYER : COMPUTER;
    spaces[column] -= 7;
  } else {
    cellElements.forEach((cell) => {
      if (cell.dataset.col == column) {
        cell.classList.add("empty");
        cell.removeEventListener("click");
      }
    });
    spaces = spaces.filter((value) => value >= 0);
    console.log(spaces);
  }

  if (checkWin(`?{isHumanTurn ? 'red' : 'yellow'}`)) {
    winningText.style.color = isHumanTurn ? RED : YELLOW;
    winningText.innerHTML = `${isHumanTurn ? PLAYER : COMPUTER} wins!`;
    winningElement.classList.add("show");
  }

  if (isFull()) {
    winningText.style.color = WHITE;
    winningText.innerHTML = "Draw";
    winningElement.classList.add("show");
  }

  swapMoves();
  turnBarColor();
  computerMove();
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
  isHumanTurn = randomPlayer;

  turnBarColor();

  if (!isHumanTurn) {
    console.log("comp");

    computerMove();
  }
}

// computer move
function computerMove() {
  let [bestMove, bestScore] = self.miniMax(2, -Infinity, Infinity, true);
  insertPiece(COMPUTER, bestMove);
  cellElements[bestMove].classList.add(COMPUTER)
  console.log('complete')
}

function miniMax(depth, alpha, beta, isMaximizing) {
  let possibleMoves = spaces.filter((n) => n >= 0);
  console.log(possibleMoves)
  lastMove = isLastMove();
  if (depth == 0 || lastMove) {
    if (lastMove) {
      if (checkWin(COMPUTER)) {
        return null, 10000;
      } else if (checkWin(PLAYER)) {
        return null, -10000;
      } else {
        return null, 0;
      }
    } else {
      return null, calculateScore(COMPUTER);
    }
  }
  if (isFull()) {
    return 0;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestMove = possibleMoves[3];
    for (let i = 0; i < possibleMoves.length; i++) {
      insertPiece(COMPUTER, possibleMoves[i]);
      let score = miniMax(depth - 1, alpha, beta, false)[1];
      removeMove(possibleMoves[i]);
      if (score > bestScore) {
        bestScore = score;
        bestMove = possibleMoves[i];
      }
      alpha = Math.max(alpha, bestScore);
      if (alpha >= beta) {
        break;
      }
    }
    return bestMove, bestScore;
  } else {
    let bestScore = Infinity;
    let bestMove = possibleMoves[3];
    for (let i = 0; i < possibleMoves.length; i++) {
      insertPiece(PLAYER, possibleMoves[i]);
      let score = miniMax(depth - 1, alpha, beta, false)[1];
      removeMove(possibleMoves[i]);
      if (score < bestScore) {
        bestScore = score;
        bestMove = possibleMoves[i];
      }
      beta = Math.min(beta, bestScore);
      if (alpha >= beta) {
        break;
      }
    }
    return bestMove, bestScore;
  }
}

function insertPiece(player, move) {
  cellElements[move].dataset.peice = player;
}

function removeMove(move) {
  cellElements[move].dataset.peice = " ";
}

function calculateScore(player) {
  let score = 0;

  for (let i = 3; i < 42; i + 7) {
    if (cellElements[i] == player) {
      score += 5;
    }
  }

  score += horizontalScore(player) += verticalScore(player) += diagonalScore(
    player
  );

  return score;
}

function horizontalScore(player) {
  let score = 0;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      let spot = i * 7 + j;
      score += evalwindow(
        [
          cellElements[spot].dataset.peice,
          cellElements[spot + 1].dataset.peice,
          cellElements[spot + 2].dataset.peice,
          cellElements[spot + 3].dataset.peice,
        ],
        player
      );
    }
  }
  return score;
}

function verticalScore(player) {
  let score = 0;

  for (let i = 0; i < 21; i++) {
    score += evalwindow(
      [
        cellElements[i].dataset.peice,
        cellElements[i + 7].dataset.peice,
        cellElements[i + 14].dataset.peice,
        cellElements[i + 21].dataset.peice,
      ],
      player
    );
  }
  return score;
}

function diagonalScore(player) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let spot = i * 7 + j;
      score += evalWindow(
        [
          cellElements[spot].dataset.peice,
          cellElements[spot + 8].dataset.peice,
          cellElements[spot + 16].dataset.peice,
          cellElements[spot + 24].dataset.peice,
        ],
        player
      );
    }
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 7; j++) {
      let spot = i * 7 + j;
      score += evalWindow(
        [
          cellElements[spot].dataset.peice,
          cellElements[spot + 6].dataset.peice,
          cellElements[spot + 12].dataset.peice,
          cellElements[spot + 18].dataset.peice,
        ],
        player
      );
    }
  }
}

function turnBarColor() {
  turnBar.style["background"] = isHumanTurn ? RED : YELLOW;
}

function filterLength(window, player) {
  return window.filter((x) => x == player).length;
}

function evalWindow(window, player) {
  let score = 0;

  let oppPeice = PLAYER;
  if (player == PLAYER) {
    oppPeice = COMPUTER;
  }

  if (filterLength(window, player) == 2 && filterLength(window, " ") == 2) {
    score += 5;
  } else if (
    filterLength(window, player) == 3 &&
    filterLength(window, " ") == 1
  ) {
    score += 10;
  } else if (filterLength(window, player) == 4) {
    score += 1000;
  }

  if (filterLength(window, oppPeice) == 2 && filterLength(window, " ") == 2) {
    score -= 5;
  } else if (
    filterLength(window, oppPeice) == 3 &&
    filterLength(window, " ") == 1
  ) {
    score -= 50;
  }
  return score;
}

function isLastMove() {
  return checkWin(PLAYER) || checkWin(COMPUTER) || isFull();
}

// resets cells
function resetCells(cell) {
  cell.dataset.peice = " ";
  cell.classList.remove(PLAYER, COMPUTER);
}

// chooses random player to start
function randomPlayer() {
  let choice = Math.floor(Math.random() * 2);
  if (choice == 0) {
    isHumanTurn = true;
  } else {
    isHumanTurn = false;
  }
}

// changes the player
function swapMoves() {
  isHumanTurn = !isHumanTurn;
}

// checks if four cells are equal and not empty
function colorMatch(one, two, three, four, player) {
  return one == two && one == three && one == four && one == player;
}

// checks for win
function checkWin(player) {
  return (
    horizontalCheckWin(player) ||
    verticalCheckWin(player) ||
    diagonalCheckWin(player)
  );
}

function horizontalCheckWin(player) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      let spot = i * 7 + j;
      if (
        colorMatch(
          cellElements[spot].dataset.peice,
          cellElements[spot + 1].dataset.peice,
          cellElements[spot + 2].dataset.peice,
          cellElements[spot + 3].dataset.peice,
          player
        )
      ) {
        return true;
      }
    }
  }
}

function verticalCheckWin(player) {
  for (let i = 0; i < 21; i++) {
    if (
      colorMatch(
        cellElements[i].dataset.peice,
        cellElements[i + 7].dataset.peice,
        cellElements[i + 14].dataset.peice,
        cellElements[i + 21].dataset.peice,
        player
      )
    ) {
      return true;
    }
  }
}

function diagonalCheckWin(player) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let spot = i * 7 + j;
      if (
        colorMatch(
          cellElements[spot].dataset.peice,
          cellElements[spot + 8].dataset.peice,
          cellElements[spot + 16].dataset.peice,
          cellElements[spot + 24].dataset.peice,
          player
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
          player
        )
      ) {
        return true;
      }
    }
  }
}

function isFull() {
  for (let i = 0; i < 42; i++) {
    if (cellElements[i].dataset.peice == " ") {
      return false;
    }
  }
  return true;
}
