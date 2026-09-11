#!/usr/bin/env python3
"""worklog-YYYY-MM.md の1日分を Google スプレッドシートに送る。

    tools/worklog-to-sheet.py --setup <URL> <TOKEN>   # 投稿先を登録（初回だけ）
    tools/worklog-to-sheet.py                         # 今日ぶんを送る
    tools/worklog-to-sheet.py 2026-08-21              # 日付指定
    tools/worklog-to-sheet.py 2026-08-21 --dry-run    # 送らずに行だけ出す

投稿先はシートに紐づけた Apps Script のウェブアプリ（doPost）。GCP も gcloud も要らない。
URL とトークンは tools/.worklog-webhook に置く。このリポジトリは push すると公開配信
されるので、このファイルは .gitignore に入れてある（URL を知れば誰でも書けるため）。

md が原本。md を直して同じ日を送り直せば、シート側の同じ日の行は置き換わる。
"""
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VAULT_RAW = os.path.join(ROOT, "mawaru-vault", "raw")
CONF_FILE = os.path.join(ROOT, "tools", ".worklog-webhook")


# ---------- 投稿先 ----------

def save_conf(url, tok):
    if not url.startswith("https://script.google.com/"):
        sys.exit("Apps Script の /exec URL を渡す（https://script.google.com/macros/s/.../exec）")
    with open(CONF_FILE, "w") as f:
        json.dump({"url": url, "token": tok}, f, ensure_ascii=False, indent=2)
    os.chmod(CONF_FILE, 0o600)
    print("登録した: %s" % CONF_FILE)


def load_conf():
    if not os.path.exists(CONF_FILE):
        sys.exit("投稿先が未登録。先に --setup <URL> <TOKEN> を実行する。")
    return json.load(open(CONF_FILE))


def post(day, rows):
    c = load_conf()
    body = {"token": c["token"], "day": day, "rows": rows}
    req = urllib.request.Request(
        c["url"], method="POST",
        data=json.dumps(body, ensure_ascii=False).encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as r:
            out = json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        sys.exit("HTTP %s\n%s" % (e.code, e.read().decode(errors="replace")))
    except urllib.error.URLError as e:
        sys.exit("投稿先に届かない: %s" % e)
    if not out.get("ok"):
        sys.exit("Apps Script 側で失敗: %s" % out.get("error"))
    return out


# ---------- md の読み取り ----------

DAY_RE = re.compile(r"^## (\d{4}-\d{2}-\d{2})（(.)）")
SEC_RE = re.compile(r"^### (.+)")
GRP_RE = re.compile(r"^\*\*(.+?)\*\*\s*$")
ITEM_RE = re.compile(r"^- (.+)")
TBL_RE = re.compile(r"^\|(.+)\|\s*$")


def parse_day(day):
    """その日のセクションを [日付, 曜日, 区分, まとまり, 内容] の行に開く。"""
    path = os.path.join(VAULT_RAW, "worklog-%s.md" % day[:7])
    if not os.path.exists(path):
        sys.exit("%s がない。先に md を書く。" % path)
    lines = open(path, encoding="utf-8").read().splitlines()

    start, wd = None, ""
    for i, ln in enumerate(lines):
        m = DAY_RE.match(ln)
        if m and m.group(1) == day:
            start, wd = i + 1, m.group(2)
            break
    if start is None:
        sys.exit("%s に %s のセクションがない。" % (os.path.basename(path), day))

    rows, section, group = [], "", ""
    in_table, tbl_head = False, []
    for ln in lines[start:]:
        if DAY_RE.match(ln) or ln.startswith("---"):
            break  # 次の日 or 区切りで終わり
        m = SEC_RE.match(ln)
        if m:
            section, group, in_table, tbl_head = m.group(1), "", False, []
            continue
        m = GRP_RE.match(ln)
        if m:
            group, in_table, tbl_head = m.group(1), False, []
            continue
        # 表（会議要望 → 対応 など）も1行ずつ拾う
        m = TBL_RE.match(ln)
        if m:
            cells = [c.strip() for c in m.group(1).split("|")]
            if cells and all(set(c) <= set("-: ") for c in cells):
                in_table = True          # 区切り線。この上がヘッダ
                continue
            if not in_table:
                tbl_head = cells         # ヘッダ行
                continue
            rows.append([day, wd, section,
                         group or " → ".join(tbl_head),
                         " → ".join(cells)])
            continue
        in_table = False
        m = ITEM_RE.match(ln)
        if m:
            # md 記法を落として素のテキストにする（シート上で読めれば十分）
            text = m.group(1)
            text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
            text = re.sub(r"`(.+?)`", r"\1", text)
            text = re.sub(r"\[\[(.+?)\]\]", r"\1", text)
            rows.append([day, wd, section, group, text.strip()])
    return rows


def main():
    args = sys.argv[1:]
    if "--setup" in args:
        rest = args[args.index("--setup") + 1:]
        if len(rest) < 2:
            sys.exit("使い方: --setup <URL> <TOKEN>")
        save_conf(rest[0], rest[1])
        return

    dry = "--dry-run" in args
    days = [a for a in args if re.match(r"^\d{4}-\d{2}-\d{2}$", a)]
    day = days[0] if days else subprocess.run(
        ["date", "+%F"], capture_output=True, text=True).stdout.strip()

    rows = parse_day(day)
    if not rows:
        print("%s の項目が0件。何もしない。" % day)
        return

    if dry:
        for r in rows:
            print(" | ".join(r))
        print("\n%d行（--dry-run なので送っていない）" % len(rows))
        return

    out = post(day, rows)
    print("%s: %d行を送った（同じ日の既存 %s行は置き換え）"
          % (day, out.get("added", 0), out.get("removed", 0)))


if __name__ == "__main__":
    main()
