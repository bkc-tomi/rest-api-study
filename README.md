# REST-API-Study
トラハックさんの[Re:ゼロから始めるWeb API入門実践編](https://www.youtube.com/playlist?list=PLX8Rsrpnn3IVW5P1H1s_AOP0EEyMyiRDA)

# 設計
SNSのAPIの設計(ユーザのみ)

## リソース指向アーキテクチャ
1. Webサービスで利用するデータを特定する
    - ユーザ情報
    ユーザID、ユーザ名、プロフィール、写真、誕生日…etc
    - フォロー情報
    フォロワーID、フォローID

2. データをリソースに分ける→リソース設計
    今回対象とするリソース
    1. ユーザリソース
    2. 検索結果リソース
3. リソースにURIで名前をつける→URI設計
    - `/users`: ユーザリソースのURI
    - `search?q=`: 検索結果リソースのURI

    |メソッド|URI|詳細|
    |----|----|----|
    |GET|/api/v1/users|ユーザリストの取得|
    |GET|/api/v1/users/123|ユーザ情報の取得|
    |POST|/api/v1/users|新規ユーザの作成|
    |PUT|/api/v1/users/123|ユーザ情報の更新|
    |DELETE|/api/v1/users/123|ユーザの削除|
    |GET|/api/v1/search?q=hoge|ユーザ検索結果の取得|

    - データベース設計
    Usersテーブル

    |フィールド名|データ型|NULL許容|その他|
    |----|----|----|----|
    |id|TEXT|NOT NULL|PRIMARY KEY|
    |name|TEXT|NOT NULL| |
    |profile|TEXT| | |
    |date_of_birth|TEXT| | |
    |create_at|TEXT|NOT NULL|datetime関数で日付を取得|
    |updated_at|TEXT|NOT NULL|datetime関数で日付を取得|
    
    ```
    CREATE TABLE users (  
        id INTEGER NOT NULL PRIMARY KEY, 
        name TEXT NOT NULL, 
        profile TEXT, 
        created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), 
        updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')), 
        date_of_birth TEXT
    );
    ```

4. リソースの表現を設計する→今回はJsonで(データの形式、構造など)
5. リンクとフォームでリソースを結びつける
6. イベントの標準的なコースを設計する(正常に動いた時にリソースがどのように表現されていくのか)
7. エラーを想定する

## sqlite3
```js
db.serialize(() => { /* query*/}); // 内部クエリを同期的に実行
db.all(sql, (err, rows)); // 全ての結果を１度に取得
db.get(sql, (err, row)); // 1つだけ結果を取得
db.run(sql, (err)); // SQLクエリを実行
db.close(); // データベース接続を終了
```

## エラー処理
```
Error: listen EADDRINUSE: address already in use :::3000
```

```
# 下記のコードを実行
$ lsof -i:3000
COMMAND   PID          USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node    78205 masahirookubo   27u  IPv6 0xcafc6155fa23d2fd      0t0  TCP *:hbci (LISTEN)

# pidを削除
$  kill -9 78205
```