import fetch from "node-fetch";

export default async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  // アクセストークンを取得
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // 最近再生した曲を取得
  const recentResponse = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=5", {
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  const recentData = await recentResponse.json();
  const items = recentData.items || [];

  // SVGを生成
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="160">
  <rect width="100%" height="100%" fill="black"/>
  <g fill="lime" font-family="monospace" font-size="14">
    ${items.map((item, i) => {
      const track = item.track;
      return `<text x="10" y="${25 + i * 25}">${i+1}. ${track.artists[0].name} - ${track.name}</text>`;
    }).join("")}
  </g>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(svg);
}
