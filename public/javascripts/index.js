'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val()
    const roomId = $('#roomId').val();
    document.cookie = "updateUserDate=こんにちは";  // "hakkeyoi=のここった"

    // ユーザ名とルームIDが未入力でないかチェックする
    if(userName === ''){
        alert("ユーザ名を入力してください");
        return;
    }
    if(roomId === ''){
        alert("ルームIDを入力してください");
        return;
    }
    $('form').submit();
}
