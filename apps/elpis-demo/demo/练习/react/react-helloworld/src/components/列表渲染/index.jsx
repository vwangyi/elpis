import React from 'react';

export default class 列表渲染 extends React.Component {

    state = {
        list: ['a', 'b', 'c'],
    };

    // react中的列表渲染就是生成一个DOM数组
    createList() {
        const domList = [];
        this.state.list.forEach((item, i) => {
            domList.push(<div key={ i }>{ item }</div>);
        });
        return domList;
    }

    render() {
        return (
            <div>
                {/* 'a' >>> <div>a</div> */}
                {/* {
                    this.state.list.map((d, i) => <div key={ i }>{ d }</div>)
                } */}
                { this.createList() }
            </div>
        );
    }

}