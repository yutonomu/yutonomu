export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;

  if (!username || !apiKey) {
    res.status(500).send("Missing LASTFM_USERNAME or LASTFM_API_KEY");
    return;
  }

  const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=5`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.recenttracks?.track) {
    res.status(500).send("No tracks found. Check API key and username.");
    return;
  }

  const tracks = data.recenttracks.track;
  const items = tracks.map((t: any, i: number) =>
    `${i + 1}. ${t.artist["#text"]} - ${t.name}`
  );

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="140">
  <rect width="100%" height="100%" fill="black"/>
  <g fill="lime" font-family="monospace" font-size="14">
    ${items.map((line, i) => `<text x="10" y="${25 + i * 20}">${line}</text>`).join("")}
  </g>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(svg);
}
