/* ============================================================
   学習ポータル ToDo  ─  app.js
   ・週サイクル制（週ごとに localStorage 保存）
   ・教科カード（算数 / 理科 / 社会）
   ・タスク種別: check / score / grid / dsupport / kobetsuba
   ============================================================ */

/* ---- 既存アプリのリンク先（必要なら書き換え） ---- */
const APP = {
  math:     "https://komaguchi-wq.github.io/math-quiz/",
  science:  "https://komaguchi-wq.github.io/science-daily-check-v2/",
  shakai:   "https://komaguchi-wq.github.io/shakai-daily-check-v2/",
  kobetsuba:"https://komaguchi-wq.github.io/kobetsuba-web-jugyou/",
};

const DAYS = ["月", "火", "水", "木", "金", "土", "日"];
const AE   = ["A", "B", "C", "D", "E"];

/* ---- 算数 デイリーサポートの単元名（最新が上） ----
   ※ 算数アプリに単元を追加したら、ここも先頭に足してください */
const DS_UNITS = [
  { id: "61-14",  title: "61-14 規則性に関する問題" },
  { id: "61-13",  title: "61-13 場合の数" },
  { id: "61-12",  title: "61-12 変化のグラフ" },
  { id: "61-11",  title: "61-11 拡大・縮小" },
  { id: "61-10",  title: "61-10 立体図形(2)" },
  { id: "61-09",  title: "61-09 立体図形(1)" },
  { id: "61-08",  title: "61-08 小数・分数" },
  { id: "H61-06", title: "H61-06 場合の数" },
  { id: "H61-05", title: "H61-05 規則性" },
  { id: "H61-04", title: "H61-04 グラフ" },
  { id: "H61-03", title: "H61-03 立体図形" },
  { id: "H61-02", title: "H61-02 平面図形" },
  { id: "H61-01", title: "H61-01 割合" },
  { id: "61-07",  title: "61-07 2量の関係" },
  { id: "61-06",  title: "61-06 速さ(2)" },
  { id: "61-05",  title: "61-05 速さ(1)" },
  { id: "61-04",  title: "61-04 割合(2)" },
  { id: "61-03",  title: "61-03 割合(1)" },
  { id: "61-02",  title: "61-02 平面図形" },
  { id: "61-01",  title: "61-01 数の性質" },
];

/* ---- 理科v2 デイリーサピックスの単元名（最新が上） ----
   ※ 理科v2に単元を追加したら、ここも先頭に足してください */
const SCI_DAILY_UNITS = [
  { id: "630-14", title: "630-14 電熱線" },
  { id: "630-13", title: "630-13 星の動き" },
  { id: "630-12", title: "630-12 中和計算" },
  { id: "630-11", title: "630-11 地層" },
  { id: "630-10", title: "630-10 ばね" },
  { id: "630-09", title: "630-09 てこ" },
  { id: "630-08", title: "630-08 人体" },
  { id: "H63-03", title: "H63-03 月" },
  { id: "H63-02", title: "H63-02 太陽" },
  { id: "H63-01", title: "H63-01 電気のはたらき" },
  { id: "630-06", title: "630-06 燃焼" },
  { id: "630-05", title: "630-05 光②" },
  { id: "630-04", title: "630-04 光①" },
  { id: "630-03", title: "630-03 植物のはたらき②" },
  { id: "630-02", title: "630-02 種子のはたらき①" },
  { id: "630-01", title: "630-01 気体と水溶液の性質" },
];

/* ---- 理科v2 Weekly SapiXの単元名（最新が上） ---- */
const SCI_WEEKLY_UNITS = [
  { id: "WS-15", title: "WS-15 磁石 / 総完成 第15回 地学③ 気象" },
  { id: "WS-14", title: "WS-14 音 / 総完成 第14回 地学② 太陽" },
  { id: "WS-13", title: "WS-13 WS-12の復習 / 総完成 第13回 地学① 星と月" },
  { id: "WS-12", title: "WS-12 濃度 / 総完成 第12回 化学④ 熱" },
  { id: "WS-11", title: "WS-11 ろうそくと燃焼 / 総完成 第11回 化学③ 燃焼" },
  { id: "WS-10", title: "WS-10 てこ / 総完成 第10回 化学② 気体" },
  { id: "WS-09", title: "WS-09 気体の発生計算・金属の燃焼計算 / 総完成 第9回 化学① 水溶液" },
  { id: "WS-08", title: "WS-08 星の知識 / 総完成 第8回 動物④ 食物連鎖" },
  { id: "WS-07", title: "WS-07 電流と方位磁針 / 総完成 第7回 動物③" },
  { id: "WS-06", title: "WS-06 動物の分類 / 総完成 第6回 動物② 人体②" },
  { id: "WS-05", title: "WS-05 人体（分化） / 総完成 第5回 動物① 人体①" },
  { id: "WS-04", title: "WS-04 岩石 / 総完成 第4回 植物④" },
  { id: "WS-03", title: "WS-03 花と受粉 / 総完成 第3回 植物③" },
  { id: "WS-02", title: "WS-02 植物のつくり / 総完成 第2回 植物②" },
  { id: "WS-01", title: "WS-01 水の三態と熱 / 総完成 第1回 植物①" },
];

/* ---- 理科v2 コアプラスの単元名（節順） ---- */
const SCI_COREPLUS_UNITS = [
  { id: "rcp-01", title: "rcp-01 第I部 身のまわりの理科 第1節 月と惑星" },
  { id: "rcp-02", title: "rcp-02 第I部 身のまわりの理科 第2節 星" },
  { id: "rcp-03", title: "rcp-03 第I部 身のまわりの理科 第3節 川と地層" },
  { id: "rcp-04", title: "rcp-04 第I部 身のまわりの理科 第4節 火山と化石" },
  { id: "rcp-05", title: "rcp-05 第I部 身のまわりの理科 第5節 気象と太陽" },
  { id: "rcp-06", title: "rcp-06 第I部 身のまわりの理科 第6節 無セキツイ動物" },
  { id: "rcp-07", title: "rcp-07 第I部 身のまわりの理科 第7節 メダカとプランクトン" },
  { id: "rcp-08", title: "rcp-08 第I部 身のまわりの理科 第8節 セキツイ動物" },
  { id: "rcp-09", title: "rcp-09 第I部 身のまわりの理科 第9節 種子と発芽" },
  { id: "rcp-10", title: "rcp-10 第I部 身のまわりの理科 第10節 花と受粉" },
  { id: "rcp-11", title: "rcp-11 第II部 第1章 化学 第1節 状態変化・熱の移動" },
  { id: "rcp-12", title: "rcp-12 第II部 第1章 化学 第2節 酸素・二酸化炭素・物の燃え方" },
  { id: "rcp-13", title: "rcp-13 第II部 第1章 化学 第3節 溶解度・水溶液" },
  { id: "rcp-14", title: "rcp-14 第II部 第2章 地学 第1節 天体" },
  { id: "rcp-15", title: "rcp-15 第II部 第2章 地学 第2節 地層・岩石・火山" },
  { id: "rcp-16", title: "rcp-16 第II部 第2章 地学 第3節 気象" },
  { id: "rcp-17", title: "rcp-17 第II部 第3章 物理 第1節 力学" },
  { id: "rcp-18", title: "rcp-18 第II部 第3章 物理 第2節 電磁気" },
  { id: "rcp-19", title: "rcp-19 第II部 第3章 物理 第3節 光・音" },
  { id: "rcp-20", title: "rcp-20 第II部 第4章 生物 第1節 植物" },
  { id: "rcp-21", title: "rcp-21 第II部 第4章 生物 第2節 動物" },
  { id: "rcp-22", title: "rcp-22 第II部 第4章 生物 第3節 人体" },
  { id: "rcp-23", title: "rcp-23 第II部 第4章 生物 第4節 環境" },
  { id: "rcp-24", title: "rcp-24 第II部 第5章 環境 第1節 環境" },
  { id: "rcp-25", title: "rcp-25 第III部 計算理科 第1節 計算問題" },
  { id: "rcp-26", title: "rcp-26 第III部 計算理科 第2節 中和" },
  { id: "rcp-27", title: "rcp-27 第IV部 巻末解説" },
];

/* ---- 社会v2 デイリーサピックスの単元名（最新が上） ---- */
const SHA_DAILY_UNITS = [
  { id: "640-14", title: "640-14 三権分立② 選挙制度" },
  { id: "640-13", title: "640-13 内閣と裁判所" },
  { id: "640-12", title: "640-12 三権分立①国会" },
  { id: "640-11", title: "640-11 日本国憲法② 基本的人権" },
  { id: "640-10", title: "640-10 日本国憲法① 三大原則" },
  { id: "640-09", title: "640-09 外交史② 欧米諸国との外交" },
  { id: "640-08", title: "640-08 外交史① アジア諸国との外交" },
  { id: "640-07", title: "640-07 文化史" },
  { id: "H64-03", title: "H64-03 社会・産業史② 商工業の発達" },
  { id: "H64-02", title: "H64-02 社会・産業史① 土地制度の移り変わり" },
  { id: "H64-01", title: "H64-01 政治史⑦ 昭和〜現代" },
  { id: "640-06", title: "640-06 政治史⑥ 明治〜昭和" },
  { id: "640-05", title: "640-05 政治史⑤ 江戸〜明治" },
  { id: "640-04", title: "640-04 政治史④ 安土桃山〜江戸" },
  { id: "640-03", title: "640-03 政治史年表③" },
  { id: "640-02", title: "640-02 政治史年表②" },
  { id: "640-01", title: "640-01 政治史年表①" },
];

/* ---- 社会v2 Weekly SapiXの単元名（最新が上） ---- */
const SHA_WEEKLY_UNITS = [
  { id: "WS-15", title: "WS-15 文化史・近現代史" },
  { id: "WS-14", title: "WS-14 社会・産業史" },
  { id: "WS-13", title: "WS-13 外交史② 欧米諸国との外交 + 歴史地名のまとめ" },
  { id: "WS-12", title: "WS-12 外交史① 中国・朝鮮との外交 + 時代区分と重要年代のまとめ" },
  { id: "WS-11", title: "WS-11 政治史④ + 歴史人物 昭和時代〜現代" },
  { id: "WS-10", title: "WS-10 政治史③ + 歴史人物 明治時代〜大正時代" },
  { id: "WS-09", title: "WS-09 政治史② + 歴史人物 室町時代〜江戸時代" },
  { id: "WS-08", title: "WS-08 政治史① 古墳時代〜室町時代" },
  { id: "WS-07", title: "WS-07 知識の総完成（地理編07）日本の交通のまとめ + 中国・四国地方のまとめ" },
  { id: "WS-06", title: "WS-06 知識の総完成（地理編06）日本の貿易のまとめ + 近畿地方のまとめ" },
  { id: "WS-05", title: "WS-05 知識の総完成（地理編05）日本の工業のまとめ + 関東地方のまとめ" },
  { id: "WS-04", title: "WS-04 知識の総完成（地理編04）" },
  { id: "WS-03", title: "WS-03 知識の総完成（地理編03）" },
  { id: "WS-02", title: "WS-02 知識の総完成（地理編02）" },
  { id: "WS-01", title: "WS-01 知識の総完成（地理編01）" },
];

/* ---- 社会v2 コアプラスの単元名（節順） ---- */
const SHA_COREPLUS_UNITS = [
  { id: "cp-00", title: "cp-00 巻頭資料" },
  { id: "cp-01", title: "cp-01 第1節 国土・自然・人口" },
  { id: "cp-02", title: "cp-02 第2節 都道府県・都市" },
  { id: "cp-03", title: "cp-03 第3節 重要地名（山・川・平地）" },
  { id: "cp-04", title: "cp-04 第4節 重要地名（岬・湾・その他）" },
  { id: "cp-05", title: "cp-05 第5節 第1次産業" },
  { id: "cp-06", title: "cp-06 第6節 第2次産業・公害・環境問題" },
  { id: "cp-07", title: "cp-07 第7節 貿易・交通・通信・世界地理" },
  { id: "cp-08", title: "cp-08 第8節 古代（旧石器〜平安時代）" },
  { id: "cp-09", title: "cp-09 第9節 中世（鎌倉〜室町時代）" },
  { id: "cp-10", title: "cp-10 第10節 近世（安土桃山〜江戸時代）" },
  { id: "cp-11", title: "cp-11 第11節 近代（明治〜昭和・戦前）" },
  { id: "cp-12", title: "cp-12 第12節 現代（昭和・戦後〜現代）" },
  { id: "cp-13", title: "cp-13 第13節 歴史重要資料のまとめ" },
  { id: "cp-14", title: "cp-14 第14節 日本国憲法" },
  { id: "cp-15", title: "cp-15 第15節 三権分立" },
  { id: "cp-16", title: "cp-16 第16節 私たちの生活・現代日本" },
  { id: "cp-17", title: "cp-17 第17節 国際連合・国際社会" },
  { id: "cp-18", title: "cp-18 第II部第1節 地理のプラス知識" },
  { id: "cp-19", title: "cp-19 第II部第2節 歴史のプラス知識" },
  { id: "cp-20", title: "cp-20 第II部第3節 公民・国際社会のプラス知識" },
  { id: "cp-21", title: "cp-21 第II部第4節 日本の伝統文化のプラス知識" },
];

/* ============================================================
   タスク定義
   type: "check" / "score" / "grid" / "dsupport" / "kobetsuba"
   ============================================================ */
const DAILY_GRID_IDS = ["m_deruju", "m_dailychk", "m_kiso", "m_bunya"];

const SUBJECTS = [
  {
    id: "math",
    name: "算数",
    icon: "🔢",
    appUrl: APP.math,
    twoCol: true,
    groups: [
      {
        title: "毎日のチェック（月〜日）",
        milestone: true,
        col: "L",
        tasks: [
          { id: "m_daily", type: "matrix", cols: DAYS, rows: [
            { id: "m_dailychk", label: "デイリー" },
            { id: "m_kiso",     label: "基礎定着" },
            { id: "m_bunya",    label: "分野別" },
            { id: "m_deruju",   label: "でる順" },
          ] },
        ],
      },
      {
        title: "デイリーサポート",
        link: APP.math,
        col: "R",
        tasks: [
          { id: "m_dsupport", type: "dsupport" },
        ],
      },
      {
        title: "コベツバ Web授業",
        link: APP.kobetsuba,
        col: "R",
        tasks: [
          { id: "m_kobetsuba", type: "kobetsuba" },
        ],
      },
      {
        title: "間違い撲滅ギャラリー",
        link: APP.math,
        col: "L",
        tasks: [
          { id: "m_gallery", type: "gallery", count: 15, cols: 5 },
        ],
      },
    ],
  },

  {
    id: "science",
    name: "理科",
    icon: "🔬",
    appUrl: APP.science,
    groups: [
      {
        title: "デイリーサピックス",
        link: APP.science,
        tasks: [
          { id: "s_daily", type: "track", units: SCI_DAILY_UNITS,
            items: ["説明", "確認問題", "発展問題", "ポイチェ", "ステップ"] },
        ],
      },
      {
        title: "Weekly SapiX",
        link: APP.science,
        tasks: [
          { id: "s_weekly", type: "track", units: SCI_WEEKLY_UNITS,
            items: ["X問題", "Y問題", "Z問題", "総完成"] },
        ],
      },
      {
        title: "コアプラス",
        link: APP.science,
        tasks: [
          { id: "s_core", type: "track", units: SCI_COREPLUS_UNITS,
            items: ["確認テスト"] },
        ],
      },
    ],
  },

  {
    id: "shakai",
    name: "社会",
    icon: "🗾",
    appUrl: APP.shakai,
    groups: [
      {
        title: "デイリーサピックス",
        link: APP.shakai,
        tasks: [
          { id: "sh_daily", type: "track", units: SHA_DAILY_UNITS,
            items: ["説明", "デイリー", "基礎問題", "発展問題", "実戦問題", "コアプラ"] },
        ],
      },
      {
        title: "Weekly SapiX",
        link: APP.shakai,
        tasks: [
          { id: "sh_weekly", type: "track", units: SHA_WEEKLY_UNITS,
            items: ["総完成"], prefixUnit: true },
        ],
      },
      {
        title: "コアプラス",
        link: APP.shakai,
        tasks: [
          { id: "sh_core", type: "track", units: SHA_COREPLUS_UNITS,
            items: ["確認テスト"] },
        ],
      },
    ],
  },
];

/* ============================================================
   週の計算（月曜はじまり）
   ============================================================ */
function startOfWeek(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function weekKey(monday) {
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function fmtRange(monday) {
  const sun = addDays(monday, 6);
  const f = (d) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${f(monday)}（月）〜 ${f(sun)}（日）`;
}

/* ============================================================
   クラウド同期（端末非依存）
   ------------------------------------------------------------
   SYNC_URL に Apps Script の /exec URL を入れると、家族で共有する
   1つのデータとして全端末で同期する（空ならこの端末内のみ）。
   ============================================================ */
const SYNC_URL = ""; // ← デプロイ後の https://script.google.com/macros/s/.../exec を貼る

function setSyncStatus(s) {
  const e = document.getElementById("syncStatus");
  if (!e) return;
  const map = {
    local:  { t: "この端末内に保存", c: "off" },
    syncing:{ t: "同期中…",         c: "busy" },
    saving: { t: "保存中…",         c: "busy" },
    synced: { t: "クラウド同期済み", c: "ok" },
    error:  { t: "同期エラー（端末内には保存済み）", c: "err" },
  };
  const m = map[s] || map.local;
  e.textContent = "● " + m.t;
  e.className = "sync-status " + m.c;
}

// localStorage の全週データを { 週キー: 状態 } に集約
function gatherAll() {
  const all = {};
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(STORAGE_PREFIX)) {
      try { all[k.slice(STORAGE_PREFIX.length)] = JSON.parse(localStorage.getItem(k)); } catch (_) {}
    }
  });
  return all;
}
// クラウドを正としてローカルへ反映
function applyAll(all) {
  Object.keys(localStorage).forEach((k) => { if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k); });
  Object.keys(all || {}).forEach((wk) => { localStorage.setItem(STORAGE_PREFIX + wk, JSON.stringify(all[wk])); });
}

let _saveTimer = null, _pendingSave = false;
function cloudSave() {
  if (!SYNC_URL) return;
  _pendingSave = true;
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    setSyncStatus("saving");
    fetch(SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // preflight回避
      body: JSON.stringify(gatherAll()),
    })
      .then((r) => r.json())
      .then(() => { _pendingSave = false; setSyncStatus("synced"); })
      .catch(() => { _pendingSave = false; setSyncStatus("error"); });
  }, 800);
}
async function cloudLoad() {
  if (!SYNC_URL) { setSyncStatus("local"); return false; }
  setSyncStatus("syncing");
  try {
    const res = await fetch(SYNC_URL, { method: "GET" });
    applyAll(await res.json());
    setSyncStatus("synced");
    return true;
  } catch (_) { setSyncStatus("error"); return false; }
}

/* ============================================================
   状態管理（localStorage / 週ごと）
   ============================================================ */
const STORAGE_PREFIX = "studytodo:v1:";
let currentMonday = startOfWeek(new Date());
let state = {};

function loadState() {
  const raw = localStorage.getItem(STORAGE_PREFIX + weekKey(currentMonday));
  state = raw ? JSON.parse(raw) : {};
}
function saveState() {
  localStorage.setItem(STORAGE_PREFIX + weekKey(currentMonday), JSON.stringify(state));
  cloudSave();
}
function getVal(key, def) { return key in state ? state[key] : def; }
function setVal(key, val) { state[key] = val; saveState(); }
function delVal(key) { delete state[key]; saveState(); }
// 単元選択ウィジェットの「その週に扱う単元リスト」（複数単元対応）
function unitList(taskId, defaultUnit) {
  const l = getVal(`${taskId}.uList`, null);
  return (Array.isArray(l) && l.length) ? l.slice() : [defaultUnit];
}

/* ============================================================
   進捗計算
   ============================================================ */
function countChecked(taskId, cols) {
  let n = 0;
  for (let i = 0; i < cols.length; i++) if (getVal(`${taskId}.${i}`, false)) n++;
  return n;
}
function dailyTotal() {
  // 4教材 × 7日のうち「解き直し○」になったセル数を数える
  let n = 0;
  DAILY_GRID_IDS.forEach((id) => {
    DAYS.forEach((_, i) => {
      if (getVal(`${id}.${i}`, false) && getVal(`${id}.redo.${i}`, "X") === "○") n++;
    });
  });
  return n;
}
function taskStats(task) {
  // {done, total} を返す
  if (task.type === "matrix") {
    let done = 0, total = 0;
    task.rows.forEach((row) => {
      task.cols.forEach((_, i) => {
        total += 2;                                   // ○=2, X=1, 未=0 の半分刻み
        if (getVal(`${row.id}.${i}`, false)) {
          done += 1;
          if (getVal(`${row.id}.redo.${i}`, "X") === "○") done += 1;
        }
      });
    });
    return { done, total };
  }
  if (task.type === "grid") {
    let done = 0, total = 0;
    task.cols.forEach((_, i) => {
      const on = getVal(`${task.id}.${i}`, false);
      total += 1;
      if (on) {
        done += 1;
        total += 1;                     // 解き直し（やった時のみ）
        if (getVal(`${task.id}.redo.${i}`, "X") === "○") done += 1;
      }
    });
    return { done, total };
  }
  if (task.type === "score" || task.type === "check")
    return { done: getVal(`${task.id}.done`, false) ? 1 : 0, total: 1 };
  if (task.type === "track") {
    let done = 0, total = 0;
    unitList(task.id, task.units[0].id).forEach((unit) => {
      task.items.forEach((_, i) => {
        total += 3;                                     // ー=0, 進行中=1, 完了=2, 完了+○=3
        const s = getVal(`${task.id}.${unit}.${i}.state`, 0);
        done += s;
        if (s === 2 && getVal(`${task.id}.${unit}.${i}.redo`, "X") === "○") done += 1;
      });
    });
    return { done, total };
  }
  if (task.type === "dsupport") {
    let done = 0, total = 0;
    unitList(task.id, DS_UNITS[0].id).forEach((unit) => {
      AE.forEach((_, i) => {
        const on = getVal(`${task.id}.${unit}.do.${i}`, false);
        total += 1;                     // やった
        if (on) {
          done += 1;
          total += 1;                   // 解き直し（やった時のみ）
          if (getVal(`${task.id}.${unit}.redo.${i}`, "X") === "○") done += 1;
        }
      });
    });
    return { done, total };
  }
  if (task.type === "gallery") {
    let n = 0;
    for (let i = 1; i <= task.count; i++) if (getVal(`${task.id}.${i}`, false)) n++;
    return { done: n, total: n };       // 退治した分だけ加点（未退治はマイナスにしない）
  }
  if (task.type === "kobetsuba") {
    let done = 0, total = 0;
    ["point", "test"].forEach((b) => {
      const n = getVal(`${task.id}.${b}.nums`, []).length;
      total += n;
      for (let i = 0; i < n; i++) if (getVal(`${task.id}.${b}.redo.${i}`, "X") === "○") done++;
    });
    return { done, total };
  }
  return { done: 0, total: 0 };
}
function subjectProgress(subject) {
  let done = 0, total = 0;
  subject.groups.forEach((g) => g.tasks.forEach((t) => {
    const s = taskStats(t); done += s.done; total += s.total;
  }));
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
function overallProgress() {
  let done = 0, total = 0;
  SUBJECTS.forEach((s) => { const p = subjectProgress(s); done += p.done; total += p.total; });
  return total ? Math.round((done / total) * 100) : 0;
}

/* ============================================================
   描画ヘルパ
   ============================================================ */
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function linkBtn(url, label) {
  const a = el("a", "task-link", label || "開く");
  a.href = url; a.target = "_blank"; a.rel = "noopener";
  return a;
}

/* ---- matrix（教材×曜日）：教材ごとに「やった行(曜日ボタン)」+「解き直し行」を縦に積む ---- */
function renderMatrix(task) {
  const wrap = el("div", "task type-matrix");
  const grid = el("div", "m-grid");
  grid.style.gridTemplateColumns = `max-content repeat(${task.cols.length}, 1fr)`;
  wrap.appendChild(grid);

  function render() {
    grid.innerHTML = "";
    task.rows.forEach((row, ri) => {
      if (ri > 0) { const sep = el("div", "m-sep"); sep.style.gridColumn = "1 / -1"; grid.appendChild(sep); }

      // やった行：教材名（太字）+ 曜日トグル（元のボタン）
      grid.appendChild(el("div", "m-itemlabel", row.label));
      task.cols.forEach((c, i) => {
        const doKey = `${row.id}.${i}`;
        const on = getVal(doKey, false);
        const cell = el("button", "m-day" + (on ? " on" : ""));
        cell.type = "button";
        cell.appendChild(el("span", "m-daylabel", c));
        cell.appendChild(el("span", "m-daymark", on ? "✓" : ""));
        cell.addEventListener("click", () => {
          const nv = !getVal(doKey, false);
          setVal(doKey, nv);
          if (nv) setVal(`${row.id}.redo.${i}`, "X"); else delVal(`${row.id}.redo.${i}`);
          render(); refreshProgress();
        });
        grid.appendChild(cell);
      });

      // 解き直し行：小さい字 + ○セル（やった日のみ X→○）
      grid.appendChild(el("div", "m-redolabel", "解き直し"));
      task.cols.forEach((c, i) => {
        const doKey = `${row.id}.${i}`;
        const reKey = `${row.id}.redo.${i}`;
        if (!getVal(doKey, false)) {
          grid.appendChild(el("div", "m-redo cr-dash", "-"));
        } else {
          const st = getVal(reKey, "X");
          const rb = el("button", "m-redo cr-redo " + (st === "○" ? "st-done" : "st-todo"), st);
          rb.type = "button";
          rb.title = `${row.label} ${c} の解き直し`;
          rb.addEventListener("click", () => {
            setVal(reKey, getVal(reKey, "X") === "○" ? "X" : "○");
            render(); refreshProgress();
          });
          grid.appendChild(rb);
        }
      });
    });
  }
  render();

  const note = el("div", "m-note", "曜日＝やった（緑）／「解き直し」はタップで X→○");
  wrap.appendChild(note);
  return wrap;
}

/* ---- grid（曜日）：やった行 + 解き直し行（-→X→○） ----
   CSS grid で上下の列をぴったり揃える（※現在は未使用。matrix に統合） */
function renderGrid(task) {
  const row = el("div", "task type-grid");
  row.appendChild(el("div", "task-label", task.label));
  const grid = el("div", "g-grid");
  grid.style.gridTemplateColumns = `max-content repeat(${task.cols.length}, 1fr)`;
  row.appendChild(grid);

  function render() {
    grid.innerHTML = "";
    // 1行目: やった（曜日トグル）
    grid.appendChild(el("div", "g-rowlabel", "やった"));
    const dayBtns = [];
    task.cols.forEach((col, i) => {
      const doKey = `${task.id}.${i}`;
      const on = getVal(doKey, false);
      const cell = el("button", "g-day" + (on ? " on" : ""));
      cell.type = "button";
      cell.appendChild(el("span", "g-daylabel", col));
      cell.appendChild(el("span", "g-daymark", on ? "✓" : ""));
      cell.addEventListener("click", () => {
        const nv = !getVal(doKey, false);
        setVal(doKey, nv);
        if (nv) setVal(`${task.id}.redo.${i}`, "X"); else delVal(`${task.id}.redo.${i}`);
        render(); refreshProgress();
      });
      grid.appendChild(cell);
      dayBtns.push(on);
    });
    // 2行目: 解き直し
    grid.appendChild(el("div", "g-rowlabel", "解き直し"));
    task.cols.forEach((col, i) => {
      const reKey = `${task.id}.redo.${i}`;
      if (!dayBtns[i]) {
        grid.appendChild(el("div", "g-redo cr-dash", "-"));
      } else {
        const st = getVal(reKey, "X");
        const rb = el("button", "g-redo cr-redo " + (st === "○" ? "st-done" : "st-todo"), st);
        rb.type = "button";
        rb.addEventListener("click", () => {
          setVal(reKey, getVal(reKey, "X") === "○" ? "X" : "○");
          render(); refreshProgress();
        });
        grid.appendChild(rb);
      }
    });
  }
  render();
  return row;
}

/* ---- check / score ---- */
function renderCheckScore(task) {
  const row = el("div", "task type-" + task.type);
  const doneKey = `${task.id}.done`;
  const head = el("div", "task-head");
  const lab = el("label", "check-label" + (getVal(doneKey, false) ? " done" : ""));
  const cb = el("input"); cb.type = "checkbox"; cb.checked = getVal(doneKey, false);
  cb.addEventListener("change", () => {
    setVal(doneKey, cb.checked);
    lab.classList.toggle("done", cb.checked);
    refreshProgress();
  });
  lab.appendChild(cb);
  lab.appendChild(el("span", "check-text", task.label));
  head.appendChild(lab);
  if (task.link) head.appendChild(linkBtn(task.link));
  row.appendChild(head);

  if (task.type === "score") {
    const scoreKey = `${task.id}.score`;
    const sc = el("div", "score-wrap");
    const inp = el("input", "score-input");
    inp.type = "text"; inp.inputMode = "numeric"; inp.placeholder = "得点";
    inp.value = getVal(scoreKey, "");
    inp.addEventListener("input", () => setVal(scoreKey, inp.value));
    sc.appendChild(el("span", "score-prefix", "得点"));
    sc.appendChild(inp);
    sc.appendChild(el("span", "score-suffix", "点"));
    row.appendChild(sc);
  }
  return row;
}

/* ---- 単元セレクタ＋ブロックの共通描画（複数単元対応） ----
   units: 選択肢配列, buildBody(unitId)→要素 を各単元ブロックに差し込む */
function renderUnitWidget(taskId, units, buildBody) {
  const wrap = el("div", "task type-unit");
  const listKey = `${taskId}.uList`;
  const getList = () => { const l = getVal(listKey, null); return (Array.isArray(l) && l.length) ? l.slice() : [units[0].id]; };
  const setList = (l) => setVal(listKey, l);

  function renderAll() {
    wrap.innerHTML = "";
    const list = getList();
    list.forEach((unitId, bi) => {
      const block = el("div", "unit-block");
      const selRow = el("div", "ds-selrow");
      selRow.appendChild(el("span", "ds-sellabel", "単元"));
      const sel = el("select", "ds-select");
      units.forEach((u) => { const o = el("option", null, u.title); o.value = u.id; sel.appendChild(o); });
      sel.value = unitId;
      sel.addEventListener("change", () => { const l = getList(); l[bi] = sel.value; setList(l); renderAll(); refreshProgress(); });
      selRow.appendChild(sel);
      if (list.length > 1) {
        const rm = el("button", "unit-remove", "×");
        rm.type = "button"; rm.title = "この単元を外す";
        rm.addEventListener("click", () => { const l = getList(); l.splice(bi, 1); setList(l); renderAll(); refreshProgress(); });
        selRow.appendChild(rm);
      }
      block.appendChild(selRow);
      block.appendChild(buildBody(unitId));
      wrap.appendChild(block);
    });
    const add = el("button", "unit-add-btn", "＋ 新しい単元を追加");
    add.type = "button";
    add.addEventListener("click", () => { const l = getList(); l.push(units[0].id); setList(l); renderAll(); refreshProgress(); });
    wrap.appendChild(add);
  }
  renderAll();
  return wrap;
}

/* ---- デイリーサポート（単元選択 + 2行A〜E、複数単元可） ---- */
function dsupportBody(task, unit) {
  const rowsBox = el("div", "ds-rows");
  function renderRows() {
    rowsBox.innerHTML = "";
    const doRow = el("div", "ae-row");
    doRow.appendChild(el("div", "ae-label", "やった"));
    const doCells = el("div", "ae-cells");
    const reRow = el("div", "ae-row");
    reRow.appendChild(el("div", "ae-label", "間違えた問題の解き直し"));
    const reCells = el("div", "ae-cells");

    AE.forEach((L, i) => {
      const doKey = `${task.id}.${unit}.do.${i}`;
      const reKey = `${task.id}.${unit}.redo.${i}`;
      const on = getVal(doKey, false);
      const b = el("button", "ae-btn" + (on ? " on" : ""), L);
      b.type = "button";
      b.addEventListener("click", () => {
        const nv = !getVal(doKey, false);
        setVal(doKey, nv);
        if (nv) setVal(reKey, "X"); else delVal(reKey);
        renderRows(); refreshProgress();
      });
      doCells.appendChild(b);
      if (!on) {
        reCells.appendChild(el("div", "ae-redo cr-dash", "-"));
      } else {
        const st = getVal(reKey, "X");
        const rb = el("button", "ae-redo cr-redo " + (st === "○" ? "st-done" : "st-todo"), st);
        rb.type = "button";
        rb.addEventListener("click", () => {
          setVal(reKey, getVal(reKey, "X") === "○" ? "X" : "○");
          renderRows(); refreshProgress();
        });
        reCells.appendChild(rb);
      }
    });
    doRow.appendChild(doCells);
    reRow.appendChild(reCells);
    rowsBox.appendChild(doRow);
    rowsBox.appendChild(reRow);
  }
  renderRows();
  return rowsBox;
}
function renderDsupport(task) {
  return renderUnitWidget(task.id, DS_UNITS, (unit) => dsupportBody(task, unit));
}

/* ---- track（理科・社会）：単元選択 + 項目を横並び + 3状態ボタン + 解き直し行（複数単元可） ---- */
const TRACK_STATES = ["ー", "進行中", "完了"];
function trackBody(task, unit) {
  const grid = el("div", "tk-grid");
  grid.style.gridTemplateColumns = `max-content repeat(${task.items.length}, 1fr)`;

  function render() {
    grid.innerHTML = "";
    // ヘッダー（項目名を横並び）。prefixUnit時は「単元ID＋項目名」
    grid.appendChild(el("div", "tk-corner", ""));
    task.items.forEach((it) => {
      grid.appendChild(el("div", "tk-colhead", task.prefixUnit ? `${unit} ${it}` : it));
    });

    // 状態ボタン行（ー → 進行中 → 完了）
    grid.appendChild(el("div", "tk-rowlabel", "進み"));
    task.items.forEach((it, i) => {
      const stKey = `${task.id}.${unit}.${i}.state`;
      const s = getVal(stKey, 0);
      const b = el("button", "tk-state st" + s, TRACK_STATES[s]);
      b.type = "button";
      b.addEventListener("click", () => {
        const ns = (getVal(stKey, 0) + 1) % 3;
        setVal(stKey, ns);
        if (ns === 2) setVal(`${task.id}.${unit}.${i}.redo`, "X");
        else delVal(`${task.id}.${unit}.${i}.redo`);
        render(); refreshProgress();
      });
      grid.appendChild(b);
    });

    // 解き直し行（完了の項目だけ X→○）
    grid.appendChild(el("div", "tk-rowlabel", "解き直し"));
    task.items.forEach((it, i) => {
      const stKey = `${task.id}.${unit}.${i}.state`;
      const reKey = `${task.id}.${unit}.${i}.redo`;
      if (getVal(stKey, 0) !== 2) {
        grid.appendChild(el("div", "tk-redo cr-dash", "-"));
      } else {
        const st = getVal(reKey, "X");
        const rb = el("button", "tk-redo cr-redo " + (st === "○" ? "st-done" : "st-todo"), st);
        rb.type = "button";
        rb.addEventListener("click", () => {
          setVal(reKey, getVal(reKey, "X") === "○" ? "X" : "○");
          render(); refreshProgress();
        });
        grid.appendChild(rb);
      }
    });
  }
  render();
  return grid;
}
function renderTrack(task) {
  return renderUnitWidget(task.id, task.units, (unit) => trackBody(task, unit));
}

/* ---- コベツバ（Point / 力試しテスト：番号を選んで追加 + 解き直し） ----
   opts: { title, start, optMax, label(n) }  各エントリの番号を select で選択 */
function makeCounterRedo(base, opts) {
  const block = el("div", "cr-block");
  const numsKey = `${base}.nums`;
  const pairs = el("div", "cr-pairs");   // ポイント／解き直しを縦ペアにして折り返す
  block.appendChild(pairs);

  const getNums = () => getVal(numsKey, []).slice();
  const setNums = (a) => setVal(numsKey, a);

  function render() {
    pairs.innerHTML = "";
    const nums = getNums();

    // 先頭：ラベルのペア（上=項目名 / 下=解き直し）
    const lab = el("div", "cr-pair cr-pair-label");
    lab.appendChild(el("div", "cr-plabel", opts.title));
    lab.appendChild(el("div", "cr-plabel", "解き直し"));
    pairs.appendChild(lab);

    // 各ポイント＝[番号select] の直下に [解き直し] を縦ペアで配置
    nums.forEach((num, i) => {
      const pair = el("div", "cr-pair");
      const sel = el("select", "cr-select");
      for (let v = opts.start; v <= opts.optMax; v++) {
        const o = el("option", null, opts.label(v)); o.value = v; sel.appendChild(o);
      }
      sel.value = num;
      sel.addEventListener("change", () => {
        const a = getNums(); a[i] = parseInt(sel.value, 10); setNums(a); refreshProgress();
      });
      pair.appendChild(sel);

      const rk = `${base}.redo.${i}`;
      const st = getVal(rk, "X");
      const rb = el("button", "cr-redo " + (st === "○" ? "st-done" : "st-todo"), st);
      rb.type = "button";
      rb.addEventListener("click", () => {
        setVal(rk, getVal(rk, "X") === "○" ? "X" : "○");
        render(); refreshProgress();
      });
      pair.appendChild(rb);
      pairs.appendChild(pair);
    });

    // 末尾：＋追加 / － の操作ペア
    const ctrl = el("div", "cr-pair cr-pair-ctrl");
    if (nums.length < 10) {
      const add = el("button", "cr-add", "＋追加");
      add.type = "button";
      add.addEventListener("click", () => {
        const a = getNums();
        const used = new Set(a);
        let next = a.length ? Math.max.apply(null, a) + 1 : opts.start;
        while (used.has(next)) next++;
        if (next > opts.optMax) next = opts.optMax;
        a.push(next);
        setNums(a);
        setVal(`${base}.redo.${a.length - 1}`, "X");
        render(); refreshProgress();
      });
      ctrl.appendChild(add);
    }
    if (nums.length > 0) {
      const rem = el("button", "cr-rem", "－");
      rem.type = "button";
      rem.addEventListener("click", () => {
        const a = getNums();
        delVal(`${base}.redo.${a.length - 1}`);
        a.pop(); setNums(a);
        render(); refreshProgress();
      });
      ctrl.appendChild(rem);
    }
    pairs.appendChild(ctrl);
  }
  render();
  return block;
}
function renderKobetsuba(task) {
  const wrap = el("div", "task type-kobetsuba");
  wrap.appendChild(makeCounterRedo(`${task.id}.point`, {
    title: "ポイント", start: 250, optMax: 400, label: (n) => "P" + n,
  }));
  wrap.appendChild(el("div", "cr-divider"));
  wrap.appendChild(makeCounterRedo(`${task.id}.test`, {
    title: "力試し", start: 1, optMax: 60, label: (n) => "第" + String(n).padStart(2, "0") + "回",
  }));
  return wrap;
}

/* ---- 間違い撲滅ギャラリー（1退治〜N退治のトグル） ---- */
function renderGallery(task) {
  const wrap = el("div", "task type-gallery");
  const grid = el("div", "gl-grid");
  grid.style.gridTemplateColumns = `repeat(${task.cols}, 1fr)`;
  for (let n = 1; n <= task.count; n++) {
    const key = `${task.id}.${n}`;
    const cell = el("button", "gl-cell" + (getVal(key, false) ? " on" : ""), n + "退治");
    cell.type = "button";
    cell.addEventListener("click", () => {
      setVal(key, !getVal(key, false));
      cell.classList.toggle("on", getVal(key, false));
      refreshProgress();
    });
    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
  wrap.appendChild(el("div", "gl-note", "解き直して退治できた問題をタップ"));
  return wrap;
}

/* ---- タスク振り分け ---- */
function renderTask(task) {
  switch (task.type) {
    case "matrix":    return renderMatrix(task);
    case "grid":      return renderGrid(task);
    case "dsupport":  return renderDsupport(task);
    case "track":     return renderTrack(task);
    case "kobetsuba": return renderKobetsuba(task);
    case "gallery":   return renderGallery(task);
    default:          return renderCheckScore(task);
  }
}

/* ============================================================
   教科カード描画
   ============================================================ */
function renderSubject(subject) {
  const card = el("section", "subject-card subj-" + subject.id);

  const header = el("div", "subject-header");
  header.appendChild(el("span", "subject-icon", subject.icon));
  header.appendChild(el("h2", "subject-name", subject.name));
  const p = subjectProgress(subject);
  const pctEl = el("span", "subject-pct", p.pct + "%");
  pctEl.dataset.subject = subject.id;
  header.appendChild(pctEl);
  card.appendChild(header);

  const bar = el("div", "subject-bar");
  const fill = el("div", "subject-fill");
  fill.style.width = p.pct + "%"; fill.dataset.subject = subject.id;
  bar.appendChild(fill);
  card.appendChild(bar);

  function buildGroup(g) {
    const grp = el("div", "group" + (g.full ? " full" : ""));
    const gh = el("div", "group-head");
    gh.appendChild(el("span", "group-title", g.title));
    if (g.link) gh.appendChild(linkBtn(g.link));
    if (g.milestone) {
      const badge = el("span", "milestone-badge");
      badge.id = "milestoneBadge";
      gh.appendChild(badge);
    }
    grp.appendChild(gh);
    g.tasks.forEach((t) => grp.appendChild(renderTask(t)));
    return grp;
  }

  if (subject.twoCol) {
    // 算数: 左右2カラム（左下にギャラリー等を配置）
    const box = el("div", "subj-groups two-col");
    const colL = el("div", "subj-col");
    const colR = el("div", "subj-col");
    subject.groups.forEach((g) => (g.col === "R" ? colR : colL).appendChild(buildGroup(g)));
    box.appendChild(colL);
    box.appendChild(colR);
    card.appendChild(box);
  } else {
    const box = el("div", "subj-groups");
    subject.groups.forEach((g) => box.appendChild(buildGroup(g)));
    card.appendChild(box);
  }
  return card;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  SUBJECTS.forEach((s) => board.appendChild(renderSubject(s)));
  refreshProgress();
}

function updateMilestone() {
  const badge = document.getElementById("milestoneBadge");
  if (!badge) return;
  const n = dailyTotal();
  let cls = "milestone-badge", text;
  if (n >= 8)      { cls += " lv2"; text = `🏆 最高！！（解き直し${n}個）`; }
  else if (n >= 5) { cls += " lv1"; text = `🎯 目標達成！（解き直し${n}個）`; }
  else             { cls += " lv0"; text = `解き直し${n}個 ・ あと${5 - n}個で目標達成`; }
  badge.className = cls;
  badge.textContent = text;
}

function refreshProgress() {
  SUBJECTS.forEach((s) => {
    const p = subjectProgress(s);
    document.querySelectorAll(`.subject-pct[data-subject="${s.id}"]`).forEach((e) => (e.textContent = p.pct + "%"));
    document.querySelectorAll(`.subject-fill[data-subject="${s.id}"]`).forEach((e) => (e.style.width = p.pct + "%"));
  });
  const o = overallProgress();
  document.getElementById("overallFill").style.width = o + "%";
  document.getElementById("overallText").textContent = o + "%";
  updateMilestone();
}

/* ============================================================
   週ナビ
   ============================================================ */
function renderWeek() {
  document.getElementById("weekRange").textContent = fmtRange(currentMonday);
  const thisMon = startOfWeek(new Date());
  const diff = Math.round((currentMonday - thisMon) / (7 * 24 * 3600 * 1000));
  const tag = document.getElementById("weekTag");
  if (diff === 0)       { tag.textContent = "今週"; tag.className = "week-tag now"; }
  else if (diff === -1) { tag.textContent = "先週"; tag.className = "week-tag past"; }
  else if (diff === 1)  { tag.textContent = "来週"; tag.className = "week-tag future"; }
  else if (diff < 0)    { tag.textContent = `${-diff}週前`; tag.className = "week-tag past"; }
  else                  { tag.textContent = `${diff}週後`;  tag.className = "week-tag future"; }
  loadState();
  renderBoard();
}
function goWeek(delta) { currentMonday = addDays(currentMonday, delta * 7); renderWeek(); }

/* ============================================================
   初期化
   ============================================================ */
document.getElementById("prevWeek").addEventListener("click", () => goWeek(-1));
document.getElementById("nextWeek").addEventListener("click", () => goWeek(1));
document.getElementById("thisWeek").addEventListener("click", () => { currentMonday = startOfWeek(new Date()); renderWeek(); });
document.getElementById("resetWeek").addEventListener("click", () => {
  if (confirm("この週のチェックと得点をすべて消します。よろしいですか？")) {
    state = {}; saveState(); renderBoard();
  }
});

// まずローカルで即描画 → クラウドから取得できたら最新で再描画
renderWeek();
cloudLoad().then((ok) => { if (ok) renderWeek(); });
// 別端末で更新された内容を、タブに戻ったとき（保存中でなければ）取り込む
window.addEventListener("focus", () => {
  if (SYNC_URL && !_pendingSave) cloudLoad().then((ok) => { if (ok) renderWeek(); });
});
