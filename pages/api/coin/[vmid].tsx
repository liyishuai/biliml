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
  } else {
    const { vmid } = req.query
    const followingURL = new URL(`/x/relation/followings?vmid=${vmid}`,
      "https://api.bilibili.com")
    fetch(followingURL, {
      headers: { 'Cookie': process.env.BILIBILI_COOKIE }
    }).then((response) => {
      if (response.ok) {
        response.json().then((jres: jsonResponse) => {
          if (jres.code !== 0) {
            res.status(500).json(jres)
          } else {
            var urls: URL[] = []
            for (const entry of jres.data.list) {
              const coinUrl = new URL(`/bilibili/usr/coin/${entry.mid}`,
                rsshubDomain)
              fetch(coinUrl).then((coinResponse) => {
                if (coinResponse.status === 200) {
                  urls.push(coinUrl)
                }
              }).catch((err) => {
                console.log(err, coinUrl)
              })
            }
            res.status(200).json(urls)
          }
        })
      } else {
        response.text().then((text) => {
          res.status(response.status).send(text)
        })
      }
    }).catch((err) => {
      res.status(500).json({ error: err })
    })
  }
}
