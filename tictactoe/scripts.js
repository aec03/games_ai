function single() {
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
  const scores = {
    x: -1,
    o: 1,
    tie: 0,
  };
  let b = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  const humanText = document.getElementById("human");
  const computerText = document.getElementById("computer");
  let humanWins = 0;
  let computerWins = 0;
  const cellElements = document.querySelectorAll("[data-cell]");
  const arr = Array.prototype.slice.call(cellElements);
  const board = document.getElementById("board");
  const winningMessageElement = document.getElementById("winningMessage");
  const winningMessageTextElement = document.querySelector(
    "[data-winning-message-text]"
  );
  const restartButton = document.getElementById("restartButton");
  let circleTurn;
  let n = 0;
  let currentClass;

  startGame();

  restartButton.addEventListener("click", startGame);

  function startGame() {
    humanText.innerHTML = "Human Wins: " + humanWins;
    computerText.innerHTML = "Computer Wins: " + computerWins;
    b = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    cellElements.forEach((cell) => {
      cell.classList.remove(X_CLASS);
      cell.classList.remove(CIRCLE_CLASS);
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick, { once: true });
    });
    if (n % 2 == 1) {
      let move = computer_move();
      b[move] = CIRCLE_CLASS;
      placeMark(cellElements[move], CIRCLE_CLASS);
    }
    winningMessageElement.classList.remove("show");
    circleTurn = false;
    setBoardHoverClass();
    n += 1;
  }

  function handleClick(e) {
    // place mark
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    let a = arr.indexOf(cell);
    b[a] = X_CLASS;
    placeMark(cell, X_CLASS);
    // check for win
    if (checkWin(currentClass)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }

    let move = computer_move();
    b[move] = CIRCLE_CLASS;
    placeMark(cellElements[move], CIRCLE_CLASS);

    if (checkWin(CIRCLE_CLASS)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  }

  function is_available(a) {
    if (b[a] == " ") {
      return true;
    }
    return false;
  }

  function check_winner() {
    for (let n = 0; n < WINNING_COMBINATIONS.length; ++n) {
      let i = WINNING_COMBINATIONS[n][0];
      let j = WINNING_COMBINATIONS[n][1];
      let k = WINNING_COMBINATIONS[n][2];
      if (b[i] == b[j] && b[j] == b[k] && b[i] != " ") {
        return b[i];
      }
    }
    let options = possible_moves();
    if (options.length == 0) {
      return "tie";
    }
  }

  function computer_move() {
    let options = possible_moves();
    let b_score = -Infinity;
    let b_move = null;
    for (let n = 0; n < options.length; ++n) {
      b[options[n]] = CIRCLE_CLASS;
      score = minimax(0, false);
      b[options[n]] = " ";
      if (score > b_score) {
        b_score = score;
        b_move = options[n];
      }
    }
    return b_move;
  }

  function possible_moves() {
    let t = [];
    for (let i = 0; i < b.length; ++i) {
      if (is_available(i)) {
        t.push(i);
      }
    }
    return t;
  }

  function minimax(depth, is_maximizing) {
    let options = possible_moves();
    let winner = check_winner();
    if (winner != null) {
      return scores[winner];
    }
    if (is_maximizing) {
      let b_score = -Infinity;
      options.forEach((i) => {
        b[i] = CIRCLE_CLASS;
        score = minimax(depth + 1, false);
        b[i] = " ";
        if (score > b_score) {
          b_score = score;
        }
      });
      return b_score;
    } else {
      let b_score = Infinity;
      options.forEach((i) => {
        b[i] = X_CLASS;
        score = minimax(depth + 1, true);
        b[i] = " ";
        if (score < b_score) {
          b_score = score;
        }
      });
      return b_score;
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
      if (winningMessageTextElement.innerHTML == "X wins!") {
        humanWins += 1;
      } else {
        computerWins += 1;
      }
    }
    winningMessageElement.classList.add("show");
  }
}

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

  startGame();

  restartButton.addEventListener("click", startGame);

  function startGame() {
    scoreText.classList.remove("show");
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
