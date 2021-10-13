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
        calculateScore();
        printScore();
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
      setTimeout(unflipAll, 1300);
      isUnflipTimerRunning = true;
    }
  }
}

let timeUsed;
let finalScore;

function calculateTimeUsed() {
  let secondsUsed = Number(document.getElementById("seconds").innerHTML);
  let minutesUsed = Number(document.getElementById("minutes").innerHTML);
  minutesUsed = minutesUsed * 60;
  timeUsed = minutesUsed + secondsUsed;
  return timeUsed;
}

function calculateScore() {
  let clicks = Number(document.getElementById("clicks_count").innerHTML);
  let time = calculateTimeUsed();
  finalScore = clicks + time;
  return finalScore;
}

function printScore () {
  if (finalScore <= 55) {
    let fiveStarsList = document.querySelectorAll("#star5, #star4, #star3, #star2, #star1");
    for (i=0; i<fiveStarsList.length; i++) {
      fiveStarsList[i].classList.add("checked");
    }
  } else if (finalScore > 55 && finalScore <= 62) {
    let fourStarsList = document.querySelectorAll("#star4, #star3, #star2, #star1");
    for (i=0; i<fourStarsList.length; i++) {
      fourStarsList[i].classList.add("checked");
    }
  } else if (finalScore > 62 && finalScore <= 67) {
    let threeStarsList = document.querySelectorAll("#star3, #star2, #star1");
    for (i=0; i<threeStarsList.length; i++) {
      threeStarsList[i].classList.add("checked");
    }
  } else if (finalScore > 67 && finalScore <= 95) {
    let twoStarsList = document.querySelectorAll("#star2, #star1");
    for (i=0; i<twoStarsList.length; i++) {
      twoStarsList[i].classList.add("checked");
    }
  } else if (finalScore > 95) {
    let oneStar = document.getElementById("star1");
    oneStar.classList.add("checked");
  }
}
