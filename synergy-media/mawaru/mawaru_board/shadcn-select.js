/*
 * shadcn/ui の Select 相当をワイヤー用に1本だけ用意する。
 *
 * ワイヤーは素のHTMLなのでRadixを動かせない。だからといって各画面で
 * <select> をそのまま置くと、OS標準の見た目が混ざってデザインが崩れる。
 * ここで「shadcnのSelectに見える・振る舞う」1実装を共有する。
 * 画面ごとに作り直さない（[[component-procurement]]）。
 *
 * 使い方: <script src="shadcn-select.js"></script> を置くだけ。
 *   ページ内の <select> を自動で置き換える。data-plain を付けたものは対象外。
 *   元の <select> は残して値の持ち主にするので、既存の .value / change は
 *   そのまま動く。あとから JS で <option> を足しても追従する。
 */
(function () {
  'use strict';

  var CSS = [
    '.scn-select{position:relative;display:block;width:100%;}',
    'select.scn-native{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;',
    '  clip:rect(0 0 0 0);white-space:nowrap;border:0;}',
    /* Trigger */
    '.scn-trigger{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;',
    '  height:46px;padding:0 12px;border:1px solid var(--color-border-strong);border-radius:var(--radius-md);',
    '  background:var(--color-input);color:var(--color-foreground);font-family:inherit;',
    '  font-size:var(--text-body);text-align:left;cursor:pointer;transition:border-color .12s,box-shadow .12s;}',
    '.scn-trigger:hover{border-color:var(--color-primary);}',
    '.scn-trigger:focus-visible,.scn-trigger.open{outline:none;border-color:var(--color-primary);',
    '  box-shadow:0 0 0 2px var(--color-primary-subtle);}',
    '.scn-trigger[disabled]{opacity:.5;cursor:not-allowed;}',
    '.scn-value{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.scn-value.ph{color:var(--color-muted-foreground);}',
    '.scn-chev{flex:none;font-size:16px;color:var(--color-muted-foreground);transition:transform .15s;}',
    '.scn-trigger.open .scn-chev{transform:rotate(180deg);}',
    /* Content */
    '.scn-content{position:fixed;z-index:3000;min-width:8rem;max-height:280px;overflow-y:auto;padding:4px;',
    '  background:var(--color-card);border:1px solid var(--color-border);border-radius:var(--radius-md);',
    '  box-shadow:0 10px 32px rgb(0 0 0 / .14);}',
    '.scn-item{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 30px;border-radius:var(--radius-sm);',
    '  font-size:var(--text-body);color:var(--color-foreground);cursor:pointer;position:relative;white-space:nowrap;}',
    '.scn-item:hover,.scn-item.active{background:var(--color-surface);}',
    '.scn-item[aria-selected="true"]{color:var(--color-primary);font-weight:var(--font-weight-body-strong);}',
    '.scn-item .scn-check{position:absolute;left:8px;font-size:14px;opacity:0;}',
    '.scn-item[aria-selected="true"] .scn-check{opacity:1;}',
    '.scn-mask{position:fixed;inset:0;z-index:2999;}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('scn-select-css')) return;
    var st = document.createElement('style');
    st.id = 'scn-select-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  var openState = null;

  function closeOpen() {
    if (!openState) return;
    openState.content.remove();
    openState.mask.remove();
    openState.trigger.classList.remove('open');
    openState = null;
  }

  function labelOf(sel) {
    var o = sel.options[sel.selectedIndex];
    return o ? o.textContent : '';
  }

  function syncTrigger(wrap) {
    var sel = wrap.querySelector('select');
    var val = wrap.querySelector('.scn-value');
    var text = labelOf(sel);
    val.textContent = text || (sel.dataset.placeholder || '選択してください');
    val.classList.toggle('ph', !text);
  }

  function openContent(wrap) {
    var sel = wrap.querySelector('select');
    var trigger = wrap.querySelector('.scn-trigger');
    if (sel.disabled) return;
    closeOpen();

    var mask = document.createElement('div');
    mask.className = 'scn-mask';
    var content = document.createElement('div');
    content.className = 'scn-content';
    content.setAttribute('role', 'listbox');

    // options は後から JS で足されることがあるので、開くたびに読み直す
    Array.prototype.forEach.call(sel.options, function (o, idx) {
      var it = document.createElement('div');
      it.className = 'scn-item';
      it.setAttribute('role', 'option');
      it.setAttribute('aria-selected', idx === sel.selectedIndex ? 'true' : 'false');
      it.innerHTML = '<i class="ti ti-check scn-check"></i>' + o.textContent;
      it.addEventListener('click', function () {
        sel.selectedIndex = idx;
        // 既存コードは change / input を見ているのでどちらも投げる
        sel.dispatchEvent(new Event('input', { bubbles: true }));
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        syncTrigger(wrap);
        closeOpen();
      });
      content.appendChild(it);
    });

    document.body.appendChild(mask);
    document.body.appendChild(content);
    trigger.classList.add('open');

    var r = trigger.getBoundingClientRect();
    content.style.minWidth = r.width + 'px';
    var h = content.offsetHeight;
    var top = r.bottom + 4;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 4);
    content.style.left = Math.min(Math.max(8, r.left), window.innerWidth - content.offsetWidth - 8) + 'px';
    content.style.top = top + 'px';

    var cur = content.querySelector('[aria-selected="true"]');
    if (cur) cur.scrollIntoView({ block: 'nearest' });

    mask.addEventListener('click', closeOpen);
    openState = { content: content, mask: mask, trigger: trigger };
  }

  function upgrade(sel) {
    if (sel.dataset.plain !== undefined || sel.closest('.scn-select')) return;
    injectCSS();

    // 元の <select> が持っていた見た目とレイアウトを引き継ぐ。
    // 引き継がないと、flex の中で幅が偏ったり（隣の入力欄が潰れる）
    // 画面ごとに高さがバラつく。※隠す前に読むこと
    var cs = getComputedStyle(sel);
    var inherit = {
      height: cs.height,
      fontSize: cs.fontSize,
      borderRadius: cs.borderRadius,
      flex: cs.flexGrow + ' ' + cs.flexShrink + ' ' + cs.flexBasis
    };

    var wrap = document.createElement('div');
    wrap.className = 'scn-select';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.classList.add('scn-native');
    sel.setAttribute('tabindex', '-1');

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'scn-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.innerHTML = '<span class="scn-value"></span><i class="ti ti-chevron-down scn-chev"></i>';
    // ダイアログの中など、初期化時に非表示だと height が 0px で返る。
    // その値を貼ると潰れるので、ちゃんとした数字のときだけ引き継ぐ
    var hpx = parseFloat(inherit.height);
    if (hpx >= 20) trigger.style.height = inherit.height;
    if (inherit.fontSize) trigger.style.fontSize = inherit.fontSize;
    if (inherit.borderRadius) trigger.style.borderRadius = inherit.borderRadius;
    wrap.style.flex = inherit.flex;
    wrap.style.minWidth = '0';
    wrap.appendChild(trigger);

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (openState && openState.trigger === trigger) { closeOpen(); return; }
      openContent(wrap);
    });
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); openContent(wrap); }
    });

    // 外側のコードが sel.value を書き換えたときも表示を合わせる。
    // change を投げてくれない呼び出し元があるので、代入そのものを拾う
    ['value', 'selectedIndex'].forEach(function (prop) {
      var d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, prop);
      if (!d || !d.get || !d.set) return;
      Object.defineProperty(sel, prop, {
        configurable: true,
        get: function () { return d.get.call(this); },
        set: function (v) { d.set.call(this, v); syncTrigger(wrap); }
      });
    });
    sel.addEventListener('change', function () { syncTrigger(wrap); });
    new MutationObserver(function () { syncTrigger(wrap); })
      .observe(sel, { childList: true, attributes: true, attributeFilter: ['disabled'] });

    syncTrigger(wrap);
  }

  function upgradeAll(root) {
    (root || document).querySelectorAll('select').forEach(upgrade);
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOpen(); });
  window.addEventListener('resize', closeOpen);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { upgradeAll(); });
  } else {
    upgradeAll();
  }
  // 画面を innerHTML で作り直すところがあるので、増えた select は自動で拾う。
  // これが無いと再描画のたびに OS 標準の <select> に戻ってしまう。
  var pending = null;
  new MutationObserver(function () {
    if (pending) return;
    pending = setTimeout(function () { pending = null; upgradeAll(); }, 0);
  }).observe(document.documentElement, { childList: true, subtree: true });

  // 後から DOM に足された select 用
  window.upgradeSelects = upgradeAll;
})();
