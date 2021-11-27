'use strict';

module.exports = function (socket, io, db) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitEvent', function (data) {
        socket.broadcast.to(data.roomId).emit('exitOtherEvent',data.userName);
        let member = [];
        
        db.serialize(() => {
            db.each("select * from members where name = ? limit 1", [data.userName], (err, test) => {
                console.dir(test);
                db.run("delete from members where id = ?", test.id);
            });

            let member = [];
            setTimeout(function(){db.get('SELECT * FROM members', (err, row) => {
                if (typeof row !== "undefined") {
                    member.push(row.name);
                }
            });},500)

            setTimeout(function(){console.log(member); socket.broadcast.emit("ChangeDeleteUserEvent", member);},1000)
        });
        
    });
};
