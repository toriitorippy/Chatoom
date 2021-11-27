'use strict';

//ページが読み込まれたらenterEventをemit
window.addEventListener("load",function(){
    const userName = $('#userName').val();
    const roomId = $('#roomId').val();
    // socket.emit('enterEvent',[userName,roomId]);
    socket.emit('enterEvent',{userName: userName, roomId: roomId});
});

// サーバから受信した入室メッセージを画面上に表示する
socket.on('enterOtherEvent', function (data) {
    $('#thread').prepend('<p>' +data.userName + 'が入室しました'+ '</p>');
});

socket.on('ChangeAddUserEvent', function (data){
    console.log("入りました")
    let text = ""
    data.forEach((x, i) => {
        text +=  x + "<br>";
    });
    document.getElementById('in_login_list').innerHTML　= text;
});