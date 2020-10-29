// array with img source links to be retrieved and inserted into the HTML when cards get created 

const cardDeck = [
    "angular.svg",
    "aurelia.svg",
    "backbone.svg",
    "ember.svg",
    "react.svg",
    "vue.svg",
    "html.svg",
    "css.svg",
    "js-badge.svg"
];

const gameId = "board-game";
const delayBeforeRemovingCards = 100;
const maxTopScores = 10;
const gameTime = 150; 

class boardGame {
    constructor(totalTime) {
        this.fullDeck = [];
        this.totalTurns = 0;
        this.totalTime = totalTime;
        this.timeLeft = totalTime;
        this.turns - document.getElementById("turns");
        this.timer = document.getElementById("time-left");
        this.configuration = null;
        this.playerPanel = document.getElementById("playerPanel");
        this.boardPanel = document.getElementById("main-gameboard");
        this.checkCard = null;
        this.addListeners();
    }


start() {
    this.loadConfiguration();
    this.showPlayerPanel();
};

addListeners() {
    let playerForm = document.getElementById("playerForm");
    playerForm.addEventListener("submit", this.onStartGameHandler.on(this)); //returning function that will used later 
}

// loading previous games played and user configuration from localStorage - if the configuration does not exist then a default one is created.
loadConfiguration() {
    this.configuration = JSON.parse(localStorage.getItem(gameId));
    if (!this.configuration) { // this will be the default configuration
        this.configuration = {
            playerName: "",
            scores: []
        };
    }
}

// function to start the game
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
    }, 500 );
    this.hideCards();
    this.timer.innerText = this.timeLeft;
    this.turns.innerText = this.totalTurns;
    this.showBoardPanel();
    this.appendCards();
}

// loading the users name and score from localStorage

showPlayerPanel() {
    document.getElementById("playerName").value = this.configuration.playerName;
    this.renderScores();
    this.boardPanel.classList.toggle("d-none", true);
    this.playerPanel.classList.toggle("d-none", false);
    
}

showBoardPanel() {
    this.playerPanel.classList.toggle("d-none", true);
    this.boardPanel.classList.toggle("d-none", false);
}

// adding the scoreboard table to the scores container - if table already exists then it is removed and recreated 

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
    let tblBody = document.createElement('tbody');
    this.configuration.scores.forEach((score, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td class="position">${index + 1}</td> 
                            <td class="player-name">${score.playerName}</td>
                            <td class="flips">${score.flips}</td>
                            <td class="total-time">${score.totalTime}</td>`;
            if (score.currentPlayer) {
                tr.classList.add('last-game');
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
 * @param {string} imageName
 */

 renderCard(imageName) {
        return `<div class="card">
                    <div class="card-back all-cards">
                        <img class="card-img" src="assets/images/card-back.jpg"  alt="Hidden card">
                    </div> 
                    <div class="card-picture all-cards">
                        <img class="card-value card-img" src="assets/images/${imageName}" alt="Picture card">
                    </div>
                </div>`;
}

// appending the cards to the gameboard 
appendCards() {
    // creating a new array by adding the cardDeck array to itself so it duplicates and the user can match the cards
    const allCards = cardDeck.concat(cardDeck);

    const addCard = document.getElementById("main-gameboard");
    // insertAdjacentHTML - inserting the html from the renderCard function for each item in the concatenated allCards array
    allCards.forEach((imageName) => addCard.insertAdjacentHTML("beforeend", this.renderCard(imageName)));

    let cards = Array.from(document.getElementsByClassName("card"));
    
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            this.turnCard(card);
        });
    });
    this.fullDeck = cards; 
};

removeCards() {
    let cards = Array.from(document.getElementsByClassName("card"));
    cards.forEach((card) => remove());
}

startCountDown() {
    return setInterval(() => {
        this.timeLeft--;
        this.timer.innerText = this.timeLeft;
        if (this.timeLeft === 0)
            timeLeft.gameOver(); // the game will end once the countdown reaches 0
    }, 1000)
}

gameFinished() {
    clearInterval(this.countDown);
    this.removeCards();
    this.showPlayerPanel();
}

currentScore() {
    let currentScore = document.getElementById("current-score");
    currentScore.innerText = this.totalTurns;
}

gameOver() {
    this.renderScores();
    this.boardPanel.classList.toggle("d-none", true);
    this.playerPanel.classList.toggle("d-none", false);
    this.gameFinished();
}

gameWin() {
    this.currentScore();
    this.updateScores();
    this.gameFinished();
}

updateScores() {
    let index = this.configuration.scores.findIndex((score) => score.currentPlayer === true);
    if (index !== -1) {
        this.configuration.scores[index].currentPlayer = false;
    }

    // adding new scores to the leaderboard
    this.configuration.scores.push({
        playerName = this.configuration.playerName,
        flips: this.totalTurns,
        totalTime: this.totalTime - this.timeLeft,
        currentPlayer: true
    });

    // sorting the scores by comparing all scores together, the scores will also be positioned high to low
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
    })

    // removing the last player from the leaderboard if there is an overflow - it will also sort it to the top 10 scores
    if (this.configuration.scores.length > maxTopScores) {
        this.configuration.scores.pop();
    }

    localStorage.setItem(gameId, JSON.stringify(this.configuration))
}

hideCards() {
    this.fullDeck.forEach((card) => {
        card.classList.remove("visible");
    })
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
            this.checkFormatch(card);
        } else {
            this.checkCard = card;
        }
    }
 };

 /**
  * checking to see if the 2nd selected card is a match for the 1st selected card
  * @param {Element} card 
  */

  checkFormatch() {
      if (this.checkCardType(card) === this.checkCardType(this.checkCardType)) {
        this.cardMatcher(card, this.checkCard);
      } else {
        this.notAMatch(card, this.checkCard);
        //clearing the cards that have been selected
        this.checkCard = null;
      }
  };

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

notAMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
        card1.classList.remove("visible");
        card2.classList.remove("visible");
        this.busy = false;
    }, 500)
}

checkCardType() {
    return card.getElementsByClassName("card-value")[0].src;
}

/**
 * Fisher-Yaters algorithm will shuffle through the card array swapping the last element with a random element 
 * from the array
 */

 shuffleDeck() {
    for (let i = this.fullDeck.length -1; i >0; i--) {
        let randomIndex = math.floor(Math.random() - (i +1));
        this.fullDeck[randomIndex].style.order = i;
        this.fullDeck[1].style.order = randomIndex;
    }
 }

 isCardFacedDown(card) {
    return (!this.busy && !this.matchedCards.includes(card) && card !== this.checkCard)
 }
}
