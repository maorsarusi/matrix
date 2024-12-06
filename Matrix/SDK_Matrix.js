// parts that helps to both calculate by myself and AI calculating

var ROWS = 0;
var COLUMNS = 0;
var DICT = {};
var PARAMETERS = [];
var EQULATIONSYSTEM = '';
var MATRIXBYOPERATION = {};
var OPERATIONCOUNT = 0; //parameter that represents the number 
var ZEROLIST = [];
var FREEPARAMETSERS = {};

/* 
function showMatrix is the function that 
show the matrix on the screen -after every calculate
*/
function showMatrix(matrix) {
    for (var j in matrix) {
        for (var k in matrix[j]) {
            var display = typeof matrix[j][k] == "number" ? matrix[j][k] : matrix[j][k].display();
            document.getElementById(String(j) + String(k)).value = display;
        }
    }
}

/* 
function displayNewMatrix() shows the matrix
and if it the final result - show the result of the calculation
*/
function displayNewMatrix() {
    showMatrix(PARAMETERS);
    displayFinalResult();
}


/* 
function checkFinalResult() checks if 
the mstrix are ranks correctly 
*/
function checkFinalResult() {
    for (let i = 0; i < ROWS; i++) {
        if (PARAMETERS[i][i] == 1) {
            for (let j = 0; j < COLUMNS - 1; j++) {
                if (PARAMETERS[i][j] != 0 && i != j) {
                    return false;
                }
            }
        } else { return false; }
    }
    return true;
}

/* 
function isRankDown() checks 
if the matix are raking down correctly
*/
function isRankDown() {
    for (let i = 0; i < ROWS; i++) {
        if (i == ROWS - 1 && PARAMETERS[i][i] != 1) {
            return false;
        }
        for (let j = i + 1; j < ROWS; j++) {
            if (!(PARAMETERS[j][i] == 0 && PARAMETERS[i][i] == 1)) {
                return false;
            }
        }
    }
    return true;
}

/* 
function isRankUp() checks 
if the matix are raking up correctly
*/
function isRankUp() {
    for (let i = ROWS - 1; i >= 0; i--) {
        if (i == 0 && PARAMETERS[i][i] != 1) {
            return false;
        }
        for (let j = i - 1; j >= 0; j--) {
            if (!(PARAMETERS[j][i] == 0 && PARAMETERS[i][i] == 1)) {
                return false;
            }
        }
    }
    return true;
}

/* 
function checkNotNXN() checks if 
the rows number are equals to the columns number
*/
function checkNotNXN() {
    return isRankDown() && isRankUp()
}

function checkLeader(line) {}

/* 
function arrangeResults() responsible at the result by line
and display it on the screen
param line: the ine to display
return all the result for the line
*/
function arrangeResults(line) {
    var result = "";
    var sign = '';
    if (isZerosLine(line, COLUMNS)) {
        return `X${line} = ${FREEPARAMETSERS[DICT[line]]} </br>`
    }
    result = `X${line} = `
    for (let i = 0; i < COLUMNS - 1; i++) {
        var isNumberVal = isNumber(PARAMETERS[line][i]);
        var value = isNumberVal ? PARAMETERS[line][i] : PARAMETERS[line][i].copyFraction();
        sign = isNumberVal ? (value < 0 ? 0 : 1) : (value.mone < 0 ? '+' : ''); // check the sign of the value
        var param = FREEPARAMETSERS[DICT[i]] // check if there is a free parameters
        if (i != line) {
            result += isNumberVal && value != 0 ? (value < 0 ? '+' : '') + (value == 1 || value == -1 ? '' : value * -1) + `${param} ` : !isNumberVal ? (sign) + value.returnMultiply(-1).display() + `${param} ` : '';
        }
    }
    var val = PARAMETERS[line][COLUMNS - 1];
    var isNumberVAl = isNumber(val);
    sign = isNumberVAl ? (val < 0 ? 0 : 1) : (val.mone < 0 ? '' : '+');
    result += val == 0 ? '' : isNumberVAl ? `${getSign(sign, val)} ${val}` : `${sign} ${val.display()}`;
    return result + "</br>";
}


/* 
function getBadtext() displaytext if the line is a bad line(all the parameters are 0 and the result differents from 0)
param lineIndex: the bad line
return a string to dispay on the screen
*/
function getBadtext(lineIndex) {
    return " השורה ה" + lineIndex + " היא שורת סתירה ולכן אין פיתרון ";
}

/* 
function displayFinalResult() is the main function to display the result on the screen
*/
function displayFinalResult() {
    var check = false;
    var checkLines = false;
    check = checkFinalResult(); // checks if we finish to calculate the matrix
    if (!check && ROWS != COLUMNS - 1) { // if we don't finish 
        check = checkNotNXN();
        checkLines = check;
    }
    for (let i = 0; i < ROWS; i++) {
        var bad = isBadLine(i);
        if (bad) {
            check = true;
            var badLine = i + 1;
            checkLines = true;
            break;
        }
        var zeros = isZerosLine(i, COLUMNS);
        if (zeros && !ZEROLIST.includes(i)) {
            ZEROLIST.push(i);
        }

    }
    if (otherRank() && !check) {
        check = true;
        checkLines = true;
    }
    if (check) {
        document.getElementById("finalResult").style.display = "flex";
        document.getElementById("result").style.display = "flex";
        insertValuesToPARAMETERS();
        var result = '</br> :תוצאה סופית </br>'
        var value = '';
        for (let i = 0; i < ROWS; i++) {
            if (!checkLines) {
                if (isNumber(PARAMETERS[i][COLUMNS - 1])) {
                    value = PARAMETERS[i][COLUMNS - 1];
                } else {
                    value = PARAMETERS[i][COLUMNS - 1].display();
                }

                result += ` X${ i } = ${ value } </br>`;
            } else if (!bad) {
                result += arrangeResults(i);
            } else {
                result += getBadtext(badLine);
                break;
            }
        }

        if (checkNotNXN && ROWS < COLUMNS - 1) { // if there i free parameters
            for (let i = ROWS; i < COLUMNS - 1; i++) {
                result += `X${i} = ${FREEPARAMETSERS[DICT[i]]} </br>`;
            }
        }

        document.getElementById("formula").innerHTML = `${EQULATIONSYSTEM}`;
        document.getElementById("result").innerHTML = result;
    }
}

/* 
function isBadLine() checks if a line is a bad line
param line: the line we check
return true if the line is a bad line and false if it didn't
*/
function isBadLine(line) {
    if (isZerosLine(line, COLUMNS - 1) && PARAMETERS[line][COLUMNS - 1] != 0) {
        return true;
    }
    return false;

}

/* 
function otherLineRank() check if every line but 1 are ranked 
param line: the line we don't want to check if it ranked - we assumed it a zero line 
return true if the other lines are ranked and false if they're didn't
*/
function otherLineRank(line) {
    for (let i = 0; i < COLUMNS - 1; i++) {
        if (!ZEROLIST.includes(i) && i != line) {
            if (PARAMETERS[line][i] != 0) {
                return false;
            }
        }

    }
    return true;
}

/* 
function otherRank() checks if all the line are ranked
*/
function otherRank() {
    for (let i = 0; i < ROWS; i++) {
        if (!ZEROLIST.includes(i)) { // check if the line isn't a zero lines
            if (PARAMETERS[i][i] == 1) {
                for (let j = 0; j < COLUMNS - 1; j++) {
                    if (PARAMETERS[i][j] != 0 && !otherLineRank(i)) {
                        return false;
                    }
                }
            } else { return false; }
        }
        return true;
    }
}

function insertOptionsToSelect(select, from, to) {
    for (let i = from; i <= to; i++) {
        insertIntoSelect(select, i + 1);
    }
}


function insertIntoSelect(select, elem) {
    var option = document.createElement('option');
    var text1 = elem;
    option.text = text1;
    option.value = text1;
    select.add(option);
}

function createMatrix(color) {
    ROWS = parseInt(document.getElementById("indexRow").value);
    COLUMNS = parseInt(document.getElementById("indexColumns").value) + 1;
    document.getElementById("startDiv").style.display = "none";
    document.getElementById("matrixDiv").style.display = "block";

    var table = document.getElementById("Matrix");
    for (let i = 0; i < ROWS; i++) {
        var row = table.insertRow();
        for (let j = 0; j < COLUMNS; j++) {
            var isBorder = ""
            if (j == COLUMNS - 1) {
                isBorder = ` border-left: 5px solid ${color};`
            }
            var c = row.insertCell(-1);
            var id = String(i) + String(j)
            c.innerHTML = '<input type="text" inputmode="numeric" pattern="[0-9]*"' + `id="${id}"` + ` style="${isBorder}"/>`;
        }
    }
}

function getFormula() {
    var formula = '';
    var formulaP = '';
    var ascii = 97;
    for (let i = 0; i < ROWS; i++) {
        PARAMETERS[i] = [];
        for (let j = 0; j < COLUMNS; j++) {
            let val = document.getElementById(String(i) + String(j)).value;
            if (val === '') {
                document.getElementById(String(i) + String(j)).value = 0;
                val = 0;
            }
            if (!(j in DICT)) {
                if (j != COLUMNS - 1) {
                    DICT[j] = `x${j}`;
                    FREEPARAMETSERS[DICT[j]] = String.fromCharCode(ascii);
                    ascii++;

                }
            }

            PARAMETERS[i][j] = isNumber(val) ? parseInt(val) : getFractionDetails(val);
            if (j < COLUMNS - 1) {
                let sign = val == -1 ? '-' : getSign(j, val);
                if (val != 0) {
                    formula += Math.abs(val) != 1 ? ` ${sign} ${val}${DICT[j].bold()}` : ` ${sign} ${DICT[j].bold()}`
                }

            } else if (formula != '') {
                formula += ` = ${val}`
            }
        }
        formulaP += formula + '</br>'
        formula = '';

    }
    return formulaP;
}

function getMatrixDetails(version) {
    var formulaP = getFormula();
    EQULATIONSYSTEM = formulaP;
    alert("במקומות ריקים הוכנס 0");
    document.getElementById("formula").innerHTML = formulaP;
    document.getElementById("submitButton").style.display = 'none';
    document.getElementById("calculate").disabled = false;
    document.getElementById("newValues").disabled = false;
    if (version) {
        document.getElementById("stepByStep").disabled = false;
    }
}

function getSign(j, val) {
    if (j == 0 || (val < 0 && j != 0)) {
        return '';
    }
    return val < 0 ? '-' : '+';
}

function insertNewValues() {
    for (var i in PARAMETERS) {
        for (var j in PARAMETERS[i]) {
            PARAMETERS[i][j] = document.getElementById(String(i) + String(j)).value;
        }
        var formulaP = getFormula();
        document.getElementById("formula").innerHTML = formulaP;

    }
}

function isNumber(value) {
    if (value == 0) { return true; }
    return !(isNaN(value) || value == "");
}

function insertValuesToPARAMETERS() {
    var display = "";
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            display = typeof PARAMETERS[i][j] == "number" ? PARAMETERS[i][j] : PARAMETERS[i][j].displayInteger();
            PARAMETERS[i][j] = display;
        }
    }
}

function isZerosLine(line, to) {
    for (let i = 0; i < to; i++) {
        if (PARAMETERS[line][i] != 0) {
            return false;
        }
    }
    return true;
}


function replaceLines(line1, line2) {
    var tmp = PARAMETERS[line1]
    PARAMETERS[line1] = PARAMETERS[line2];
    PARAMETERS[line2] = tmp;
    if (ZEROLIST.includes(line1) && !ZEROLIST.includes(line2)) {
        var index = ZEROLIST.indexOf(line1);
        ZEROLIST.splice(index, 1, line2);
    } else if (ZEROLIST.includes(line2) && !ZEROLIST.includes(line1)) {
        var index = ZEROLIST.indexOf(line2);
        ZEROLIST.splice(index, 1, line1);
    }
}

function insertByOperation(count) {
    var matrix = matrixToMatrix(PARAMETERS);
    MATRIXBYOPERATION[count] = matrix;
    console.log(MATRIXBYOPERATION)
}

function matrixToMatrix(from) {
    var matrix = [];
    var row = [];
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            row[j] = from[i][j];
        }
        matrix[i] = row;
        row = [];
    }
    return matrix;
}


function reverseByOperations(operation) {
    var matrix = MATRIXBYOPERATION[parseInt(operation)];
    showMatrix(matrix);
    PARAMETERS = matrixToMatrix(matrix);
    document.getElementById("formula").innerHTML = "";
    document.getElementById("result").style.display = "none";
    displayFinalResult();
    var index = parseInt(operation);
    for (let i = index; i <= OPERATIONCOUNT; i++) {
        var x = document.getElementById("R" + i);
        x.remove();
    }
    OPERATIONCOUNT = index - 1;
}

function isFraction(value) {
    if (value.fractionSign == '/')
        return ["/", true];

    if (!(value.includes(":") || value.includes("/"))) {
        return ["", false];
    }
    return [value.includes(":") ? ":" : "/", true]
}