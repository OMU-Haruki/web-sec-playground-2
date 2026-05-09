## ⚠️ 重要な注意事項

このプロジェクトは **ウェブアプリのセキュリティ実験用のコンテンツ** です。学習と検証を目的として、あえて脆弱性を含む設計となっています。

- このウェブアプリを公開サーバーやインターネット上でホストしないでください。
- 自分以外がアクセス可能な環境にデプロイしないでください。
- ローカル環境（localhost）でのみ実行してください。

このコードには意図的に組み込まれたセキュリティの脆弱性💀があります。セキュティ学習用の教材としてのみ利用してください。

## セットアップ手順

### 1. リポジトリのクローン

```
git clone https://github.com/TakeshiWada1980/web-sec-playground-2.git
cd web-sec-playground-2
```

上記でクローンすると、カレントフォルダのなかに `web-sec-playground-2` というフォルダが新規作成されて展開されます。別名にしたいときは、たとえば `hoge` というフォルダにクローンしたいときは、次のようにしてください。

```
git clone https://github.com/TakeshiWada1980/web-sec-playground-2.git hoge
cd hoge
```

### 2. 依存関係のインストール

```bash
npm i
```

### 3. 環境変数の設定ファイル (.env) の作成

プロジェクトのルートフォルダに `.env` (環境変数の設定ファイル) を新規作成して以下の内容を記述してください。

```
DATABASE_URL="file:./app.db"
JWT_SECRET=ABCDEFG123456789UVWXYZ
```

- `JWT_SECRET` は認証処理に必要な秘密キーです。安全性を確保するため、適当なランダムな英数字を用いた **16文字以上の文字列** に置き換えてください。文字数が不十分だと、動作時にエラーとなる可能性があります。


### 4. データベースの初期化

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 5. 開発サーバの起動

```bash
npm run dev
```

### 6. ビルドと実行

```bash
npm run build
npm run start
```

- データベースの状態確認

```bash
npx prisma studio
```

