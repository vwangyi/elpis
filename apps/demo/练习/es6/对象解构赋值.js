const input = [
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    birthday: '1998'
  },
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    birthday: '1998'
  },
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    birthday: '1998'
  },
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    birthday: '1998'
  }
];

const expect = [
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    age: 24,
    birthday: '1998'
  },
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    age: 24,
    birthday: '1998'
  },
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    age: 24,
    birthday: '1998'
  },
  {
    name: 'zs',
    sex: 'nan',
    height: 200,
    age: 24,
    birthday: '1998'
  }
];

function getResult(input) {
  return input.map(item => ({
    // name: item.name,
    // sex: item.sex,
    // height: item.height,
    ...item,
    age: 2022 - item.birthday
  }));
}
