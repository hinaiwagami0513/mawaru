#!/bin/bash
# Finder からダブルクリックで開くやつ。
# ビルド → ローカルサーバー起動 → ブラウザを開く、までやる。
# このターミナルのウィンドウを閉じるとサーバーも止まる。

cd "$(dirname "$0")" || exit 1

PORT=4321
URL="http://localhost:$PORT/"

# Volta / nvm 配下の node に PATH を通す（Finder 起動だと .zshrc が読まれないため）
export PATH="$HOME/.volta/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

if ! command -v node >/dev/null 2>&1; then
  echo "node が見つかりません。ターミナルで 'node -v' が通る状態にしてください。"
  read -r -p "Enter で閉じます"
  exit 1
fi

echo "== マワル ヘルプセンター =="
echo

if [ ! -d node_modules ]; then
  echo "初回セットアップ中（1〜2分）..."
  npm install --no-audit --no-fund || { read -r -p "失敗しました。Enter で閉じます"; exit 1; }
  echo
fi

echo "ビルド中..."
npm run build || { read -r -p "ビルドに失敗しました。Enter で閉じます"; exit 1; }
echo

# 既に立っているサーバーを片付ける
pkill -f "serve@latest out -l $PORT" 2>/dev/null
sleep 1

echo "起動中 → $URL"
echo "（このウィンドウを閉じるとサーバーが止まります）"
echo

( sleep 3 && open "$URL" ) &

npx --yes serve@latest out -l "$PORT" --no-clipboard
