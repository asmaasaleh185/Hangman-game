// All Buttons
let howToBtn = document.querySelector(".how-to-btn");
let backBtn = document.querySelector(".back-btn");
let playBtn = document.querySelector(".play-btn");
let categoryBtn = document.querySelectorAll(".category-btn");
let letterBtn = document.querySelectorAll(".key-btn");
let pauseMenuBtn = document.querySelector(".pause-menu-btn");
let continueGameBtn = document.querySelector(".continue-game-btn");
let newCategoryBtn = document.querySelector(".new-category-btn");
let quitGameBtn = document.querySelector(".quit-game-btn");

// All Pages
let homePage = document.querySelector("#home");
let howToPage = document.querySelector("#instruction");
let categoriesPage = document.querySelector("#category");
let game = document.querySelector("#game");

// Other Variables
let header = document.getElementsByTagName("header")[0];
let headerTitle = document.querySelector(".header-title");
let categoryHeader = document.querySelector(".category-header");
let hiddenWordContainer = document.querySelector(".hidden-word-container");
let healthBar = document.querySelector(".progress-bar");
let pauseMenu = document.querySelector(".pause-menu");
let pauseMenuHeading = document.querySelector(".pause-menu-heading");
let chosenCategory = "";
let hiddenWord = "";
let lettersAlreadyChosen = [];
let animationCount = 0;
let wrongGuesses = 0;
let correctGuesses = 0;
let correctGuess = false;
let health = 100;
let gameOver = false;
let animationInterval;

// buttons behavior
howToBtn.addEventListener("click", () => {
  homePage.classList.add("display");
  header.classList.remove("display");
  header.children[0].classList.remove("display");
  howToPage.classList.remove("display");
  headerTitle.innerText = `How To Play`;
});

backBtn.addEventListener("click", () => {
  homePage.classList.remove("display");
  header.classList.add("display");
  header.children[0].classList.add("display");
  howToPage.classList.add("display");
  categoriesPage.classList.add("display");
});

playBtn.addEventListener("click", () => {
  homePage.classList.add("display");
  header.classList.remove("display");
  header.children[0].classList.remove("display");
  categoriesPage.classList.remove("display");
  headerTitle.innerText = `Pick a Category`;
});

categoryBtn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    chosenCategory = this.value;
    initiateGame(chosenCategory);
    game.classList.remove("display");
    categoriesPage.classList.add("display");
    header.children[0].classList.add("display");
    header.children[1].classList.remove("display");
    categoryHeader.innerHTML = this.value;
  });
});

letterBtn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    if (!this.classList.contains("inactive-key")) {
      this.classList.add("inactive-key");
      this.tabIndex = "-1";
      checkLetter(this.value);
    }
  });
});

pauseMenuBtn.addEventListener("click", function () {
  pauseMenu.classList.remove("display");
});

continueGameBtn.addEventListener("click", function () {
  togglePauseMenu();
  toggleKeyTabIndex();
  if (gameOver) {
    initiateGame(chosenCategory);
  }
});

newCategoryBtn.addEventListener("click", function () {
  toggleKeyTabIndex();
  togglePauseMenu();
  game.classList.add("display");
  categoriesPage.classList.remove("display");
  header.children[0].classList.remove("display");
  header.children[1].classList.add("display");
});

quitGameBtn.addEventListener("click", function () {
  togglePauseMenu();
  toggleKeyTabIndex();
  homePage.classList.remove("display");
  header.children[1].classList.add("display");
  game.classList.add("display");
});

document.addEventListener("keyup", function (event) {
  if (event.repeat) {
    return;
  }
  // console.log(event.key);
  let key = event.key.toLowerCase();
  let buttons = document.querySelectorAll(".key-btn");

  if (!lettersAlreadyChosen.includes(key)) {
    lettersAlreadyChosen.push(key);
    buttons.forEach(function (button) {
      if (button.textContent.trim() === key) {
        checkLetter(key);
        for (let i = 0; i < letterBtn.length; i++) {
          if (event.key === letterBtn[i].value) {
            letterBtn[i].classList.add("inactive-key");
            letterBtn[i].tabIndex = "-1";
          }
        }
      }
    });
  }
});

// All functions
function toggleKeyTabIndex() {
  for (let i = 0; i < letterBtn.length; i++) {
    letterBtn[i].tabIndex = "0";
  }
}

function togglePauseMenu() {
  pauseMenu.classList.toggle("display");
  for (let i = 0; i < letterBtn.length; i++) {
    letterBtn[i].tabIndex = "-1";
  }
}

function initiateGame(category) {
  continueGameBtn.innerHTML = "<h4>Continue</h4>";
  pauseMenuHeading.innerHTML = "Paused";
  hiddenWord = "";
  lettersAlreadyChosen = [];
  animationCount = 0;
  wrongGuesses = 0;
  correctGuesses = 0;
  health = 100;
  correctGuess = false;
  gameOver = false;
  hiddenWordContainer.innerHTML = "";
  healthBar.style.width = health + "%";

  toggleKeyTabIndex();
  for (let i = 0; i < letterBtn.length; i++) {
    letterBtn[i].classList.remove("inactive-key");
  }

  // fetch categories from data.json
  fetch("../JSON/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const randIndex = Math.floor(
        Math.random() * data.categories[category].length
      );
      hiddenWord = data.categories[category][randIndex].name.toLowerCase();
      // console.log(hiddenWord);
      ChoosenWord(hiddenWord);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function ChoosenWord(word) {
  for (let i = 0; i < word.length; i++) {
    const hiddenLetter = document.createElement("div");
    hiddenLetter.classList.add("hidden-letter");
    if (word[i] === " ") {
      hiddenLetter.classList.add("hidden");
      correctGuesses += 1;
    }

    const hiddenLetterInner = document.createElement("div");
    hiddenLetterInner.classList.add("hidden-letter-inner");

    const hiddenLetterFront = document.createElement("div");
    hiddenLetterFront.classList.add("hidden-letter-front");

    const hiddenLetterBack = document.createElement("div");
    hiddenLetterBack.classList.add("hidden-letter-back");

    const h2 = document.createElement("h2");
    h2.textContent = word[i];

    hiddenLetterBack.appendChild(h2);
    hiddenLetterInner.appendChild(hiddenLetterFront);
    hiddenLetterInner.appendChild(hiddenLetterBack);
    hiddenLetter.appendChild(hiddenLetterInner);

    const hiddenWordContainer = document.querySelector(
      ".hidden-word-container"
    );
    hiddenWordContainer.appendChild(hiddenLetter);
  }
}

function checkLetter(letter) {
  for (let i = 0; i < hiddenWord.length; i++) {
    if (letter === hiddenWord[i]) {
      // console.log(letter);
      const letterTile = hiddenWordContainer.children[i].querySelector(
        ".hidden-letter-inner"
      );
      letterTile.classList.add("reveal-letter");
      correctGuess = true;
      correctGuesses += 1;
    }
  }
  if (!correctGuess) {
    health -= 100 / 8;
    wrongGuesses += 1;
  } else {
    correctGuess = false;
  }
  healthBar.style.width = health + "%";

  if (wrongGuesses >= 8) {
    loseGame();
  } else if (correctGuesses == hiddenWord.length) {
    winGame();
  }
}

function loseGame() {
  for (let i = 0; i < hiddenWord.length; i++) {
    const letter = hiddenWordContainer.children[i].querySelector(
      ".hidden-letter-inner"
    );
    letter.classList.add("reveal-letter");
  }
  continueGameBtn.innerHTML = "<h4>Play Again</h4>";
  pauseMenuHeading.innerHTML = "You Lose";
  gameOver = true;
  setTimeout(togglePauseMenu, 1000);
}

function winGame() {
  gameOver = true;
  continueGameBtn.innerHTML = "<h4>Play Again</h4>";
  pauseMenuHeading.innerHTML = "You Win";
  animationInterval = setInterval(addAnimation, 75);
}
function addAnimation() {
  const hiddenLetter = document.querySelectorAll(".hidden-letter");
  if (animationCount < hiddenLetter.length) {
    hiddenLetter[animationCount].classList.add("animated-letter");
    animationCount += 1;
  } else {
    clearInterval(animationInterval);
    setTimeout(togglePauseMenu, 1000);
  }
}
