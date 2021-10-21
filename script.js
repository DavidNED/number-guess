const btnCheck = document.querySelector('.check');
const btnAgain = document.querySelector('.again');
const btnSumbit = document.querySelector('.btn-submit');
const guess = document.querySelector('.guess');
const message = document.querySelector('.message');
const messageError = document.querySelector('.message-error');
const scoreLabel = document.querySelector('.score');
const highScoreLabel = document.querySelector('.highscore');
const minNum = document.querySelector('.min-num');
const maxNum = document.querySelector('.max-num');
const between = document.querySelector('.between');

const state = {
  secretNum: 0,
  highScore: 0,
  score: 20,
  maxNum: 20,
  minNum: 1,
  playing: true,
};

// window.s = state;

//------------------------------------------------------------------

const setValuesToNewGame = function () {
  state.score = 20;
  scoreLabel.textContent = '20';
  message.textContent = 'Start guessing...';
  between.textContent = `(Between ${state.minNum} and ${state.maxNum})`;
};

const setValuesToDefault = function () {
  state.maxNum = 20;
  state.minNum = 1;
  state.secretNum = 0;
  state.score = 20;
  state.playing = true;
  scoreLabel.textContent = '20';
  message.textContent = 'Start guessing...';
  between.textContent = '(Between 1 and 20)';
};

const createSetTimeout = function () {
  setTimeout(() => {
    messageError.textContent = '';
  }, 3500);
};

const clearInputFields = function () {
  guess.value = '';
  minNum.value = '';
  maxNum.value = '';
};

const createPositiveRandomNumber = function () {
  return (
    Math.trunc(Math.random() * (state.maxNum - state.minNum) + 1) + state.minNum
  );
};

const checkMaxGreater = function (negativeVal = false) {
  // Check if min. number is greater than max. number.
  // If this is the case, return. min. number should always be lower.

  // With only negative values (negativeVal), things work different with comparing
  const condition = negativeVal
    ? state.minNum < state.maxNum
    : state.minNum > state.maxNum;

  if (condition) {
    messageError.textContent =
      "Minimum number can't be higher than maximum number.";

    createSetTimeout();

    return false;
  }
};

const checkGuessNumber = function () {
  const val = +guess.value;

  if (val > state.maxNum || val < state.minNum) {
    message.textContent = `Number range is ${state.minNum}-${state.maxNum}.`;
    return;
  }

  if (val > state.secretNum) {
    state.score--;
    message.textContent = 'Too high';
    scoreLabel.textContent = state.score;
  }

  if (val < state.secretNum) {
    state.score--;
    message.textContent = 'Too low';
    scoreLabel.textContent = state.score;
  }

  if (val === state.secretNum) {
    if (!state.playing) return;
    state.score--;
    message.textContent = 'Correct!';
    if (state.score > state.highScore) state.highScore = state.score;
    scoreLabel.textContent = state.score;
    highScoreLabel.textContent = state.highScore;
    state.playing = false;
  }
};

const checkInputFields = function () {
  // Set borders back to default - when user filled in one field before instead of two the border was red
  minNum.style.border = '2px solid #eee';
  maxNum.style.border = '2px solid #eee';

  // Get values out of fields
  const maxNumVal = maxNum.value;
  const minNumVal = minNum.value;

  // When both fields are filled in, move on to init() function
  if (maxNumVal !== '' || minNumVal !== '') {
    state.maxNum = +maxNumVal;
    state.minNum = +minNumVal;
  }

  // When one of the fields is empty, apply red border to that field
  if (maxNumVal === '' || minNumVal === '') {
    minNum.value === ''
      ? (minNum.style.border = '2px solid #C02B0B')
      : (maxNum.style.border = '2px solid #C02B0B');

    // Set back to 20 and 1 (in this case either one of them is set to 0 because of line 51 and 52)
    setValuesToDefault();

    return;
  }

  init();
};

//------------------------------------------------------------------

const init = function () {
  // Return when both values are the same
  if (state.maxNum === state.minNum) {
    messageError.textContent = "Numbers can't be the same.";
    createSetTimeout();
    setValuesToDefault();
    return;
  }

  // When both min. and max. values are positive (default)
  if (state.maxNum > 0 && state.minNum > 0) {
    const check = checkMaxGreater();

    if (check === false) {
      setValuesToDefault();
      clearInputFields();
      return;
    }

    state.secretNum = createPositiveRandomNumber();
    setValuesToNewGame();
    clearInputFields();
  }

  // When both min. and max. numbers are negative
  // With only negative values (negativeVal), things work the other way around with comparing
  if (state.maxNum < 0 && state.minNum < 0) {
    const check = checkMaxGreater(true);

    if (check === false) {
      setValuesToDefault();
      clearInputFields();
      return;
    }

    state.secretNum =
      Math.trunc(Math.random() * (state.maxNum - state.minNum) - 1) +
      state.minNum;

    setValuesToNewGame();
    clearInputFields();
    return;
  }

  // When one of the numbers is positive and one negative
  if (state.maxNum < 0 || state.minNum < 0) {
    const check = checkMaxGreater();

    if (check === false) {
      setValuesToDefault();
      clearInputFields();
      return;
    }

    // e.g. max = 30, min = -20. Player basically wants a number between 1 to 30 and -1 to -20.
    // We create a random number. When it is <= the minimum number (in this case 20 (we cut of the '-')), we create a random number again
    // When this random number is > 0.5 we multiply the first created random number 1, when it is < 0.5 we multiple it by -1
    // With this we can create a number that is either negative or positive when the number is <= 20 (and in this example this is what the user wants (number between -1 to -20))
    // In this case -20 is excluded and -1 is included
    let num = Math.trunc(Math.random() * state.maxNum) + 1;
    if (num <= Math.abs(state.minNum)) {
      num *= Math.round() > 0.5 ? 1 : -1;
    }
    state.secretNum = num;

    setValuesToNewGame();
    clearInputFields();
  }
};

//------------------------------------------------------------------

// Event listeners
btnCheck.addEventListener('click', checkGuessNumber);

const elements = [minNum, maxNum];
elements.forEach(element =>
  element.addEventListener('keypress', function (e) {
    state.playing = true;
    if (e.key === 'Enter') checkInputFields();
  })
);

btnSumbit.addEventListener('click', function () {
  state.playing = true;
  checkInputFields;
});
btnAgain.addEventListener('click', function () {
  setValuesToDefault();
  clearInputFields();
  state.secretNum = createPositiveRandomNumber();
});

init();
