# Hyperledger_fabric

## 生鮮食品のトレーサビリティ管理
生鮮食品のトレーサビリティを管理し、問題が起きた際にサプライチェーン全体で即座に提供をストップできるようなシステムを構築。

説明スライド：
https://docs.google.com/presentation/d/127pMOvdjudUj7D4TXq4rqCM4_Q7BZy1XfQIXtW_u_Uw/edit?usp=sharing

## 想定するサプライチェーン
![スクリーンショット 2022-07-19 21 09 11](https://user-images.githubusercontent.com/78332175/179746809-2028e716-10b8-4b43-958a-20f3c54e4081.png)


## 開発環境
基本的には、次のversionに合わせると良い。
- node >= 14.18.1
- npm >= 7.24.2
- go >= 1.18.4
- Ubuntu 20.04 (Linux なら可)

## node.jsのインストール
まず、必要モジュールをインストールする。
プロジェクトルートディレクトリで、次のコマンドを叩く。
```
npm ci
```
次に、chaincodeのネットワークを立ち上げるために、次のコマンド叩く。
```
npm run network-up
```
但し、すでにネットワークが立ち上がっている場合は、次のコマンドを叩いて、以前に立ち上げたネットワークを消してから、ネットワークを構築する。
```
npm run network-down
```
次に、HyperLedger-Fabricに保存しないデータを保存するために使用するMySQLサーバを立てる。
以下のコマンドをbackendディレクトリで叩く。
```
npm run docker:dev
```
次にデータベースのマイグレーションをするために、以下のコマンドを叩く。
```
npm run migration:run
```

次に、backendディレクトリで、次のコマンドを叩き、backendを起動する。
```
npm run dev
```

最後に、webappディレクトリで、次のコマンドを叩くと、フロントエンドが起動する。
```
npm run dev
```
localhost:3000 をブラウザで開くと、アプリケーションのトップページを見ることができる。

```
