/* ===========================================================================
   sp-check.js — スマホ表示の崩れを機械で見つけるプローブ
   ---------------------------------------------------------------------------
   使い方（gstack browse）:
     B=~/.claude/skills/gstack/browse/dist/browse
     $B viewport 390x844
     $B goto http://localhost:5173/xxx_wire.html
     $B eval ./sp-check.js
   端末幅は 320 / 344 / 360 / 375 / 390 / 414 / 430 を通すこと。
   320px（iPhone SE1・小型Android）で崩れないかが本番。

   ■ 確実な指摘（出たら直す）
     PAGE     ページ自体が横に溢れている
     OVERFLOW 要素が親の内側からはみ出している
     CLIP     nowrap なのに箱から溢れて文字が切れている
     OVERLAP  文字どうしが重なっている
     RAGGED   同種のセルが同じ行で高さ不揃い（＝どれかだけ折り返している）

   ■ 助言（目で確かめてから判断する）
     ALIGN    同じ親に並ぶパネルの左端が揃っていない
              └ 意図的に内側へ寄せた枠（丸みのある囲み等）も拾う。
                実バグ例: サブタブだけ margin:32px で本文16pxより内側だった。
                正常例  : 全幅の帯の隣に、内側に寄せた囲みを置いている。

   ■ 既知の誤検出は除外済み
     ・当たり判定を44pxにする負のマージン（padding で広げて margin で詰め戻す定石）
     ・角に付く position:absolute のバッジ（意図してはみ出している）
     ・アイコン字形の箱が丸ボタンよりわずかに大きいときの左右対称なはみ出し
     ・畳まれたアコーディオンの中身（display:none ではないので矩形を持ち、
       全部が同じ座標に積み上がって「重なり」に見える）
     ・float の横に回り込む行（左端がずれて当然）
     ・箇条書き（UL/OL）の行頭字下げ
   =========================================================================== */
(() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const out = [];
  const name = (e) => {
    if (!e) return '?';
    if (typeof e.className === 'string' && e.className.trim())
      return '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.');
    return e.tagName.toLowerCase();
  };
  const seen = new Set();
  const add = (kind, e, detail) => {
    const k = kind + '|' + name(e) + '|' + detail.replace(/\d+/g, '#');
    if (seen.has(k)) return;
    seen.add(k);
    out.push(kind + ' ' + name(e) + ' ' + detail);
  };

  if (de.scrollWidth > vw + 1) out.push('PAGE ページ横溢れ ' + de.scrollWidth + '/' + vw);

  const all = [...document.querySelectorAll('body *')];

  for (const e of all) {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.position === 'fixed' || cs.position === 'absolute') continue;
    /* 負のマージンは、この実装で当たり判定を44pxに広げるときの定石
       （padding で広げて margin で詰め戻す）。はみ出しに見えるが意図的なので除外。 */
    const mL = parseFloat(cs.marginLeft) || 0, mR = parseFloat(cs.marginRight) || 0;
    if (mL < 0 || mR < 0) continue;

    /* 親の内側からのはみ出し。
       ・display:contents の親は矩形を持たない（0px）ので、実体のある祖先まで遡る
       ・横スクロール前提の親は除外 */
    let p = e.parentElement;
    while (p && p !== document.body && getComputedStyle(p).display === 'contents') p = p.parentElement;
    if (p && p !== document.body) {
      const pcs = getComputedStyle(p);
      const scroller = ['auto', 'scroll'].includes(pcs.overflowX);
      if (!scroller) {
        const pr = p.getBoundingClientRect();
        if (pr.width > 1) {
          const L = pr.left + (parseFloat(pcs.paddingLeft) || 0);
          const R = pr.right - (parseFloat(pcs.paddingRight) || 0);
          var outR = r.right - R, outL = L - r.left;
          /* 左右に同じくらい少しだけ出るのは、アイコン字形の箱が小さい丸ボタンより
             わずかに大きいときの見え方で、レイアウトの崩れではない。両側8px以内は見ない。 */
          var glyphish = outR > 0 && outL > 0 && outR <= 8 && outL <= 8;
          if (!glyphish) {
            if (outR > 1.5) add('OVERFLOW', e, '右に' + outR.toFixed(0) + 'px (親' + name(p) + ')');
            if (outL > 1.5) add('OVERFLOW', e, '左に' + outL.toFixed(0) + 'px (親' + name(p) + ')');
          }
        }
      }
    }

    /* nowrap なのに自分の箱から溢れる＝文字が切れる（省略記号があるものは除外）。
       ⚠️ 角に付くバッジ等の position:absolute な子は scrollWidth を押し広げるが、
       あれは意図してはみ出させているもの。子に absolute がいる箱は見ない。 */
    var hasAbsChild = [...e.children].some(function (c) {
      return getComputedStyle(c).position === 'absolute';
    });
    if (!hasAbsChild && cs.whiteSpace === 'nowrap' && cs.textOverflow !== 'ellipsis'
        && !['hidden', 'auto', 'scroll'].includes(cs.overflowX)
        && e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0) {
      add('CLIP', e, '文字が' + (e.scrollWidth - e.clientWidth) + 'px はみ出し「' + (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 14) + '」');
    }
  }

  /* 同種の兄弟（同じクラスのカード/セル）が同じ行に並ぶのに高さが違う＝どれかだけ折り返している。
     アイコン＋本文のような「別物の並び」は拾わないよう、先頭クラス名が一致する組だけ見る。 */
  for (const e of all) {
    const cs = getComputedStyle(e);
    if (cs.display !== 'flex' && cs.display !== 'grid') continue;
    if (cs.flexDirection === 'column') continue;
    if (cs.display === 'grid' && cs.gridTemplateColumns.split(' ').length < 2) continue;
    const kids = [...e.children].filter(c => {
      const r = c.getBoundingClientRect();
      return r.width > 1 && r.height > 1;
    });
    if (kids.length < 2) continue;
    const rows = new Map();
    for (const c of kids) {
      const r = c.getBoundingClientRect();
      const key = Math.round(r.top / 4);
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(c);
    }
    for (const [, cells] of rows) {
      if (cells.length < 2) continue;
      const cls = cells.map(c => (typeof c.className === 'string' ? c.className.trim().split(/\s+/)[0] : ''));
      if (new Set(cls).size !== 1 || !cls[0]) continue;   /* 同種でなければ見ない */
      const hs = cells.map(c => c.getBoundingClientRect().height);
      const mn = Math.min(...hs), mx = Math.max(...hs);
      if (mx - mn > 10) add('RAGGED', e, '同種セル .' + cls[0] + ' の高さが不揃い ' + mn.toFixed(0) + '〜' + mx.toFixed(0) + 'px');
    }
  }

  /* 文字どうしが重なる。
     親からはみ出していなくても、伸びた見出しがグラフのラベルに被る等が起きる
     （analysis_account で実際に起きた。はみ出し検査だけでは見つからない）。
     葉ノード（子を持たない＝文字を持つ要素）どうしで、矩形が実際に交差したものだけ拾う。 */
  /* ⚠️ 畳まれたパネル（height:0 + overflow:hidden のアコーディオン等）の中身は、
     display:none ではないので矩形を持ち、全部が同じ座標に積み上がる。
     そのまま比べると「別セクションの文字同士が重なっている」と大量に誤検出する。
     祖先に切られて画面に出ていないものは、判定から外す。 */
  function clippedAway(e) {
    var r = e.getBoundingClientRect();
    var p = e.parentElement;
    while (p && p !== document.body) {
      var pcs = getComputedStyle(p);
      if (pcs.overflow !== 'visible' || pcs.overflowY !== 'visible' || pcs.overflowX !== 'visible') {
        var pr = p.getBoundingClientRect();
        if (r.bottom <= pr.top + 1 || r.top >= pr.bottom - 1 ||
            r.right <= pr.left + 1 || r.left >= pr.right - 1) return true;
      }
      p = p.parentElement;
    }
    return false;
  }
  var leaves = all.filter(function (e) {
    if (e.children.length) return false;
    var t = (e.textContent || '').trim();
    if (!t) return false;
    var r = e.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return false;
    var cs = getComputedStyle(e);
    if (cs.visibility === 'hidden' || cs.position === 'absolute' || cs.position === 'fixed') return false;
    if (clippedAway(e)) return false;
    return true;
  });
  for (var i = 0; i < leaves.length; i++) {
    for (var j = i + 1; j < leaves.length; j++) {
      var a = leaves[i], b = leaves[j];
      if (a.contains(b) || b.contains(a)) continue;
      var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      var ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      var oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      /* かすり合いは無視。縦横とも4px以上食い込んだものだけを重なりとみなす */
      if (ox > 4 && oy > 4) {
        add('OVERLAP', a, '「' + (a.textContent || '').trim().slice(0, 10) + '」と'
          + name(b) + '「' + (b.textContent || '').trim().slice(0, 10) + '」が重なる');
      }
    }
  }

  /* 同じ親の直下に並ぶ「ほぼ全幅の帯・カード」は左端が揃うはず。
     1つだけ内側に寄っているのは、その要素だけ余計な margin / padding を持っている合図。
     （サブタブの帯だけ margin:32px で本文16pxより内側に寄っていたのを、
       中身の詰め方ばかり見て取り逃がした。器のほうを見る検査。）
     誤検出を避けるため、比較するのは
       ・ほぼ全幅（親の内側の60%以上）
       ・ブロック級（inline は対象外）
       ・3つ以上並んでいて、そのうち2つ以上が同じ左端を共有している
     ものだけにする。 */
  for (var pi = 0; pi < all.length; pi++) {
    var par = all[pi];
    var prr = par.getBoundingClientRect();
    if (prr.width < 120) continue;
    var parcs = getComputedStyle(par);
    var innerL = prr.left + (parseFloat(parcs.paddingLeft) || 0);
    var innerR = prr.right - (parseFloat(parcs.paddingRight) || 0);
    var innerW = innerR - innerL;
    if (innerW < 120) continue;
    var kids = [].slice.call(par.children).filter(function (c) {
      var r = c.getBoundingClientRect();
      if (r.height < 8) return false;
      var ccs = getComputedStyle(c);
      if (ccs.position === 'absolute' || ccs.position === 'fixed') return false;
      if (ccs.display.indexOf('inline') === 0) return false;
      /* 箇条書きは行頭記号のぶん字下げされるのが普通。ずれではないので比べない。 */
      if (c.tagName === 'UL' || c.tagName === 'OL') return false;
      return r.width > innerW * 0.6;
    });
    if (kids.length < 3) continue;
    /* float の横に回り込む行は左端がずれて当然（サムネの右に見出しを置く形）。
       浮いた子を持つ枠は、この検査の対象から外す。 */
    var floatNear = false;
    var fp = par;
    for (var fi = 0; fi < 3 && fp && fp !== document.body; fi++) {
      if ([].slice.call(fp.children).some(function (c) { return getComputedStyle(c).float !== 'none'; })) {
        floatNear = true; break;
      }
      fp = fp.parentElement;
    }
    if (floatNear) continue;
    /* ⚠️ 比べるのは「箱の左端」。
       中身の左端（left + padding）で比べると、カードの内側の余白（padding:20px 等）まで
       ずれと数えてしまい、実際にはきれいに揃っている画面が大量に引っかかる。
       見たいのは「パネルの縁が揃っているか」なので箱で見る。 */
    var lefts = kids.map(function (c) { return Math.round(c.getBoundingClientRect().left); });
    var counts = {};
    lefts.forEach(function (l) { counts[l] = (counts[l] || 0) + 1; });
    var mode = +Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
    if (counts[mode] < 2) continue;
    kids.forEach(function (c, i) {
      var d = lefts[i] - mode;
      /* 内側（右）へ余計に寄っているものだけ見る。逆に外へ出ているのは
         「帯を端まで伸ばす」意図的な全幅レイアウトなので対象外。
         しきい値は16px（今回の実バグがちょうど16px＝本文1段ぶんのずれだった）。 */
      if (d >= 16) {
        add('ALIGN', c, '左端が他より' + d + 'px 内側に寄っている（他は x' + mode + '）');
      }
    });
  }

  return out.length ? out.join('\n') : 'OK';
})()
