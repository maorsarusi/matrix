/*
Matrix is a page that hold the functions that helps the user to calculate the matrix
the function calculate the mathematics of the operations the user choose to do
*/

/* 
function calculateMatrixByYou manages the presentation of the matrix after inserting the values
the function locked the cells of the values for changs
*/
function calculateMatrixByYou() {
    document.getElementById("newValues").style.display = "none";
    document.getElementById("formula").innerHTML = "";
    document.getElementById("byYou").style.display = "flex";
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            document.getElementById(String(i) + String(j)).disabled = true;
        }
    }
}

/* 
function manageOperations takes the value of the selected operation and 
mangae the operation by this value
*/
function manageOperations() {
    document.getElementById("operationsP").style.display = "flex";
    document.getElementById("calculate").style.display = "none";
    var val = returnSelectOption("operations");
    val == "1" ? manageSwitch() : (val == "2" ? manageMultiply() : manageAdd());
    displayNewMatrix();
}

/* 
function manageSwitch is the function that manage the switch between 2 rows
*/
function manageSwitch() {
    var from = returnSelectOption("from");
    var to = returnSelectOption("to");
    OPERATIONCOUNT++;
    insertByOperation(OPERATIONCOUNT);
    replaceLines(parseInt(from) - 1, parseInt(to) - 1);
    var operation = `R${from} <=> R${to}`;
    document.getElementById("operationsOrder").innerHTML += `<div id="R${OPERATIONCOUNT}"> <a  onclick="reverseByOperations('${OPERATIONCOUNT}')">${operation}</a></br></div>`;
}

/* 
function multiply does the operation multiply
param val : the value to multiply the row
param select : the selcet that had the number of row to multiply
return  a list with the row number to multiply and the prev row that multiplied - if the multiply happend'
and a list with the number -1 and empty row if the multiply didn't happend
*/
function multiply(val, select) {
    var tmp = [];
    if (!(isNumber(val) || isFraction(val)[1])) { // insert NAN to the val cell
        alert("חייב להכניס מספר!");
        OPERATIONCOUNT--; //cancel the raise by one anyway
        return [-1, []];
    } else {
        var [fraction, isfraction] = isFraction(val);
        var f = getFractionDetails(val, fraction);
    }
    var rowNum = returnSelectOption(select);
    for (let i = 0; i < PARAMETERS[rowNum - 1].length; i++) {
        tmp[i] = PARAMETERS[rowNum - 1][i];
    }
    let row = PARAMETERS[rowNum - 1];
    for (var i in row) {
        var isfractionCell = typeof row[i] == "number" ? false : isFraction(row[i])[1];
        if (!(isfraction || isfractionCell)) {
            row[i] = parseFloat(val) * row[i];
        } else {
            var f1 = multipleConstOrCell(isfraction, isfractionCell, f, row[i]);
            row[i] = Number.isInteger(f1.calculate()) ? f1.calculate() : f1;
        }
    }
    PARAMETERS[rowNum - 1] = row;
    return [rowNum, tmp];
}
/* 
function multipleConstOrCell gives the number that we multiple the row - represents by a fraction
param isfraction : a boolean represents if the value to multiply is fraction
param isfractionCell : a boolean represents if the value in the cell to multiply is fraction
param f : the value to multiple
param cell : the value in the cell to mutiply
return the fraction after multiplies
*/
function multipleConstOrCell(isfraction, isfractionCell, f, cell) {
    if (isfraction && !isfractionCell) {
        var f1 = new Fraction(f.mone, f.mechane, f.fractionSign);
        f1.multiply(cell);
    } else { // the cell is fraction 
        var f1 = new Fraction(cell.mone, cell.mechane, cell.fractionSign);
        f1.multiply(f);
    }
    return f1
}

/* 
function manageAdd is the function that manage the add row to other row
*/
function manageAdd() {
    var val = document.getElementById("alphaAdd").value;
    OPERATIONCOUNT++;
    insertByOperation(OPERATIONCOUNT);
    const [rowNum, preRow] = multiply(val, "current");
    //console.log([rowNum, preRow])
    var rowToAdd = PARAMETERS[rowNum - 1];
    var currentRow = returnSelectOption("with");
    var isNumberCell = false;
    var isNumberAdd = false;
    for (let i = 0; i < COLUMNS; i++) {
        isNumberAdd = isNumber(rowToAdd[i]);
        isNumberCell = isNumber(PARAMETERS[currentRow - 1][i]);
        PARAMETERS[currentRow - 1][i] = isNumberAdd && isNumberCell ? PARAMETERS[currentRow - 1][i] + rowToAdd[i] : (isNumberCell ? rowToAdd[i].add(PARAMETERS[currentRow - 1][i]) : PARAMETERS[currentRow - 1][i].add(rowToAdd[i]));
    }
    PARAMETERS[rowNum - 1] = preRow;
    var thisVal = 0;
    var valtoPrint = 0;
    if (!isNumber(val)) { // prepare the value to display
        var fractionVal = getFractionDetails(val, "/");
        thisVal = fractionVal.mone;
        fractionVal.absFraction();
        valtoPrint = fractionVal.display();
    } else {
        thisVal = val;
        valtoPrint = Math.abs(val) != 1 ? Math.abs(val) : '';
    }
    var sign = thisVal < 0 ? '-' : '+';
    var operation = `R${currentRow} => R${currentRow} ${sign} ${valtoPrint}R${rowNum}`;
    document.getElementById("operationsOrder").innerHTML += `<div id="R${OPERATIONCOUNT}"><a  onclick="reverseByOperations('${OPERATIONCOUNT}')">${operation}</a></br></div>`;

}
/* 
function manageMultiply is the function managed multiply number in row
*/
function manageMultiply() {
    var val = document.getElementById("alpha").value;
    OPERATIONCOUNT++;
    insertByOperation(OPERATIONCOUNT);
    var rowNum = multiply(val, "rowNum")[0];
    if (rowNum != -1) {
        var operation = `R${rowNum} => ${val}R${rowNum}`;
        document.getElementById("operationsOrder").innerHTML += `<div id="R${OPERATIONCOUNT}"><a onclick="reverseByOperations('${OPERATIONCOUNT}')">${operation}</a></br></div>`;
    }
}
/* 
function returnSelectOption gives the value of chosen select 
param id : the id of the select we take it's value
return the value from the select
*/
function returnSelectOption(id) {
    var select = document.getElementById(id);
    var val = select.options[select.selectedIndex].value;
    return val;
}

/* 
function switchOptions gets the operation from the operation select and 
displayed on the screen the atrributes by the chosen operation
*/
function switchOptions() {
    var val = returnSelectOption("operations");
    document.getElementById("switch").style.display = "none";
    document.getElementById("multiply").style.display = "none";
    document.getElementById("add").style.display = "none";
    document.getElementById("calculateButton").style.display = "flex";
    if (val == "1") {
        manageToOperations1And3("from", "to", "switch");

    } else if (val == "2") {
        document.getElementById("multiply").style.display = "flex";
        if (document.getElementById("rowNum").options.length == 0) {
            var select = document.getElementById("rowNum");
            insertOptionsToSelect(select, 0, ROWS - 1)
        }
    }
    if (val == "3") {
        manageToOperations1And3("current", "with", "add");
    }
}

/* 
function manageToOperations1And3 get 2 selcts and a div, 
insert values to the selects if the number of options are 0
and didplay the div

param first : the first select to insert
param second :the second select to insert
param div : the div to display
*/

function manageToOperations1And3(first, second, div) {
    if (document.getElementById(first).options.length == 0) {
        var firstSelect = document.getElementById(first);
        var secondSelect = document.getElementById(second);
        insertOptionsToSelect(secondSelect, 0, ROWS - 1);
        insertOptionsToSelect(firstSelect, 0, ROWS - 1);
    }

    document.getElementById(div).style.display = "flex";
}