var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//定义变量，用来存储socket。如果是多进程的话，那么socket可以考虑存入redis中
var socketList = {};
//客户端连接服务器socket成功时触发的事件;
io.sockets.on('connection', function (socket) {
    //连接成功时，告诉客户端连接成功;可以通过send来发送信息
    socket.send({status: 1});
    //socket失去连接时触发（包括关闭浏览器，主动断开，掉线等任何断开连接的情况）
    socket.on('disconnect', function () {
        console.log("client disconnect");
        //客户端失去
        for (var key in socketList) {
            delete socketList[key];
        }
    });
    //接收客户端send来的信息
    socket.on('message', function (data) {
        var areaid = data.areaid;
        //用来保存socket,键值为区域
        socketList[areaid] = socket;
    });
    //注意：这里是从客户端的角度来提交事件
    //socket.broadcast.to('my room').emit('event_name', data);
});

//测试。延迟5S等客户端连接上后发送广播
setTimeout(broadcast,5000);

function broadcast(){
    //发送广播测试,system为约定的广播事件
    io.sockets.emit('system','broadcast test');
    // 向another room广播一个事件，在此房间所有客户端都会收到消息
    //注意：这里是从服务器的角度来提交事件
    //io.sockets.in('another room').emit('event_name', data);
}
server.listen(3000);