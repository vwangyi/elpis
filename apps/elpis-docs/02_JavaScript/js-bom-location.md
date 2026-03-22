# location 


// 拿到 location对象
const location = window.location; // 单例模式


如何操作数据 
location.href = 'www.baidu.com'
location.reload() 

window.location.href  // 返回整个url
window.location.host  // 返回主机名 www.baidu.com
window.location.port  // 返回服务器端口号
window.location.pathname // 返回URL中的目录和文件名
window.location.search // 返回URL的查询字符串，字符串以问号开头
window.location.hash // 返回URL中的hash（#号后跟零或多个字符）
window.location.protocol // 返回页面使用的协议（http://或https://)
window.location.query // 返回URL的查询字符串，字符串以问号开头
window.location.path // 返回URL中的目录和文件名

// 本页跳转
window.location.href = 'https://baidu.com';

// 新页面跳转 open 慎用 可能会被浏览器拦截
window.open('https://baidu.com')