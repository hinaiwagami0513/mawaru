/*
 * shadcn/ui の DatePicker（Popover + Calendar）相当をワイヤー用に1本だけ用意する。
 *
 * <input type="date"> のままだと OS 標準のカレンダーが開き、青いアクセントや
 * 「削除／今日」のリンクがそのまま出てデザインが混ざる。shadcn-select.js と
 * 同じ方針で「shadcnに見える・振る舞う」1実装を共有する。
 * 画面ごとに作り直さない（[[component-procurement]]）。
 *
 * 使い方: <script src="shadcn-date.js"></script> を置くだけ。
 *   ページ内の <input type="date"> を自動で置き換える。data-plain は対象外。
 *   元の input は残して値の持ち主にするので、既存の .value / change はそのまま動く。
 *   あとから JS で作られた input にも自動で追従する（再描画する画面があるため）。
 */
(function () {
  'use strict';

  var WD = ['日', '月', '火', '水', '木', '金', '土'];

  var CSS = [
    '.scd-date{position:relative;display:block;}',
    'input.scd-native{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;',
    '  clip:rect(0 0 0 0);white-space:nowrap;border:0;}',
    /* Trigger */
    '.scd-trigger{display:flex;align-items:center;gap:8px;width:100%;height:46px;padding:0 12px;',
    '  border:1px solid var(--color-border-strong);border-radius:var(--radius-md);background:var(--color-input);',
    '  color:var(--color-foreground);font-family:inherit;font-size:var(--text-body);text-align:left;',
    '  cursor:pointer;transition:border-color .12s,box-shadow .12s;}',
    '.scd-trigger:hover{border-color:var(--color-primary);}',
    '.scd-trigger:focus-visible,.scd-trigger.open{outline:none;border-color:var(--color-primary);',
    '  box-shadow:0 0 0 2px var(--color-primary-subtle);}',
    '.scd-trigger[disabled]{opacity:.5;cursor:not-allowed;}',
    '.scd-val{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.scd-val.ph{color:var(--color-muted-foreground);}',
    '.scd-ic{flex:none;font-size:16px;color:var(--color-muted-foreground);}',
    /* Popover */
    '.scd-pop{position:fixed;z-index:3000;width:288px;padding:12px;background:var(--color-card);',
    '  border:1px solid var(--color-border);border-radius:var(--radius-md);box-shadow:0 10px 32px rgb(0 0 0 / .14);}',
    '.scd-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}',
    '.scd-mon{font-size:var(--text-body);font-weight:var(--font-weight-body-strong);}',
    '.scd-nav{display:flex;gap:4px;}',
    '.scd-nav button{width:28px;height:28px;display:flex;align-items:center;justify-content:center;',
    '  border:1px solid var(--color-border);border-radius:var(--radius-sm);background:transparent;',
    '  color:var(--color-foreground);cursor:pointer;font-size:14px;}',
    '.scd-nav button:hover{border-color:var(--color-primary);color:var(--color-primary);}',
    '.scd-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;}',
    '.scd-wd{height:26px;display:flex;align-items:center;justify-content:center;font-size:var(--text-meta);',
    '  color:var(--color-muted-foreground);}',
    '.scd-day{height:34px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);',
    '  font-size:var(--text-label);color:var(--color-foreground);cursor:pointer;border:1px solid transparent;}',
    '.scd-day:hover{background:var(--color-surface);}',
    '.scd-day.out{color:var(--color-muted-foreground);opacity:.45;}',
    '.scd-day.today{border-color:var(--color-primary);color:var(--color-primary);font-weight:var(--font-weight-body-strong);}',
    '.scd-day.sel{background:var(--color-primary);border-color:var(--color-primary);color:#fff;',
    '  font-weight:var(--font-weight-body-strong);}',
    '.scd-day.sel:hover{background:var(--color-primary);}',
    '.scd-ft{display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--color-border);}',
    '.scd-ft button{flex:1;height:32px;border-radius:var(--radius-sm);border:1px solid var(--color-border);',
    '  background:transparent;font-family:inherit;font-size:var(--text-label);',
    '  font-weight:var(--font-weight-body-strong);color:var(--color-foreground);cursor:pointer;}',
    '.scd-ft button:hover{border-color:var(--color-primary);color:var(--color-primary);',
    '  background:var(--color-primary-subtle);}',
    '.scd-mask{position:fixed;inset:0;z-index:2999;}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('scd-date-css')) return;
    var st = document.createElement('style');
    st.id = 'scd-date-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
  function parse(v) {
    if (!v) return null;
    var p = v.split('-');
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d.getTime()) ? null : d;
  }
  /* 表記はアプリ内の他の日付（投稿一覧など）に合わせる。
     年は今年と違うときだけ出す（狭い欄で切れるのを避ける） */
  function label(d) {
    var y = d.getFullYear() === new Date().getFullYear() ? '' : d.getFullYear() + '/';
    return y + (d.getMonth() + 1) + '/' + d.getDate() + '(' + WD[d.getDay()] + ')';
  }

  var openState = null;

  function closeOpen() {
    if (!openState) return;
    openState.pop.remove();
    openState.mask.remove();
    openState.trigger.classList.remove('open');
    openState = null;
  }

  function syncTrigger(wrap) {
    var inp = wrap.querySelector('input');
    var val = wrap.querySelector('.scd-val');
    var d = parse(inp.value);
    val.textContent = d ? label(d) : (inp.dataset.placeholder || '日付を選ぶ');
    val.classList.toggle('ph', !d);
    wrap.querySelector('.scd-trigger').disabled = inp.disabled;
  }

  function commit(wrap, value) {
    var inp = wrap.querySelector('input');
    inp.value = value;
    /* 既存コードは change / input を見ているのでどちらも投げる */
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    syncTrigger(wrap);
  }

  function openPop(wrap) {
    var inp = wrap.querySelector('input');
    var trigger = wrap.querySelector('.scd-trigger');
    if (inp.disabled) return;
    closeOpen();

    var sel = parse(inp.value);
    var view = sel ? new Date(sel.getFullYear(), sel.getMonth(), 1) : new Date();
    view.setDate(1);

    var mask = document.createElement('div');
    mask.className = 'scd-mask';
    var pop = document.createElement('div');
    pop.className = 'scd-pop';
    pop.setAttribute('role', 'dialog');

    function render() {
      var today = new Date();
      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var start = new Date(first);
      start.setDate(1 - first.getDay());
      var html = '<div class="scd-hd"><span class="scd-mon">' + view.getFullYear() + '年' + (view.getMonth() + 1) + '月</span>' +
        '<span class="scd-nav"><button type="button" data-m="-1" aria-label="前の月">&#x2039;</button>' +
        '<button type="button" data-m="1" aria-label="次の月">&#x203A;</button></span></div><div class="scd-grid">';
      WD.forEach(function (w) { html += '<span class="scd-wd">' + w + '</span>'; });
      for (var i = 0; i < 42; i++) {
        var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        var cls = 'scd-day';
        if (d.getMonth() !== view.getMonth()) cls += ' out';
        if (iso(d) === iso(today)) cls += ' today';
        if (sel && iso(d) === iso(sel)) cls += ' sel';
        html += '<span class="' + cls + '" data-d="' + iso(d) + '">' + d.getDate() + '</span>';
      }
      html += '</div><div class="scd-ft"><button type="button" data-set="today">今日</button>' +
        '<button type="button" data-set="clear">クリア</button></div>';
      pop.innerHTML = html;
    }
    render();

    pop.addEventListener('click', function (e) {
      var nav = e.target.closest('[data-m]');
      if (nav) { view.setMonth(view.getMonth() + (+nav.dataset.m)); render(); return; }
      var ft = e.target.closest('[data-set]');
      if (ft) {
        if (ft.dataset.set === 'today') commit(wrap, iso(new Date()));
        else commit(wrap, '');
        closeOpen();
        return;
      }
      var day = e.target.closest('.scd-day');
      if (day) { commit(wrap, day.dataset.d); closeOpen(); }
    });

    document.body.appendChild(mask);
    document.body.appendChild(pop);
    trigger.classList.add('open');

    var r = trigger.getBoundingClientRect();
    var h = pop.offsetHeight;
    var top = r.bottom + 4;
    if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 4);
    pop.style.left = Math.min(Math.max(8, r.left), window.innerWidth - pop.offsetWidth - 8) + 'px';
    pop.style.top = top + 'px';

    mask.addEventListener('click', closeOpen);
    openState = { pop: pop, mask: mask, trigger: trigger };
  }

  function upgrade(inp) {
    if (inp.dataset.plain !== undefined || inp.closest('.scd-date')) return;
    injectCSS();

    /* 元の input の見た目とレイアウトを引き継ぐ（隣の欄が潰れないように）。※隠す前に読む */
    var cs = getComputedStyle(inp);
    var inherit = {
      height: cs.height,
      fontSize: cs.fontSize,
      borderRadius: cs.borderRadius,
      flex: cs.flexGrow + ' ' + cs.flexShrink + ' ' + cs.flexBasis,
      width: cs.width
    };

    var wrap = document.createElement('div');
    wrap.className = 'scd-date';
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    inp.classList.add('scd-native');
    inp.setAttribute('tabindex', '-1');

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'scd-trigger';
    trigger.innerHTML = '<span class="scd-val"></span><i class="ti ti-calendar-event scd-ic"></i>';
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
      openPop(wrap);
    });
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); openPop(wrap); }
    });

    /* 外側のコードが input.value を書き換えたときも表示を合わせる。
       change を投げてくれない呼び出し元（かんたん選択など）があるので、
       value の代入そのものを拾う */
    var vd = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (vd && vd.get && vd.set) {
      Object.defineProperty(inp, 'value', {
        configurable: true,
        get: function () { return vd.get.call(this); },
        set: function (v) { vd.set.call(this, v); syncTrigger(wrap); }
      });
    }
    inp.addEventListener('change', function () { syncTrigger(wrap); });
    new MutationObserver(function () { syncTrigger(wrap); })
      .observe(inp, { attributes: true, attributeFilter: ['value', 'disabled'] });

    syncTrigger(wrap);
  }

  function upgradeAll(root) {
    (root || document).querySelectorAll('input[type="date"]').forEach(upgrade);
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOpen(); });
  window.addEventListener('resize', closeOpen);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { upgradeAll(); });
  } else {
    upgradeAll();
  }

  /* 画面を innerHTML で作り直すところがあるので、増えた input は自動で拾う */
  var pending = null;
  new MutationObserver(function () {
    if (pending) return;
    pending = setTimeout(function () { pending = null; upgradeAll(); }, 0);
  }).observe(document.documentElement, { childList: true, subtree: true });

  window.upgradeDates = upgradeAll;
})();
