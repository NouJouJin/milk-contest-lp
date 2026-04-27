# 未来のミルク画像投稿キャンペーン2026 LP

牛乳月間2026に向けた「未来のミルク画像投稿キャンペーン2026」の静的LPです。

## ファイル構成

- `index.html` - LP本体
- `gallery.html` - 参加者向け参考ギャラリーページ
- `image/LP掲載/世界牛乳の日コンテスト2026LP用V1.png` - KV画像（1920×1080）
- `image/LP掲載/川上牧場の牛舎.jpg` - 活用紹介セクション画像（1080×720）
- `image/` 直下の牛写真 - 参考ギャラリー掲載用
- `.nojekyll` - GitHub Pagesで静的HTMLをそのまま配信するための設定

## 画像管理

`image/` 配下は `.gitignore` でGit管理対象外にしています。GitHubには画像をアップしない前提です。

GitHub PagesやVercelで公開する場合、ローカルの `image/` 参照はそのままでは表示されません。公開時は画像を別ホスティングに配置し、`index.html` / `gallery.html` の画像URLを差し替えてください。

## フォーム

AirtableフォームをLP下部の応募セクションに埋め込んでいます。

```html
<iframe class="airtable-embed" src="https://airtable.com/embed/apprCtybztnPDNCXI/paghtnLiOMP0bccRE/form" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
```

## 実装メモ

- CSSのみでヒーロー画像のゆるやかな動き、カードのホバー、FAQの開閉表示を調整
- JavaScriptでスクロール進捗、ヘッダー状態、表示アニメーション、応募開始までのカウント、モバイル固定CTAを制御
- `prefers-reduced-motion` に対応し、動きを減らす設定の環境ではアニメーションを抑制

## 公開想定

GitHub Pagesで公開する場合は、リポジトリの Pages 設定で `main` ブランチの root を公開元にします。

Vercelで公開する場合は、静的HTMLプロジェクトとしてこのフォルダをデプロイ対象にします。ビルドコマンドは不要です。
