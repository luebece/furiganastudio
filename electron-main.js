const path = require("path");
const { app, BrowserWindow, dialog } = require("electron");
const { startServer, stopServer } = require("./server");

const HOST = "127.0.0.1";
const PORT = 8000;
const APP_URL = `http://${HOST}:${PORT}`;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#0e1319",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
    },
  });
  mainWindow.loadURL(APP_URL);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function bootstrap() {
  try {
    await startServer({ host: HOST, port: PORT, quiet: true });
  } catch (error) {
    const message = `내부 서버 시작 실패: ${String(error && (error.message || error) || "unknown_error")}`;
    dialog.showErrorBox("FuriganaStudio", message);
    app.quit();
    return;
  }
  createWindow();
}

app.whenReady().then(bootstrap);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  stopServer().catch(() => {});
});
