import React from 'react';

export default class Count extends React.Component {

    // 和vue中的data作用类似
    state = {
        count: 0,
    };

    constructor(props) {
        super(props);
        // created
        console.log(this.state.count);
    }

    // mounted
    componentDidMount() {
        // 各种初始化操作
        // 相当于vue的前4个生命周期
        console.log('mounted');
    }

    // updated
    componentDidUpdate() {
        console.log('updated');
    }

    // beforeDestory
    componentWillUnmount() {
        // 清除内存
        console.log('beforeDestory');
    }

    onAdd() {
        this.setState({
            count: this.state.count + 1,
        });
    }

    render() {
        return (
            <div>
                { this.state.count }
                <button onClick={ this.onAdd.bind(this) }>+1</button>
            </div>
        );
    }

}
