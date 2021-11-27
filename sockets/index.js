'use strict';

module.exports = function (server) {

    const socketIo = require('socket.io')(server, { wsEngine: 'ws' });
    const io = socketIo.listen(server);
    const sqlite3 = require("sqlite3");

    const db = new sqlite3.Database("./test.db");

    db.run("drop table if exists members");
    db.run("create table if not exists members(id integer primary key, name)");

    io.sockets.on('connection', function (socket) {
        // 投稿モジュールの呼出
        require('./publish')(socket, io, db);

        // 入室モジュールの呼出
        require('./enter')(socket, io, db);
      
        // webrtcモジュールの呼び出し
        require('./webrtc')(socket);

        // 退室モジュールの呼出
        require('./exit')(socket, io, db);
    });

    //db.close();
};
