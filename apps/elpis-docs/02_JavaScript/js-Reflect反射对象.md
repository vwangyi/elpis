# Reflect



Reflect 上提供的方法 之前都有 不过是存在 Object 和 Function 上 但现在都统一在 Reflect 上
Reflect其实ES6新引入的一个内置对象，它提供一些反射方法其实以前这些方法都分散在object或Function上



Reec是 ES6 中引入的一个内置对象，它提供了一些反射方法，这些方法与那些在 Object 和Funcion 原型上的方法具有相同的名称和功能。Renect的引入主要是为了对象的行为变得更规范和一致，并且提供一个与 Proxy 对象互补的 API。下面是对 Reflect 的详细讲解。


Refect 对象的方法大致可以分为三类:对象操作、函数调用和原型操作。以下是 Refect 所提供的所有方法及其说明:



1.对象操作方法
。Reflect.get(target, propertyKey[, receiver]):获取对象的属性值，相当于targetipropertyKey)
Reflect.set(target, propertyKey, value[, receiver]):设置对象的属性值，相当于targetipropertyKeyj= value 。
Reflect.deleteProperty(target, propertyKey):删除对象的属性值，相当于 delete target[properyKey]。
Reflect.has(target, propertyKey):检查对象是否有某个属性，相当于 propertyKey in target 。
Reflec,.defineProperty(target, propertyKey, descriptor):定义对象的属性，相当于object.definePropenrtyltargel,propertykey, desciptor) 。
。Reflect.getOwnPropertyDescriptortarget, propertyKey):获取对象自有属性的描述符，相当于0bec.getownPropertyDesciplorltarget, propertykey) 。
.Reflect.ownKeys(target):返回对象的所有自有属性的键，相当于 0bject.getownPropertyNames(larget),concal(oblecl.getownPropertysymbos(targel)。

2.函数调用方法
.Reflect.apply(target, thisArgument, argumentsList): 调用一个数,相当于Funcion.protobype.aply.calltarget,thisArgument, argumentsList) ,.Reflect.construct(target, argumentsListl, newTarget]):构造一个实例,相当于 new target(..argumentsList)。


3.原型操作方法
Reflect.getPrototypeOf(target):获取对象的原型，相当于 Object.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype):设置对象的原型，相当于Object.setPrototypeOf(target, prototype)
。Reflect.isExtensible(target):检查对象是否是可扩展的，相当于0bject.isExtensible(target)。
Reflect.preventExtensions(target):让一个对象变得不可扩展，相当于 Object.,preventExtensions(target)。





1.3.2 使用方法
在使用 refect-metadata之前，需要在代码的入口文件(例如indexts或main.ts)中引入 reflect-metadata:
import "reflect-metadata';
1.3.3 主要功能
reflect.metadata
提供了一组用于定义和检索元数据的方法
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey):定义元数据
Reflect.hasMetadata(metadataKey, target,propertyKey):]检查目标对象是否具有指定的元数据。
Reflect.getMetadata(metadataKey, target, propertyKey):获取目标对象的元数据。
Reflect.getownMetadata(metadataKey,target,propertyKey):获取目标对象的自有元数据。
5Reflect.deleteMetadata(metadataKey, target, propertyKey):删除目标对象的元数据
import"reflect-metadata';
class Myclass{private myProperty:string;
constructor(value:string)this.myProperty.value;
//定义一个方法，并为其添加元数据@Reflect.metadata('customkey',"customValue")myMethod()f
console.log( Executing myMethod~);
/实例化 Mas
const instance =new Myclass('Hello');