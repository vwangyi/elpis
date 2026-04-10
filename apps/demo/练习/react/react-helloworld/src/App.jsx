import React from 'react';
import HelloWorld from './components/hello-world';
import Count from './components/count';
import 条件渲染 from './components/条件渲染';
import 列表渲染 from './components/列表渲染';
import Input from './components/输入框';
import Todolist from './components/todolist';
import Komponent from './components/组件/父组件';
import ButtonWrapper from './components/组件/按钮的父组件';
import Row from './components/组件/Row';
import Col from './components/组件/Col';

export default class App extends React.Component {

  // 渲染函数(react提供的)(必写)
  render() {
    // jsx
    return (
      <div>
        <Row gutter={ 16 }>
          <Col span={ 12 }>1</Col>
          <Col span={ 6 }>2</Col>
          <Col span={ 6 }>3</Col>
        </Row>
        sadkuhasdihasiohd
      </div>
    );
  }

}
