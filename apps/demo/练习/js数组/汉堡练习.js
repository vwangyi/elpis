const input = [1, 2, 3, 4];

function getResult(nums) {
  return nums.reduce((p, c) => {
    p.push(c ** 2);
    return p;
  }, []);
  // 1: p: []  c: 1  >>  [1]
  // 2: p: [1] c: 2  >>  [1, 4]
}

function getResult(nums) {
  return nums.reduce((p, c) => p.concat(c ** 2), []);
  // 1: p: []  c: 1  >>  [1]
  // 2: p: [1] c: 2  >>  [1, 4]
}

const expect = [1, 4, 9, 16];
