"use strict";
import { app, protocol, BrowserWindow, Tray, Menu, nativeImage } from "electron";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import path from "path";

declare const __static: string;

const
  isDevelopment = process.env.NODE_ENV !== "production",
  // TODO: when theming comes around, the user should be able to select a dark logo image for light UIs
  icon = nativeImage.createFromPath(path.join(__static, "logo-light.png"));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], {secure: true});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    title: "PLAN",
    icon,
    width: 800,
    height: 600,
    frame: false,
    transparent: true
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.hide();
  win.on("close", ev => {
    ev.preventDefault();
    win.hide();
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    // app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createTrayIcon();
  createWindow();
});

function createTrayIcon() {
  const
    tray = new Tray(icon),
    menu = Menu.buildFromTemplate([
      {
        label: "Show", type: "normal", click: () => {
          win.show();
          win.focus();
        }
      },
      {label: "E&xit", type: "normal", click: () => app.exit(0)},
    ]);
  tray.setIgnoreDoubleClickEvents(true);
  tray.setToolTip("PLAN");
  tray.setContextMenu(menu);
  // TODO: try to get single-click to open the main window
  tray.on("click", () => {
    win.show();
    win.focus();
  });
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
