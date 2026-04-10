import React from 'react';
import Button from './按钮组件';

export default class 组件名 extends React.Component {

    state = {

    };

    render() {
        return (
            <div>
                <Button
                    isLoading={ false }
                    disabled={ false }
                    type="primary" // danger
                    onClick={ (e) => { console.log(e); } }
                    loadingIcon={ <div>a</div> }
                >
                    loading
                </Button>
            </div>
        );
    }

}/*  */