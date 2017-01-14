// var app = require('app');  // Module to control application life.
// var BrowserWindow = require('browser-window');  // Module to create native browser window.
const {app, BrowserWindow, ipcMain, Tray, Menu} = require('electron');
var robot = require('robotjs');
// var ipcMain = require('ipcMain');
// var Tray = require('Tray');
// var Menu = require('Menu');
//var robot = '';

// Report crashes to our server.
// require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var mouseSelected = false;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  //mainWindow = new BrowserWindow({width: 800, height: 600});
  //Tray.setImage('/Users/chasejohnson/projects/fireTheLaser/www/node_mouse/electron_test/img/Fire_logo.png');
  var contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' },
  ]);

  var window_obj = {
      width: 300, 
      height: 100, 
      frame: false, 
      transparent: true,
      'alwaysOnTop': true,
      x: 5000,
      y: 5000,
      center: false
  };
  mainWindow = new BrowserWindow(window_obj);
  mainWindow2 = new BrowserWindow(window_obj);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow2.loadURL('file://' + __dirname + '/options_window.html');

  // fires when page is ready
  mainWindow.webContents.on('did-finish-load', function(){
      mainWindow.webContents.send('ping', 'whooooooh!');
  });

  // fires when mouse move event has fired
  ipcMain.on('mouseMove', function(event, data){
      var mouse = robot.getMousePos();
      //console.log('mouse is at x: ' + mouse.x + ' y: ' + mouse.y);
      //console.log('data is x: ' + data.x + ' y: ' + data.y);
      // moving mouse here
      robot.moveMouse(mouse.x+data.x, mouse.y+data.y);
  });

  ipcMain.on('mouseMoveRelative', function(event, data){
      var mouse = robot.getMousePos();
      //console.log('mouse is at x: ' + mouse.x + ' y: ' + mouse.y);
      //console.log('data is x: ' + data.x + ' y: ' + data.y);
      // moving mouse here
      robot.moveMouse(mouse.x+data.x, mouse.y+data.y);
  });

  // fires when mouse click event has fired
  ipcMain.on('leftClick', function(event, data){
       robot.mouseClick();
       console.log('left mouse click server');
  });

  // testing window position redraw
  ipcMain.on('moveWindow', function (event, data){
        //mainWindow.setPosition(data.x, data.y);
        console.log('data.x ' + data.x + ' data.y ' + data.y);
        var x = parseInt(data.x);
        var y = parseInt(data.y);
        var xy = mainWindow.getPosition();
        if (mouseSelected){
              var mouse = robot.getMousePos();
              //robot.moveMouse(mouse.x+data.x, mouse.y+data.y);
              robot.moveMouse(mouse.x+x, mouse.y+y);
        }
        else{
            //mainWindow.setPosition(data.x + xy[0], data.y + xy[1]);
            mainWindow.setPosition(x + xy[0], y + xy[1]);
        }
        console.log('setting pos: ' + data.x + ' y: ' + data.y);
  });

  ipcMain.on('toggleMouse', function (event, data) {
        console.log('toggle mouse event');
        mouseSelected = !mouseSelected ;
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
