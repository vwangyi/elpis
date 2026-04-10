import React from 'react';
import './main.css';

export default class 组件名 extends React.Component {

    state = {

    };

    render() {
        return (
            <button
                className={ 'button '  + (this.props.type || 'primary') }
                disabled={ this.props.disabled }
                onClick={ this.props.onClick }
            >
                { this.props.isLoading && <div className="loading-icon">{ this.props.loadingIcon }</div> }
                { this.props.children }
            </button>
        );
    }

}