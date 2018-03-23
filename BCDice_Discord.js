/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

//apiを叩くためのもの
const request = require('request');
const async = require('async');
var URL = 'ここにURL';
var regExp;

//ダイスボット保存用のやつ
var system = [];

//トークン
const token = 'ここにトークン';

//起動確認
client.on('ready', () => {
  console.log('I am ready!');
});

//メッセージが来たらここ。
client.on('message', message => {
  // /rであるか？
  if (message.content.match("^\/r")) {
    //初期ダイスの確認。なきゃクトゥルフにする。
    if (system.indexOf(message.guild.id) == -1) {
      system.push(message.guild.id);
      system.push("Cthulhu");
    }
    //ここにパターンとかいれていく。
    //バージョン確認
    if(message.content.match("^\/r version")) {
      request.get({
        uri: URL + "v1/version",
        headers: {'Content-type': 'application/json'},
        json: true
      }, function(err, req, data){
        message.reply("Version:" + data.api + " BCDice:" + data.bcdice);
      });
    //ダイスのセット。初期はクトゥルフ
    } else if (message.content.match("/r set .*")){
      //ここもう少し上手くやれそうだけど気力がない
      regExp = new RegExp( "^/r set ", "g");
      var diceset = message.content.replace(regExp, "");
      diceset = diceset.replace(/シノビガミ/g, "ShinobiGami");
      diceset = diceset.replace(/ソード・ワールド2.0/g, "SwordWorld2.0");
      diceset = diceset.replace(/クトゥルフ/g, "Cthulhu");
      diceset = diceset.replace(/フィルトウィズ/g, "FilledWith");
      //保存したIDの次にダイスボットの種類が入っているはずなのでそこに入れる。
      system[system.indexOf(message.guild.id) + 1] = diceset;
      message.reply("ダイスボットを" + diceset + "に変更しました。");
    } else if (message.content.match("^/r [0-9]+ .*")) {
      //クソみたいなゴリ押しやります。
      var each_count = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
      var loop_count_server;
      //こちらリプライする文字列
      var reply_text = "";
      //まず抜き出す。後ろを切る。
      var text = message.content.match("^/r [0-9]+");
      //次に回数を取得
      var loop_count = Number(text[0].replace(/^\/r /, ""));
      //投げるテキストを用意する。
      var post_text = message.content.replace(/^\/r [0-9]+ /, "");
      //エラー対処マン！
      request.get({
        uri: URL + "v1/diceroll",
        headers: {'Content-type': 'application/json'},
        qs: {
         'system': system[system.indexOf(message.guild.id) + 1],
         'command': post_text
        },
        json: true
      }, function(err, req, data){
        if (data.result == null) {
          message.reply("Error:記述ミスです。どどんとふと同じように記述してください。");
          return 1;
        }
      });
      //そもそも16回以上のループは拒否。
      if (loop_count >= 16) {
        message.reply("回数が多すぎます！　15回以下にしてください");
        return;
      }
      //ループだけどapiたたきまくってる上に遅い。
      async.mapSeries(each_count, function(loop_count_server, callback){
        //0.3msで連続は遅いなあ。
        setTimeout(function(){
          //console.log(loop_count_server);
          request.get({
            uri: URL + "v1/diceroll",
            headers: {'Content-type': 'application/json'},
            qs: {
              'system': system[system.indexOf(message.guild.id) + 1],
              'command': post_text
            },
            json: true
          }, function(err, req, data){
             reply_text = reply_text + data.result + "#" + String(loop_count_server + 1) + "\n";
             console.log(data.result + "#" + (loop_count_server + 1));
          });
          //全部完了したなら1を送る。
          if (loop_count < loop_count_server) {
            callback(1);
          } else {
            callback(null);
          }
        }, 300);
      }, function(err){
        if (err == 1) {
          message.reply(reply_text);
        }
      });
    //普通のダイス
    } else if (message.content.match("^/r .*")) {
      //console.log("dice test");
      //var dice = message.content.replace(message.content, "(?=^/r.*)");
      regExp = new RegExp( "^/r ", "g");
      var dice = message.content.replace(regExp, "");
      request.get({
        uri: URL + "v1/diceroll",
        headers: {'Content-type': 'application/json'},
        qs: {
          'system': system[system.indexOf(message.guild.id) + 1],
          'command': dice
        },
        json: true
      }, function(err, req, data){
        if (data.result == null) {
          message.reply("Error:記述ミスです。どどんとふと同じように記述してください。");
        } else {
          message.reply(data.result);
          //console.log(dice);
          //console.log(message.guild.id);
        }
      });
    }
  }
});

//ログインする
client.login(token);
