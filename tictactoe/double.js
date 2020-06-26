function double() {
  const X_CLASS = "x";
  const CIRCLE_CLASS = "o";
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const cellElements = document.querySelectorAll("[data-cell]");
  const board = document.getElementById("board");
  const winningMessageElement = document.getElementById("winningMessage");
  const winningMessageTextElement = document.querySelector(
    "[data-winning-message-text]"
  );
  const restartButton = document.getElementById("restartButton");
  const scoreText = document.getElementsById("score");

  let circleTurn;
  let unavailable = [];
  let n = 0;

  startGame();

  restartButton.addEventListener("click", startGame);

  function startGame() {
    scoreText.classList.remove("show");
    unavailable = [];
    cellElements.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick, { once: true });
    });
    winningMessageElement.classList.remove("show");
    circleTurn = false;
    setBoardHoverClass();
  }

  function handleClick(e) {
    // place mark
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    // check for win
    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  }

  function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
  }

  function swapTurns() {
    circleTurn = !circleTurn;
  }

  function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
      board.classList.add(CIRCLE_CLASS);
    } else {
      board.classList.add(X_CLASS);
    }
  }

  function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some((combination) => {
      return combination.every((index) => {
        return cellElements[index].classList.contains(currentClass);
      });
    });
  }

  function isDraw() {
    return [...cellElements].every((cell) => {
      return (
        cell.classList.contains(X_CLASS) ||
        cell.classList.contains(CIRCLE_CLASS)
      );
    });
  }

  function endGame(draw) {
    if (draw) {
      winningMessageTextElement.innerHTML = "Draw!";
    } else {
      winningMessageTextElement.innerHTML = `${circleTurn ? "O" : "X"} Wins!`;
    }
    winningMessageElement.classList.add("show");
  }
}
