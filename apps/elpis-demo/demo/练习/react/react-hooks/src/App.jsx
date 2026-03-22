import Counter from './components/counter';
import Todolist from './components/todolist';
import Lifecycle from './components/lifecycle';
import { useState } from 'react';
import { useRoutes, useNavigate } from 'react-router-dom';
import routes from './router';
import { observer } from 'mobx-react-lite';

export default observer((props) => {

  console.log(props.store.counter);

  // 编程时导航
  const goTo = useNavigate();

  // hooks路由
  const routerView = useRoutes(routes);

  function goToPage1() {
    // vue
    // router.push();
    goTo('/page1');
  }


  return (
    <div className="App">
      {/* { visible && <Counter /> }
      <button onClick={ onSwitch }>开关</button> */}

      {/* <router-view></router-view> */}
      { routerView }
      <button onClick={ goToPage1 }>去page1</button>
    </div>
  );
});
