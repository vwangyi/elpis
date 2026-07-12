import { BrowserWindow, app } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
//#region electron/main.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, '..');
var VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
var MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
var RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;
var mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1600,
    maxHeight: 1200,
    resizable: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: { preload: path.join(__dirname, 'preload.mjs') }
  });
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send(
      'main-process-message',
      /* @__PURE__ */ new Date().toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) mainWindow.loadURL(VITE_DEV_SERVER_URL);
  else mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'));
  mainWindow.webContents.openDevTools();
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    mainWindow = null;
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
app.whenReady().then(createWindow);
//#endregion
export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL };
