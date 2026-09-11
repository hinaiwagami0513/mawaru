#!/usr/bin/env node
/*
 * ワイヤーフレーム用のローカル生成プロキシ（開発専用・依存なし）
 *
 *   node dev-server.js
 *   → http://localhost:5173/image_editor_dark_wire.html
 *
 * 役割は2つだけ。
 *   1. このディレクトリを静的配信する（file:// だと assets が読めないため）
 *   2. POST /api/stamp でスタンプ画像を生成して data URL で返す
 *
 * APIキーをブラウザに置かないための1枚。キーはこのプロセスの中だけに留まり、
 * レスポンスにも含めない。本番は同じ責務をバックエンドのAPI routeが持つ。
 *
 * キーの探索順:
 *   1. 環境変数 GEMINI_API_KEY
 *   2. リポジトリルート（dev/）の .nano-banana-config.json の geminiApiKey
 * AI Studio (https://aistudio.google.com/apikey) のキーは "AIza" 始まりの39文字。
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';

/* ---------- APIキー ---------- */
function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const candidates = [
    path.resolve(ROOT, '../../../.nano-banana-config.json'),
    path.resolve(ROOT, '../.nano-banana-config.json'),
    path.resolve(ROOT, '.nano-banana-config.json'),
  ];
  for (const p of candidates) {
    try {
      const k = JSON.parse(fs.readFileSync(p, 'utf8')).geminiApiKey;
      if (k) return String(k).trim();
    } catch (_) { /* 次の候補へ */ }
  }
  return '';
}

/* ---------- 静的配信 ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
};
function serveStatic(req, res) {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(ROOT, rel === '/' ? '/image_editor_dark_wire.html' : rel);
  /* ROOT の外へは出さない */
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404).end('not found'); return; }
    res.writeHead(200, {
      'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      /* 編集がすぐ反映されるように、ブラウザにキャッシュさせない */
      'cache-control': 'no-store, no-cache, must-revalidate',
      'pragma': 'no-cache',
      'expires': '0'
    });
    res.end(buf);
  });
}

/* ---------- スタンプ生成 ---------- */
/* ステッカーとして使える絵を出すための定型。文言だけ差し替える。 */
function stickerPrompt(userPrompt) {
  return [
    'A single die-cut sticker: ' + userPrompt + '.',
    'Flat vector illustration, bold thick white outline around the whole shape, subtle drop shadow.',
    'Centered, isolated on a fully transparent background. No scene, no background, no border, no watermark.',
    'If the design includes Japanese text, render it correctly and legibly.',
  ].join(' ');
}

async function genStamp(prompt, ref) {
  const key = loadKey();
  if (!key) {
    return { ok: false, code: 'NO_KEY', error: 'APIキーが見つかりません。GEMINI_API_KEY を設定するか .nano-banana-config.json に geminiApiKey を入れてください。' };
  }
  const parts = [];
  /* 参照画像があれば先に渡す。既存素材と絵柄を揃えたいときに効く。 */
  const m = ref && /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(ref);
  if (m) {
    parts.push({ inline_data: { mime_type: m[1], data: m[2] } });
    parts.push({ text: '1枚目の画像と同じ絵柄・配色・線の太さを保ったまま、次のスタンプを作ってください。' });
  }
  parts.push({ text: stickerPrompt(prompt) });
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';
  let r;
  try {
    r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ parts }] }),
    });
  } catch (e) {
    return { ok: false, code: 'NETWORK', error: '生成APIに接続できません: ' + e.message };
  }
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (body.error && body.error.message) || ('HTTP ' + r.status);
    /* キー切れは呼び出し側で案内を出したいので区別する */
    const code = r.status === 401 || r.status === 403 ? 'BAD_KEY' : 'API_ERROR';
    return { ok: false, code, error: msg };
  }
  const outParts = (((body.candidates || [])[0] || {}).content || {}).parts || [];
  const img = outParts.find(p => p.inlineData && p.inlineData.data);
  if (!img) {
    const text = outParts.map(p => p.text).filter(Boolean).join(' ').slice(0, 200);
    return { ok: false, code: 'NO_IMAGE', error: '画像が返りませんでした' + (text ? '（' + text + '）' : '') };
  }
  return { ok: true, image: 'data:' + (img.inlineData.mimeType || 'image/png') + ';base64,' + img.inlineData.data };
}

/* ---------- ルーティング ---------- */
const server = http.createServer((req, res) => {
  /* file:// から開いても叩けるように緩めのCORS（localhost限定の開発用サーバ） */
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type');
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }

  if (req.url.split('?')[0] === '/api/stamp' && req.method === 'POST') {
    let raw = '';
    /* 参照画像を data URL で受けるので余裕を持たせる */
    req.on('data', c => { raw += c; if (raw.length > 8e6) req.destroy(); });
    req.on('end', async () => {
      let prompt = '', ref = null;
      try { const b = JSON.parse(raw); prompt = String(b.prompt || '').slice(0, 500); ref = b.ref || null; } catch (_) {}
      if (!prompt) { res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: false, error: 'prompt がありません' })); return; }
      const t0 = Date.now();
      const out = await genStamp(prompt, ref);
      console.log('[stamp] "' + prompt.slice(0, 30) + '" → ' + (out.ok ? 'ok' : out.code) + ' (' + (Date.now() - t0) + 'ms)');
      res.writeHead(out.ok ? 200 : 502, { 'content-type': 'application/json' });
      res.end(JSON.stringify(out));
    });
    return;
  }
  if (req.url.split('?')[0] === '/api/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, hasKey: !!loadKey(), model: MODEL }));
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  const key = loadKey();
  console.log('wire  → http://localhost:' + PORT + '/image_editor_dark_wire.html');
  console.log('model → ' + MODEL);
  console.log(key
    ? 'key   → 読み込み済み（' + key.length + '文字）'
    : 'key   → 未設定。GEMINI_API_KEY を入れるまでAI生成はモックにフォールバックします。');
});
