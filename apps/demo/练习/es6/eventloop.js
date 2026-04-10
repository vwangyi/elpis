async function async1() {
  console.log('1');
  await async2();
  console.log('2');
  await async2();
  console.log('3');
}
async function async2() {
  console.log('3');
}
console.log('4');
async1();
new Promise(function (resolve) {
  console.log('6');
  setTimeout(function () {
    console.log('5');
  }, 0);
  resolve('7');
})
  .then(function (res) {
    console.log(res);
    return Promise.resolve('10').then(() => {
      console.log('11');
    });
  })
  .then(function (res) {
    console.log(res);
  });
console.log('9');
