// array with img source links to be retrieved and inserted into the HTML when cards get created

const cardDeck = [
  "aurelia.svg",
  "backbone.svg",
  "ember.svg",
  "react.svg",
  "vue.svg",
  "html.svg",
  "css.svg",
  "js-badge.svg",
];

const gameId = "board-game";
const delayBeforeRemovingCards = 100;
const maxTopScores = 10;
const gameTime = 150;

class BoardGame {
  /**
   * Constructor for the BoardGame
   * @param {Number} totalTime the total time has to complete the game
   */

  constructor(totalTime) {
    this.fullDeck = [];
    this.totalTurns = 0;
    this.totalTime = totalTime;
    this.timeLeft = totalTime;
    this.turns = document.getElementById("turns");
    this.timer = document.getElementById("time-left");
    this.configuration = null;
    this.playerPanel = document.getElementById("playerPanel");
    this.checkCard = null;
    this.navBar = document.getElementById("navBar");
    this.gameCardsContainer = document.getElementById("gameboard-container");
    this.addListeners();
  }

  /**
   * Function to load up the game and showing the leaderboard with the user's details from local storage
   */
  start() {
    this.loadConfiguration();
    this.showPlayerPanel();
  }

  /**
   * Function that listens for when the user clicks "submit"
   */
  addListeners() {
    let playerForm = document.getElementById("playerForm");
    playerForm.addEventListener("submit", this.onStartGameHandler.bind(this)); //returning function that will used later
  }

  /**
   * Helper function to make the navigation bar visible or hidden
   * @param {Boolean} value to specify when to hide or show the element.
   */
  navBarVisible(value) {
    if (value) {
      this.navBar.classList.remove("d-none");
    } else {
      this.navBar.classList.add("d-none");
    }
  }

  /**
   * Helper function to make the player panel visible or hidden.
   * @param {Boolean} value to specify when to hide or show the element
   */
  playerPanelVisible(value) {
    if (value) {
      this.playerPanel.classList.remove("d-none");
    } else {
      this.playerPanel.classList.add("d-none");
    }
  }

  /**
   * Helper function to make the game cards container visible or hidden.
   * @param {Boolean} value to specify when to hide or show the element
   */
  gameCardsVisible(value) {
    if (value) {
      this.gameCardsContainer.classList.remove("d-none");
    } else {
      this.gameCardsContainer.classList.add("d-none");
    }
  }

  /**
   * Loading the previous games player by the user from the localStorage
   */
  loadConfiguration() {
    this.configuration = JSON.parse(localStorage.getItem(gameId));
    if (!this.configuration) {
      // this will be the default configuration
      this.configuration = {
        playerName: "",
        scores: [],
      };
    }
  }

  /**
   * function to start the game
   */
  startGame() {
    this.checkCard = null;
    this.totalTurns = 0;
    this.timeLeft = this.totalTime;
    this.matchedCards = []; // an array will store the matched cards
    this.busy = true;
    setTimeout(() => {
      this.shuffleDeck(this.fullDeck);
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 500);
    this.hideCards();
    this.timer.innerText = this.timeLeft;
    this.turns.innerText = this.totalTurns;
    this.showBoardPanel();
    this.appendCards();
  }

  /**
   * Function to load the users name and score from the localStorage
   * @param {Boolean} value to load the users details from localStorage
   */
  showPlayerPanel(value) {
    document.getElementById("playerName").value = this.configuration.playerName;
    this.navBarVisible(false);
    this.gameCardsVisible(false);
    this.renderScores();
    this.playerPanelVisible(true);
  }

  /**
   * Function to show the board panel and hide the leaderboard
   */
  showBoardPanel() {
    this.gameCardsVisible(true);
    this.navBarVisible(true);
    this.playerPanelVisible(false);
  }

  /**
   * Adding the scoreboard table to the scores container - if the table exists then it is removed and recreated
   */
  renderScores() {
    let scoresContainer = document.getElementById("scores");
    if (scoresContainer.firstElementChild) {
      scoresContainer.firstElementChild.remove();
    }
    let table = document.createElement("table");
    let header = table.createTHead();
    let headers = header.insertRow(0);
    headers.innerHTML = `<th class="position">Position</th>
                        <th class="player-name">Player Name</th>
                        <th class="flips">Total Turns</th>
                        <th class="total-time">Total Time</th>`;
    let tblBody = document.createElement("tbody");
    this.configuration.scores.forEach((score, index) => {
      let tr = document.createElement("tr");
      tr.innerHTML = `<td class="position">${index + 1}</td>
                            <td class="player-name">${score.playerName}</td>
                            <td class="flips">${score.flips}</td>
                            <td class="total-time">${score.totalTime}</td>`;
      if (score.currentPlayer) {
        tr.classList.add("last-game");
      }
      tblBody.appendChild(tr);
    });
    table.appendChild(tblBody);
    scoresContainer.appendChild(table);
  }

  /**
   * event handler to handle the onsubmit event that the user clicks on from the "start game" button
   * @param {*} event DOM event
   */
  onStartGameHandler(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    //assigning the players name to the config object to start the game
    this.configuration.playerName = event.target[0].value;
    this.startGame();
  }

  /**
   * renders the card element using the image name passed in as a parameter
   * @param {String} imageName
   */
  renderCard(imageName) {
    return `<div class="card">
                    <div class="card-back all-cards">
                        <img class="card-img" src="assets/images/card_background.jpg"  alt="Hidden card">
                    </div>
                    <div class="card-picture all-cards">
                        <img class="card-value card-img" src="assets/images/${imageName}" alt="Picture card">
                    </div>
                </div>`;
  }

  /**
   * Appending the cards from JS to the gameboard via InsertAdjacentHTML
   */
  appendCards() {
    // creating a new array by adding the cardDeck array to itself so it duplicates and the user can match the cards
    const allCards = cardDeck.concat(cardDeck);

    const addCard = document.getElementById("main-gameboard");
    allCards.forEach((imageName) =>
      addCard.insertAdjacentHTML("beforeend", this.renderCard(imageName))
    );

    let cards = Array.from(document.getElementsByClassName("card"));

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        this.turnCard(card);
      });
    });
    this.fullDeck = cards;
  }

  /**
   * Function to remove the cards once matched.
   */
  removeCards() {
    let cards = Array.from(document.getElementsByClassName("card"));
    cards.forEach((card) => card.remove());
  }

  /**
   * Function to start the timer once the game has started
   */
  startCountDown() {
    return setInterval(() => {
      this.timeLeft--;
      this.timer.innerText = this.timeLeft;
      if (this.timeLeft === 0) {
        this.gameOver(); // the game will end once the countdown reaches 0
      }
    }, 1000);
  }

  /**
   * Function that carries out tasks once the game has been completed - it will remove all cards, clear the timer and show the leaderboard
   */
  gameFinished() {
    clearInterval(this.countDown);
    this.removeCards();
    this.showPlayerPanel();
  }

  /**
   * Function that displays the user's score on the leaderboard.
   */
  currentScore() {
    let currentScore = document.getElementById("current-score");
    currentScore.innerText = this.totalTurns;
  }

  /**
   * Function that carries out tasks if the game is not completed in the time frame.
   */
  gameOver() {
    this.renderScores();
    this.gameCardsVisible(false);
    this.navBarVisible(false);
    this.gameFinished();
  }

  /**
   * Function that carries out tasks when the user has won the game - winning is achieved by matching all cards in the time frame.
   */
  gameWin() {
    this.currentScore();
    this.updateScores();
    this.modalPopUp();
    //this.gameFinished();
  }

  /**
   * Function that pops up a modal once the game has finished
   */

  modalPopUp() {
    let modal = document.getElementById("gameOverModal");
    let btn = document.getElementById("modal-button");
    let span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = none;
      }
    };
    btn.onclick = this.gameFinished();
  }

  /**
   * This function updates the leaderboard with the scores from the games that are played.
   */
  updateScores() {
    let index = this.configuration.scores.findIndex(
      (score) => score.currentPlayer === true
    );
    if (index !== -1) {
      this.configuration.scores[index].currentPlayer = false;
    }

    /**
     * Pushes any new scores to the leaderboard
     */
    this.configuration.scores.push({
      playerName: this.configuration.playerName,
      flips: this.totalTurns,
      totalTime: this.totalTime - this.timeLeft,
      currentPlayer: true,
    });

    /**
     * Arranges the scores on the leaderboard from high to low
     */
    this.configuration.scores.sort((a, b) => {
      if (a.flips < b.flips) {
        return -1;
      }

      if (a.flips > b.flips) {
        return 1;
      }

      if (a.totalTime < b.totalTime) {
        return -1;
      }

      if (a.totalTime > b.totalTime) {
        return 1;
      }
      return 0;
    });

    /**
     * Removes the last player from the leaderboard if there are more than 10 scores, it will arrange the scores into the top 10.
     */
    if (this.configuration.scores.length > maxTopScores) {
      this.configuration.scores.pop();
    }

    localStorage.setItem(gameId, JSON.stringify(this.configuration));
  }

  /**
   * This function removes the cards once matched.
   */
  hideCards() {
    this.fullDeck.forEach((card) => {
      card.classList.remove("visible");
    });
  }

  /**
   * @param {Element} card the card element
   */
  turnCard(card) {
    if (this.isCardFacedDown(card)) {
      this.totalTurns++; //increasing the number of turns
      this.turns.innerText = this.totalTurns; //increasing the number of turns on screen
      card.classList.add("visible");
      if (this.checkCard) {
        this.checkForMatch(card);
      } else {
        this.checkCard = card;
      }
    }
  }

  /**
   * checking to see if the 2nd selected card is a match for the 1st selected card
   * @param {Element} card
   */
  checkForMatch(card) {
    if (this.checkCardType(card) === this.checkCardType(this.checkCard)) {
      this.cardMatcher(card, this.checkCard);
    } else {
      this.notAMatch(card, this.checkCard);
      //clearing the cards that have been selected
      this.checkCard = null;
    }
  }

  /**
   * @param {*} card1 first card selected
   * @param {*} card2 second card selected
   *
   */
  cardMatcher(card1, card2) {
    //adding the cards to the matchedCards array to track the progress of the user
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    setTimeout(() => {
      card1.classList.add("invisible");
      card2.classList.add("invisible");
    }, delayBeforeRemovingCards);
    this.checkCard = null;
    // ending the game when all of the cards have been matched
    if (this.matchedCards.length === this.fullDeck.length) {
      this.gameWin();
    }
  }

  /**
   * Function that checks to see if the two cards selected are a match and if they do not match then it will flip the cards back over
   * @param {*} card1 first card selected
   * @param {*} card2 second card selected
   */
  notAMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      this.busy = false;
    }, 500);
  }

  /**
   *
   * @param {*} card to check the type of card that has been selected
   */
  checkCardType(card) {
    return card.getElementsByClassName("card-value")[0].src;
  }

  /**
   * Fisher-Yaters algorithm will shuffle through the card array swapping the last element with a random element
   * from the array
   */
  shuffleDeck() {
    for (let i = this.fullDeck.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      this.fullDeck[randomIndex].style.order = i;
      this.fullDeck[1].style.order = randomIndex;
    }
  }

  /**
   * Helper function to check whether the card is faced down or not
   * @param {*} card to check whether the card is faced down or whether the card image is visible
   */
  isCardFacedDown(card) {
    return (
      !this.busy && !this.matchedCards.includes(card) && card !== this.checkCard
    );
  }
}

const game = new BoardGame(gameTime);
game.start();
