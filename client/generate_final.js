// Generate two more valid numbers
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
    for (let checkDigit = 0; checkDigit <= 9; checkDigit++) {
        const testNumber = base11digits + checkDigit;
        if (verhoeffValidate(testNumber)) {
            return checkDigit;
        }
    }
    return -1;
};

const moreBases = ['45678901234', '56789012345'];

moreBases.forEach(base => {
    const checkDigit = generateCheckDigit(base);
    if (checkDigit >= 0) {
        const fullNumber = base + checkDigit;
        const isValid = verhoeffValidate(fullNumber);
        console.log(`'${fullNumber}',  // Valid checksum - ${isValid ? 'VERIFIED ✓' : 'ERROR ✗'}`);
    }
});