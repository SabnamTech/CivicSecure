// CORRECTED Verhoeff implementation for Aadhaar
const verhoeffValidateCorrect = (aadhaar) => {
    if (!/^\d{12}$/.test(aadhaar)) return false;

    // Official Verhoeff algorithm multiplication table
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

    // Official Verhoeff algorithm permutation table
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

    console.log(`\nTesting: ${aadhaar} (CORRECTED)`);
    console.log(`Reversed array: [${arr.join(', ')}]`);

    for (let i = 0; i < arr.length; i++) {
        // CORRECTED: Use i % 8 instead of (i + 1) % 8
        const pos = i % 8;
        const permuted = p[pos][arr[i]];
        const newC = d[c][permuted];
        console.log(`i=${i}, pos=${pos}, digit=${arr[i]}, permuted=${permuted}, c=${c} -> newC=${newC}`);
        c = newC;
    }

    console.log(`Final c: ${c}, Valid: ${c === 0}`);
    return c === 0;
};

// Test with known valid Aadhaar numbers
const knownValidAadhaar = [
    '123456789018',  // Known valid
    '234567890129',  // Should be valid
    '345678901230',  // Should be valid
];

console.log("=== Testing with CORRECTED algorithm ===");
knownValidAadhaar.forEach(num => {
    const result = verhoeffValidateCorrect(num);
    console.log(`${num}: ${result ? 'PASS ✓' : 'FAIL ✗'}`);
});

console.log("\n=== Testing numbers from Register.jsx with CORRECTED algorithm ===");
const testNumbers = [
    '874568755785',
    '234567890129', 
    '345678901230',
    '784568755807',
    '567890123452',
    '678901234563'
];

testNumbers.forEach(num => {
    const result = verhoeffValidateCorrect(num);
    console.log(`${num}: ${result ? 'PASS ✓' : 'FAIL ✗'}`);
});