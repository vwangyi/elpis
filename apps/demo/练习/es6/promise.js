// (async () => {

//     // Promise
//     function sleep(delay) {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 // resolve执行之日 await结束之时
//                 // resolve接受的参数
//                 // 1. 给await的结果
//                 // 2. 给.then的回调函数
//                 resolve();
//             }, delay);
//         });
//     }

//     // 让程序阻塞一秒之后打印1
//     await sleep(1000);

//     console.log(1);

// })();

// resolve: 成功函数, reject: 失败函数
// new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve([1, 2, 3]);
//     }, 1000);
// }).then(res => {
//     console.log(res);
// });

// (async () => {
//     // Promise实例才能await 才能.then
//     // const res = await new Promise((resolve, reject) => {
//     //     setTimeout(() => {
//     //         resolve([1, 2, 3]);
//     //     }, 2000);
//     // });

//     const res = await new Promise((resolve, reject) => {
//         setTimeout(() => {
//             reject('hello world');
//         }, 500);
//     })
//     .then(r => {
//         console.log('1:', r); // [1, 2, 3]
//         return 1;
//     })
//     .then(r => {
//         console.log('2:', r); // 1
//     })
//     .catch(err => {
//         console.log(err); // 'hello world'
//     });

//     console.log(res);

// })();

function sleep(delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
}

// sleep()
// .then(res => {

// })
// .catch(err => {

// });

async function fn() {
  const res = await sleep(1000);
  console.log(res);
}

fn();
