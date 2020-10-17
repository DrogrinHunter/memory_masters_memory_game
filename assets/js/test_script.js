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