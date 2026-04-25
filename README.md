# 未来のミルク画像投稿キャンペーン2026 LP

牛乳月間2026に向けた「未来のミルク画像投稿キャンペーン2026」の静的LPです。

## ファイル構成

- `index.html` - LP本体
- `.nojekyll` - GitHub Pagesで静的HTMLをそのまま配信するための設定

## フォーム

AirtableフォームをLP下部の応募セクションに埋め込んでいます。

```html
<iframe class="airtable-embed" src="https://airtable.com/embed/apprCtybztnPDNCXI/pagVO82kDOh6GuPwy/form" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
```

## 公開想定

GitHub Pagesで公開する場合は、リポジトリの Pages 設定で `main` ブランチの root を公開元にします。
