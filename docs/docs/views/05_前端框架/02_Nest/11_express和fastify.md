


## express和fastify 

- 适配器就是加了中间层来适配，生活中就是 国内和国外的插头不能直接用 需要一个转换器才可以用
- 通过适配器 来 切换 express和fastify 
```js
const duck = new Duck('鸭子');
const chicken = new Chicken('鸡叫')

const adpter = new AnimalAdapter(duck, 'clunk方法名1')
// const adpter = new AnimalAdapter(chicken, 'clunk方法名2')

mackItQuack(adpter)
```

