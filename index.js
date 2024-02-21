const numbersRegex = /[0-9]+/;
const operatorsRegex = /(×|÷|-|\+)/;    
const operatorsPrecedence = {
    '+': 0,
    '-': 0,
    '÷': 1,
    '×': 1
};


let infixExpression = '0';
let result = '';
let emptyDisplay = true;

const displayContainer = document.getElementById("expression");
const displayResultContainer = document.getElementById("result");
const buttons = document.querySelectorAll('button');


displayContainer.textContent = infixExpression;
buttons.forEach((button) => button.addEventListener('click', handleClickedButton));




/************************************* MAIN FUNCTIONS*******************************************/

function handleClickedButton(event) {
    const input = this.textContent;
    switch(input) {
        case '=': result = operate(); displayResult(); break;
        case '%': break;
        case '.' : break;
        case 'AC': resetCalculator(); break;
        default:  processAndDisplayInput(input); break;
    }    
}


function processAndDisplayInput(input) {
    // TO DO replace or remove duplicate operator
    if(result) { resetCalculator(); }
    if(emptyDisplay) {
        infixExpression = '';
        emptyDisplay = false;
    }
    infixExpression += input;
    displayContainer.textContent = infixExpression;
    
}

function convertToPostfixExpression(infixExpression) {
    let splittedInfixExpression = infixExpression.split('');
    let postfixExpression = '';
    let operatorStack = [];
    for(let i = 0; i < splittedInfixExpression.length; i++) {
        if(splittedInfixExpression[i].match(numbersRegex)) {
            postfixExpression += splittedInfixExpression[i];
        } else if (splittedInfixExpression[i].match(operatorsRegex)) {
    
            // space is for speration when evaluating the expression
            postfixExpression += ' ';
            let peekIndex = operatorStack.length - 1;
            if(operatorStack.length != 0) {
                // pop the peek operator from the stack and append it to postfix expression 
                // each time it has a precedance greater or equal to the current operator's precedence  
                while ( 
                    operatorsPrecedence[splittedInfixExpression[i]] <= operatorsPrecedence[operatorStack[peekIndex]] 
                    && peekIndex >= 0
                ) {
                    postfixExpression += operatorStack.pop();
                    postfixExpression += ' ';
                    peekIndex--;
                }
            }
            operatorStack.push(splittedInfixExpression[i]);
        }
    }

    while (operatorStack.length != 0) {
        postfixExpression += ' ';
        postfixExpression += operatorStack.pop();
    }

    return postfixExpression;
}

function operate() {

    let postfixExpression = convertToPostfixExpression(infixExpression);

    // evaluate the postfix expression
    let postfixExpArray = postfixExpression.split(" ");
    let operationStack = [];
    for(let i = 0; i < postfixExpArray.length; i++) {
        switch(postfixExpArray[i]) {
            case '+' : operationStack.push(add(operationStack.pop(), operationStack.pop())); break;
            case '-' : operationStack.push(subtract(operationStack.pop(), operationStack.pop())); break;
            case '÷' : operationStack.push(divide(operationStack.pop(), operationStack.pop())); break;
            case '×' : operationStack.push(multiply(operationStack.pop(), operationStack.pop())); break;
            default : operationStack.push(postfixExpArray[i]); break;
        }
    }
    return operationStack.pop();
}

function displayResult() {
    displayResultContainer.textContent = "=" + result;
}

function deleteExpression() {

}

function resetCalculator() {
    infixExpression = '';
    result = '';
    emptyDisplay = true;
    displayContainer.textContent = '0';
    displayResultContainer.textContent = "";
}

/*****************************************************************************************************/

/************************************* OPERATIONS FUNCTIONS*******************************************/

function add(num1, num2) {
    return +num1 + +num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    if (num1 == 0) return "infinity";
    return num2 / num1;
}

function subtract(num1, num2) {
    return num2 - num1;
}

function percentage(number) {
    return number / 100;
}

/*****************************************************************************************************/