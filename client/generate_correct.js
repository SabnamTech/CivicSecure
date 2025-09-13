// Let's verify what makes 784568755807 valid and fix the algorithm
const verhoeffValidate = (aadhaar) => {
    if (!/^\d{12}$/.test(aadhaar)) return false;

    const d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const arr = aadhaar.split('').map(Number).reverse();

    for (let i = 0; i < arr.length; i++) {
        c = d[c][p[i % 8][arr[i]]];
    }

    return c === 0;
};

// Generate check digit for 11 digits
const generateCheckDigit = (base11digits) => {
    const d = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
        [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
        [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
        [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
        [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
        [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
        [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
        [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
        [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
        [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
        [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
        [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
        [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
        [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

    // Calculate checksum for 11 digits with potential check digit
    for (let checkDigit = 0; checkDigit <= 9; checkDigit++) {
        const testNumber = base11digits + checkDigit;
        if (verhoeffValidate(testNumber)) {
            return checkDigit;
        }
    }
    return -1; // No valid check digit found
};

console.log("=== Analyzing known valid number ===");
const knownValid = '784568755807';
console.log(`${knownValid} -> ${verhoeffValidate(knownValid) ? 'VALID ✓' : 'INVALID ✗'}`);

console.log("\n=== Generating new valid numbers ===");
const testBases = ['12345678901', '23456789012', '34567890123', '78456875580'];

const validNumbers = [];

testBases.forEach(base => {
    const checkDigit = generateCheckDigit(base);
    if (checkDigit >= 0) {
        const fullNumber = base + checkDigit;
        const isValid = verhoeffValidate(fullNumber);
        console.log(`${base} + ${checkDigit} = ${fullNumber} -> ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
        if (isValid) {
            validNumbers.push(fullNumber);
        }
    } else {
        console.log(`${base} -> No valid check digit found`);
    }
});

console.log("\n=== Final valid test numbers ===");
validNumbers.forEach(num => {
    console.log(`'${num}',`);
});