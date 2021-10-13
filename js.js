function Card(name, image) {
  this.name = name;
  this.image = image;
  this.flipped = false;
  this.solved = false;
  this.setElement = function (elementID) {
    let element = document.getElementById(elementID);
    this.element = element;
  }
}

function updateCardState(card) {
  if (card.flipped) {
    card.element.classList.toggle('flipped', true);
  } else {
    card.element.classList.toggle('flipped', false);
  }
  card.element.querySelector('img').src = "img/"+card.image;
}

let cards = [
  new Card('train', 'train.png'),
  new Card('train', 'train.png'),
  new Card('sheep', 'sheep.png'),
  new Card('sheep', 'sheep.png'),
  new Card('taxi', 'taxi.png'),
  new Card('taxi', 'taxi.png'),
  new Card('light', 'light.png'),
  new Card('light', 'light.png'),
  new Card('tractor', 'tractor.png'),
  new Card('tractor', 'tractor.png'),
  new Card('tree', 'tree.png'),
  new Card('tree', 'tree.png'),
  new Card('truck', 'truck.png'),
  new Card('truck', 'truck.png'),
  new Card('gas_station', 'gas_station.png'),
  new Card('gas_station', 'gas_station.png')
]

function getRandomNumber(min, max) {
  let randomNumberResult = Math.floor(Math.random() * (max-min) + min);
  return randomNumberResult;
}

function switchElements(array, a, b) {
  let elementA = array[a];
  array[a] = array[b];
  array[b] = elementA;
}

function shuffle(array) {
  for (let i=0; i<array.length; i++) {
    let randomPosition = getRandomNumber(i, array.length);
    switchElements(array, i, randomPosition);
  }
}

shuffle(cards);

for (let i=0; i<cards.length; i++) {
  let cardId = "card"+(i+1);
  cards[i].setElement(cardId);
  updateCardState(cards[i]);
}

let firstClick;
let clicksCount = 0;
let isFirstCardClicked = false;
let isUnflipTimerRunning = false;
let unflipTimer;

function updateCount() {
  document.getElementById('clicks_count').innerHTML = clicksCount;
}

function getCardFromElement(element) {
  for (let i=0; i < cards.length; i++) {
    if (cards[i].element == element) {
      return cards[i];
    }
  }
  console.error("Couldn't find element");
}

function isAnyCardFlipped() {
  for (let i=0; i<cards.length; i++) {
    if (cards[i].flipped && cards[i].solved == false) {
      return true;
    }
  }
  return false;
}

function checkSolved(card) {
  if (card.solved) {
    return true;
  } else {
    return false;
  }
}

let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let interval = setInterval(setTime, 1000);

function setTime() {
  if (isFirstCardClicked) {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds%60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
  }
}

function pad(val) {
  let valString = val + "";
  if(valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function cardClicked(element) {
  if (isUnflipTimerRunning) {
    return; // Calm down.
  }
  let card = getCardFromElement(element);
  if (firstClick != undefined && firstClick.element == card.element) {
    return; // It's the same. Ignore the click.
  }
  isFirstCardClicked = true;
  if (card.solved == false) {
    clicksCount = clicksCount + 1;
    updateCount();
  }
  let isFlipped = isAnyCardFlipped();
  if (isFlipped == false) {
    // This is the first card of a pair flipped. No checking needed.
    card.flipped = true;
    firstClick = card;
    updateCardState(card);
  } else {
    // This is the second card of a pair flipped. Check for match.
    card.flipped = true;
    updateCardState(card);
    if (firstClick.name == card.name) {
      // We found a match - mark it as such
      firstClick.solved = true;
      card.solved = true;
      if (cards.every(checkSolved)) {
        clearInterval(interval);
        let score = calculateScore();
        printScore(score);
      }
    } else {
      // We flipped two cards that are different - unflip after pause
      function unflipAll() {
        isUnflipTimerRunning = false;
        firstClick = undefined;
        for (let i=0; i<cards.length; i++) {
          if (cards[i].solved == false) {
            cards[i].flipped = false;
          }
          updateCardState(cards[i]);
        }
      }
      unflipTimer = setTimeout(unflipAll, 1300);
      isUnflipTimerRunning = true;
    }
  }
}

function calculateScore() {
  return clicksCount + totalSeconds;
}

function printScore (finalScore) {
  let starsList;
  if (finalScore <= 62) {
    starsList = document.querySelectorAll("#star5, #star4, #star3, #star2, #star1");
    confettiToot(200);
  } else if (finalScore <= 70) {
    starsList = document.querySelectorAll("#star4, #star3, #star2, #star1");
    confettiToot(150);
  } else if (finalScore <= 75) {
    starsList = document.querySelectorAll("#star3, #star2, #star1");
    confettiToot(100);
  } else if (finalScore <= 85) {
    starsList = document.querySelectorAll("#star2, #star1");
    confettiToot(50);
  } else {
    starsList = document.querySelectorAll("#star1");
    confettiToot(10);
  }
  for (i=0; i<starsList.length; i++) {
    starsList[i].classList.add("checked");
  }
}

function resetGame () {
  shuffle(cards);
  for (let i=0; i<cards.length; i++) {
    let cardId = "card"+(i+1);
    cards[i].setElement(cardId);
    cards[i].flipped = false;
    cards[i].solved = false;
    updateCardState(cards[i]);
  }
  clicksCount = 0;
  updateCount();
  firstClick = undefined;
  isFirstCardClicked = false;
  isUnflipTimerRunning = false;
  clearTimeout(unflipTimer);
  clearInterval(interval);
  interval = setInterval(setTime, 1000);
  totalSeconds = 0;
  secondsLabel.innerHTML = pad(0);
  minutesLabel.innerHTML = pad(0);
  let fiveStarsList = document.querySelectorAll("#star5, #star4, #star3, #star2, #star1");
  for (i=0; i<fiveStarsList.length; i++) {
    fiveStarsList[i].classList.remove("checked");
  }
}


let colors = ["#f25f5c", "#edb74c", "#308baa", "#70c1b3", "#765783", "#4daf7c"];

function confettiToot(particles) {
  confetti({
    particleCount: particles,
    angle: 60,
    spread: 45,
    origin: { x: 0 },
    colors: colors,
    shapes: ['circle'],
  });
  confetti({
    particleCount: particles,
    angle: 120,
    spread: 45,
    origin: { x: 1 },
    colors: colors,
    shapes: ['circle'],
  });
}


/* Flip Effect

let cards = document.querySelectorAll('.cards');

function flipCard() {
  this.classList.toggle('flip');
}

cards.forEach(card => card.addEventListener('click', flipCard));

*/
