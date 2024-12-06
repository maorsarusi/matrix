/*
Matrix_AI is a page that hold the functions that calculate a matrix by itself
the matrix can be clclated step by step or the whole matrix in one  click
*/


// Global parameters
var stepParameter = 0; // parameter that helps to step by step and counting the number of rows
var isDown = true; // parameter that says if we in down rank or up

/* 
function calculateMatrix is the main function that manage the calculate the whole matrix
*/
function calculateMatrix() {
    document.getElementById("newValues").style.display = "none";
    document.getElementById("formula").innerHTML = "";
    if (PARAMETERS[0][0] != 1) {
        for (let i = 1; i < PARAMETERS.length; i++) {
            if (PARAMETERS[i][0] == 1) {
                replaceLines(i, 0);
                for (var j in PARAMETERS) {
                    for (var k in PARAMETERS[j]) {
                        document.getElementById(String(j) + String(k)).value = PARAMETERS[j][k];
                    }
                }
                break;
            }
        }
    }
}

/* 
function calculateMatrix() is the manage function to calculte the matrix by AI
*/
function calculateMatrix() {
    document.getElementById("operationsP").style.display = "flex";
    var bad = rankDown();
    if (!bad) {
        rankUp();
    }
    displayNewMatrix();
}
/* 
function rankDown() is the manage function of rank the 
matrix under the one's
*/
function rankDown() {
    var bad = false;
    for (let i = 0; i < ROWS; i++) {
        if (PARAMETERS[i][i] != 1) {
            multiplyRow(i); // turn the leader to 1 
        }
        for (let j = i + 1; j < ROWS; j++) {
            zeroDown(PARAMETERS[j][i], j, i)
            bad = isBadLine(j);
            if (bad) {
                return bad; // means that we have a bad line
            }
        }
    }
    return false;
}

/* 
function multiplyRow() is the main function of 
multiply a row by a value
param row: is the row to multiple  
*/
function multiplyRow(row) {
    OPERATIONCOUNT++;
    insertByOperation(OPERATIONCOUNT); // insert the matrix that calculated by the operation
    var value = PARAMETERS[row][row];
    var fraction;
    if (isNumber(value)) {
        fraction = value != 0 ? new Fraction(1, value, "/") : new Fraction(value, 1, "/");
        fraction.switchSign();
    } else // it means its a fraction
    {
        fraction = value.mone < 0 ? new Fraction(value.mechane * -1, value.mone, "/") : new Fraction(value.mechane, value.mone, "/");
    }
    for (let i = 0; i < COLUMNS; i++) {
        var coppy = fraction.copyFraction();
        var x = fraction.returnMultiply(PARAMETERS[row][i]);
        PARAMETERS[row][i] = x;
        fraction = coppy.copyFraction();
    }
    var operation = `R${row + 1} => ${fraction.display()}R${row + 1}`;
    document.getElementById("operationsOrder").innerHTML += `<div id="${OPERATIONCOUNT}"> <a>${operation}</a></br></div>`;
    insertValuesToPARAMETERS();

}

/* 
function rankUp() is the manage function of rank the 
matrix below the one's
*/
function rankUp() {
    for (let i = ROWS - 1; i > 0; i--) {
        if (PARAMETERS[i][i] != 1 || ((PARAMETERS[i][i].mone != PARAMETERS[i][i].mechane))) {
            multiplyRow(i);
        }
        for (let j = i - 1; j >= 0; j--) {
            zeroUp(PARAMETERS[j][i], j, i)
        }
    }
}

/* 
function zeroUp() is the function that operate the zero 
belows the one's
param value: is the value to add
param row: is the row we add  to it 
param rowMul: is the row we add rothe row we calculate
*/
function zeroUp(value, row, rowMul) {
    OPERATIONCOUNT++;
    insertByOperation(OPERATIONCOUNT);
    var isNumberCell = false;
    var isNumberAdd = false;
    var isNUmberCellMUl = false;
    var ValFraction = upsidedown(value);
    for (let i = COLUMNS - 1; i >= 0; i--) {
        // checks if the parameters are numbers or fraction
        isNumberAdd = isNumber(value);
        isNumberCell = isNumber(PARAMETERS[row][i]);
        isNUmberCellMUl = isNumber(PARAMETERS[rowMul][i]);
        // do the add
        var valToAdd = isNumberAdd && isNUmberCellMUl ? value * -1 * PARAMETERS[rowMul][i] : ValFraction.returnMultiply(PARAMETERS[rowMul][i]);
        var isNUmberToAdd = isNumber(valToAdd);
        PARAMETERS[row][i] = isNUmberToAdd && isNumberCell ? PARAMETERS[row][i] + valToAdd : (isNumberCell ? valToAdd.add(PARAMETERS[row][i]) : PARAMETERS[row][i].add(valToAdd));
        ValFraction = upsidedown(value);
    }

    //display the operation line
    var sign = ValFraction.mone < 0 ? '-' : '+';
    ValFraction.absFraction();
    var operation = `R${row + 1} =>  R${row + 1} ${sign} ${ValFraction.display()}R${rowMul}`;
    document.getElementById("operationsOrder").innerHTML += `<div id="${OPERATIONCOUNT}"> <a>${operation}</a></br></div>`;
    insertValuesToPARAMETERS();
}

/* 
function stepByStep() calculate the matrix step by step
*/
function stepByStep() {
    document.getElementById("operationsP").style.display = "flex";
    if (stepParameter == ROWS) {
        isDown = false; // finish to rank down, starts to rank up
    }
    if (isDown) {
        if (PARAMETERS[stepParameter][stepParameter] != 1) {
            multiplyRow(stepParameter);
        }
        var bad = isBadLine(stepParameter)
        if (!bad) {
            for (let i = stepParameter + 1; i < ROWS; i++) {
                zeroDown(PARAMETERS[i][stepParameter], i, stepParameter);
            }
        }
        stepParameter++;
    } else { // ranking up
        stepParameter--;
        if (PARAMETERS[stepParameter][stepParameter] != 1 || ((PARAMETERS[stepParameter][stepParameter].mone != PARAMETERS[stepParameter][stepParameter].mechane))) {
            multiplyRow(stepParameter);
        }
        for (let j = stepParameter - 1; j >= 0; j--) {
            zeroUp(PARAMETERS[j][stepParameter], j, stepParameter)
        }

    }
    displayNewMatrix();
}

/* 
function zeroDown() is the function that operate the zero 
down the one's
param value: is the value to add
param row: is the row we add  to it 
param rowMul: is the row we add rothe row we calculate
*/
function zeroDown(value, row, rowMul) {
    if (value != 0) // if it value of the parameter is zero we don't need to sub \ add 
    {
        OPERATIONCOUNT++;
        insertByOperation(OPERATIONCOUNT);
        var isNumberCell = false;
        var isNumberAdd = false;
        var isNUmberCellMUl = false;
        var ValFraction = upsidedown(value);
        for (let i = 0; i < COLUMNS; i++) {
            isNumberAdd = isNumber(value);
            isNumberCell = isNumber(PARAMETERS[row][i]);
            isNUmberCellMUl = isNumber(PARAMETERS[rowMul][i]);
            var valToAdd = isNumberAdd && isNUmberCellMUl ? value * -1 * PARAMETERS[rowMul][i] : ValFraction.returnMultiply(PARAMETERS[rowMul][i]);
            var isNUmberToAdd = isNumber(valToAdd);
            PARAMETERS[row][i] = isNUmberToAdd && isNumberCell ? PARAMETERS[row][i] + valToAdd : (isNumberCell ? valToAdd.add(PARAMETERS[row][i]) : PARAMETERS[row][i].add(valToAdd));
            ValFraction = upsidedown(value);
        }
        var sign = ValFraction.mone < 0 ? '-' : '+';
        ValFraction.absFraction();
        var operation = `R${row + 1} =>  R${row + 1} ${sign} ${ValFraction.display()}R${rowMul + 1}`;
        document.getElementById("operationsOrder").innerHTML += `<div id="${OPERATIONCOUNT}"> <a>${operation}</a></br></div>`;
        insertValuesToPARAMETERS();
    }
}