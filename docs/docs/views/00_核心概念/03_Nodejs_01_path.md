

# path



path.join() 会拼接路径 同时会处理 . .. 或多余斜杠  通常配合 __dirname使用

path.resolve() 从右向左拼接参数 遇到绝对路径就停止 所有参数都没有绝对路径就采用当前目录作为绝对路径 



path.join(__dirname, 'xx')

path.resolve(process.cwd(), "./xxx")





https://nodejs.org/docs/latest/api/path.html 


path.join() 会拼接路径 同时会处理 . .. 或多余斜杠  通常配合 __dirname使用
path.resolve() 从右向左拼接参数 遇到绝对路径就停止 所有参数都没有绝对路径就采用当前目录作为绝对路径 

path.join(__dirname, 'xx')
path.resolve(process.cwd(), "./xxx")


https://nodejs.org/docs/latest/api/path.html 