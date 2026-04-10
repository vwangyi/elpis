// console.log(msg);
// if (true) {
//     var msg = 'hello world';
// }

// for (let i = 0; i < 5; i++) {
//     setTimeout(() => {
//         console.log(i);
//     }, 1000);
// }

// 新的声明变量的方式
// 1. let
// let a = 1;
// console.log(a); // 1

// 2. const 定量/常量
// const b = 2;
// console.log(b);

// no-var: 不能用var
// 能用const的不能用let

// let msg = 'hello world';
// if (true) {
//     console.log(msg);
// }

// num > 0
// 在不输入的情况下 打印100
function fn(num) {
  // if (num) {
  //     console.log(num);
  // }
  num && console.log(num);
}

// fn(5); // 5
// fn(); // 100

// document.addEventListener('keyup', (e) => {
//     if (e.key === 'Enter') {
//         console.log('Enter');
//     }
//     if (e.key === 'Backspace') {
//         console.log('Backspace');
//     }
//     if (e.key === 'Shift') {
//         console.log('Shift');
//     }

//     switch (e.key) {
//         case 'Enter':

//             break;
//         case 'Backspace':

//             break;
//         case 'Shift':

//             break;

//         default:
//             break;
//     }

// });

const str = 'hello world';
const num = 1;

const arr = [];

if (!arr.length) {
}
