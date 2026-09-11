# ship-separation（マワル と SHIP は絶対に混ぜない）

> **マワル と SHIP関係は絶対的に別グループ。決して混合してはならない。**
> 参照・流用だけでなく、**同じコミットに乗せることも禁止**。

（源泉: 陽菜 2026-08-20 指示）

## 2つの分離を両方守る

**1. 知識・デザインの分離**
マワル の DESIGN.md / トークン / コンポーネント / 文言を SHIP 側に持ち込まない。逆も同じ。
顧客もデザインも別物で、「似てるから流用」が一番やってはいけない事故。
ルート `CLAUDE.md`「🚫 グループ跨ぎ参照禁止」と同じ話。例外は `synergy-media/SYNERGY.md` だけ（ship-inc からは参照しない）。

**2. リポジトリ・配信の分離** ← 2026-08-20 に実害寸前まで行った

`~/dev` が**公開リポジトリ `github.com/hinaiwagami0513/mawaru` の git ルート**になっている。
そして SHIP のコードが、そのリポジトリの作業ツリーの中に物理的に置かれている。

| 作業ツリー内にある未追跡パス | 中身 |
|---|---|
| `ship/` | **3.1GB / 120,622ファイル**。`ship/resme-lp/.git`（別リポジトリ）と `.env.local` を含む |
| `line-harness-segn/` | 1.1GB / 33,780ファイル。独自 `.git` と `node_modules` を含む |
| `line-harness-segn.zip` | 28MB |
| `AID/` | 10MB |
| `.nano-banana-config.json` | **Gemini APIキーの平文**。`.gitignore` に入っていない |

`main` への push は `.github/workflows/help-pages.yml` を起動して
`https://hinaiwagami0513.github.io/mawaru/` に**公開配信**される。
つまり `git add -A` を一度でも打つと、**SHIP のコードとAPIキーが公開サイトに出る**。
git 履歴に入るので、消しても取り返せない。

## 守り方（毎回）

- **`git add` は必ずパスを明示する。** `synergy-media/mawaru/...` のように書く。
- **`git add -A` / `git add .` / `git commit -a` は使わない。** 「未コミット全部コミット」も同じ理由で通さない。
- ステージ後に `git diff --cached --name-only` で、マワル 配下だけか目で確認する。
- **push = 公開配信**。ローカル確認のつもりで push しない。

## 未処置（要対応）

- `.nano-banana-config.json` の Gemini キーは**失効・再発行が必要**。まだ漏れてはいないが、`.gitignore` に無いので次の事故で一発で出る。
- `.gitignore` が `ship/` `line-harness-segn*` `AID/` `.env*` `node_modules/` `*.zip` を弾いていない。
- 本来 SHIP は `ship-inc/` グループとして別管理。作業ツリーから物理的に出すのが根治。

関連: [[dev-environment]] / [[resme]]（混同注意の別プロダクト）
