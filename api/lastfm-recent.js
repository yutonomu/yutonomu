export default async function handler(req, res) {
  console.log("hogehoge");
  const username = process.env.LASTFM_USERNAME;
  const apiKey = process.env.LASTFM_API_KEY;

  if (!username || !apiKey) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="50">
      <rect width="100%" height="100%" fill="red"/>
      <text x="10" y="30" font-size="16" fill="white">❌ Missing LASTFM_USERNAME or LASTFM_API_KEY</text>
    </svg>`);
  }

  const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=5`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.recenttracks?.track) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    return res.status(500).send(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="50">
      <rect width="100%" height="100%" fill="red"/>
      <text x="10" y="30" font-size="16" fill="white">❌ No tracks found (check API key / username)</text>
    </svg>`);
  }

  const tracks = data.recenttracks.track;
  const items = tracks.map((t, i) => `${i + 1}. ${t.artist["#text"]} - ${t.name}`);

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
