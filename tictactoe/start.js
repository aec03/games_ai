const singlePlayerButton = document.getElementById("singlePlayerButton");
const twoPlayerButton = document.getElementById("doublePlayerButton");
const startingMessageElement = document.getElementById("startingMessage");

singlePlayerButton.addEventListener("click", function () {
  single();
  startingMessageElement.classList.remove("show");
});

twoPlayerButton.addEventListener("click", function () {
  two_player();
  startingMessageElement.classList.remove("show");
});
