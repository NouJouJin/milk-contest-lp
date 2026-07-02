const DEFAULT_BASE_ID = "apprCtybztnPDNCXI";
const DEFAULT_TABLE_ID = "tblmLIIRLUMflNeM7";

const PUBLIC_FIELDS = [
  "作品タイトル",
  "作品画像",
  "応募テーマ",
  "作品形式",
  "掲載時の表示名",
  "投稿日付",
  "作品の説明・思い",
];

function airtableFieldParams(fields) {
  return fields
    .map((field) => `fields[]=${encodeURIComponent(field)}`)
    .join("&");
}

function normalizeWork(record) {
  const fields = record.fields || {};
  const image = Array.isArray(fields["作品画像"]) ? fields["作品画像"][0] : null;

  return {
    id: record.id,
    title: fields["作品タイトル"] || "",
    author: fields["掲載時の表示名"] || "",
    theme: fields["応募テーマ"] || "",
    format: fields["作品形式"] || "",
    description: fields["作品の説明・思い"] || "",
    thumb: image?.thumbnails?.large?.url || image?.thumbnails?.full?.url || image?.url || null,
    full: image?.url || null,
    createdAt: fields["投稿日付"] || record.createdTime || "",
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ works: [], count: 0, error: "method_not_allowed" });
  }

  const baseId = process.env.AIRTABLE_BASE_ID || DEFAULT_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID || DEFAULT_TABLE_ID;
  const token = process.env.AIRTABLE_TOKEN;

  if (!token) {
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).json({
      works: [],
      count: 0,
      configured: false,
      error: "missing_airtable_token",
      updatedAt: new Date().toISOString(),
    });
  }

  const formula = encodeURIComponent(
    "AND({参加規約への同意},{作品画像},{作品タイトル},NOT({掲載対象外}))"
  );
  const fields = airtableFieldParams(PUBLIC_FIELDS);
  const url =
    `https://api.airtable.com/v0/${baseId}/${tableId}` +
    `?filterByFormula=${formula}&${fields}` +
    "&sort[0][field]=投稿日付&sort[0][direction]=desc&pageSize=100";

  try {
    const records = [];
    let offset = "";

    do {
      const pageUrl = offset ? `${url}&offset=${encodeURIComponent(offset)}` : url;
      const response = await fetch(pageUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const detail = await response.text();
        return res.status(502).json({
          works: [],
          count: 0,
          error: "airtable_upstream",
          detail: detail.slice(0, 500),
        });
      }

      const data = await response.json();
      records.push(...(data.records || []));
      offset = data.offset || "";
    } while (offset);

    const works = records
      .map(normalizeWork)
      .filter((work) => work.title && work.thumb);

    res.setHeader("Vercel-CDN-Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).json({
      works,
      count: works.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      works: [],
      count: 0,
      error: "server_error",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
