const MAX_CHARACTERS = 15;
const SECONDARY_COLOR = 'grey';
const SMALL_FONT_SIZE = '1rem';
const MEDIUM_FONT_SIZE = '2rem';
const LARGE_FONT_SIZE = '3rem';

const numbersRegex = /[0-9\.]+/;
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
let firstInput = true;

const displayContainer = document.getElementById("expression");
const displayResultContainer = document.getElementById("result");
const buttons = document.querySelectorAll('button');
const dotButton = document.getElementById('dot');


displayContainer.textContent = infixExpression;
displayContainer.style.fontSize = MEDIUM_FONT_SIZE;
displayResultContainer.style.color = SECONDARY_COLOR;
buttons.forEach((button) => {
    if (button.id !== 'delete-btn') {
        button.addEventListener('click', handleClickedButton);
    } else {
        button.addEventListener('click', deleteExpression);
    }
});




/************************************* MAIN FUNCTIONS*******************************************/

function handleClickedButton(event) {
    const input = this.textContent;
    switch(input) {
        case '=': if (!infixExpression[infixExpression.length - 1].match(operatorsRegex)) { 
                        operate(); 
                  }
                  displayFinalResult(); 
                  break;
        case '%':  displayPercentage(); break;
        case 'AC': resetCalculator(); break;
        default:  processAndDisplayInput(input); 
                  if (!infixExpression[infixExpression.length - 1].match(operatorsRegex)) { 
                    operate(); 
                  } 
                  displayResult();
                  break;
    }    
}


function processAndDisplayInput(input) {
    if(emptyDisplay) {
        infixExpression = '';
        resetDisplayTextStyle();
        emptyDisplay = false;
        dotButton.disabled = false;
        firstInput = true;
    }

    if (infixExpression.length <= MAX_CHARACTERS) {

        let lastIndex = infixExpression.length - 1;

        // to replace operators if there is two operators in a row
        if (input.match(operatorsRegex) ) {
            dotButton.disabled = false;
            if (infixExpression.length > 0 && infixExpression[lastIndex].match(operatorsRegex)) {
                infixExpression = infixExpression.slice(0,lastIndex) + input;
            } else if (!firstInput) {
                infixExpression += input;
            } else {
                return;
            }
        } else if (input === '.') {
            dotButton.disabled = true;
            infixExpression += input;
        } else {
            firstInput = false;
            infixExpression += input
        }
        
        displayContainer.textContent = infixExpression;
    }
        
    
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
    result = operationStack.pop();
    
    
}

function displayResult() {
    if(! isNaN(result)) {
        displayResultContainer.textContent = "= " + result;
    }    
}

function displayPercentage() {
    displayContainer.textContent = result + "%";
    result = percentage(result);
    emptyDisplay = true;
    dotButton.disabled = true;
    displayContainer.style.fontSize = SMALL_FONT_SIZE;
    displayResultContainer.textContent = "= " + result;
    displayResultContainer.style.fontSize = LARGE_FONT_SIZE;
    displayResultContainer.style.color = 'black';
}

function displayFinalResult() {
    if(! isNaN(result)) {
        emptyDisplay = true;
        dotButton.disabled = true;
        displayContainer.style.fontSize = SMALL_FONT_SIZE;
        displayResultContainer.textContent = "= " + result;
        displayResultContainer.style.fontSize = LARGE_FONT_SIZE;
        displayResultContainer.style.color = 'black';
    }    
}

function deleteExpression() {
    if(!emptyDisplay) {
        infixExpression = infixExpression.substring(0, infixExpression.length - 1);
        if (infixExpression.length === 0) {
            resetCalculator();
        } else {
            processAndDisplayInput(''); 
            operate();
            displayResult();
        }
        
    }
}

function resetCalculator() {
    infixExpression = '';
    result = '';
    emptyDisplay = true;
    dotButton.disabled = true;
    displayContainer.textContent = '0';
    displayResultContainer.textContent = "";
    resetDisplayTextStyle();
}

function resetDisplayTextStyle() {
    displayContainer.style.fontSize = MEDIUM_FONT_SIZE;
    displayResultContainer.style.fontSize = SMALL_FONT_SIZE;
    displayResultContainer.style.color = SECONDARY_COLOR;
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
    return Math.round((num2 / num1) * 100) / 100;
}

function subtract(num1, num2) {
    return num2 - num1;
}

function percentage(number) {
    return Math.round(number) / 100;
}

/*****************************************************************************************************/