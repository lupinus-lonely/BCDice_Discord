# なにこれ
Discordで動くnode.jsのBCDice（のはず）です。

## なんで作ったん？
Sidekickという名ボットを使えば大体のことが済むわけですが、色んなダイスを振りたいのが心情というもの。
なので振れるようにしたかった。

## なんで過去形？
サーバーがなかった。これの公開動機は誰かがサーバー用意してくれねーかなーという念です。

## 使い方
・/r なんたら
なんたらがBCDiceくんに送信されます。帰ってきたメッセージが†無†であるならリプライでError飛ばします。

・/r set ダイスボットのシステム名
どどんとふと同じ名前を入力してもらうわけですが、身内で流行っているTRPGは日本語でも反応します。
ソード・ワールド2.0/クトゥルフ/フィルトウィズ/シノビガミ。これが日本語で反応するやつです。

・/r x ndm
x回ndmを振る機能ですが、動作が不安定です。BCDice-apiをめっちゃ叩くので無駄に使うのはやめよう！
（apiに複数回飛ばしてるだけなのでndmがCCB<=45のようなものであれ動きます）

## インストール
前提としてnode.jsが動作しないといけないと思います。
使ってるモジュールは以下です。
・discord.js
・async
・request

1.必要なモジュールをインストールします。
2.Discordくんのbotユーザーみたいなのを作ってtokenを用意します。
3.どっかからBCDice-apiのURL持ってきます。
4.両方とも中に記述します。
5.どっかのサーバーで起動。

## ライセンス
中で使ってるモジュールはそのモジュールのライセンスです。
これ自体はフリー。

