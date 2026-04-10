const minInt = Number.MIN_SAFE_INTEGER;
// console.log(minInt);         // → -9007199254740991
// console.log(-9007199254740996n === -9007199254740997n);     // → -9007199254740996

// console.log(1n == 1);
// console.log('1' == 1);
// console.log('1' == 1n);
let a = 1n;
a++;
console.log(a);
