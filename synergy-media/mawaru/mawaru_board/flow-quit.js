/* ===== 投稿作成フローを途中でやめる =====
   読み込むのは投稿作成ウィザードの5本:
     flow_image_v3 / flow_video_script / flow_video_material /
     flow_image_material / flow_manual

   これまでウィザードには「前のステップに下がる」（フッターの戻る）しか無く、
   作るのをやめてボードに帰る口が無かった。ステップ3まで来てから
   「やっぱり何も編集せずにやめたい」が行き止まりになる。

   出口はフッターの「戻る」の隣に置く。最初はヘッダー右の ✕ に付けていたが、
   操作は全部フッターでしているので目が上に行かず気づけない（2026-09-03 陽菜指摘）。
   「予約する」と競らないよう、枠線なしの文字ボタンにして
   予約する（塗り）> 戻る（枠線）> 作成をやめる（文字だけ）の順で弱くする。

   確認ダイアログは各ファイルが持っている仮予約ダイアログの
   .kariov / .karibox のクラスをそのまま使う。足すCSSはボタン2つぶんだけ。 */
(function(){
  var HOME = './board.html';
  var ov = null;

  function build(){
    if(ov) return ov;
    ov = document.createElement('div');
    ov.className = 'kariov';
    ov.id = 'quitOv';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label','作成をやめる');
    ov.innerHTML =
      '<div class="karibox">'+
        /* アイコンは付けない。この面のアイコンフォントはサブセットで、
           ti-alert-triangle / ti-logout / ti-alert-circle は字が入っておらず
           幅0の空要素になる（既存ページでも同じ）。 */
        '<div class="h">作成をやめますか？'+
          '<button class="x" data-quit="no" aria-label="閉じる"><i class="ti ti-x"></i></button></div>'+
        '<div class="b">途中まで作った案は保存されません。<br>予約ずみの投稿はボードに残ります。</div>'+
        '<div class="f">'+
          '<span class="sp">'+
            '<button class="btn btn-ghost" data-quit="no">続ける</button>'+
            '<button class="btn btn-primary" data-quit="yes">やめる</button>'+
          '</span>'+
        '</div>'+
      '</div>';
    /* 暗幕を押しても閉じる。中身を押したときは閉じない。 */
    ov.addEventListener('click', function(e){
      var b = e.target.closest ? e.target.closest('[data-quit]') : null;
      if(b){ if(b.dataset.quit === 'yes') location.href = HOME; else closeQuit(); return; }
      if(e.target === ov) closeQuit();
    });
    document.body.appendChild(ov);
    return ov;
  }

  function openQuit(){ build().classList.add('on'); }
  function closeQuit(){ if(ov) ov.classList.remove('on'); }

  /* .foot は justify-content:space-between で [戻る] … [次へ] の2つを
     両端に振っている。戻るを包んでから隣に足すと、左の塊 / 右の次へ の
     2アイテムのままなので、既存の振り分けを崩さずに済む。 */
  function style(){
    if(document.getElementById('quitCss')) return;
    var s = document.createElement('style');
    s.id = 'quitCss';
    s.textContent =
      '.foot-left{display:flex;align-items:center;gap:6px;}'+
      '.quitbtn{background:none;border:none;font-family:inherit;cursor:pointer;'+
        'font-size:var(--text-label);font-weight:var(--font-weight-body-strong);'+
        'color:var(--color-muted-foreground);padding:11px 10px;border-radius:var(--radius-md);}'+
      '.quitbtn:hover{color:var(--color-primary);background:var(--color-primary-subtle);}';
    document.head.appendChild(s);
  }

  function init(){
    var back = document.getElementById('back');
    var foot = back && back.parentNode;
    if(!foot || !foot.classList.contains('foot')) return;
    style();
    var wrap = document.createElement('span');
    wrap.className = 'foot-left';
    foot.insertBefore(wrap, back);
    wrap.appendChild(back);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quitbtn';
    btn.textContent = '作成をやめる';
    btn.addEventListener('click', openQuit);
    wrap.appendChild(btn);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && ov && ov.classList.contains('on')) closeQuit();
    });
  }

  window.openQuitFlow = openQuit;
  window.closeQuitFlow = closeQuit;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
