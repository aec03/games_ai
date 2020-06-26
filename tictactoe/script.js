const startButton = document.getElementById("startButton");
const startingMessageElement = document.getElementById("startingMessage");

startButton.addEventListener("click", function () {
  single();
  startingMessageElement.classList.remove("show");
});
