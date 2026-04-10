console.log('1');

function async11() {
  return async22().then(() => {
    console.log('2');
  });
}
function async22() {
  console.log('12');
  return async33().then(() => {
    console.log('3');
  });
}
function async33() {
  console.log('11');
  return Promise.resolve();
}
async11();

setTimeout(function () {
  console.log('4');
}, 0);

new Promise(resolve => {
  console.log('5');
  resolve();
})
  .then(function () {
    console.log('6');
  })
  .then(function () {
    console.log('7');
  });

console.log('8');
