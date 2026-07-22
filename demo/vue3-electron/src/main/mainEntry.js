// 和主进程相关的代码
import { app, BrowserWindow, ipcMain } from 'electron';

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let mainWindow = null; // 存储窗口实例

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 650,
    transparent: true,
    frame: false,
    // resizable: false,
    webPreferences: {
      nodeIntegration: true, // ✅ 启用 Node.js 集成
      contextIsolation: false // ✅ 关闭上下文隔离（或使用 preload）
    }
  });
  mainWindow.loadURL(process.argv[2]);

  mainWindow.webContents.openDevTools();
});

ipcMain.on('closeWindow', () => {
  mainWindow.close();
});

ipcMain.on('minimaizeWindow', () => {
  mainWindow.minimize();
});
