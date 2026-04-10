async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end'); // 微
}
async function async2() {
  console.log('async2 start');
  await async3();
  console.log('async2 end'); // 微
}
async function async3() {
  console.log('async3 start');
  await async4();
  console.log('async3 end'); // 微1
}
async function async4() {
  console.log('async4');
}
console.log('script start');
setTimeout(function () {
  console.log('settimeout');
});
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2'); // 微
});
console.log('script end');

// script start
// async1 start
// async2 start
// async3 start
// async4
// promise1

// promise2
// script end
// settimeout
