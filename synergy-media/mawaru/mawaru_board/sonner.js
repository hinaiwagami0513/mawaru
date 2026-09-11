/**
 * sonner.js — shadcn/ui Sonner (vanilla JS)
 * Source of truth: github.com/emilkowalski/sonner/src/styles.css
 *
 * API:
 *   toast('message')
 *   toast.success('message')
 *   toast.error('message')
 *   toast.info('message')
 *   toast.warning('message')
 *   toast('message', { description: '...' })
 *   toast.dismiss(el)
 *
 * Position (default bottom-right):
 *   toast.position = 'bottom-right'
 */
(function () {
  var DURATION = 4000;
  var GAP = 14;
  var MAX_VISIBLE = 3;
  var WIDTH = 356;
  var OFFSET = 32;

  /* ---- 配色（DESIGN.md 準拠） --------------------------------------------
     Sonner 既定の緑/赤/青/黄はマワルの配色ではないので使わない。
     **既定はオレンジ。赤はエラーだけ。**
     アイコンは種類を問わずチェックマーク1種に統一（形は変えない）。
     区別は色だけ = オレンジ(既定) / 赤(エラー)。
     文字は foreground のまま。色を持つのは背景・枠・アイコンだけにして読みやすさを守る。 */
  var ORANGE = {
    bg:     'var(--color-primary-subtle, #fff2e2)',
    border: 'rgba(239,97,8,0.30)',
    text:   'var(--color-foreground, #2a2826)',
    icon:   'var(--color-primary, #ef6108)',
  };
  var RED = {
    bg:     'var(--color-destructive-subtle, #fee2e2)',
    border: 'rgba(220,38,38,0.30)',
    text:   'var(--color-foreground, #2a2826)',
    icon:   'var(--color-destructive, #dc2626)',
  };
  var THEME = {
    success: ORANGE,
    info:    ORANGE,
    warning: ORANGE,
    error:   RED,
  };

  /* ---- icon 16x16 — 全種類チェックマークで統一（Sonner の success アイコン） ---- */
  var CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  var ICONS = {
    success: CHECK,
    error:   CHECK,
    info:    CHECK,
    warning: CHECK,
  };

  var container = null;
  var position = 'bottom-right';

  function ensureContainer() {
    if (container) return container;
    container = document.createElement('div');
    container.setAttribute('data-sonner-toaster', '');
    var isBottom = position.indexOf('bottom') === 0;
    var xPos = position.split('-')[1] || 'right';
    var s = container.style;
    s.position = 'fixed';
    s.zIndex = '999999999';
    s.display = 'flex';
    s.flexDirection = isBottom ? 'column-reverse' : 'column';
    s.gap = GAP + 'px';
    s.pointerEvents = 'none';
    s.width = WIDTH + 'px';
    s.boxSizing = 'border-box';
    s.padding = '0';
    s.margin = '0';
    s.listStyle = 'none';
    s.outline = 'none';
    s.fontFamily = 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif';
    if (isBottom) s.bottom = OFFSET + 'px'; else s.top = OFFSET + 'px';
    if (xPos === 'right') s.right = OFFSET + 'px';
    else if (xPos === 'left') s.left = OFFSET + 'px';
    else { s.left = '50%'; s.transform = 'translateX(-50%)'; }
    document.body.appendChild(container);
    return container;
  }

  function createToast(message, opts) {
    opts = opts || {};
    var type = opts.type || 'default';
    var description = opts.description || '';
    var duration = typeof opts.duration === 'number' ? opts.duration : DURATION;

    ensureContainer();

    var el = document.createElement('div');
    el.setAttribute('data-sonner-toast', '');
    el.setAttribute('data-type', type);

    /* ---- base style (exact Sonner source values) ---- */
    var colors = THEME[type] || ORANGE;   /* 種類を付けずに呼んでもオレンジ */
    var bg    = colors.bg;
    var bdr   = colors.border;
    var txt   = colors.text;
    var icoc  = colors.icon;

    el.style.cssText = [
      'pointer-events:auto',
      'display:flex',
      'align-items:center',
      'gap:6px',
      'padding:16px',
      'border-radius:8px',
      'background:' + bg,
      'border:1px solid ' + bdr,
      'color:' + txt,
      'font-size:13px',
      'line-height:1.5',
      'box-shadow:0px 4px 12px rgba(0,0,0,0.1)',
      'width:' + WIDTH + 'px',
      'box-sizing:border-box',
      'overflow-wrap:anywhere',
      'transform:translateY(100%)',
      'opacity:0',
      'transition:transform 400ms ease,opacity 400ms ease',
      'cursor:pointer',
    ].join(';');

    /* ---- icon ---- */
    var iconSvg = ICONS[type] || CHECK;   /* 種類なしの toast() も既定扱いで ✓ を出す */
    var iconWrap = '';
    if (iconSvg) {
      iconWrap = '<div data-icon style="display:flex;height:16px;width:16px;flex-shrink:0;align-items:center;justify-content:flex-start;margin-left:-3px;margin-right:4px;color:' + icoc + ';">' + iconSvg + '</div>';
    }

    /* ---- content ---- */
    var contentHtml = '<div data-content style="display:flex;flex-direction:column;gap:2px;">' +
      '<div data-title style="font-weight:500;line-height:1.5;">' + escapeHtml(message) + '</div>' +
      (description
        ? '<div data-description style="font-weight:400;line-height:1.4;opacity:0.9;font-size:12px;">' + escapeHtml(description) + '</div>'
        : '') +
      '</div>';

    el.innerHTML = iconWrap + contentHtml;

    /* ---- dismiss on click ---- */
    el.addEventListener('click', function () { dismiss(el); });

    /* ---- append & animate in ---- */
    container.appendChild(el);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    });

    /* ---- max visible ---- */
    var toasts = container.querySelectorAll('[data-sonner-toast]');
    if (toasts.length > MAX_VISIBLE) dismiss(toasts[0]);

    /* ---- auto dismiss ---- */
    if (duration > 0) {
      el._timer = setTimeout(function () { dismiss(el); }, duration);
    }

    return el;
  }

  function dismiss(el) {
    if (!el || !el.parentNode) return;
    if (el._timer) clearTimeout(el._timer);
    el.style.transform = 'translateY(100%)';
    el.style.opacity = '0';
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---- public API ---- */
  function toast(message, opts) {
    return createToast(message, opts);
  }
  toast.success = function (msg, opts) { return createToast(msg, assign(opts, 'success')); };
  toast.error   = function (msg, opts) { return createToast(msg, assign(opts, 'error')); };
  toast.info    = function (msg, opts) { return createToast(msg, assign(opts, 'info')); };
  toast.warning = function (msg, opts) { return createToast(msg, assign(opts, 'warning')); };
  toast.dismiss = dismiss;

  function assign(opts, type) {
    var o = {};
    if (opts) { for (var k in opts) o[k] = opts[k]; }
    o.type = type;
    return o;
  }

  Object.defineProperty(toast, 'position', {
    get: function () { return position; },
    set: function (v) {
      position = v;
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
        container = null;
      }
    },
  });

  window.toast = toast;

  /* ---- shadcn AlertDialog ----
     アラート系ダイアログ（確認・警告・破壊操作）はこの1つだけを使う。
     ワイヤーごとに .cfbox 等を自作しない（DESIGN.md §Components「手でコンポーネントを再発明しない」）。

       alertDialog({
         title:       '連携を解除しますか？',      // 必須
         description: 'Instagram（@…）の連携を解除します。',
         points:      ['予約している投稿は出せなくなります', ...],  // 任意。中黒つきの詳細ブロック
         cancelLabel: 'やめる',                    // 既定 'キャンセル'
         actionLabel: '連携を解除する',            // 既定 '続ける'
         destructive: true                         // 赤塗り + 警告アイコン
       }, function(){ ...OKのときの処理... });

     見た目の値は DESIGN.md のトークンに合わせている。shadcn の既定値（角丸6px・18px見出し・
     ほぼ黒のCTA）はスケール外／ブランド外なので使わない。 */
  var ALERT_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;margin-top:1px;"><path d="M12 9v4"/><path d="M10.363 3.591 2.257 17.125a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636-2.87L13.637 3.59a1.914 1.914 0 0 0-3.274 0z"/><path d="M12 16h.01"/></svg>';

  function alertDialog(opts, onConfirm) {
    var title = opts.title || '';
    var description = opts.description || '';
    var points = opts.points || null;
    var cancelLabel = opts.cancelLabel || 'キャンセル';
    var actionLabel = opts.actionLabel || '続ける';
    var destructive = opts.destructive || false;

    /* HTMLの style="…" に埋めるのでフォント名はシングルクォート。
       ダブルクォートだと属性が early close して以降の指定（背景色など）が全部落ちる。 */
    var FONT = "var(--font-body,Inter),'Noto Sans JP','Hiragino Sans','Meiryo',sans-serif";

    /* backdrop */
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999999998;background:rgba(0,0,0,0.45);opacity:0;transition:opacity .15s ease;';

    /* dialog: 大きめの面なので radius は lg(16px)、影は DESIGN.md §Elevation の overlay */
    var dialog = document.createElement('div');
    dialog.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:50%',
      'z-index:999999999',
      'display:flex',
      'flex-direction:column',
      'gap:0',
      'width:calc(100vw - 32px)',
      'max-width:440px',
      'border-radius:16px',
      'background:var(--color-card,#fff)',
      'border:1px solid var(--color-border,#e9e8e6)',
      'box-shadow:0 8px 24px rgb(0 0 0 / 0.12)',
      'padding:24px',
      'box-sizing:border-box',
      'font-family:' + FONT,
      'transform:translate(-50%,-50%) scale(.95)',
      'opacity:0',
      'transition:all .15s ease',
    ].join(';');

    /* header: タイトルは h3(16px)+700。破壊操作は色+形のセットで示す（色だけで表さない） */
    var icon = destructive
      ? '<span style="color:var(--color-destructive,#dc2626);display:flex;">' + ALERT_ICON + '</span>'
      : '';
    var header = '<div style="display:flex;flex-direction:column;gap:8px;">' +
      '<div style="display:flex;align-items:flex-start;gap:9px;font-size:1rem;font-weight:700;line-height:1.5;color:var(--color-foreground,#2a2826);">' +
        icon + '<span>' + escapeHtml(title) + '</span>' +
      '</div>' +
      (description ? '<div style="font-size:0.875rem;line-height:1.7;color:var(--color-muted-foreground,#757575);">' + escapeHtml(description) + '</div>' : '') +
      '</div>';

    /* points: 「何が起きるか」の箇条書き。これが無いと各画面が独自の詳細ブロックを作り始める */
    var detail = '';
    if (points && points.length) {
      /* 改行を含む値も1行ずつに開き、すでに中黒が付いている行には足さない（・・になる） */
      var lines = [];
      points.forEach(function (p) {
        String(p).split('\n').forEach(function (l) {
          l = l.trim();
          if (!l) return;
          lines.push(l.charAt(0) === '・' ? l : '・' + l);
        });
      });
      detail = '<div style="background:var(--color-surface,#fbfaf8);border:1px solid var(--color-border,#e9e8e6);' +
        'border-radius:12px;padding:12px 14px;margin-top:14px;font-size:0.75rem;line-height:1.8;' +
        'color:var(--color-foreground,#2a2826);max-height:150px;overflow-y:auto;word-break:break-word;">' +
        lines.map(escapeHtml).join('<br>') +
        '</div>';
    }

    /* footer: ボタンは radius md(12px)・高さ44px。通常アクションは primary（ほぼ黒のCTAは使わない） */
    var btnBase = 'display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 20px;border-radius:12px;' +
      'font-family:' + FONT + ';font-size:0.875rem;font-weight:700;cursor:pointer;transition:opacity .2s;outline:none;';
    var cancelBtn = '<button data-cancel style="' + btnBase + 'background:transparent;border:1px solid var(--color-border,#e9e8e6);color:var(--color-foreground,#2a2826);">'+escapeHtml(cancelLabel)+'</button>';
    var actionColor = destructive
      ? 'background:var(--color-destructive,#dc2626);border:none;color:var(--color-on-destructive,#fff);'
      : 'background:var(--color-primary,#ef6108);border:none;color:var(--color-on-primary,#fff);';
    var actionBtn = '<button data-action style="' + btnBase + actionColor + '">'+escapeHtml(actionLabel)+'</button>';
    var footer = '<div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;">' + cancelBtn + actionBtn + '</div>';

    dialog.innerHTML = header + detail + footer;
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    /* animate in */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        dialog.style.transform = 'translate(-50%,-50%) scale(1)';
        dialog.style.opacity = '1';
      });
    });

    function close() {
      document.removeEventListener('keydown', onKey);
      overlay.style.opacity = '0';
      dialog.style.transform = 'translate(-50%,-50%) scale(.95)';
      dialog.style.opacity = '0';
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (dialog.parentNode) dialog.parentNode.removeChild(dialog);
      }, 150);
    }
    /* Esc で閉じる。開いた時点のフォーカスは「やめる」側に置く（誤爆させない） */
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);

    overlay.addEventListener('click', close);
    var cancelEl = dialog.querySelector('[data-cancel]');
    cancelEl.addEventListener('click', close);
    cancelEl.focus();
    dialog.querySelector('[data-action]').addEventListener('click', function () {
      close();
      if (onConfirm) onConfirm();
    });
  }
  window.alertDialog = alertDialog;

  /* ---- resetChat: AI assist header refresh button ---- */
  window.resetChat = function (btn) {
    alertDialog({
      title: '会話をリセットしますか？',
      description: 'これまでの会話履歴がすべて削除されます。この操作は取り消せません。',
      cancelLabel: 'キャンセル',
      actionLabel: 'リセット',
      destructive: true,
    }, function () {
      var node = btn.parentElement;
      var stream = null;
      while (node && !stream) {
        stream = node.querySelector('#stream, #chatStream, #aiStream, .stream, .booth-body, .ai-ex-stream');
        if (!stream) node = node.parentElement;
      }
      if (stream) stream.innerHTML = '';
      toast.success('会話をリセットしました');
    });
  };
})();
