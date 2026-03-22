import React from 'react';
import './main.css';

export default class Todolist extends React.Component {

    state = {
        inputValue: '',
        list: [],
    };

    idCounter = 1;

    onInput(e) {
        this.setState({
            inputValue: e.target.value,
        });
    }

    onAdd() {
        this.setState({
            list: this.state.list.concat({
                id: this.idCounter++,
                value: this.state.inputValue,
            }),
        });
    }

    onRemove(id) {
        this.setState({
            list: this.state.list.filter(item => item.id !== id),
        });
    }

    render() {
        return (
            <div className="todolist">
                <input
                    type="text"
                    value={ this.state.inputValue }
                    onInput={ this.onInput.bind(this) }
                />
                <button onClick={ this.onAdd.bind(this) }>新增</button>
                <ol>
                    {
                        this.state.list.map((item) => (
                            <li key={ item.id }>
                                { item.value }
                                <button onClick={ () => this.onRemove.call(this, item.id) }>删除</button>
                            </li>
                        ))
                    }
                </ol>
            </div>
        );
    }

}