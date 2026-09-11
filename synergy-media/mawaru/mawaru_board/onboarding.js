/**
 * onboarding.js — はじめの設定（チュートリアル）
 *
 * 使い方: 各画面で <script src="./onboarding.js"></script> を1行足すだけ。
 *   サイドバー（.foot の手前）にタスク一覧を自分で差し込む。
 *   全部終わるまで常駐し、終わったら消える。
 *
 * 設計の根拠（一般的なオンボーディングの知見に合わせている）:
 *   - ステップは3〜5に収める。3ステップの完了率72%に対し7ステップは16%まで落ちる。
 *     → 粗い4タスク。入力欄ごとに割らず、欄の細かさは飛んだ先の画面に持たせる
 *   - 読ませるのではなくやらせる。専用の練習画面は作らず、本物の画面で本物を書かせる
 *   - 押した項目がどこか分かるように、飛んだ先でカードを光らせる（settings_wire の pjGo）
 *   - 完了条件は「画面を開いた」ではなく「そのフローを1回通した」に置く
 *
 * 状態は localStorage に置く。ワイヤーはページを跨ぐと変数が消えるため。
 *
 * 色とアイコンはこのファイルで完結させる。読み込み先によって :root のトークンも
 * .ti-* の字形宣言も揃っていないので、var() には既定値を書き、アイコンはSVGで持つ。
 * （--color-destructive-border が無い画面で丸印が消えていた）
 * 初心者マークだけは既製アセット assets/beginner-mark.svg を参照する（標章なので
 * 手で描き起こさない。出典とライセンスはそのファイルのコメントに書いてある）。
 */
(function () {
  /* タスクの構成を変えたら上げる。旧版の保存データを引きずると、
     消えた task の済みが残ったり、無い欄を触って落ちたりする。 */
  var KEY = 'mawaru.onboarding.v2';

  /* タスクの定義。
     粗い単位で持つ。「増やしたいものを決める」「お客様の悩みを書く」のように
     入力欄ごとに割ると、一覧が作業メモになって全体像が見えない。
     欄の細かさは飛んだ先の画面が持っているので、ここは「何を覚えるか」で切る。
     中に部品がある task は sub に総数を書くと「2/4」がその行に出る（行は増やさない）。

     順番は「決める → つなぐ → 作る」。何のために出すかが無いまま投稿を作らせても
     説明文しか出てこないので、コンセプトを先頭に置く。 */
  var TASKS = [
    { k:'concept', t:'運用のコンセプトを決める', sub:4, to:'./settings_wire.html?task=concept#project' },
    { k:'sns',     t:'SNSをつなぐ',              to:'./settings_wire.html?task=sns#sns' },
    { k:'post',    t:'投稿を作ってみる',          to:'./flow_video_script_wire.html' },
    /* 動画エディタは「動画ができたあと」に開く画面で、単独の入口が無い。
       ./video_editor_dark_wire.html へ直リンクすると、製品に存在しない導線を
       チュートリアルが教えることになる（ワイヤーに見本データがあるので開けてしまうだけ）。
       素材ルートの終わりがエディタなので、そこを通す。 */
    { k:'video',   t:'動画を編集してみる',        to:'./flow_video_material_wire.html' }
  ];

  /* progress は task ごとの途中経過（例 concept:2 = 4つのうち2つ済み）。
     保存データをそのまま返すと、欄が足りない形（旧版・手で壊れた値）で
     st.progress[k] を触った瞬間に落ちる。既定の型に必ず流し込む。 */
  function load() {
    var st = { done: [], progress: {}, welcomed: false, celebrated: false, hidden: false };
    var v = null;
    try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* 壊れていたら既定 */ }
    if (v && typeof v === 'object') {
      /* いま定義されている task のキーだけ拾う。消した task の済みは持ち越さない */
      if (Array.isArray(v.done)) {
        st.done = v.done.filter(function (k) {
          return TASKS.some(function (x) { return x.k === k; });
        });
      }
      if (v.progress && typeof v.progress === 'object') st.progress = v.progress;
      st.welcomed = !!v.welcomed;
      st.celebrated = !!v.celebrated;
      st.hidden = !!v.hidden;
    }
    return st;
  }
  /* 画面ボードからの確認表示（?ob=finish）のときは保存しない。
     見ただけで本物の進捗が「完了」に変わってしまうため。 */
  var PREVIEW = false;
  function save(st) {
    if (PREVIEW) return;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }

  /* 共有部品なので、アイコンもページ側の .ti-* 宣言に頼らない。
     字形コードは各ファイルが自前で宣言していて、入っていない画面ではチェックが
     出ない（実際に消えていた）。インラインSVGなら読み込み先を問わず必ず出る。 */
  var SVG_CHECK =
    '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" ' +
    'stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12.5l5 5 9-11"/></svg>';

  var st = load();
  var isDone = function (k) { return st.done.indexOf(k) >= 0; };
  var left = function () { return TASKS.filter(function (x) { return !isDone(x.k); }).length; };

  /* ---------- 見た目 ---------- */
  function injectCss() {
    if (document.getElementById('ob-css')) return;
    var css = [
      /* サイドバーの中に置くので、面はサイドバーより一段明るくして浮かせる */
      '.ob{margin:10px;padding:12px 13px;background:var(--color-card, #ffffff);border:1px solid var(--color-border, #efe7df);border-radius:var(--radius-md);}',
      '.ob-hd{display:flex;align-items:center;gap:8px;margin-bottom:9px;}',
      '.ob-hd .t{font-size:var(--text-label);font-weight:var(--font-weight-body-strong);}',
      /* 初心者マーク。ここが入門者向けの場所だと一目で分かるようにする。
         既製アセット（assets/beginner-mark.svg）なので色はファイル側が持つ */
      '.ob-hd .lf{flex:none;width:16px;height:16px;display:block;}',
      '.ob-fin svg{flex:none;}',
      /* 残り数は必須の未完了なので赤（DESIGN.md: 必須・未入力は destructive で一貫させる） */
      '.ob-hd .n{margin-left:auto;font-size:var(--text-meta);font-weight:var(--font-weight-body-strong);color:var(--color-destructive, #e90c2a);}',
      '.ob-bar{height:5px;border-radius:999px;background:var(--color-border, #efe7df);overflow:hidden;margin-bottom:10px;}',
      '.ob-bar i{display:block;height:100%;background:var(--color-primary, #fe7235);border-radius:999px;transition:width .3s;}',
      '.ob-li{display:flex;align-items:center;gap:8px;width:100%;padding:6px 6px;border:none;background:none;',
      '  font-family:inherit;font-size:var(--text-meta);color:var(--color-foreground, #2a2826);text-align:left;',
      '  border-radius:var(--radius-sm);cursor:pointer;text-decoration:none;}',
      '.ob-li:hover{background:var(--color-primary-subtle, #fff5f1);color:var(--color-primary, #fe7235);}',
      '.ob-li .mk{width:16px;height:16px;flex:none;border-radius:999px;border:2px dashed var(--color-destructive-border, #ffd0d8);',
      '  display:flex;align-items:center;justify-content:center;font-size:11px;}',
      '.ob-li.done{color:var(--color-muted-foreground, #757575);cursor:default;}',
      '.ob-li.done:hover{background:none;color:var(--color-muted-foreground, #757575);}',
      '.ob-li.done .mk{border:none;background:var(--color-success, #008a24);color:#fff;}',
      '.ob-li.done .tx{text-decoration:line-through;}',
      '.ob-li .tx{flex:1;min-width:0;}',
      /* task の中の進み具合。行を増やさずここだけで示す */
      '.ob-li .sub{flex:none;font-size:var(--text-meta);font-weight:var(--font-weight-body-strong);color:var(--color-muted-foreground, #757575);}',
      '.ob-li:hover .sub{color:var(--color-primary, #fe7235);}',
      /* 終わったときだけ出す。祝って消える導線を置く */
      '.ob.fin .ob-hd .n{color:var(--color-success, #008a24);}',
      '.ob-fin{display:flex;align-items:center;gap:7px;font-size:var(--text-meta);color:var(--color-success, #008a24);font-weight:var(--font-weight-body-strong);margin-bottom:8px;}',
      '.ob-close{width:100%;padding:7px;border:1px solid var(--color-border-strong, #ddd0c4);background:var(--color-card, #ffffff);',
      '  color:var(--color-foreground, #2a2826);border-radius:var(--radius-sm);font-family:inherit;font-size:var(--text-meta);',
      '  font-weight:var(--font-weight-body-strong);cursor:pointer;}',
      '.ob-close:hover{border-color:var(--color-primary, #fe7235);color:var(--color-primary, #fe7235);}',
      /* ---- 最初の1枚だけ出すダイアログ。ツアーは作らない（長いツアーは完了しない） ---- */
      '.ob-ovl{position:fixed;inset:0;background:rgba(0,0,0,.5);display:none;align-items:center;justify-content:center;z-index:300;padding:20px;}',
      '.ob-ovl.open{display:flex;}',
      '.ob-dlg{background:var(--color-card, #ffffff);border-radius:var(--radius-xl);box-shadow:0 8px 24px rgb(0 0 0 / .14);width:min(460px,100%);padding:26px 26px 22px;text-align:center;}',
      '.ob-dlg img{width:84px;height:84px;object-fit:contain;margin-bottom:12px;}',
      '.ob-dlg .t{font-size:var(--text-h2);font-weight:var(--font-weight-h2);margin-bottom:8px;}',
      '.ob-dlg .d{font-size:var(--text-body);color:var(--color-muted-foreground, #757575);line-height:1.9;margin-bottom:18px;}',
      '.ob-dlg .go{width:100%;padding:12px;border:none;background:var(--color-primary, #fe7235);color:#fff;border-radius:var(--radius-md);',
      '  font-family:inherit;font-size:var(--text-body);font-weight:var(--font-weight-body-strong);cursor:pointer;}',
      '.ob-dlg .later{margin-top:9px;background:none;border:none;color:var(--color-muted-foreground, #757575);font-family:inherit;',
      '  font-size:var(--text-label);cursor:pointer;text-decoration:underline;}',
      /* ---- SPでは一覧を出さない ----
         SPのサイドバー（shell-sp.css）は高さ60pxの下部ナビに変わる。そこへこの箱が
         居座ると、7項目で分け合っている幅を110px奪って「投稿」「カレンダー」の
         ラベルが重なる（実測）。縦に積む場所がないので、SPでは箱ごと下げる。
         最初の1枚のダイアログと画面ごとの案内（tour.js）はSPでも出るので、
         入門者が何をすればいいか分からなくなることはない。 */
      '@media(max-width:768px){.ob{display:none;}}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'ob-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- サイドバーのタスク一覧 ---------- */
  function render() {
    var host = document.getElementById('obBox');
    if (!host) return;
    var n = left();
    var pct = Math.round((TASKS.length - n) / TASKS.length * 100);

    /* 中身を空にするだけだと .ob の枠・余白・背景が残って、
       サイドバーに空の白い箱が居座る。要素ごと外す。 */
    if (st.hidden) { host.remove(); return; }

    var rows = TASKS.map(function (x) {
      var d = isDone(x.k);
      var mark = d ? '<span class="mk">' + SVG_CHECK + '</span>' : '<span class="mk"></span>';
      /* 中に部品がある task は、その行に「2/4」だけ出す。行は増やさない */
      var sub = '';
      if (x.sub && !d) {
        var p = st.progress[x.k] || 0;
        sub = '<span class="sub">' + p + '/' + x.sub + '</span>';
      }
      /* 済みは押せない。押しても同じ画面に飛ぶだけで、できたことが取り消せるように見える */
      return d
        ? '<div class="ob-li done">' + mark + '<span class="tx">' + x.t + '</span></div>'
        : '<a class="ob-li" href="' + x.to + '">' + mark + '<span class="tx">' + x.t + '</span>' + sub + '</a>';
    }).join('');

    host.className = 'ob' + (n === 0 ? ' fin' : '');
    host.innerHTML =
      '<div class="ob-hd"><img class="lf" src="./assets/beginner-mark.svg" alt="" title="はじめての方向け">' +
      '<span class="t">はじめの設定</span>' +
      '<span class="n">' + (n ? '残り' + n : '完了') + '</span></div>' +
      '<div class="ob-bar"><i style="width:' + pct + '%"></i></div>' +
      (n === 0 ? '<div class="ob-fin">' + SVG_CHECK + 'すべて終了しました</div>' : '') +
      rows +
      (n === 0 ? '<button class="ob-close" onclick="MawaruOnboarding.hide()">閉じる</button>' : '');
  }

  /* このチュートリアルを出していい画面か。サイドバーの .foot を唯一の目印にする。
     `.foot` 単独への逃げ道は持たない。投稿フロー（flow_*_wire）にサイドバーは無く、
     そこの `.foot` は画面下の「戻る／次へ」バーなので、逃げると横長の箱が投稿画面の
     真下に居座って作業の邪魔になる。出す場所が無い画面では箱もダイアログも出さない
     （完了の記録は complete() 側でやるので、読み込み自体は要る）。 */
  function sidebarFoot() {
    var foot = document.querySelector('.sb .foot');
    return (foot && foot.parentElement) ? foot : null;
  }

  /* サイドバーの一番下（アカウント切替の手前）に箱を作る。
     .nav の中に入れるとスクロールで流れて見えなくなるので、.foot の手前に置く。 */
  function mount() {
    /* 終わって下げたあとは作らない。作ってから消すと一瞬だけ箱が見える */
    if (st.hidden) return;
    if (document.getElementById('obBox')) return;
    var foot = sidebarFoot();
    if (!foot) return;
    var box = document.createElement('div');
    box.id = 'obBox';
    box.className = 'ob';
    foot.parentElement.insertBefore(box, foot);
    render();
  }

  /* ---------- 最初の1枚 ---------- */
  function welcome() {
    if (st.welcomed || st.hidden || left() === 0) return;
    /* 出す場所は箱と揃える。投稿フロー（サイドバーが無い画面）は作業中なので、
       そこで被せると1枚目の選択の前に手が止まる。サイドバーがある画面まで待てば、
       welcomed を立てないまま持ち越されるので案内が消えるわけではない。 */
    if (!sidebarFoot()) return;
    var ovl = document.createElement('div');
    ovl.className = 'ob-ovl open';
    ovl.id = 'obOvl';
    ovl.innerHTML =
      '<div class="ob-dlg" role="dialog" aria-modal="true" aria-label="はじめの設定">' +
      '<img src="./assets/mawaru-fox-sit.png" alt="">' +
      '<div class="t">はじめに、投稿の狙いを決めます</div>' +
      '<div class="d">AIは<b>ここで決めたこと</b>をもとに投稿を書きます。<br>' +
      '4つ決めるだけで、説明文ではなく狙いのある投稿になります。</div>' +
      '<button class="go" onclick="MawaruOnboarding.start()">はじめる（残り' + left() + '）</button>' +
      '<button class="later" onclick="MawaruOnboarding.later()">あとでやる</button>' +
      '</div>';
    document.body.appendChild(ovl);
  }

  /* ---------- 終わったときの1枚 ---------- */
  /* 一度出したら二度は出さない。ページを開くたびに祝われると邪魔になる。 */
  function finish() {
    if (st.celebrated) return;
    st.celebrated = true; save(st);
    var ovl = document.createElement('div');
    ovl.className = 'ob-ovl open';
    ovl.id = 'obFinOvl';
    ovl.innerHTML =
      '<div class="ob-dlg" role="dialog" aria-modal="true" aria-label="完了">' +
      '<img src="./assets/mawaru-fox-celebrate.png" alt="">' +
      '<div class="t">すべてのチュートリアルタスクが<br>終了しました</div>' +
      '<div class="d">AIが<b>狙いのある投稿</b>を書けるようになりました。</div>' +
      '<button class="go" onclick="MawaruOnboarding.closeFinish()">はじめる</button>' +
      '</div>';
    document.body.appendChild(ovl);
  }

  /* ---------- 外に出すAPI ---------- */
  window.MawaruOnboarding = {
    /* 各画面の保存処理から呼ぶ。済みにして表示を更新する */
    complete: function (k) {
      if (!isDone(k)) { st.done.push(k); save(st); }
      render();
      /* 最後の1つが終わった瞬間に祝う。トーストは出さない（ダイアログと二重になる）。
         動画エディタのようにサイドバーが無い画面で終わることもあるので、
         ウィジェットの有無に関係なく出せるようにしてある。 */
      if (left() === 0) finish();
    },
    /* 部品がある task の途中経過。総数に届いたら自動で済みにする。
       呼び出し側に「あと何個で完了か」を計算させない（画面ごとにズレる） */
    progress: function (k, n) {
      var task = TASKS.filter(function (x) { return x.k === k; })[0];
      if (!task) return;
      st.progress[k] = n;
      save(st);
      if (task.sub && n >= task.sub) { window.MawaruOnboarding.complete(k); return; }
      render();
    },
    /* いま何が残っているか。呼び出し側で分岐したいとき用 */
    left: left,
    isDone: isDone,
    start: function () {
      st.welcomed = true; save(st);
      var next = TASKS.filter(function (x) { return !isDone(x.k); })[0];
      location.href = next ? next.to : './settings_wire.html#project';
    },
    later: function () {
      st.welcomed = true; save(st);
      var o = document.getElementById('obOvl'); if (o) o.remove();
    },
    hide: function () { st.hidden = true; save(st); render(); },
    /* 祝ったあとはサイドバーからも下げる。終わったタスク一覧を置いておく意味がない */
    closeFinish: function () {
      var o = document.getElementById('obFinOvl'); if (o) o.remove();
      st.hidden = true; save(st); render();
    },
    /* 動作確認用。コンソールから最初の状態に戻せる */
    reset: function () { localStorage.removeItem(KEY); location.reload(); }
  };

  /* ?ob=finish で終わりのダイアログだけ出す。画面ボードから確認するための入口。
     4タスク消化しないと見られないと、確認のたびに全部やり直すことになる。
     状態は書き換えない（celebrated を立てない）ので、何度開いても同じものが出る。 */
  function preview() {
    if (new URLSearchParams(location.search).get('ob') !== 'finish') return false;
    PREVIEW = true;
    st.done = TASKS.map(function (x) { return x.k; });   /* 一覧も完了の見た目にする */
    st.celebrated = false;
    render();
    finish();
    return true;
  }

  function init() {
    injectCss();
    mount();
    if (preview()) return;   /* 確認用のときは初回案内を出さない */
    welcome();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
