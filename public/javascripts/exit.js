'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名とルームIDを取得
    const userName = $('#userName').val();
    const roomId = $('#roomId').val();
    // 退室メッセージイベントを送信する
    socket.emit('exitEvent', {userName: userName, roomId, roomId});
    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('exitOtherEvent', function (data) {
    $('#thread').prepend('<p>' +data.userName + 'が退出しました'+ '</p>');
});

socket.on('ChangeDeleteUserEvent', function (data){
    console.log("さようなら")
    console.log(data)
    let text = ""
    data.forEach((x, i) => {
        text +=  x + "<br>";
    });
    document.getElementById('in_login_list').innerHTML　= text;
});