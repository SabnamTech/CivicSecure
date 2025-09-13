// Final test of all numbers in Register.jsx
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

console.log("=== Final verification of all test numbers in Register.jsx ===");

const finalTestNumbers = [
    '123456789010',
    '234567890124',
    '345678901238',
    '784568755807',
    '456789012341',
    '567890123458'
];

let allValid = true;

finalTestNumbers.forEach((number, index) => {
    const isValid = verhoeffValidate(number);
    console.log(`${index + 1}. ${number} -> ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
    if (!isValid) allValid = false;
});

console.log(`\n=== Overall Result: ${allValid ? 'ALL NUMBERS ARE VALID ✓' : 'SOME NUMBERS ARE INVALID ✗'} ===`);

// Test with a few real Aadhaar patterns (fictional but properly formatted)
console.log("\n=== Testing real Aadhaar patterns ===");
const realPatterns = ['999999999998', '888888888887', '777777777776'];

realPatterns.forEach(pattern => {
    const isValid = verhoeffValidate(pattern);
    console.log(`Real pattern: ${pattern} -> ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
});