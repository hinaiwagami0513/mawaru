/* ===== マワル 投稿編集（エディタ面）のSP挙動 =====
   editor-sp.css と対。読み込むのは同じファイル群。
   対象: flow_video_script / flow_image_v3 / flow_image_material /
         flow_video_material / post_editor_image
   （flow_manual には #aiPanel が無いので、読み込んでも何もしない）

   やること: PCで右カラムに出しっぱなしのAIアシストを、SPでは右下の丸アイコンにして
   押したときだけ下からシートで上げる。見た目は editor-sp.css 側、
   ここは「初期状態」「暗幕」「アイコンの位置」の3つだけを持つ。

   開閉の状態機械そのものは各ファイルの toggleAI() が既に持っている
   （#aiPanel に ai-panel-open / ai-panel-closed を付け替え、
     #aiCollapsed / #aiExpanded の display を直接書く）。
   ここではそれを置き換えず、包んで前後に処理を足す。 */
(function(){
  var MQ = window.matchMedia('(max-width:430px)');
  var backdrop = null;
  /* SPに入るときこちらで閉じたか。PC幅に戻したら元の「開いている」に返すため。 */
  var autoCollapsed = false;

  function panel(){ return document.getElementById('aiPanel'); }
  function isOpen(){ var p = panel(); return !!p && p.classList.contains('ai-panel-open'); }

  /* 暗幕は body ではなく #aiPanel の隣に置く。同じ親に入れておくと
     ・エディタ以外の画面では #sc_editor ごと display:none で一緒に消える
     ・#aiPanel と同じ重なり順の中に入るので z-index が素直に効く */
  function ensureBackdrop(){
    var p = panel();
    if(backdrop || !p) return backdrop;
    backdrop = document.createElement('div');
    backdrop.className = 'ai-sheet-backdrop';
    backdrop.addEventListener('click', function(){
      if(MQ.matches && isOpen()) window.toggleAI();
    });
    p.parentNode.insertBefore(backdrop, p);
    return backdrop;
  }

  /* フッター（戻る / 予約する）の実測値をCSS変数に渡す。
     アイコンをこの高さぶん持ち上げて、ボタンに被らないようにする。 */
  function syncFootHeight(){
    var foot = document.querySelector('.foot');
    if(!foot) return;
    var h = Math.round(foot.getBoundingClientRect().height);
    if(h > 0) document.documentElement.style.setProperty('--sp-foot-h', h + 'px');
  }

  function sync(){
    if(!panel()) return;
    syncFootHeight();
    var sheetOpen = MQ.matches && isOpen();
    var b = ensureBackdrop();
    if(b) b.classList.toggle('on', sheetOpen);
    document.body.classList.toggle('ai-sheet-open', sheetOpen);
  }

  /* SPに入ったら閉じた状態（＝アイコン）から始める。PCに戻したら開いた状態に返す。 */
  function applyMode(){
    if(!panel() || typeof window.toggleAI !== 'function') return;
    if(MQ.matches){
      if(isOpen()){ window.toggleAI(); autoCollapsed = true; }
    }else if(autoCollapsed && !isOpen()){
      window.toggleAI(); autoCollapsed = false;
    }
    sync();
  }

  /* toggleAI() を包んで、開閉のたびに暗幕とスクロール止めを合わせる。
     元の関数はそのまま呼ぶので、PC側の挙動は変わらない。 */
  function wrapToggle(){
    if(typeof window.toggleAI !== 'function' || window.toggleAI.__spWrapped) return;
    var orig = window.toggleAI;
    var wrapped = function(){ var r = orig.apply(this, arguments); sync(); return r; };
    wrapped.__spWrapped = true;
    window.toggleAI = wrapped;
  }

  function init(){
    if(!panel()) return;
    wrapToggle();
    applyMode();
    MQ.addEventListener('change', applyMode);
    window.addEventListener('resize', sync);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
