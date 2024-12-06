/*
 class fraction represents the fraction inside the matrix -
 a fraction is a number represent by mone and mechane and / like x/y
*/
class Fraction {
    /* 
    a consructor to fraction class
    */
    constructor(mone, mechane, fractionSign = "/") {
            this.mone = mone;
            this.mechane = mechane;
            this.fractionSign = fractionSign;
            this.reduce();
        }
        /* 
        method absFraction() get a fraction and became it to posituve fraction
        */
    absFraction() {
        this.mone = Math.abs(this.mone);
        this.mechane = Math.abs(this.mechane);
    }

    /* 
    method displayInteger() return the fraction as integer if 
    the mechane is 1 or the mone is 0, and the fraction itsef if not
    */
    displayInteger() {
            if (this.mone == 0 || this.mechane == 1) { return this.mone; }
            return this
        }
        /* 
        method display() display the function on the screen - 
        it's the console fraction of the class
        */
    display() {
            if (this.mone == 0 || this.mechane == 1) { return this.mone; }
            if (this.mechane < 0) {
                this.mone *= -1;
                this.mechane *= -1;
            }
            return this.mone + this.fractionSign + this.mechane;
        }
        /* 
        method multiplyByConst gets a value and multiple the fraction by it
        param val : the multiple value
        */
    multiplyByConst(val) {
        if (val == 0 || this.mone == 0)
            this.mone = 0;
        else { this.mone *= val; }
    }

    /* 
    method multiply is the responsible method of
    multiple the fraction  
    param f: is the value that multiple the fraction
    in the end the value has been reduced 
    */
    multiply(f) {
            if (typeof f == "number" || isNumber(f)) {
                this.multiplyByConst(parseFloat(f));
            } else {
                this.mone *= f.mone;
                this.mechane *= f.mechane;
            }
            this.reduce();

        }
        /* 
         method calculate() get the value of the fraction
        */
    calculate() {
            if (this.mone == 0) { return 0; }
            return this.mone / this.mechane;
        }
        /* 
        method add() is the responsible fraction of add value to fraction
        param f: is the  value to add (can be fraction or number)
        */
    add(f) {
            if (isNumber(f)) {
                return new Fraction(f * this.mechane + this.mone, this.mechane, "/");
            }
            var commonMechane = findGcd(this.mechane, f.mechane);
            commonMechane = (this.mechane * f.mechane) / commonMechane;

            let num = ((this.mone) * (commonMechane / this.mechane) +
                (f.mone) * (commonMechane / f.mechane));

            let gcd = findGcd(commonMechane, num);
            var f1 = new Fraction(num / gcd, commonMechane / gcd, '/');
            //var f1 = new Fraction((this.mone * f.mechane)/commonMechane + this.mechane * f.mone / commonMechane, commonMechane, "/");
            if (f1.mone == 0) {
                return 0;
            }
            f1.reduce();
            return f1;
        }
        /* 
        method reduce() reduce the fraction to it's reduced version
        by using the gcd algorithm
        */
    reduce() {
        const gcd = findGcd(Math.abs(this.mone), Math.abs(this.mechane));
        this.mone /= gcd;
        this.mechane /= gcd;
    }

    /* 
    method switchSign() switch the sign to positive or to negative 
    for the fraction
    */
    switchSign() {
        if ((this.mone < 0 && this.mechane < 0) || (this.mone > 0 && this.mechane < 0)) {
            this.mone *= -1;
            this.mechane *= -1;
        }
    }

    /* 
    method returnMultiply() manage the multiply fraction and return 
    the multiple fraction 
    */
    returnMultiply(f) {
        this.multiply(f);
        return this;
    }

    /* 
    method copyFraction() copy the fraction 
    and return the coppied fraction
    */
    copyFraction() {
        var fraction = new Fraction(1, 1, "/");
        fraction.mone = this.mone;
        fraction.mechane = this.mechane;
        return fraction;
    }
}

/* 
function findGcd() gets 2 numbers and return the greater common divisor 
between them
param a: the first divisor
param b: the second divisor
return the biggest number that divde the 2 numbers
*/
function findGcd(a, b) {
    return b ? findGcd(b, a % b) : a;
}

/* 
function getFractionDetails() gets a fraction as as string and
a divisor sign and returns a fraction
param val: the fraction as a string
para, fraction: the divisor sign - can be / or %
*/
function getFractionDetails(val, fraction = "/") {
    if (typeof val == "number" || isNumber(val)) { return val; }
    var numbers = val.split(fraction);
    var mone = parseInt(numbers[0]);
    var mechane = parseInt(numbers[1]);
    var f = new Fraction(mone, mechane, fraction);
    return f
}

/* 
function upsidedown() turn the fraction and switch the fraction sign
and if it isn't a fraction - turn its sign
param num: the value to turn
*/
function upsidedown(num) {
    if (isNumber(num)) {
        var f = new Fraction(num * -1, 1);
    } else {
        var f = new Fraction(num.mone * -1, num.mechane);
    }
    f.switchSign();
    return f;
}