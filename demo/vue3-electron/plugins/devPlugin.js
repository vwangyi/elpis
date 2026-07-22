import esbuild from 'esbuild';
import { spawn } from 'child_process';
import electron from 'electron';

export const devPlugin = () => {
  return {
    name: 'dev-plugin', // 插件的名称
    // 一个异步的方法，用于配置服务器的
    // 接收一个参数，该参数就是 Vite 开发服务器的实例
    async configureServer(server) {
      // 首先第一步，咱们需要使用 esbuild 去同步的构建项目
      esbuild.buildSync({
        entryPoints: ['./src/main/mainEntry.js'], // 对象项目的入口文件
        bundle: true, //  启用打包，将依赖一起打包为一个文件
        platform: 'node', // 指定平台为 node，主要是为了 Electorn 主进程服务
        format: 'esm', // 模块的格式
        outfile: './dist/mainEntry.js', // 输出文件的路径
        external: ['electron'] // 外部依赖，避免被打包进去
      });
      // 接下来，我们需要监听服务器的 listening 事件
      // 这个 listening 事件会在服务器开始监听端口时触发 (listening事件改为once事件 区别是只触发一次)
      server.httpServer.once('listening', () => {
        const addressInfo = server.httpServer.address();
        const port = addressInfo.port;
        const httpAddress = `http://localhost:${port}`;
        console.log(`✓ Vite server started at ${httpAddress}`);
        const electronProcess = spawn(
          electron,
          ['./dist/mainEntry.js', httpAddress],
          {
            cwd: process.cwd(),
            stdio: 'inherit'
          }
        );

        electronProcess.on('close', () => {
          server.close();
          process.exit();
        });
      });
    }
  };
};
