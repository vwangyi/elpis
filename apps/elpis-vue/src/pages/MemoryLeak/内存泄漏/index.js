function createLeakyClosure() {
  const bigData = new Array(1000000).fill('data'); // 大数据
  const button = document.getElementById('myButton');

  button.addEventListener('click', function () {
    // 这个闭包引用了bigData和button
    console.log(bigData.length); // 即使不需要，也保持着引用
    console.log('Button clicked');
  });

  // 即使removeEventListener，闭包仍然保持引用
}

function createClosure() {
  let data = getHugeData();

  return function () {
    // 意外地创建了全局引用
    window.leakedData = data; // ❌ 错误的做法
    processData(data);
  };
}

function setupHandler() {
  const largeObject = getLargeData();
  const button = document.getElementById('btn');

  function handler() {
    console.log('Processing:', largeObject);
  }

  button.addEventListener('click', handler);

  // 提供清理函数
  return function cleanup() {
    button.removeEventListener('click', handler);
    // 显式解除引用
    largeObject = null;
  };
}

const cleanup = setupHandler();
// 当不再需要时调用清理函数
cleanup();

function createEfficientClosure() {
  const largeData = getLargeData();
  const button = document.getElementById('btn');

  // 只引用真正需要的变量
  const neededData = extractNeededData(largeData);

  return function () {
    processData(neededData); // 只引用必要的数据
  };
}

// 正确做法3：使用WeakMap/WeakSet
const weakMap = new WeakMap();

function createSafeClosure(element) {
  const data = getLargeData();

  weakMap.set(element, {
    handleClick: function () {
      // 处理逻辑
      console.log('Clicked');
    }
  });

  element.addEventListener('click', weakMap.get(element).handleClick);
}

// 当element被移除时，相关的闭包可以被垃圾回收

// 最佳实践总结
// 最小化闭包范围：只保留必要的引用

// 及时清理：移除事件监听器，解除引用

// 避免循环引用：特别是涉及DOM元素时

// 使用弱引用：WeakMap、WeakSet适合缓存场景

// 代码审查：检查潜在的泄漏模式

// 目的是什么 排查内存泄漏 总结方法论
//   以后遇到内存泄漏 知道调用方法论 第一步 复现问题反复操作
//     打开关闭弹窗 通过 memory内存选项卡 录制快照信息
//       查看堆中所有变量，从而定位到源码位置。
//         定位内存泄漏原油造成内存泄漏的原因
//           未销毁的事件监听器未清理的定时器和回调未清理的全局变量未释放的
//             DOM 元素未清理的闭包变量未移除的控制台变量一个被聚集的dom，
//               哪怕失焦后卸载 也不会被GC回收去查看github上查看 iussse ，
//                 也有人之前就遇到过 创建一个小的游离节点
//   最终只有这个小的游离节点没有回收 问题也就不大了
