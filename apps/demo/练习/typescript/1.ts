// typescript: javascript的超集

// 数字
const num: number = 1;

// 字符串
const str: string = '1';

// 布尔值
const boo = false;

// 或者 |
const numStr: string | number = 1; // '2'

// 元组
const size: [number, number] = [100, 80]; // w, h
const position: [number, number] = [12, 312]; // x, y
const position3d: [number, number, number] = [12, 312, 12312]; // x, y

// 数组
// const arr: number[] = [1, 2, 3];
// const arr: string[] = ['1', '2', '3'];
const positionList: [number, number][] = [
  [1, 2],
  [1, 2],
  [1, 2]
];

// 对象
interface IPerson {
  name: string;
  age: number;
  children?: IPerson[];
}

const zs: IPerson = {
  name: 'zhangsan',
  age: 12
};

zs.children?.push({
  name: 'ls',
  age: 11
});

// 按钮组件参数
// type: primary/danger/warning
// size: small/large/mini
// round: true/false
// disabled: true/false

type IButtonType = 'primary' | 'danger' | 'warning';
type IButtonSize = 'small' | 'large' | 'mini';

interface IButtonProps {
  type?: IButtonType;
  size?: IButtonSize;
  round?: boolean;
  disabled?: boolean;
}

interface IShoppingCartListMember {
  id: string;
  name: string;
  picture: string;
  price: number;
  count: number;
  // ...
}

// 练习
interface IShoppingCartListAPI {
  msg: string;
  result: IShoppingCartListMember[];
}

const res: IShoppingCartListAPI = {
  msg: 'hello world',
  result: []
};

res.result.forEach(element => {
  console.log(element);
});
