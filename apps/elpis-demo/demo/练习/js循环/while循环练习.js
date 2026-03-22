var username = prompt('用户名')
var password = prompt('密码')

while (username !== 'admin' || password !== '123456') {
  username = prompt('用户名')
  password = prompt('密码')
}

alert('成功')

// while (!(username === 'admin' && password === '123456')) {

// }
