/**
 * hint.js — ヒントを×で閉じられるようにする
 *
 * 使い方: 各画面で <script src="./hint.js"></script> を1行足すだけ。
 *   HTML側は今まで通り（DESIGN.md §Alert のまま）でよく、×はこのファイルが差し込む。
 *   すでに手で <button class="x"> を書いてある箱（settings_wire の運用目的）は
 *   作り直さず、その1個をそのまま使う。
 *
 * 対象は2つ。どちらも「ヒントとして出す文」で、ⓘが数値の横に
 * して付いているだけのもの（analysis_metrics の .summary-hint / .mc-hint、
 * analysis_account の .trend-row）は喋っていないので対象外。
 *   .hint  吹き出しの箱を持つ本体（DESIGN.md §Alert）
 *   .hint-inline    箱を持たない一言（AIレポートのスライド下の「リーチが課題やな！」など）
 *
 * 設計の根拠:
 *   - アラートは「据え置き」なので、一度読んだ人には毎回同じ文が居座る。
 *     ドライブの ATTENTION は SP で本文6行ぶんの高さを占め、ファイル一覧を押し下げる。
 *     読み終わった人が自分で片付けられる逃げ道を1つ置く（tour.js のスキップと同じ考え）。
 *   - 消すのは任意。既定では出したままで、押した人にだけ消える。
 *     出さない判断（data-keep）は書き手が明示したときだけ。
 *   - ×は吹き出しの外に置く。DESIGN.md §Alert「吹き出しの外に出していいのは、
 *     ⓘと右端のボタン（.sp）と閉じるボタン（.x）だけ」に合わせる。
 *
 * 状態は localStorage に置く。ワイヤーはページを跨ぐと変数が消えるため。
 * 鍵は「ページ名 + 本文のハッシュ」。何番目の箱かで持つと、後から上に1つ足したり
 * JSで差し込んだりしたときに番号がずれて、別の箱が最初から消えたまま出なくなる。
 * 文面を書き換えたときに出戻るのは、別の話になった＝もう一度読ませたい場面なので都合がよい。
 * 固定したいときは data-fa="任意の名前" を書けばそれを鍵にする。
 *
 * アイコンはSVGで持つ。.ti-x の字形宣言は各画面が使う分だけ書く方式なので、
 * analysis_posts_wire のように ti-x を持たない画面では ti タグだと空白になる
 * （onboarding.js と同じ事情）。
 */
(function () {
  /* 箱の並びを変えたら上げる。旧版の「消した」が残ると、
     入れ替えた別のアラートが最初から消えたまま誰にも出ない。 */
  var KEY = 'mawaru.hint.v1';

  var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function save(m) {
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) { /* 保存できなくても閉じる動作は生かす */ }
  }

  /* err だけは覚えない。
     失敗の報せは「いま起きていること」で、次に開いたときも失敗していれば
     また出るべきもの。ここを覚えると、一度×を押した人にはエラーが二度と出ない。
     ok / care（説明・注意）は据え置きの文なので覚えてよい。 */
  function remembers(el) { return !el.classList.contains('err'); }

  /* 本文から鍵を作る。衝突しても困るのは「同じページの同じ文面」だけなので、
     短い加算ハッシュで足りる（暗号用途ではない）。 */
  function keyOf(el, bubble) {
    var tag = el.getAttribute('data-fa');
    if (tag) return page + '#' + tag;
    var t = (bubble.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    var h = 0;
    for (var i = 0; i < t.length; i++) { h = ((h << 5) - h + t.charCodeAt(i)) | 0; }
    return page + '#' + (h >>> 0).toString(36);
  }

  function icon() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'M18 6 6 18M6 6l12 12');
    s.appendChild(p);
    return s;
  }

  function init() {
    var seen = load();
    var boxes = document.querySelectorAll('.hint, .hint-inline');

    for (var i = 0; i < boxes.length; i++) {
      var el = boxes[i];

      /* 書き手が「これは消させない」と決めた箱は触らない。
         常設の説明ではなく、その画面の中身そのものになっているアラート
         （analysis_posts の投稿ごとのAI講評など）が該当する。 */
      if (el.hasAttribute('data-keep')) continue;

      /* 一度触った箱は飛ばす。JSで後から差し込まれる箱（calendar の予約完了、
         analysis_posts の講評）を拾うために下でDOMを見張っているので、
         この印が無いと init が自分の差し込みに反応して無限に回る。 */
      if (el.hasAttribute('data-fa-done')) continue;
      el.setAttribute('data-fa-done', '');

      /* ×は吹き出しの中の右上に浮かせる（float）。
         外に兄弟として置くと、SPでは28px + gap12px が本文から丸ごと引かれて
         吹き出しが 318→266px まで痩せ、ドライブの ATTENTION が1行増える。
         中に浮かせれば、幅を譲るのは×の高さ（28px）に掛かる行だけで、
         ラベルの行の右余白に収まる。下の行は満幅に戻る。
         手書きの×（settings_wire）があれば作り直さず、同じ位置へ移す。 */
      /* .hint-inline は吹き出しの箱を持たないので、行そのものを本文として扱い、
         ×は行の右端に置く（中に float すると中央寄せの一言がずれる）。 */
      var say = el.classList.contains('hint-inline');
      var bubble = say ? el : el.querySelector(':scope > div, :scope > p');
      if (!bubble) continue;

      var id = keyOf(el, bubble);
      if (remembers(el) && seen[id]) { el.style.display = 'none'; continue; }

      /* 手書きの×は el 直下（settings_wire）か吹き出し直下にしか無い。
         request_wire の素材チップ（.ref > .x）まで拾わないよう、深追いしない。 */
      var btn = el.querySelector(':scope > .x') || bubble.querySelector(':scope > .x');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'x';
        btn.appendChild(icon());
      }
      btn.setAttribute('aria-label', '閉じる');
      /* カード化したので、× は本文の中ではなくカード直下に置く（フレックスの右端） */
      el.appendChild(btn);

      btn.addEventListener('click', (function (box, key) {
        return function (e) {
          e.stopPropagation();
          box.style.display = 'none';
          if (remembers(box)) { var m = load(); m[key] = 1; save(m); }
        };
      })(el, id));
    }
  }

  /* 消したものを出し直す。ワイヤーの確認用（コンソールから叩く）。
     製品では設定画面の「案内をまた表示する」がこれを呼ぶ。 */
  window.hintReset = function () {
    try { localStorage.removeItem(KEY); } catch (e) { /* noop */ }
    location.reload();
  };

  /* 後から差し込まれる箱も拾う。カレンダーの「予約しました」や投稿ごとの講評は
     ページを開いた時点ではまだ無く、押したときにHTMLごと書き換えられて出てくる。 */
  function watch() {
    if (!window.MutationObserver) return;
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].addedNodes.length) { init(); return; }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function start() { init(); watch(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
