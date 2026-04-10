// 打印1~10 但是不打5
for (var i = 1; i < 11; i++) {
  if (i !== 5) {
    console.log(i);
    console.log(i);
    console.log(i);
    console.log(i);
    console.log(i);
    console.log(i);
    console.log(i);
    console.log(i);
  }
}

for (var i = 1; i < 11; i++) {
  if (i === 5) {
    // 本轮循环不要了
    continue;
  }
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  console.log(i);
  // 1w+
}
