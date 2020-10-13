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
let gameGrid = cardsArray.concat(cardsArray);

// inputting the cards into the dom 
const game = document.getElementById('game');

const grid = document.createElement('section');
grid.setAttribute('class', 'grid');

game.appendChild(grid);

gameGrid.forEach((item) => {
    const card = document.createElement('div');

    card.classList.add('card');

    card.dataset.name = item.name;

    card.style.backgroundImage = `url(${item.img})`;

    grid.appendChild(card)
})

