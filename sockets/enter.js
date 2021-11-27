'use strict';

module.exports = function (socket, io, db) {
    // 入室メッセージをクライアントに送信する
    socket.on('enterEvent', function (data) {
        socket.join(data.roomId);
        socket.broadcast.to(data.roomId).emit('enterOtherEvent',data.userName);
        let member = [];
        db.serialize(() => {
            db.run("insert into members(name) values(?)", data.userName);
            db.each("select * from members", (err, row) => {
                console.dir(row);;
                member.push(row.name);
            });
        });
        setTimeout(function(){console.log(member); socket.broadcast.emit("ChangeDeleteUserEvent", member);},1000)
    });
};
