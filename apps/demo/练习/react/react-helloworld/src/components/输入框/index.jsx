import React from 'react';

export default class Input extends React.Component {

    state = {
        inputValue: '',
    };

    handleInput(e) {
        this.setState({
            inputValue: e.target.value,
        });
    }

    render() {
        return (
            <div>
                { this.state.inputValue }
                <input
                    type="text"
                    value={ this.state.inputValue }
                    onInput={ this.handleInput.bind(this) }
                />
            </div>
        );
    }

}
