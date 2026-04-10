const zs = {
  name: 'zhangsan',
  age: 18,
  sex: 'nan',
  [Symbol.iterator]() {
    const values = Object.values(this);
    let i = 0;
    return {
      next() {
        const value = values[i++];
        const done = i > values.length;
        return {
          value,
          done
        };
      }
    };
  }
};

for (const value of zs) {
  console.log(value); // 'zhangsan' 18 'nan'
}
