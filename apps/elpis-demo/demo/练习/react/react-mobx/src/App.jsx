import { observer } from 'mobx-react-lite';
import { useRef } from 'react';

let idCounter = 1;

export default observer((props) => {

  const inp = useRef(null);

  function onAdd() {
    props.store.add({
      id: idCounter++,
      value: inp.current.value,
    });
  }

  function onRemove(id) {
    props.store.remove(id);
  }

  return (
    <div className="App">
      <input type="text" ref={ inp } />
      <button onClick={ onAdd }>新增</button>
      <ol>
        {
          props.store.list.map(item => (
            <li key={ item.id }>
              { item.value }
              <button onClick={ () => onRemove(item.id) }>删除</button>
            </li>
          ))
        }
      </ol>
    </div>
  )
});
