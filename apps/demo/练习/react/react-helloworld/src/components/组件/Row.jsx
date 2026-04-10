import React from 'react';

export const Gutter = React.createContext({
    gutter: 16,
    count: 0,
});

export default class Row extends React.Component {

    render() {
        return (
            <Gutter.Provider value={{
                gutter: this.props.gutter,
                count: this.props.children.length,
            }}>
                <div className="row">
                    { this.props.children }
                </div>
            </Gutter.Provider>
        );
    }

}