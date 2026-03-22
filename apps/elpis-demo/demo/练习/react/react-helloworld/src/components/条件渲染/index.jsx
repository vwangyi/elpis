import React from 'react';

export default class 条件渲染 extends React.Component {

    state = {
        visible: true,
    };

    toggle() {
        this.setState({
            visible: !this.state.visible,
        });
    }

    createHelloWorld() {
        if (this.state.visible) {
            return <div>hello world</div>;
        }
        return null;
    }

    render() {
        return (
            <div>
                { this.createHelloWorld() }
                {/* { this.state.visible ? <div>hello world</div> : null } */}
                {/* { this.state.visible && <div>hello world</div> } */}
                <button onClick={ this.toggle.bind(this) }>
                    { this.state.visible ? '隐藏' : '显示' }
                </button>
            </div>
        );
    }

}
