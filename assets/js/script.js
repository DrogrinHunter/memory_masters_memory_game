// cards 
const cardsArray = [
    {
        name: 'angular',
        img: 'assets/images/angular.svg'
    },
    {
        name: 'aurelia',
        img: 'assets/images/aurelia.svg'
    },
    {
        name: 'backbone',
        img: 'assets/images/backbone.svg'
    },
    {
        name: 'ember',
        img: 'assets/images/ember.svg'
    },
    {
        name: 'react',
        img: 'assets/images/react.svg'
    },
    {
        name: 'vue',
        img: 'assets/images/vue.svg'
    },
    {
        name: 'js',
        img: 'assets/images/js-badge.svg'
    },
    {
        name: 'html',
        img: 'assets/images/html.svg'
    },
    {
        name: 'css',
        img: 'assets/images/css.svg'
    },
    {
        name: 'python',
        img: 'assets/images/python.svg'
    },
    {
        name: 'sql',
        img: 'assets/images/sql.svg'
    },
    {
        name: 'bootstrap',
        img: 'assets/images/bootstrap.svg'
    }
]




// duplicating 2 sets of cards 
const gameGrid = cardsArray.concat(cardsArray);

//randomising card order
gameGrid.sort(() => 0.5 - Math.random());

// global variables
let firstGuess = ''
let secondGuess = ''
let count = 0;
let previousTarget = null;
let delay = 1200

// inputting the cards into the dom 
const game = document.getElementById('game');
const grid = document.createElement('section');
grid.setAttribute('class', 'grid');
game.appendChild(grid);

// creating divs for cards 
gameGrid.forEach((item) => {

    const {name, img} = item;

    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = item.name;
    
    //front of card
    const front = document.createElement('div')
    front.classList.add('front')

    //back of card
    const back = document.createElement('div')
    back.classList.add('back')
    back.style.backgroundImage = `url(${img})`;

    grid.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
})

const match = () => {
    var selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
        card.classList.add('match');
    });
}

// resetting guess count after 2 selections
const resetGuesses = () => {
    firstGuess = '';
    secondGuess = '';
    count = 0;
    previousTarget = null;

    let selected = document.querySelectorAll('.selected')
    selected.forEach(card => {
        card.classList.remove('selected')
    })
}

// event listener for when a card is selected 
grid.addEventListener('click', function(event){ 
    const clicked = event.target;
    if (
    clicked.nodeName === 'SECTION' || 
    clicked === previousTarget || 
    clicked.parentNode.classList.contains('selected') ||
    clicked.parentNode.classList.contains('match')
    ) {
        return
    }

    // clicked.classList.add('selected');

    if (count < 2 ) {
        count++;

        if (count === 1) {
            firstGuess = clicked.parentNode.dataset.name;
            console.log(firstGuess);
            clicked.parentNode.classList.add('selected');
        } else {
            secondGuess = clicked.parentNode.dataset.name
            console.log(secondGuess);
            clicked.parentNode.classList.add('selected')
        };

        if (firstGuess && secondGuess) {
      if (firstGuess === secondGuess) {
        setTimeout(match, delay);
      }
      setTimeout(resetGuesses, delay);
    }
    previousTarget = clicked;
  }

});

