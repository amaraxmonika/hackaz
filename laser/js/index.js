// var socket = io('http://localhost:3000');
var socket = io('http://162.243.108.203:3000');
// var ipcRenderer = require('ipcRenderer');
const {ipcRenderer} = require('electron');

// Ipc is used for async inter process communication
// between page thread and main program thread.
// Functions similar to socket.io

// Function definitions for websocket
socket.on('connect', function () {
    console.log('socket connected');

    // Move event sent from server
    socket.on('moveCursor', function (data) {
        moveMousePosition(data);
    });

    // Relative move cursor event
    socket.on('moveCursorRelative', function (data) {
        moveMouseRelativePosition(data);
    });

    // Click event sent from server
    socket.on('leftClickCursor', function (data) {
        mouseClick(data);
    });

    // Click event to change cursor
    socket.on('changeCursorEvent', function () {
        changeCursor();
    });
});

// Trying to decouple mouse events from socket
// functions. This method logs event and calls
// ipcRenderer thread on backend to move mouse
moveMousePosition = function (data) {
    //console.log("X: " + data.x + " Y: " + data.y);
    //ipcRenderer.send('mouseMove', data);
    ipcRenderer.send('moveWindow', {'x':data.x,'y': data.y});
}

changeCursor = function () {
    var rotationMap = {
        'circle' : 'circle2',
        'circle2': 'circle3',
        'circle3': 'circle'
    }
    var cursor = document.querySelector('.circle')
    cursor.id = rotationMap[cursor.id];
};


moveMouseRelativePosition = function (data) {
    //console.log("X: " + data.x + " Y: " + data.y);
    ipcRenderer.send('mouseMoveRelative', data);
}

mouseClick = function (data) {
    //console.log('left click');
    ipcRenderer.send('leftClick', data);
}

// Switch to move mouse or laser
function toggleMouse() {
    ipcRenderer.send('toggleMouse', 'hi');
}

function testMove(x, y){
    ipcRenderer.send('moveWindow', {'x':x,'y': y});
}
