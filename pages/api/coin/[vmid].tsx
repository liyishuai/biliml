import { NextApiRequest, NextApiResponse } from 'next';

type entryType = {
  mid: number;
  uname: string;
}

type listType = {
  list: entryType[];
}

type jsonResponse = {
  code: number;
  message: string;
  data: listType;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  var rsshubDomain: string = "https://rsshub.app"
  if (process.env.RSSHUB_DOMAIN !== undefined) {
    rsshubDomain = process.env.RSSHUB_DOMAIN
  }
  if (process.env.BILIBILI_COOKIE === undefined) {
    res.status(500).json({ error: 'BILIBILI_COOKIE is not set' })
    return
  } else {
    const { vmid } = req.query

    const response = await fetch(`https://api.bilibili.com/x/relation/followings?vmid=${vmid}`, {
      headers: { 'Cookie': process.env.BILIBILI_COOKIE }
    })
    const jres = await response.json() as jsonResponse
    if (jres.code !== 0) {
      res.status(500).json({ error: jres.message })
      return
    }
    var urls: URL[] = []
    for (const entry of jres.data.list) {
      const coinUrl = new URL(`/bilibili/usr/coin/${entry.mid}`, rsshubDomain)
      const coinResponse = await fetch(coinUrl)
      if (coinResponse.status === 200) {
        urls.push(coinUrl)
      }
    }
    res.status(200).json(urls)
  }
}
