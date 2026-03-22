设计模式(design pattern)是对 面向对象设计中 反复出现的问题的解决方案 
设计模式是解决特定问题的经验总结和可复用的解决方案
通俗解释就是 某个经常出现的场景 总结出的 解决方案 


问：观察者模式

1.观察者模式(observer Pattern):
    Vue.js 利用观察者模式实现了数据双向绑定。
    通过使用响应式的数据劫持，当数据发生变化时，自动更新相关的D0M元。
    Vue.js中的观家者模式由Vue 实例、渲染函数和 Watcher 组件等组成。
问：适配器模式？
应用场景：当系统中某个接口的结构已经无法满足我们现在的业务需求，但又不能改动这个接口，因为可能原来的系统很多功能都依赖于这个接口，
改动接口会牵扯到太多文件。因此应对这种场景，我们可以很快地想到可以用适配器模式来解决这个问题。

4.适配器模式(AdapterPattern):
vue.js 的计算属性和监听属性实现了适配器模式。
计算属性允许开发者创建派生属性，其值基于其他响应式属性的值计算得出。
监听属性允许开发者监听数据对象的属性变化，并在变化时执行相关操作。
 
问：工厂模式？
3.工厂模式(Factory Pattern):
Vue.js中的组件系统充分利用了工厂模式。
通过使用 Vue.extend()方法创建组件构造函数，
并使用new关键字实例化组件，从而生成组件实例。
这种方式简化了组件的创建过程。
问：发布订阅模式

2.发布-订阅模式(Publish-Subscribe Pattern):
    Vue.js 的事件机制基于发布-订阅模式。
    Vue实例可以触发事件并监听事件，允许组件之间以松合的方式进行通信。
    Vue 使用'emit'方法用于发布事件，使用'on'方法用于订阅事件。

问：单例模式？

单例模式(Singleton Pattern):
Vue.js的全局事件总线(Global Event Bus)模式采用了单例模式。
通过创建一个全局的Vue实例作为事件总线，
可以在任何组件中通过 $emit()触发事件，或者通过 $on()监听事件。

单例模式：一个类只有一个实例对象

用class实现单例模式
class Singleton {
    static #instance = null; // 静态私有变量
    constructor() {
        if (Singleton.#instance) {
            return Singleton.#instance;  // 如果实例已存在，返回已存在的实例
        }
        this.name = 'Singleton Instance';
        Singleton.#instance = this;  // 保存当前实例
    }
}
// function Singleton() {
//     if (Singleton.instance) {
//         return Singleton.instance;  // 如果实例已存在，返回已存在的实例
//     }
//     this.name = 'Singleton Instance';
//     Singleton.instance = this;  // 保存当前实例
// }

const singleton1 = new Singleton();
const singleton2 = new Singleton();

// console.log( '# ', Singleton.#instance ); // 报错 

console.log(singleton1 === singleton2);  // 输出: true，确保是同一个实例

用闭包函数实现单例模式
const Singleton = (function() {
    let instance = null;  // 用于保存实例

    function createInstance() {
        // 创建一个新实例
        return {
            name: 'Singleton Instance',
            sayHello: function() {
                console.log('Hello, Singleton!');
            }
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();  // 如果实例不存在，则创建
            }
            return instance;
        }
    };
})();

// 使用单例
const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();

console.log(singleton1 === singleton2);  // 输出: true，确保是同一个实例



用Proxy实现单例模式
// 使用 Proxy 可以为单例模式添加一些额外的控制，例如日志、懒加载等。
const Singleton = (function() {
    let instance = null;

    function createInstance() {
        return {
            name: 'Singleton Instance',
            sayHello: function() {
                console.log('Hello, Singleton!');
            }
        };
    }

    const handler = {
        get: function(target, prop) {
            if (!instance) {
                instance = createInstance();
            }
            return instance[prop];
        }
    };

    return new Proxy({}, handler);  // 代理对象，代理访问单例实例
})();

// 使用单例
const singleton1 = Singleton.sayHello;
const singleton2 = Singleton.sayHello;

console.log(singleton1 === singleton2);  // 输出: true





应用场景
vuex 就是采用单例模式 全局只有一个Store 
弹窗 弹窗，无论打开关闭多少次，弹窗只应该被创建一次。 
  第一次打开关闭弹窗 和 第二次打开关闭弹窗 都是同一个实例对象

好处
单例模式可以保证全局只有一个实例，避免了重复创建和资源浪费的问题。


      ● 设计模式 
        ○ 目的：有助于写出可复用 可维护性高的程序
        ○ 模式
          ■ 发布订阅者模式 （观察者模式）
          ■ 工厂模式
          ■ 装饰者模式
          ■ 单例模式
          ■ 构造器模式
          ■ 原型模式
          ■ 代理模式
          ■ 外观模式
          ■ 迭代器模式
          ■ 适配器模式
          ■ mvc模式 （最传统的 model view controller）
          ■ mvp模式：（view层提供更新UI的接口 presenter 接收大到数据变化后 通过这层接口更新view ）
          ■ mvvm模式：
        ○ AOP 面向切片编程
        ○ OOP 面向对象编程
        ○ 设计原则
          ■ 单一职责原则：一个类 应该仅有一个引起它变化的原因 简而言之 功能要单一
          ■ 接口隔离原则：一个接口应该是一种角色 不该干的事别干 该干的事都要干 简而言之 降低耦合 减少依赖
          ■ 开放封闭原则  对扩展开放 对修改关闭 
          ■ 面对接口编程： 依赖抽象 而不依赖具体