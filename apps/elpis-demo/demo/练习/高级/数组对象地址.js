// const arr1 = [1, 2];
// const arr2 = arr1;

// arr2.push(3);

// console.log(arr1 === arr2); // true
// console.log( [] === [] ); // false

// const obj1 = {};
// const obj2 = {};
// // obj1.name = 'zs';

// console.log(obj2.name); // undefined
// console.log(obj2 === obj1); // false
// console.log(obj2 == obj1); // false

const obj1 = {
  name: 'zs',
  children: [
    {
      name: 'zs1',
      children: [
        {
          name: 'zs11',
          children: [],
        },
      ],
    },
  ],
}
