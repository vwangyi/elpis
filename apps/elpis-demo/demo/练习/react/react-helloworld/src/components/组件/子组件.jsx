import React from 'react';

/**
 * 1. 父 >> 子 传参
 * 2. 子 >> 父 传参(函数)
 * 3. 插槽
 */
export default class 子组件 extends React.Component {

    state = {

    };

    // DOM加载完成
    componentDidMount() {
        this.props.fn('hello world');
    }

    render() {
        return (
            <div>
                {/* 前缀prefix: 具名插槽 */}
                { this.props.prefix }
                {/* 相当于默认插槽 */}
                { this.props.children }
                { this.props.msg }
            </div>
        );
    }

}