# Hyperledger_fabric

## 生鮮食品のトレーサビリティ管理
食品のトレーサビリティを管理し、各店舗での在庫管理に役立てるアプリケーションを開発する。

在庫管理から、商品の欠品に対しアクションを素早く起こすことで売り上げ向上を狙う。

説明スライド：
https://docs.google.com/presentation/d/127pMOvdjudUj7D4TXq4rqCM4_Q7BZy1XfQIXtW_u_Uw/edit?usp=sharing

## 想定するサプライチェーン
<img width="846" alt="スクリーンショット 2022-06-24 14 54 03" src="https://user-images.githubusercontent.com/78332175/175471508-0a1829ad-3844-4cd0-9494-fb1f31566f35.png">


## 開発環境
基本的には、次のversionに合わせると良い。
- node >= 14.18.1
- npm >= 7.24.2

## node.jsのインストール
まず、必要モジュールをインストールする。
プロジェクトルートディレクトリで、次のコマンドを叩く。
```
npm install
```

次に、backendディレクトリで、次のコマンドを叩き、backendを起動する。
```
npm run dev
```

最後に、webappディレクトリで、次のコマンドを叩くと、フロントエンドが起動する。
```
npm run dev
```

### For Mac
```
brew install nodebrew
export PATH=$HOME/.nodebrew/current/bin:$PATH
source ~/.zshrc
nodebrew setup
nodebrew install-binary <version>
nodebrew use <version>
npm install npm@<version>
exec $SHELL -l
```
