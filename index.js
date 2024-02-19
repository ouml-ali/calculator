function add(num1, num2) {
    return +num1 + +num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function percentage(number) {
    return number / 100;
}

const displayContainer = document.getElementById("display-text");
const buttons = document.querySelectorAll('button');
buttons.forEach(
    (button) => button.addEventListener('click', handleClickedButton));


function handleClickedButton() {
    const input = this.textContent;
    const numbersRegex = /[0-9]+/;
    const operationsRgex = /(%|×|÷|-|\+|\.|=)/;

    // TODO: user stack to track order of operation

    if(input.match(numbersRegex) || input.match(operationsRgex)) {
        
    } else {
        if(this.id === 'delete-btn') {
            console.log("delete");
        }
        if(input === 'AC') {
            console.log(input);
        }
    }
}



function parseInput(input) {

}


function deleteExpression() {

}

function resetCalculator() {

}