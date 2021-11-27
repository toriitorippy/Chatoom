'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    // ユーザ名とルーム　IDを取得
    const userName = $('#userName').val();
    const roomId = $('#roomId').val();
    // 入力されたメッセージを取得
    const message = $('#message').val().replace(/\r?\n/g, '<br>');
    // 空白，空行でない時投稿内容を送信
    if($('#message').val().match(/\S/g)){
        if (socket.emit('sendMessageEvent', {userName: userName, message: message, roomId: roomId})) {
            $('#message').val('');
        }
    }
}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('receiveMessageEvent', function (data) {
    // ユーザ名を取得
    const userName = $('#userName').val();
    if (data.userName == userName){
        $('#thread').append('<div class="mychatBox"><p>' + data.userName + 'さん' + '</p><div class="mybot mychatBalloon">' + data.message + '</div></div>');
    } else {
        $('#thread').append('<div class="chatBox"><p>' + data.userName + 'さん' + '</p><div class="bot chatBalloon">' + data.message + '</div></div>');
    }
});

window.document.onkeydown = function(event){
    if (event.keyCode === 13) {
        publish();
    }
}
