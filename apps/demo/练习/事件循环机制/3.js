console.log('a');
setTimeout(() => {
  console.log('c');
  // new Promise((resolve) => {
  //     resolve('e');
  // })
  // .then((res) => {
  //     console.log(res);
  // });

  Promise.resolve('e').then(res => {
    console.log(res);
  });
});
setTimeout(() => {
  console.log('d');
});
console.log('b');

// 同步: a, b
// 0s宏: c, e, d
