import { generic_handler } from '../handlers'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest,
  res: NextApiResponse) {
  return generic_handler(req, res, (mid: number) =>
    `/bilibili/user/like/${mid}`)
}
