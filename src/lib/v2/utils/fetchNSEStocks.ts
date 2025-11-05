/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import fs from "fs";
import path from "path";

const BASE_URL = "https://api.twelvedata.com/stocks?exchange=XNSE";

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/\blimited\b/g, "ltd") // “Limited” → “Ltd”
    .replace(/\bprivate\b/g, "pvt") // “Private” → “Pvt”
    .replace(/\bco\b/g, "company") // optional cleanup
    .replace(/[.,']/g, "") // remove punctuation
    .normalize("NFC") // ensure consistent Unicode form [web:123][web:124]
    .trim();
}

export async function fetchNSEStocks(companyName: string) {
  const cachePath = path.join(process.cwd(), "cache", "nse_stocks.json");
  let data: { symbol: string; name: string }[] = [];

  if (fs.existsSync(cachePath)) {
    console.log("⚡ Loading from cache...");
    data = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  } else {
    console.log("🌐 Fetching from TwelveData API...");
    const response = await axios.get(BASE_URL);
    data = response.data.data.map((item: any) => ({
      symbol: item.symbol,
      name: item.name,
    }));
    fs.mkdirSync(path.dirname(cachePath), { recursive: true });
    fs.writeFileSync(cachePath, JSON.stringify(data, null, 2));
  }

  // Normalize both company names before comparison
  const query = normalizeName(companyName);
  const matches = data.filter((item) =>
    normalizeName(item.name).includes(query)
  );

  if (matches.length === 0) {
    console.log(`❌ No matches found for "${companyName}"`);
    return [];
  }

  console.log(`✅ Found ${matches.length} matches for "${companyName}"`);
  return matches;
}
