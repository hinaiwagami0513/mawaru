#!/usr/bin/env python3
"""生成した1日分のセクションを worklog-YYYY-MM.md の先頭（新しい日が上）に差し込む。

    tools/insert-worklog.py 2026-08-22 /path/to/section.md

同じ日のセクションが既にあれば、そこを差し替える。無ければ最初の `## ` の前に入れる。
md 本体を書くのはこのスクリプトだけ。生成側（claude）にはファイルを触らせない。
"""
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VAULT_RAW = os.path.join(ROOT, "mawaru-vault", "raw")
DAY_RE = re.compile(r"^## (\d{4}-\d{2}-\d{2})（.）", re.M)


def main():
    if len(sys.argv) < 3:
        sys.exit("使い方: insert-worklog.py YYYY-MM-DD <セクションのファイル>")
    day, src = sys.argv[1], sys.argv[2]

    section = io.open(src, encoding="utf-8").read().strip()
    if not section.startswith("## "):
        sys.exit("セクションが '## ' で始まっていない。生成に失敗している:\n"
                 + section[:300])
    head = DAY_RE.match(section)
    if not head or head.group(1) != day:
        sys.exit("セクションの日付が %s と合わない: %s" % (day, section.splitlines()[0]))

    path = os.path.join(VAULT_RAW, "worklog-%s.md" % day[:7])
    if not os.path.exists(path):
        sys.exit("%s がない。月の初回は雛形を用意しておく。" % path)
    text = io.open(path, encoding="utf-8").read()

    marks = [(m.start(), m.group(1)) for m in DAY_RE.finditer(text)]
    if not marks:
        sys.exit("%s に日付セクションが1つも無い。書式を確認する。" % path)

    block = section + "\n\n"
    same = [i for i, (_, d) in enumerate(marks) if d == day]
    if same:
        # 同じ日を差し替える。次の日の見出しまで（無ければ末尾まで）
        i = same[0]
        start = marks[i][0]
        end = marks[i + 1][0] if i + 1 < len(marks) else len(text)
        new = text[:start] + block + text[end:]
        how = "差し替えた"
    else:
        # 新しい日は「日付の降順」を保つ位置に入れる。単純に先頭へ入れると、
        # --backfill で古い日を後から足したときに 8/26 → 8/25 → 8/27 のように
        # 順番が壊れる（2026-08-28 に実際に壊した）。自分より古い最初の見出しの
        # 手前に入れ、自分より古い日が無ければ末尾に足す。
        older = [pos for pos, d in marks if d < day]
        if older:
            start = older[0]
            new = text[:start] + block + text[start:]
        else:
            new = text.rstrip("\n") + "\n\n" + block
        how = "追加した"

    io.open(path, "w", encoding="utf-8").write(new)
    print("%s: %s を %s（%d行）" % (os.path.basename(path), day, how,
                                   len(section.splitlines())))


if __name__ == "__main__":
    main()
