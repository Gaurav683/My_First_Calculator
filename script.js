const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.value = currentValue;
}

function clearCalculator() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function inputNumber(value) {
  if (currentValue === 'Error') {
    currentValue = '0';
  }

  if (shouldResetDisplay) {
    currentValue = value;
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue === '0' ? value : currentValue + value;
  }

  updateDisplay();
}

function inputDecimal() {
  if (currentValue === 'Error') {
    currentValue = '0';
  }

  if (shouldResetDisplay) {
    currentValue = '0';
    shouldResetDisplay = false;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
  }

  updateDisplay();
}

function deleteLast() {
  if (currentValue === 'Error') {
    clearCalculator();
    return;
  }

  if (currentValue.length <= 1) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay();
}

function setOperator(nextOperator) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }

  previousValue = currentValue;
  operator = nextOperator;
  shouldResetDisplay = true;
}

function calculate() {
  if (operator === null || previousValue === null) {
    return;
  }

  const a = Number(previousValue);
  const b = Number(currentValue);
  let result;

  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        currentValue = 'Error';
        previousValue = null;
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
      }
      result = a / b;
      break;
    default:
      return;
  }

  currentValue = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
  previousValue = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (action === 'number') {
      inputNumber(value);
      return;
    }

    if (action === 'decimal') {
      inputDecimal();
      return;
    }

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'operator') {
      setOperator(value);
      return;
    }

    if (action === 'equals') {
      calculate();
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    inputNumber(key);
    return;
  }

  if (key === '.') {
    inputDecimal();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    setOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    calculate();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
