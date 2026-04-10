setTimeout(() => {
  new Promise(resolve => {
    console.log('b');
    resolve('c');
    setTimeout(() => {
      console.log('d');
      setTimeout(() => {
        console.log('f');
      });
    });
  }).then(res => {
    console.log(res);
    setTimeout(() => {
      console.log('e');
    });
  });
  console.log('a');
});
console.log('z');

// 同: z
// 宏:
//      同: b, a
//      微: c
//      宏: d
//      微+宏: e
//      宏+宏: f
