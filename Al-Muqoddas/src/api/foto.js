export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "No id" });

  try {
    const driveRes = await fetch(
      `https://drive.google.com/thumbnail?id=${id}&sz=w400`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );

    if (!driveRes.ok) return res.status(404).end();

    const buffer = await driveRes.arrayBuffer();
    const contentType = driveRes.headers.get("content-type") || "image/jpeg";

    // Cache 1 hari di CDN Vercel
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    res.setHeader("Content-Type", contentType);
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}