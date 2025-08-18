# Blog

## 概要

このプロジェクトは、Next.js 15 を用いたブログアプリです。  
ユーザー認証、記事管理、プロフィール編集などの機能を備えています。

---

## 主な機能

### 🏠 ルート画面

- 公開記事一覧表示
- 記事クリックで詳細画面へ遷移
- タイトルで記事検索
- ログイン画面遷移ボタン
- 新規登録画面遷移ボタン

### 📝 新規登録画面

- パスワードと確認用パスワードの不一致エラー表示
- 名前 5 文字以上入力チェック
- 名前 15 文字以内入力チェック
- パスワード 8 文字以上入力チェック
- ログイン画面遷移
- 記事一覧画面遷移
- ユーザー情報を Auth.js（NextAuth） に格納

### 🔑 ログイン画面

- メールアドレス誤入力エラー表示
- パスワード誤入力エラー表示
- 新規登録画面遷移
- 記事一覧画面遷移
- ユーザー情報を Auth.js に格納

### 📊 ダッシュボード画面

- 自分の記事のみ一覧表示
- 新規記事作成画面への遷移
- 記事クリックで詳細画面へ遷移
- タイトルで記事検索
- 記事編集・削除ドロップダウンリスト表示
- 記事削除
- プロフィール名、画像編集（編集時は元の画像を削除）

### ✏️ 記事編集画面

- タイトル、内容、画像、表示/非表示の編集
- 編集時は元の画像を削除

### 🆕 新規記事登録画面

- タイトル、内容、画像、表示/非表示選択
- 記事作成

### 🚫 未ログイン時の URL 直打ち

- ログイン画面へ遷移を促すページ表示

### ⚡ 今後の予定

- 記事に「いいね」やコメント機能の追加、詳細画面の作り込み予定

---

## 技術スタック

- **Next.js 15**
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **NextAuth (Auth.js)**
- **Prisma 6 + SQLite**
- **Axios**
- **Radix UI**（Dialog, DropdownMenu など）
- **Zod**（バリデーション）
- **bcryptjs**（パスワードハッシュ化）
- **lucide-react**（アイコン）

---

## 環境構築手順

1. リポジトリをクローン

```bash
git clone <リポジトリURL>
cd next-blog

```

2. 依存パッケージのインストール

```bash
npm install
```

3. .env を作成し、必要な環境変数を設定

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="任意のシークレット文字列"
```

4. public フォルダ直下に uploads フォルダを作成

5. Prisma マイグレーション

```bash
npx prisma migrate dev --name init
```

6. 開発サーバー起動

```bash
npm run dev
```

7. ブラウザで `http://localhost:3000` にアクセス

## ダミーデータを作成する場合

```bash
npx prisma db seed
```

- ユーザー
  - email: alice@example.com
  - password: password123
  - name: Alice
- 記事
  - タイトル: My First Blog Post
  - 内容: This is the content of the first blog post.
  - 作成者: Alice
  - 公開状態: 公開
