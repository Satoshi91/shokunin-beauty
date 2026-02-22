/**
 * MockAPI.io 疎通確認スクリプト
 * 
 * 使い方: node scripts/check-api.mjs
 */

const BASE_URL = "https://699a88e5377ac05ce28e1aed.mockapi.io";

const REQUIRED_RESOURCES = ["services", "craftsmen", "reviews"];

async function checkResource(name) {
  try {
    const res = await fetch(`${BASE_URL}/${name}`);
    
    if (res.ok) {
      const data = await res.json();
      return { status: "ok", count: data.length };
    } else if (res.status === 404) {
      return { status: "not_found" };
    } else {
      return { status: "error", code: res.status, message: res.statusText };
    }
  } catch (error) {
    return { status: "error", message: error.message };
  }
}

async function main() {
  console.log("🔍 MockAPI.io 疎通確認");
  console.log("=".repeat(50));
  console.log(`URL: ${BASE_URL}`);
  console.log("");

  let allOk = true;
  const results = [];

  for (const resource of REQUIRED_RESOURCES) {
    const result = await checkResource(resource);
    results.push({ name: resource, ...result });

    if (result.status === "ok") {
      console.log(`✅ ${resource}: OK (${result.count}件のデータ)`);
    } else if (result.status === "not_found") {
      console.log(`❌ ${resource}: 未作成`);
      allOk = false;
    } else {
      console.log(`❌ ${resource}: エラー - ${result.message || result.code}`);
      allOk = false;
    }
  }

  console.log("");
  console.log("=".repeat(50));

  if (allOk) {
    console.log("🎉 すべてのリソースが準備完了です！");
    console.log("");
    console.log("次のステップ:");
    console.log("  node scripts/seed.mjs  # データを投入");
  } else {
    console.log("⚠️  以下のリソースを mockapi.io で作成してください:");
    console.log("");
    console.log("手順:");
    console.log("1. https://mockapi.io にアクセス");
    console.log("2. プロジェクトを開く");
    console.log("3. 「New Resource」をクリック");
    console.log("4. 以下のリソースを作成:");
    console.log("");
    
    for (const r of results) {
      if (r.status !== "ok") {
        console.log(`   - ${r.name}`);
      }
    }
    
    console.log("");
    console.log("※ スキーマ（フィールド）は空のままでOKです");
    console.log("  POSTリクエスト時に自動で作成されます");
  }
}

main().catch(console.error);
