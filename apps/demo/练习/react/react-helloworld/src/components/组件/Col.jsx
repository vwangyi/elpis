import React from 'react';
import { Gutter } from './Row';

export default class Col extends React.Component {

    static contextType = Gutter;

    render() {
        return (
            <div className="col" style={{
                width: `calc(((100% - ${ this.context.gutter }px * ${ this.context.count - 1 }) * ${ this.props.span }) / 24)`,
                marginRight: `${ this.context.gutter }px`,
            }}>
                { this.props.children }
            </div>
        );
    }

}