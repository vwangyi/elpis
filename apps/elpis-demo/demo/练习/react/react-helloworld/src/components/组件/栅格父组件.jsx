import React from 'react';

export default class 组件名 extends React.Component {

    state = {

    };

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <div>col-6</div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div>col-6</div>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <div>col-6</div>
                    </Col>
                </Row>
            </div>
        );
    }

}