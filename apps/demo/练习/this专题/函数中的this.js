// function fn() {
//     // this指向调用者
//     console.log('b', this);
// }

// fn(); // window

// const obj = {
//     run: fn,
// };

// obj.run(); // obj

// document.addEventListener('click', fn); // document

// document.addEventListener('click', function () {
//     console.log('a:', this); // document
//     fn(); // window
// });

// document.addEventListener('click', function () {
//     console.log('a:', this); // document
//     const fn = () => {
//         console.log('b', this);
//     }
//     fn(); //
// });

// const obj = {
//     fn: () => {
//         console.log(this);
//     },
// };

// obj.fn(); // window

document.addEventListener('click', () => {
  console.log('a:', this);
  function fn() {
    console.log('b', this);
  }
  fn();
});

const obj = {
  fn() {
    console.log('a:', this); // ?????
  },
  f1: () => {
    console.log('b:', this); // window
  }
};

document.addEventListener('click', obj.f1); // b: window

document.addEventListener('click', obj.fn); // a: document
