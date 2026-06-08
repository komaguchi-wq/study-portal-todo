/* ============================================================
   学習ポータル ToDo — クラウド同期用 Apps Script（サーバー側）
   ------------------------------------------------------------
   ■ 役割: 家族で共有する進捗データ（全週分のJSON）を
           スプレッドシートに読み書きする小さなAPI。
   ■ 置き方:
     1) Googleスプレッドシートを新規作成（名前は「学習ポータルToDo同期」等）
     2) 拡張機能 → Apps Script を開く
     3) このファイルの中身を全部貼り付けて保存
     4) 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
        - 実行するユーザー: 自分
        - アクセスできるユーザー: 全員
     5) 発行された /exec のURLを app.js の SYNC_URL に貼る
   ※ データは 'data' シートに「A列=週キー / B列=その週のJSON」で1行ずつ保存。
   ============================================================ */

const SHEET_NAME = 'data';

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  return sh;
}

// 読み出し: { "週キー": {状態オブジェクト}, ... } を返す
function doGet(e) {
  const sh = getSheet_();
  const out = {};
  const last = sh.getLastRow();
  if (last >= 1) {
    const rows = sh.getRange(1, 1, last, 2).getValues();
    rows.forEach(function (r) {
      if (r[0]) { try { out[r[0]] = JSON.parse(r[1]); } catch (_) {} }
    });
  }
  return ContentService
    .createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

// 保存: 受け取った全週分JSONで丸ごと置き換え（最後に保存した端末の内容が反映）
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const sh = getSheet_();
    sh.clearContents();
    const keys = Object.keys(data);
    if (keys.length) {
      const values = keys.map(function (k) { return [k, JSON.stringify(data[k])]; });
      sh.getRange(1, 1, values.length, 2).setValues(values);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, weeks: keys.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
