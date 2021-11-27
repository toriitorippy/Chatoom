'use strict';

module.exports = function (socket, io, db) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        io.to(data.roomId).emit('receiveMessageEvent', data);
    });
};
