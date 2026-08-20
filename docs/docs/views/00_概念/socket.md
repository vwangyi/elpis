# Socket


Socket实例就是 你给谁(http://localhost:3000)打电话
const socket = io('http://localhost:3000');
socket对象 有 on方法是监听 emit方法是说话  

为什么要有"事件名"，因为Socket 通信是基于事件的，就像电话里说不同的话题  

为什么需要"单例"？  通常前端整个应用只有一个电话（单例socket）  用不同的事件名来区分不同页面的需求）

Socket：一条实时的电话线
实例（instance）：电话机
单例（singleton：整个应用只用一个电话机
on('事件')：主动听（等对方说某个话题）
emit('事件')：主动说（主动说某个话题）
disconnect()：挂断电话




Socket 就是为了解决"服务器需要主动推消息给客户端"或"需要实时双向通信"的场景。它不是神秘的东西，就是一条保持连接的"电话线"，你通过它来收发消息。


客户端一个电话 服务器一个电话  两个电话就可以相互通信
一般来说客户端只需要给自己的后端打电话 （如果一个客户端需要给多个后端打电话就需要创建多个电话机了）





## 命名空间
命名空间是什么：命名空间是 Socket.IO 提供的一种在同一服务器上区分不同功能模块的机制。


服务器提供了  http://localhost:3000 和http://localhost:3000/chat 和 http://localhost:3000/charts  
那客户端就至少创建3个socket实例 （但socket 底层有优化 同一个ip 但命名空间不同 多个socket对象 底层是同一条socket连接 这个优化可以关闭） 
// 强制每个命名空间使用独立的 WebSocket 连接
const chatSocket = io('http://localhost:3000/chat', {
  multiplex: false  // 禁用多路复用
})

如果是三个不同的ip 那就是3个不同的对象 且 3条socket连接



连接 3 个命名空间需要 3 个实例吗？	是的，需要创建 3 个 socket 实例
会建立 3 条 WebSocket 连接吗？	不会，默认只有 1 条连接
多个实例的意义是什么？	代码组织、权限控制、功能隔离
什么时候才有真正的多条连接？	不同服务器、禁用 multiplex、不同传输方式