import { useState, useRef } from 'react';

let idCounter = 1;

export default function Todolist() {

    const inpRef = useRef(null);
    const [list, setList] = useState([]);

    function onAdd() {
        setList(list.concat({
            id: idCounter++,
            value: inpRef.current.value
        }));
    }

    function onRemove(id) {
        setList(list.filter(item => id !== item.id));
    }

    return (
        <div>
            <input
                type="text"
                ref={ inpRef }
            />
            <button onClick={ onAdd }>新增</button>
            <ol>
                {
                    list.map(item => (
                        <li key={ item.id }>
                            { item.value }
                            <button onClick={ () => onRemove(item.id) }>删除</button>
                        </li>
                    ))
                }
            </ol>
        </div>
    );
}
