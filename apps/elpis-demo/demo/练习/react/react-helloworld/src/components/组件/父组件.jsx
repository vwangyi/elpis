import React from 'react';
import Child from './子组件';

export default class 父组件 extends React.Component {

    state = {

    };

    fnn(a) {
        console.log(a);
    }

    render() {
        return (
            <div>
                <Child
                    msg={ 123 }
                    fn={ this.fnn }
                    prefix={ <span>前缀</span> }
                >
                    <div>这是插槽</div>
                </Child>
            </div>
        );
    }

}