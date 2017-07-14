const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false
  })

  let indexURL = process.defaultApp
    ? 'http://localhost:8080'
    : url.format({
      pathname: path.join(__dirname, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true
    })

  mainWindow.loadURL(indexURL)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (process.defaultApp) mainWindow.webContents.openDevTools()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
