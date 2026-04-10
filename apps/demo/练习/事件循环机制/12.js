console.log('aaa');

setTimeout(() => console.log('t1'), 0);
(async () => {
  console.log(111);
  await console.log(222);
  console.log(333);

  setTimeout(() => console.log('t2'), 0);
})().then(() => {
  console.log(444);
});

console.log('bbb');
