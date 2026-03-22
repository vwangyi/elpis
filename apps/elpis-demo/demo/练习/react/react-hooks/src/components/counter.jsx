import { useState, useEffect } from 'react';

function App() {

  // v16.8.3+ 函数式状态
  const [count, setCount] = useState(0);

  // 类似mounted
  useEffect(() => {
      console.log(document.querySelector('#counter'));

      // 类似beforeDestory
      return () => {
        console.log('卸载前');
      };
  }, []);

  // 类似于updated
  // useEffect(() => {
  //     console.log(count);
  // });

  // 类似于watch
  // useEffect(() => {
  //     console.log(count);
  // }, [count]);

  function onAdd() {
    setCount(count + 1);
  }

  return (
    <div id="counter">
      { count }
      <button onClick={ onAdd }>+1</button>
    </div>
  );
}

export default App;
