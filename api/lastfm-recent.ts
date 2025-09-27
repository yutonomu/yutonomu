import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const username = "YOUR_LASTFM_USERNAME";
  const apiKey = "YOUR_LASTFM_API_KEY";

  const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=5`;

  const data = await fetch(url).then(r => r.json());
  const tracks = data.recenttracks.track;

  let items = tracks.map((t: any, i: number) => 
    `${i+1}. ${t.artist["#text"]} - ${t.name}`
  ).join(" | ");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="40">
  <rect width="100%" height="100%" fill="black"/>
  <text x="10" y="25" font-size="14" fill="lime" font-family="monospace">
    🎧 Recently played: ${items}
  </text>
</svg>
`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store");
  res.send(svg);
}
