'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $('#userName').val();
    // 入力されたメッセージを取得
    const message = $('#message').val().replace(/\r?\n/g, '<br>');
    // 空白，空行でない時メモの内容を表示
    if($('#message').val().match(/\S/g)){
        $('#thread').prepend('<p>' + userName + 'さんのメモ：' + message + '</p>');
        $('#message').val('');
    }

    return false;
}
