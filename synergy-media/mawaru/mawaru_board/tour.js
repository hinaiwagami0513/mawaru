/**
 * tour.js — 画面ごとの使い方案内（スポットライト）
 *
 * 使い方: 各画面で <script src="./tour.js"></script> を1行足すだけ。
 *   その画面を初めて開いたときだけ、押すべきところを残して他を暗くし、
 *   吹き出しで説明する。押すと次へ進む。2回目以降は出ない。
 *
 * 設計の根拠:
 *   - 読ませるのではなく押させる。手を動かした操作だけが残るので、
 *     既定の送りは「次へ」ボタンではなく本物のクリックにしてある（next:'tap'）。
 *     見るだけの箇所（一覧・グラフなど押しても何も起きない場所）は next:'read'。
 *   - 1画面2〜3ステップに収める。コーチマークは step が増えるほど離脱する。
 *     画面の全部を教えず「その画面で最初にやること」だけに絞る。
 *   - いつでも抜けられる。逃げ道の無いツアーは操作不能と区別が付かない。
 *     スキップ（この画面だけ）と、案内そのものを止める導線を両方置く。
 *
 * 状態は localStorage に置く。ワイヤーはページを跨ぐと変数が消えるため。
 * onboarding.js（サイドバーの「はじめの設定」）とは別物で、こちらは
 * 「いま開いている画面の使い方」だけを担当する。両方が同時に出ると
 * 暗幕が二重になるので、onboarding のダイアログが消えるまで待つ。
 *
 * 色は var() に既定値を書く。読み込み先によって :root のトークンが
 * 揃っていない画面があり、変数だけだと色が消える（onboarding.js と同じ事情）。
 */
(function () {
  /* 手順の構成を変えたら上げる。旧版の「見た」が残ると、
     作り直した案内が誰にも出ないまま終わる。 */
  var KEY = 'mawaru.tour.v1';

  /* ページ内容より上、トーストより下。
     ページ側の最大が 10000、select/日付ポップオーバーが 3000、
     sonner のトーストが 999999998。その間に入れる。 */
  var Z = 20000;

  /* 穴の余白。要素にぴったり合わせると窮屈で、光っているのが
     どの部品なのか（枠線なのか中身なのか）が読み取りにくい。 */
  var PAD = 6;

  /* ==========================================================================
     手順の定義
     ページ名（ファイル名から .html を取ったもの）→ ステップ配列

     step:
       el    セレクタ。複数書くと最初に見つかったものを使う（画面差の吸収用）
       to    ここまでをひと続きで囲む（省略可）。タブの帯のように、器は画面幅いっぱいだが
             中身は左に寄っている場合、器を囲むと空白まで光って何が対象か読めない。
             端から端の要素を指定して、中身にぴったり合った穴を開ける
       t     吹き出しの見出し（体言止め・8文字前後。長いと右肩の「1/3」と喧嘩する）
       d     説明。1〜2文。ここで操作の目的を書く（何が起きるかではなく何のためか）
       next  'tap'  = その要素を実際に押したら次へ（既定）
             'read' = 押せない箇所。「次へ」ボタンで送る
       at    吹き出しの向き 'auto'（既定） / 'top' / 'bottom' / 'left' / 'right'
     ========================================================================== */
  var TOURS = {};

  /* --- ホーム ------------------------------------------------------------ */
  TOURS.shell_header_sidebar_wire = [
    { el: ['.sb .nav', '.sb'], t: 'ここが入口', at: 'right', next: 'read',
      d: 'マワルの画面はすべてこの列から開きます。迷ったらここに戻ってきてください。' },
    { el: '.db-stats', t: '今の状況', next: 'read',
      d: '下書きが何件あるか、予約がいつ入っているかがひと目で分かります。<b>数字は押せます</b>。' },
    { el: '.db-cta', t: 'まずは1本作る', next: 'tap',
      d: '投稿はここから作ります。AIが下書きまで書くので、空白から始めることはありません。' }
  ];

  /* --- 投稿一覧 ---------------------------------------------------------- */
  TOURS.post_list_wire = [
    { el: '.tab[data-tab="draft"]', to: '.tab[data-tab="posted"]', t: '状態で分かれる', next: 'read',
      d: '作りかけは<b>下書き</b>、日付が決まったものは<b>予約済み</b>に入ります。出したあとは投稿済みへ移ります。' },
    { el: '.filterbar', t: '絞り込み', next: 'read',
      d: 'SNSや状態で絞れます。数が増えてから使うところなので、今は場所だけ覚えてください。' },
    { el: '.pcard-plan', t: '投稿日を決める', next: 'tap',
      d: '下書きは日付を入れて初めて予約になります。押すと日時を選ぶ画面が出ます。' }
  ];

  /* --- カレンダー -------------------------------------------------------- */
  TOURS.calendar_wire = [
    { el: '.tb .seg', t: '表示を変える', next: 'read',
      d: '月・週・日で切り替わります。<b>日</b>にすると、その日の時間帯ごとの予定まで見えます。' },
    { el: '.traybtn', t: '日付が未定のもの', next: 'tap',
      d: 'まだ日を決めていない投稿がここに溜まります。押して開き、カレンダーに置いてください。' },
    { el: '.tb .btn-p', t: 'その場で作る', next: 'tap',
      d: '空いている日を埋めたいときは、ここから直接作れます。' }
  ];

  /* --- 分析（5枚とも同じ枠を持つので手順を共有する） ---------------------- */
  var ANALYSIS = [
    { el: '.acct-hd', t: 'どのアカウントか', next: 'read',
      d: 'ここに出ているアカウントの数字を見ています。複数つないでいるなら<b>切替</b>で見比べられます。' },
    { el: '.tab-nav a:first-child', to: '.tab-nav a:last-child', t: 'レポートは3種類', next: 'read',
      d: '画像で見る<b>ビジュアル</b>、全体の推移を見る<b>アカウント</b>、1本ずつ見る<b>投稿</b>に分かれています。' },
    { el: '.tab-nav a:not(.active)', t: '別のレポートへ', next: 'tap',
      d: '同じ期間の数字を、別の切り口で見られます。押して移動してみてください。' }
  ];
  ['analysis_visual_wire', 'analysis_posts_wire',
   'analysis_account_wire', 'analysis_metrics_wire'].forEach(function (k) { TOURS[k] = ANALYSIS; });

  /* AIレポートだけは共通の案内を使わない。他の分析画面が「数字を見る」場所なのに対し、
     ここは「AIが読んで、何をすべきかを出す」場所で、覚えることが違う。 */
  TOURS.analysis_report_wire = [
    { el: '.sub-tab:first-child', to: '.sub-tab:last-child', t: 'レポートは4つ', next: 'read',
      d: 'AIが出した<b>改善点</b>から始まります。数字の裏づけは分析概要とコンテンツ、持ち出しは出力です。' },
    /* 表示中のタブの中から拾う。隠れているタブにも .sl-actions はあるので、
       セレクタだけだと 1枚目ではなく別タブの改善案を光らせてしまう */
    { el: '.carousel-track:not([style*="none"]) .sl-actions', t: '来月やること', next: 'read',
      d: 'まずこの3つだけやれば十分です。ここで出た改善案は、投稿を作るときの台本に自動で反映されます。' },
    { el: '.sub-tab:last-child', t: '持ち出す', next: 'tap',
      d: '画像・PDF・テキストで書き出せます。押して中身を見てください。' }
  ];

  /* --- ドライブ ---------------------------------------------------------- */
  TOURS.drive_wire = [
    { el: ['.tr.on', '.tr'], t: 'フォルダ', at: 'right', next: 'read',
      d: '写真も動画も、ここに入れておくと投稿を作るときにそのまま呼び出せます。' },
    { el: '.chip[data-k="img"]', t: '種類で絞る', next: 'tap',
      d: '画像だけ・動画だけを表示できます。素材が増えてから効いてきます。' },
    { el: '.btn-p', t: '素材を入れる', next: 'tap',
      d: 'まずは撮った写真を何枚か入れてみてください。AIはここにある素材から選びます。' }
  ];

  /* --- 設定 -------------------------------------------------------------- */
  TOURS.settings_wire = [
    { el: '#ptFact', to: '#ptConcept', t: '設定は2種類', next: 'read',
      d: '<b>お店の事実</b>は変わらない情報、<b>運用のコンセプト</b>は投稿の狙いです。AIは両方を読んで書きます。' },
    { el: ['.pj.must', '#pj-goal'], t: '赤い印は未入力', next: 'read',
      d: '印が付いている項目が埋まるまで、AIは狙いのない説明文しか書けません。ここから埋めてください。' },
    { el: '#navSns', t: 'つないで初めて出せます', at: 'right', next: 'tap',
      d: '書いた投稿を実際に出すにはSNSの接続が要ります。押して設定に進めます。' }
  ];

  /* --- NEWS -------------------------------------------------------------- */
  TOURS.news_wire = [
    { el: '.nw-chip[data-f="unread"]', t: '未読だけ見る', next: 'tap',
      d: '新しく増えた機能や、メンテナンスの予定が届きます。まず未読だけ見るのが早いです。' },
    { el: '.nw-item', t: '開いて読む', next: 'tap',
      d: '押すと本文が開きます。読んだものは自動で既読になります。' }
  ];

  /* --- チャット ---------------------------------------------------------- */
  /* SPは一覧とトークが別画面なので、一覧にある .newgrp を「開く」より前に置く。
     後ろに置くと、トークへ入った時点で .newgrp が隠れて find() に拾われず、
     SPだけ最後の1歩が丸ごと落ちていた（PCは3歩とも常時見えているので順番は自由）。
     文言も「右に本文が出ます」をやめる。SPでは右ではなく全画面で開く。 */
  TOURS.chat_wire = [
    { el: '.newgrp', t: '相談の場を分ける', next: 'read',
      d: '案件ごとにグループを作ると、後から探しやすくなります。' },
    { el: '#convList .conv', t: 'やり取りを開く', at: 'right', next: 'tap',
      d: 'チームやサポートとのやり取りがここに並びます。押すと中身が開きます。' },
    { el: '#cinput', t: 'ここに書く', next: 'read',
      d: '書いて送信を押すだけです。<b>ドライブから</b>で、素材をそのまま渡せます。' }
  ];

  /* --- 広告（一覧 → 作成の入口まで通す） --------------------------------- */
  TOURS.ads_wire = [
    { el: 'button[onclick*="s1"]', t: '広告を作る', next: 'tap',
      d: '作った投稿をそのまま広告に回せます。押して始めてみてください。' },
    { el: '.goal', t: 'まず目的を決める', next: 'tap',
      d: '知ってもらいたいのか、来店してほしいのか。ここで選んだものに合わせて出し方が変わります。' },
    { el: 'button[onclick*="s2"]', t: '次へ', next: 'tap',
      d: 'このあと、届ける相手と予算を決めます。途中でやめても下書きに残ります。' }
  ];

  /* --- 依頼（発注相談 / 出張撮影） --------------------------------------- */
  TOURS.request_wire = [
    { el: '#tabOrder', t: '依頼は2種類', next: 'read',
      d: '作るものを相談する<b>発注相談</b>と、撮りに来てもらう<b>出張撮影</b>があります。' },
    { el: '#tabShoot', t: '切り替える', next: 'tap',
      d: '素材そのものが足りないときは、こちらです。押して中身を見てください。' },
    { el: 'button[onclick*="send"]', t: '最後に送る', next: 'read',
      d: '埋めたらここから送ります。金額が決まってから作業が始まるので、押しただけでは費用は出ません。' }
  ];

  /* --- プラン ------------------------------------------------------------ */
  TOURS.plan_wire = [
    { el: '#paPlan .btn-g', t: '支払いの変更', next: 'read',
      d: 'カードの変更や請求書の確認はここからです。' },
    { el: '.btn-p', t: 'プランを上げる', next: 'read',
      d: '作れる本数やつなげるSNSの数が増えます。日割りで、いつ変えても損はしません。' }
  ];

  /* --- 投稿作成フロー（5本とも入口が同じなので手順を共有する） ------------ */
  var FLOW = [
    { el: '#stepbar', t: 'いま何番目か', next: 'read',
      d: '作成は数ステップで終わります。<b>戻る</b>でいつでも前に戻れるので、迷ったら進んでみてください。' },
    { el: '#sc_sns .opt.acct', t: 'どこに出すか選ぶ', next: 'tap',
      d: '選んだSNSに合わせて、長さも書き方もAIが変えます。あとから変えられます。' },
    { el: '#next', t: '次へ', next: 'tap',
      d: '選んだら進みます。以降も同じで、選んで次へを繰り返すだけです。' }
  ];
  ['flow_video_script_wire', 'flow_video_material_wire', 'flow_image_v3_wire',
   'flow_image_material_wire', 'flow_manual_wire'].forEach(function (k) { TOURS[k] = FLOW; });

  /* --- 投稿の仕上げ ------------------------------------------------------ */
  TOURS.post_editor_image_wire = [
    { el: '.ed-xtab:first-of-type', to: '.ed-xtab:last-of-type', t: '本文まわり', next: 'read',
      d: 'AIが書いた本文・ハッシュタグ・設定がタブで分かれています。直したいところだけ開いてください。' },
    { el: '#next', t: '進む', next: 'tap',
      d: '直し終わったらここから。日付を決めれば予約、決めなければ下書きのまま残ります。' }
  ];

  /* --- 動画エディタ ------------------------------------------------------ */
  TOURS.video_editor_dark_wire = [
    { el: '.tools', t: '左が道具', at: 'right', next: 'read',
      d: 'テキスト・図形・音声・フィルター。押すと左に設定が出て、その場で足せます。' },
    { el: ['#tlToolbar', '.tl-toolbar'], t: '下が時間の並び', next: 'read',
      d: '動画の順番と長さをここで決めます。<b>+</b> から、空いている区間に画像を足せます。' },
    { el: '.hdbtn-lbl', t: '通して見る', next: 'tap',
      d: '書き出す前に必ず一度通してください。テロップの出るタイミングはここでしか分かりません。' }
  ];

  /* --- 画像エディタ ------------------------------------------------------ */
  TOURS.image_editor_dark_wire = [
    { el: '.tools', t: '左が道具', at: 'right', next: 'read',
      d: 'AI生成・テキスト・素材・調整。上から順に、作る → 足す → 整えるの並びです。' },
    { el: '.tool[onclick*="rp-text"]', t: '文字を足す', next: 'tap',
      d: '画像の中の文字はここから。押して、左に出る設定を見てみてください。' },
    { el: '#saveBtn', t: '投稿にもどる', next: 'read',
      d: '編集中は自動保存されています。終わったらここから投稿の画面にもどります。' }
  ];

  /* ==========================================================================
     ここから下は仕組み。手順を足すときに触る必要はない
     ========================================================================== */

  function load() {
    var st = { seen: [], off: false };
    var v = null;
    try { v = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* 壊れていたら既定 */ }
    if (v && typeof v === 'object') {
      if (Array.isArray(v.seen)) st.seen = v.seen.filter(function (k) { return typeof k === 'string'; });
      st.off = !!v.off;
    }
    return st;
  }
  function save(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }

  var st = load();

  /* いま開いている画面の名前。index/空パスは board 扱いにする */
  function pageKey() {
    var f = location.pathname.split('/').pop() || '';
    return f.replace(/\.html$/, '') || 'board';
  }

  /* アイコンはインラインSVGで持つ。.ti-* の字形宣言は画面ごとにバラバラで、
     入っていない画面では記号が消える（onboarding.js で実際に消えていた）。 */
  var SVG_NEXT =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
    'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M9 6l6 6-6 6"/></svg>';
  var SVG_TAP =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M8 11V5.5a1.5 1.5 0 0 1 3 0V11V8.5a1.5 1.5 0 0 1 3 0V11v-1a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1 3 0v4a6 6 0 0 1-6 6h-1.5a5 5 0 0 1-4-2l-3-4a1.6 1.6 0 0 1 2.4-2.1L8 12"/></svg>';

  function injectCss() {
    if (document.getElementById('tr-css')) return;
    var css = [
      /* 暗幕は4枚に割って、穴の部分にだけ要素を置かない。
         box-shadow で1枚に抜くやり方だと穴もクリックを吸ってしまい、
         「実際に押して進む」が成立しない。4枚なら穴だけ素通りする。 */
      '.tr-dim{position:fixed;background:rgb(0 0 0 / .62);z-index:' + Z + ';}',
      /* 光っている枠。見せるだけなので絶対にクリックを奪わない */
      '.tr-ring{position:fixed;z-index:' + (Z + 1) + ';pointer-events:none;border-radius:var(--radius-md, 10px);',
      '  box-shadow:0 0 0 2px var(--color-primary, #2E5AB0), 0 0 0 7px rgb(254 114 53 / .3);}',
      '.tr-ring.pulse{animation:tr-pulse 1.7s ease-out infinite;}',
      '@keyframes tr-pulse{0%{box-shadow:0 0 0 2px var(--color-primary, #2E5AB0), 0 0 0 4px rgb(254 114 53 / .45);}',
      '  70%{box-shadow:0 0 0 2px var(--color-primary, #2E5AB0), 0 0 0 13px rgb(254 114 53 / 0);}',
      '  100%{box-shadow:0 0 0 2px var(--color-primary, #2E5AB0), 0 0 0 4px rgb(254 114 53 / 0);}}',
      /* 動きを減らす設定の人には光らせない。点滅は負担になる */
      '@media (prefers-reduced-motion: reduce){.tr-ring.pulse{animation:none;}}',

      '.tr-tip{position:fixed;z-index:' + (Z + 2) + ';width:min(300px, calc(100vw - 24px));',
      '  background:var(--color-card, #ffffff);color:var(--color-foreground, #2a2826);',
      '  border-radius:var(--radius-lg, 14px);box-shadow:0 10px 30px rgb(0 0 0 / .28);padding:15px 16px 13px;}',
      /* 中の部品名はすべて tr- で始める。.hd .t .d のような短い名前は
         読み込み先が別の意味で使っていて、そちらの規則を丸ごと浴びる。
         （動画エディタの .hd は暗い背景を持っていて、見出しが背景に沈んで消えていた）
         色も一つずつ指定する。継承任せだと、同じ理由で親の色に染まる。 */
      '.tr-tip .tr-hd{display:flex;align-items:center;gap:7px;margin-bottom:6px;',
      '  height:auto;padding:0;border:none;background:none;}',
      '.tr-tip .tr-lf{flex:none;width:15px;height:15px;display:block;}',
      /* min-width:0 が無いと、見出しが折り返さず右肩の「1/3」を押し出す */
      '.tr-tip .tr-t{min-width:0;font-size:var(--text-label, 14px);color:var(--color-foreground, #2a2826);',
      '  font-weight:var(--font-weight-body-strong, 700);}',
      /* 何ステップ中の何番目か。終わりが見えないと押す気にならない */
      '.tr-tip .tr-ct{flex:none;margin-left:auto;padding-left:6px;font-size:var(--text-meta, 12px);',
      '  color:var(--color-muted-foreground, #6E6A66);font-weight:var(--font-weight-body-strong, 700);}',
      '.tr-tip .tr-d{font-size:var(--text-meta, 12px);line-height:1.85;color:var(--color-muted-foreground, #6E6A66);}',
      '.tr-tip .tr-d b{color:var(--color-foreground, #2a2826);}',
      '.tr-tip .tr-ft{display:flex;align-items:center;gap:10px;margin-top:12px;}',
      /* 押して進む箇所では「次へ」を出さない。ボタンがあるとそっちを押して、
         本物の操作を覚えないまま終わる。代わりに何をすればいいかを書く */
      '.tr-tip .tr-hint{display:flex;align-items:center;gap:5px;font-size:var(--text-meta, 12px);',
      '  font-weight:var(--font-weight-body-strong, 700);color:var(--color-primary, #2E5AB0);}',
      '.tr-tip .tr-go{margin-left:auto;display:flex;align-items:center;gap:4px;padding:7px 13px;border:none;',
      '  background:var(--color-primary, #2E5AB0);color:#fff;border-radius:var(--radius-sm, 8px);',
      '  font-family:inherit;font-size:var(--text-meta, 12px);font-weight:var(--font-weight-body-strong, 700);cursor:pointer;}',
      '.tr-tip .tr-skip{background:none;border:none;padding:0;font-family:inherit;font-size:var(--text-meta, 12px);',
      '  color:var(--color-muted-foreground, #6E6A66);cursor:pointer;text-decoration:underline;}',
      '.tr-tip .tr-skip.r{margin-left:auto;}',
      /* 吹き出しの尻尾。向きは JS が class で決める */
      '.tr-tip .tr-ar{position:absolute;width:12px;height:12px;background:var(--color-card, #ffffff);transform:rotate(45deg);}',
      '.tr-tip.at-bottom .tr-ar{top:-6px;}',
      '.tr-tip.at-top .tr-ar{bottom:-6px;}',
      '.tr-tip.at-right .tr-ar{left:-6px;}',
      '.tr-tip.at-left .tr-ar{right:-6px;}',
      /* 案内そのものを止める導線。最後のステップだけ出す */
      '.tr-tip .tr-off{display:block;margin-top:9px;background:none;border:none;padding:0;font-family:inherit;',
      '  font-size:var(--text-meta, 12px);color:var(--color-muted-foreground, #6E6A66);cursor:pointer;text-decoration:underline;}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'tr-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- 実行中の状態 ---------- */
  var run = null;   /* { steps, i, el, nodes, raf, last } */

  function el(cls) {
    var d = document.createElement('div');
    d.className = cls;
    return d;
  }

  /* セレクタは配列でも文字列でも受ける。画面によって同じ部品の名前が違うため、
     候補を順に当てて最初に見つかった「見えている」ものを使う。
     display:none の候補を掴むと、暗幕だけ出て何も光らない。 */
  function find(sel) {
    var list = Array.isArray(sel) ? sel : [sel];
    for (var i = 0; i < list.length; i++) {
      var nodes = document.querySelectorAll(list[i]);
      for (var j = 0; j < nodes.length; j++) {
        var r = nodes[j].getBoundingClientRect();
        if (r.width > 0 && r.height > 0) return nodes[j];
      }
    }
    return null;
  }

  /* 4枚の暗幕・光る枠・吹き出しを、いまの要素の位置に合わせる。
     スクロールでもレイアウト変化でもズレないよう、rAF で毎フレーム見る。
     位置が変わったときだけ書き込む（毎フレーム style を触ると重い）。 */
  function place() {
    if (!run || !run.el) return;
    var r = run.el.getBoundingClientRect();
    /* to があれば、そこまでをひとつの穴にまとめる */
    if (run.toEl) {
      var r2 = run.toEl.getBoundingClientRect();
      var l = Math.min(r.left, r2.left), t = Math.min(r.top, r2.top);
      r = { left: l, top: t, width: Math.max(r.right, r2.right) - l, height: Math.max(r.bottom, r2.bottom) - t };
    }
    var sig = [r.top, r.left, r.width, r.height].join(',');
    if (sig === run.last) return;
    run.last = sig;

    var W = window.innerWidth, H = window.innerHeight;
    var x = r.left - PAD, y = r.top - PAD, w = r.width + PAD * 2, h = r.height + PAD * 2;
    var n = run.nodes;

    /* 上・下・左・右。左右は穴の高さぶんだけに絞る */
    n.top.style.cssText    = 'left:0;top:0;width:100%;height:' + Math.max(0, y) + 'px';
    n.bottom.style.cssText = 'left:0;top:' + (y + h) + 'px;width:100%;height:' + Math.max(0, H - y - h) + 'px';
    n.left.style.cssText   = 'left:0;top:' + y + 'px;width:' + Math.max(0, x) + 'px;height:' + h + 'px';
    n.right.style.cssText  = 'left:' + (x + w) + 'px;top:' + y + 'px;width:' + Math.max(0, W - x - w) + 'px;height:' + h + 'px';
    n.ring.style.cssText   = 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px';

    /* 吹き出し。下に置けなければ上、それも無理なら横。
       最後に画面の中へ押し戻す（端の要素で吹き出しが切れないように） */
    var tip = n.tip;
    var tw = tip.offsetWidth, th = tip.offsetHeight, gap = 12;
    var at = run.steps[run.i].at || 'auto';
    if (at === 'auto') {
      if (y + h + gap + th <= H - 8) at = 'bottom';
      else if (y - gap - th >= 8) at = 'top';
      else if (x + w + gap + tw <= W - 8) at = 'right';
      else at = 'left';
    }
    var tx, ty;
    if (at === 'bottom')      { tx = x + w / 2 - tw / 2; ty = y + h + gap; }
    else if (at === 'top')    { tx = x + w / 2 - tw / 2; ty = y - gap - th; }
    else if (at === 'right')  { tx = x + w + gap;        ty = y + h / 2 - th / 2; }
    else                      { tx = x - gap - tw;       ty = y + h / 2 - th / 2; }
    tx = Math.min(Math.max(8, tx), W - tw - 8);
    ty = Math.min(Math.max(8, ty), H - th - 8);
    tip.className = 'tr-tip at-' + at;
    tip.style.left = tx + 'px';
    tip.style.top = ty + 'px';

    /* 尻尾は穴の中心に向ける。吹き出しを押し戻したぶんだけ中でずらす */
    var ar = tip.querySelector('.tr-ar');
    if (at === 'bottom' || at === 'top') {
      ar.style.left = Math.min(Math.max(10, x + w / 2 - tx - 6), tw - 22) + 'px';
      ar.style.top = '';
    } else {
      ar.style.top = Math.min(Math.max(10, y + h / 2 - ty - 6), th - 22) + 'px';
      ar.style.left = '';
    }
  }

  function tick() {
    if (!run) return;
    place();
    run.raf = requestAnimationFrame(tick);
  }

  /* いま光らせている要素に付けたクリック待ち。
     次のステップへ移るときと終わるときに必ず外す。
     capture で拾うのは、押した先が preventDefault しても取りこぼさないため。 */
  function unbind() {
    if (run && run.onTap && run.el) {
      run.el.removeEventListener('click', run.onTap, true);
      run.onTap = null;
    }
  }

  function step(i) {
    if (!run) return;
    unbind();
    /* 見つからない要素は飛ばす。画面の状態（タブ・折りたたみ）で
       出ていないことがあり、そこで止まると暗いまま動かなくなる */
    var target = null;
    while (i < run.steps.length) {
      target = find(run.steps[i].el);
      if (target) break;
      i++;
    }
    if (i >= run.steps.length || !target) { finish(); return; }

    run.i = i;
    run.el = target;
    /* 見つからなければ el 単独の穴にする。to は見た目の調整なので、
       欠けても手順は成立する（ここで止める理由がない） */
    run.toEl = run.steps[i].to ? find(run.steps[i].to) : null;
    run.last = null;

    /* 画面の外にあるなら寄せる。寄せ終わる前に位置を測ると
       暗幕が一瞬ずれるが、rAF が毎フレーム直すので追いつく */
    var r = target.getBoundingClientRect();
    if (r.top < 60 || r.bottom > window.innerHeight - 60) {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }

    var s = run.steps[i];
    var tap = s.next !== 'read';
    var last = i === run.steps.length - 1;
    run.nodes.ring.className = 'tr-ring' + (tap ? ' pulse' : '');

    run.nodes.tip.innerHTML =
      '<div class="tr-ar"></div>' +
      '<div class="tr-hd"><img class="tr-lf" src="./assets/beginner-mark.svg" alt="">' +
      '<span class="tr-t">' + s.t + '</span>' +
      '<span class="tr-ct">' + (i + 1) + '/' + run.steps.length + '</span></div>' +
      '<div class="tr-d">' + s.d + '</div>' +
      '<div class="tr-ft">' +
      (tap
        ? '<span class="tr-hint">' + SVG_TAP + 'ここを押してください</span><button class="tr-skip r" data-tr="skip">スキップ</button>'
        : '<button class="tr-skip" data-tr="skip">スキップ</button>' +
          '<button class="tr-go" data-tr="next">' + (last ? '終わる' : '次へ') + SVG_NEXT + '</button>') +
      '</div>' +
      (last ? '<button class="tr-off" data-tr="off">今後この案内を出さない</button>' : '');

    if (tap) {
      run.onTap = function () {
        /* 押した直後に次を測ると、押したことで開く物（タブ・引き出し）が
           まだ動いている。1フレーム置いてから次のステップへ移る */
        setTimeout(function () { step(run ? run.i + 1 : 0); }, 60);
      };
      target.addEventListener('click', run.onTap, true);
    }
    place();
  }

  function finish() {
    if (!run) return;
    unbind();
    cancelAnimationFrame(run.raf);
    Object.keys(run.nodes).forEach(function (k) { run.nodes[k].remove(); });
    document.removeEventListener('keydown', run.onKey, true);
    run = null;
  }

  function start(steps) {
    if (run) return;
    injectCss();
    var nodes = {
      top: el('tr-dim'), bottom: el('tr-dim'), left: el('tr-dim'), right: el('tr-dim'),
      ring: el('tr-ring'), tip: el('tr-tip')
    };
    nodes.tip.setAttribute('role', 'dialog');
    nodes.tip.setAttribute('aria-live', 'polite');
    nodes.tip.setAttribute('aria-label', 'この画面の使い方');
    Object.keys(nodes).forEach(function (k) { document.body.appendChild(nodes[k]); });

    /* 吹き出しの中のボタンは1箇所で受ける。ステップごとに付け直さない */
    nodes.tip.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-tr]') : null;
      if (!b) return;
      var a = b.getAttribute('data-tr');
      if (a === 'next') step(run.i + 1);
      else if (a === 'skip') finish();
      else if (a === 'off') { st.off = true; save(st); finish(); }
    });

    run = { steps: steps, i: 0, el: null, nodes: nodes, raf: 0, last: null, onTap: null };

    /* Esc で抜ける。暗いまま操作できない状態から出る道を必ず1つ残す */
    run.onKey = function (e) { if (e.key === 'Escape') finish(); };
    document.addEventListener('keydown', run.onKey, true);

    step(0);
    run.raf = requestAnimationFrame(tick);
  }

  /* onboarding.js の「はじめの設定」ダイアログが出ている間は待つ。
     暗幕が二重になるうえ、後ろのボタンは押せないので案内が成立しない。 */
  function whenClear(cb) {
    var tries = 0;
    (function poll() {
      if (!document.getElementById('obOvl') && !document.getElementById('obFinOvl')) { cb(); return; }
      if (++tries > 600) return;   /* 5分見て消えなければ諦める（無限に回さない） */
      setTimeout(poll, 500);
    })();
  }

  /* ---------- 外に出すAPI ---------- */
  window.MawaruTour = {
    /* いまの画面の案内をもう一度出す。ヘルプから呼べるようにしてある */
    replay: function () {
      var steps = TOURS[pageKey()];
      if (!steps || !steps.length) return false;
      finish();
      start(steps);
      return true;
    },
    /* この画面に案内があるか。ヘルプの導線を出すかどうかの判定用 */
    has: function () { var s = TOURS[pageKey()]; return !!(s && s.length); },
    /* 全部止める / 再開する */
    off: function () { st.off = true; save(st); finish(); },
    on: function () { st.off = false; save(st); },
    isOff: function () { return st.off; },
    /* 動作確認用。コンソールから最初の状態に戻せる */
    reset: function () { localStorage.removeItem(KEY); location.reload(); }
  };

  /* ?tour=reset で「見た」と「今後出さない」を両方消して、その場でもう一度出す。
     最終ステップの「今後この案内を出さない」は off を立てるが、これは全ページ共通の
     フラグなので、一度押すとどの画面でも二度と出なくなる。戻すUIが画面上に無く、
     コンソールで MawaruTour.on() / reset() を叩くしかなかった。確認用の入口を用意する。
     （onboarding.js の ?ob=finish と同じ考え方） */
  function resetByUrl() {
    if (new URLSearchParams(location.search).get('tour') !== 'reset') return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    st.seen = [];
    st.off = false;
  }

  function init() {
    resetByUrl();
    if (st.off) return;
    var key = pageKey();
    var steps = TOURS[key];
    if (!steps || !steps.length) return;
    if (st.seen.indexOf(key) >= 0) return;

    whenClear(function () {
      /* 「見た」は “始めた時点” で記録する。終わりで記録すると、押した先が別の画面へ飛ぶ手順
         （大半がそう）で永久に記録されず、同じ画面へ戻るたびに最初からやり直しになる。

         ⚠️ ここは init() の直下に置いてはいけない。init() は whenClear より前に走るので、
         オンボーディングのモーダル（#obOvl）を閉じずにページを離れると、
         案内が一度も出ていないのに「見た」だけが残り、二度と出なくなる。
         記録するのは、実際に出せると決まってから。 */
      st.seen.push(key);
      save(st);
      /* 描画が落ち着いてから測る。読み込み直後は高さが確定しておらず、
         穴が実物からずれた位置に開く */
      setTimeout(function () { start(steps); }, 400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
